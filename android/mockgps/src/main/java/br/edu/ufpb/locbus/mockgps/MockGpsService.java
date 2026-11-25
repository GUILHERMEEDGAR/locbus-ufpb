package br.edu.ufpb.locbus.mockgps;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationManager;
import android.os.Binder;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.SystemClock;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import java.util.List;

public class MockGpsService extends Service {

    private static final String TAG = "LocBUSMockGps";
    public static final String CHANNEL_ID = "locbus_mock_gps_channel";
    public static final int NOTIFICATION_ID = 4040;

    public static final String ACTION_STATUS_UPDATE = "br.edu.ufpb.locbus.mockgps.STATUS_UPDATE";
    public static final String EXTRA_LAT = "extra_lat";
    public static final String EXTRA_LON = "extra_lon";
    public static final String EXTRA_SPEED = "extra_speed";
    public static final String EXTRA_BEARING = "extra_bearing";
    public static final String EXTRA_POINT_NAME = "extra_point_name";
    public static final String EXTRA_PROGRESS = "extra_progress";
    public static final String EXTRA_ELAPSED_SECONDS = "extra_elapsed_seconds";
    public static final String EXTRA_IS_RUNNING = "extra_is_running";
    public static final String EXTRA_IS_PAUSED = "extra_is_paused";
    public static final String EXTRA_ERROR = "extra_error";

    private final IBinder binder = new LocalBinder();
    private LocationManager locationManager;
    private Handler simulationHandler;
    private Runnable simulationRunnable;

    private List<Waypoint> currentRouteWaypoints;
    private int currentSegmentIndex = 0;
    private double currentLat;
    private double currentLon;
    private float currentBearing = 0.0f;
    private float targetSpeedKmh = 35.0f;
    private boolean isLoopEnabled = true;

    private boolean isRunning = false;
    private boolean isPaused = false;
    private int elapsedSeconds = 0;

    public class LocalBinder extends Binder {
        public MockGpsService getService() {
            return MockGpsService.this;
        }
    }

    @Override
    public void onCreate() {
        super.onCreate();
        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        simulationHandler = new Handler(Looper.getMainLooper());
        createNotificationChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        startForeground(NOTIFICATION_ID, buildNotification("LocBUS Mock GPS Pronto"));
        return START_NOT_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Simulação de Trajeto LocBUS",
                    NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Notificação de injeção de GPS em segundo plano");
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    private Notification buildNotification(String text) {
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                this, 0, notificationIntent,
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0
        );

        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("LocBUS Mock GPS Ativo")
                .setContentText(text)
                .setSmallIcon(android.R.drawable.ic_menu_compass)
                .setContentIntent(pendingIntent)
                .setOngoing(true)
                .build();
    }

