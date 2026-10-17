package br.edu.ufpb.locbus;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ServiceInfo;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.os.PowerManager;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

import org.json.JSONObject;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class LocationService extends Service implements LocationListener {

    private static final String TAG = "LocBUS-LocationService";
    public static final String CHANNEL_ID = "locbus_location_channel";
    public static final int NOTIFICATION_ID = 2001;

    public static final String ACTION_START = "br.edu.ufpb.locbus.action.START";
    public static final String ACTION_STOP = "br.edu.ufpb.locbus.action.STOP";

    private static final String TELEMETRY_URL = "https://locbus-ufpb.onrender.com/api/v1/telemetry/collaborative";
    private static final long MIN_TIME_MS = 3500; // 3.5 segundos
    private static final float MIN_DISTANCE_M = 1.0f; // 1 metro

    private LocationManager locationManager;
    private PowerManager.WakeLock wakeLock;
    private ExecutorService networkExecutor;

    private long lastSendTimestamp = 0;
    private int pointsSentCount = 0;
    private boolean isTracking = false;

    public interface LocationUpdateCallback {
        void onNativeLocationReceived(double lat, double lng, float accuracy, float speed, float heading, int pointsSent);
    }

    private static LocationUpdateCallback updateCallback;

    public static void setUpdateCallback(LocationUpdateCallback callback) {
        updateCallback = callback;
    }

    public static boolean isRunning = false;

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
        networkExecutor = Executors.newSingleThreadExecutor();

        PowerManager powerManager = (PowerManager) getSystemService(Context.POWER_SERVICE);
        if (powerManager != null) {
            wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "LocBUS:BackgroundTrackingLock");
            try {
                wakeLock.acquire(4 * 60 * 60 * 1000L); // Max 4 horas por segurança
            } catch (Exception e) {
                Log.w(TAG, "Falha ao adquirir WakeLock", e);
            }
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && ACTION_STOP.equals(intent.getAction())) {
            stopTrackingService();
            return START_NOT_STICKY;
        }

        startTrackingService();
        return START_STICKY;
    }

    private void startTrackingService() {
        if (isTracking) return;
        isTracking = true;
        isRunning = true;

        Notification notification = buildNotification("Iniciando transmissão de GPS...", 0);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION);
        } else {
            startForeground(NOTIFICATION_ID, notification);
        }

        startLocationUpdates();
        Log.i(TAG, "Serviço de localização em segundo plano iniciado com sucesso.");
    }

    private void startLocationUpdates() {
        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        if (locationManager == null) return;

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
            ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            Log.e(TAG, "Permissão de localização não concedida para o Foreground Service");
            return;
        }

        try {
            if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, MIN_TIME_MS, MIN_DISTANCE_M, this);
            }
            if (locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
                locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, MIN_TIME_MS + 2000, MIN_DISTANCE_M, this);
            }
            if (locationManager.getAllProviders().contains(LocationManager.PASSIVE_PROVIDER)) {
                locationManager.requestLocationUpdates(LocationManager.PASSIVE_PROVIDER, MIN_TIME_MS, 0, this);
            }

            // Envia imediatamente a última localização conhecida se disponível
            Location lastGps = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
            Location lastNet = locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
            Location bestLast = lastGps != null ? lastGps : lastNet;
            if (bestLast != null) {
                onLocationChanged(bestLast);
            }
        } catch (SecurityException se) {
            Log.e(TAG, "SecurityException ao registrar LocationUpdates", se);
        }
    }

    private void stopTrackingService() {
        isTracking = false;
        isRunning = false;

        if (locationManager != null) {
            locationManager.removeUpdates(this);
        }

        if (wakeLock != null && wakeLock.isHeld()) {
            try {
                wakeLock.release();
            } catch (Exception ignored) {}
        }

        if (networkExecutor != null) {
            networkExecutor.shutdown();
        }

        stopForeground(true);
        stopSelf();
        Log.i(TAG, "Serviço de localização em segundo plano encerrado.");
    }

    @Override
    public void onLocationChanged(Location location) {
        if (location == null) return;

        long now = System.currentTimeMillis();
        // Throttling de 3.5 segundos
        if (lastSendTimestamp != 0 && (now - lastSendTimestamp < 3500)) {
            return;
        }
        lastSendTimestamp = now;

        final double lat = location.getLatitude();
        final double lng = location.getLongitude();
        final float accuracy = location.getAccuracy();
        final float speedKmh = location.hasSpeed() ? location.getSpeed() * 3.6f : 0.0f;
        final float heading = location.hasBearing() ? location.getBearing() : 0.0f;

        // Dispara envio HTTP assíncrono para a nuvem
        networkExecutor.execute(() -> sendTelemetryPayload(lat, lng, accuracy, speedKmh, heading));

        // Notifica WebView e atualiza a notificação persistente na barra do Android
        pointsSentCount++;
        updateNotificationStatus(accuracy, speedKmh, pointsSentCount);

        if (updateCallback != null) {
            updateCallback.onNativeLocationReceived(lat, lng, accuracy, speedKmh, heading, pointsSentCount);
        }
    }

    private void sendTelemetryPayload(double lat, double lng, float accuracy, float speedKmh, float heading) {
        HttpURLConnection conn = null;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
            sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
            String isoTimestamp = sdf.format(new Date());

            JSONObject json = new JSONObject();
            json.put("latitude", lat);
            json.put("longitude", lng);
            json.put("accuracy", Math.round(accuracy * 10.0) / 10.0);
            json.put("speed", Math.round(speedKmh * 10.0) / 10.0);
            json.put("heading", Math.round(heading * 10.0) / 10.0);
            json.put("client_timestamp", isoTimestamp);

            byte[] postData = json.toString().getBytes(StandardCharsets.UTF_8);

            URL url = new URL(TELEMETRY_URL);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            conn.setRequestProperty("User-Agent", "LocBUS-Android-ForegroundService");
            conn.setConnectTimeout(8000);
            conn.setReadTimeout(8000);
            conn.setDoOutput(true);
            conn.setFixedLengthStreamingMode(postData.length);

            try (OutputStream os = conn.getOutputStream()) {
                os.write(postData);
                os.flush();
            }

            int responseCode = conn.getResponseCode();
            if (responseCode == 200 || responseCode == 201) {
                Log.d(TAG, "Telemetria enviada com sucesso: HTTP " + responseCode);
            } else {
                Log.w(TAG, "Resposta do servidor de telemetria: HTTP " + responseCode);
            }
        } catch (Exception e) {
            Log.e(TAG, "Erro ao enviar telemetria HTTP em segundo plano", e);
        } finally {
            if (conn != null) {
                conn.disconnect();
            }
        }
    }

    private void updateNotificationStatus(float accuracy, float speedKmh, int count) {
        String statusText = String.format(Locale.getDefault(),
                "Ponto #%d enviado • Precisão: ±%.0fm • %.0f km/h",
                count, accuracy, speedKmh);

        Notification notification = buildNotification(statusText, count);
        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager != null) {
            manager.notify(NOTIFICATION_ID, notification);
        }
    }

    private Notification buildNotification(String contentText, int pointsCount) {
        Intent openAppIntent = new Intent(this, MainActivity.class);
        openAppIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                this,
                0,
                openAppIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0)
        );

        Intent stopIntent = new Intent(this, LocationService.class);
        stopIntent.setAction(ACTION_STOP);
        PendingIntent stopPendingIntent = PendingIntent.getService(
                this,
                1,
                stopIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0)
        );

        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("LocBUS • Transmissão em Segundo Plano Ativa")
                .setContentText(contentText)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setOngoing(true)
                .setContentIntent(pendingIntent)
                .addAction(0, "Encerrar", stopPendingIntent)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setCategory(NotificationCompat.CATEGORY_SERVICE)
                .build();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Rastreamento em Segundo Plano LocBUS",
                    NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Exibe o status da telemetria GPS transmitida em segundo plano");
            channel.setShowBadge(false);

            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    @Override
    public void onDestroy() {
        stopTrackingService();
        super.onDestroy();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {}

    @Override
    public void onProviderEnabled(String provider) {}

    @Override
    public void onProviderDisabled(String provider) {}
}