    private void updateNotification(String text) {
        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager != null && isRunning) {
            manager.notify(NOTIFICATION_ID, buildNotification(text));
        }
    }

    /**
     * Inicia a simulação com a rota fornecida.
     */
    public boolean startSimulation(List<Waypoint> waypoints, float speedKmh, boolean loop) {
        if (waypoints == null || waypoints.size() < 2) {
            broadcastError("A rota precisa de pelo menos 2 waypoints.");
            return false;
        }

        this.currentRouteWaypoints = waypoints;
        this.targetSpeedKmh = speedKmh;
        this.isLoopEnabled = loop;
        this.currentSegmentIndex = 0;
        this.currentLat = waypoints.get(0).latitude;
        this.currentLon = waypoints.get(0).longitude;
        this.elapsedSeconds = 0;

        // Tenta registrar provedor de teste no LocationManager
        if (!setupTestProviders()) {
            return false;
        }

        isRunning = true;
        isPaused = false;

        startForeground(NOTIFICATION_ID, buildNotification("Simulando na velocidade de " + (int) targetSpeedKmh + " km/h"));

        // Loop de simulação a cada 1 segundo (1 Hz como GPS real)
        simulationRunnable = new Runnable() {
            @Override
            public void run() {
                if (isRunning && !isPaused) {
                    stepSimulation();
                    simulationHandler.postDelayed(this, 1000);
                }
            }
        };
        simulationHandler.post(simulationRunnable);

        broadcastStatus();
        return true;
    }

    private boolean setupTestProviders() {
        try {
            // Provedor GPS
            setupProvider(LocationManager.GPS_PROVIDER);
            // Provedor de Rede (para cobrir apps que usam NETWORK)
            try {
                setupProvider(LocationManager.NETWORK_PROVIDER);
            } catch (Exception ignored) {
            }
            return true;
        } catch (SecurityException se) {
            Log.e(TAG, "Permissão negada ao adicionar Test Provider", se);
            broadcastError("Permissão Negada: Selecione 'LocBUS Mock GPS' em Opções do Desenvolvedor > App de Local Fictício.");
            return false;
        } catch (Exception e) {
            Log.e(TAG, "Erro ao configurar Test Provider", e);
            broadcastError("Erro ao iniciar provedor GPS: " + e.getMessage());
            return false;
        }
    }

    private void setupProvider(String provider) {
        try {
            locationManager.removeTestProvider(provider);
        } catch (Exception ignored) {
        }

        locationManager.addTestProvider(
                provider,
                false, // requiresNetwork
                false, // requiresSatellite
                false, // requiresCell
                false, // hasMonetaryCost
                true,  // supportsAltitude
                true,  // supportsSpeed
                true,  // supportsBearing
                Criteria.POWER_LOW,
                Criteria.ACCURACY_FINE
        );
        locationManager.setTestProviderEnabled(provider, true);
    }

    private void removeTestProviders() {
        try {
            locationManager.removeTestProvider(LocationManager.GPS_PROVIDER);
        } catch (Exception ignored) {
        }
        try {
            locationManager.removeTestProvider(LocationManager.NETWORK_PROVIDER);
        } catch (Exception ignored) {
        }
    }

    /**
     * Passo discreto da simulação (1 segundo):
     * Calcula o avanço métrico de acordo com a velocidade e interpola geograficamente.
     */
    private void stepSimulation() {
        if (currentRouteWaypoints == null || currentRouteWaypoints.size() < 2) return;

        elapsedSeconds++;

        Waypoint startWp = currentRouteWaypoints.get(currentSegmentIndex);
        Waypoint targetWp = currentRouteWaypoints.get(currentSegmentIndex + 1);

        double distToTarget = RouteManager.haversineMeters(currentLat, currentLon, targetWp.latitude, targetWp.longitude);
        float speedMps = (targetSpeedKmh * 1000.0f) / 3600.0f; // km/h -> m/s

        currentBearing = RouteManager.calculateBearing(currentLat, currentLon, targetWp.latitude, targetWp.longitude);

        if (distToTarget <= speedMps || distToTarget < 2.0) {
            // Atingiu o próximo waypoint
            currentLat = targetWp.latitude;
            currentLon = targetWp.longitude;
            currentSegmentIndex++;

            if (currentSegmentIndex >= currentRouteWaypoints.size() - 1) {
                // Chegou ao fim da rota
                if (isLoopEnabled) {
                    currentSegmentIndex = 0;
                    currentLat = currentRouteWaypoints.get(0).latitude;
                    currentLon = currentRouteWaypoints.get(0).longitude;
                } else {
                    pauseSimulation();
                    injectMockLocation(currentLat, currentLon, 0.0f, currentBearing);
                    broadcastStatus();
                    return;
                }
            }
        } else {
            // Interpolação suave em direção ao alvo
            double fraction = speedMps / distToTarget;
            currentLat = currentLat + fraction * (targetWp.latitude - currentLat);
            currentLon = currentLon + fraction * (targetWp.longitude - currentLon);
        }

        // Injeta a coordenada nos provedores do Android
        injectMockLocation(currentLat, currentLon, speedMps, currentBearing);

        updateNotification(String.format("Ponto: %s (%.0f km/h)", getCurrentPointName(), targetSpeedKmh));
        broadcastStatus();
    }

    private void injectMockLocation(double lat, double lon, float speedMps, float bearing) {
        long now = System.currentTimeMillis();
        long elapsedNanos = SystemClock.elapsedRealtimeNanos();

        injectSingleProvider(LocationManager.GPS_PROVIDER, lat, lon, speedMps, bearing, now, elapsedNanos);
        try {
            injectSingleProvider(LocationManager.NETWORK_PROVIDER, lat, lon, speedMps, bearing, now, elapsedNanos);
        } catch (Exception ignored) {
        }
    }

    private void injectSingleProvider(String provider, double lat, double lon, float speedMps, float bearing, long timeMs, long elapsedNanos) {
        Location mockLocation = new Location(provider);
        mockLocation.setLatitude(lat);
        mockLocation.setLongitude(lon);
        mockLocation.setAltitude(45.0);
        mockLocation.setSpeed(speedMps);
        mockLocation.setBearing(bearing);
        mockLocation.setAccuracy(3.0f); // Alta precisão simulada (±3m)
        mockLocation.setTime(timeMs);
        mockLocation.setElapsedRealtimeNanos(elapsedNanos);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            mockLocation.setBearingAccuracyDegrees(2.0f);
            mockLocation.setSpeedAccuracyMetersPerSecond(0.5f);
            mockLocation.setVerticalAccuracyMeters(2.0f);
        }

        try {
            locationManager.setTestProviderLocation(provider, mockLocation);
        } catch (Exception e) {
            Log.w(TAG, "Falha ao injetar em " + provider, e);
        }
    }

    public void pauseSimulation() {
        isPaused = true;
        updateNotification("Simulação Pausada");
        broadcastStatus();
    }

    public void resumeSimulation() {
        if (!isRunning) return;
        isPaused = false;
        if (simulationRunnable != null) {
            simulationHandler.post(simulationRunnable);
        }
        updateNotification("Simulando a " + (int) targetSpeedKmh + " km/h");
        broadcastStatus();
    }

    public void stopSimulation() {
        isRunning = false;
        isPaused = false;
        if (simulationHandler != null && simulationRunnable != null) {
            simulationHandler.removeCallbacks(simulationRunnable);
        }
        removeTestProviders();
        stopForeground(true);
        broadcastStatus();
    }

    public void setSpeedKmh(float speed) {
        this.targetSpeedKmh = Math.max(5.0f, Math.min(speed, 120.0f));
    }

    public void setLoopEnabled(boolean loop) {
        this.isLoopEnabled = loop;
    }

    public boolean isRunning() {
        return isRunning;
    }

    public boolean isPaused() {
        return isPaused;
    }

    public String getCurrentPointName() {
        if (currentRouteWaypoints != null && currentSegmentIndex < currentRouteWaypoints.size()) {
            return currentRouteWaypoints.get(currentSegmentIndex).name;
        }
        return "Aguardando";
    }

    public int getProgressPercent() {
        if (currentRouteWaypoints == null || currentRouteWaypoints.size() <= 1) return 0;
        return (int) (((float) currentSegmentIndex / (currentRouteWaypoints.size() - 1)) * 100);
    }

    private void broadcastStatus() {
        Intent intent = new Intent(ACTION_STATUS_UPDATE);
        intent.setPackage(getPackageName());
        intent.putExtra(EXTRA_LAT, currentLat);
        intent.putExtra(EXTRA_LON, currentLon);
        intent.putExtra(EXTRA_SPEED, targetSpeedKmh);
        intent.putExtra(EXTRA_BEARING, currentBearing);
        intent.putExtra(EXTRA_POINT_NAME, getCurrentPointName());
        intent.putExtra(EXTRA_PROGRESS, getProgressPercent());
        intent.putExtra(EXTRA_ELAPSED_SECONDS, elapsedSeconds);
        intent.putExtra(EXTRA_IS_RUNNING, isRunning);
        intent.putExtra(EXTRA_IS_PAUSED, isPaused);
        sendBroadcast(intent);
    }

    private void broadcastError(String msg) {
        Intent intent = new Intent(ACTION_STATUS_UPDATE);
        intent.setPackage(getPackageName());
        intent.putExtra(EXTRA_ERROR, msg);
        intent.putExtra(EXTRA_IS_RUNNING, false);
        intent.putExtra(EXTRA_IS_PAUSED, false);
        sendBroadcast(intent);
    }

    @Override
    public void onDestroy() {
        stopSimulation();
        super.onDestroy();
    }
}

