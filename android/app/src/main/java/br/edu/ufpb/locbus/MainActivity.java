package br.edu.ufpb.locbus;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.webkit.GeolocationPermissions;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.core.content.ContextCompat;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends Activity {

    private WebView webView;
    private static final int PERMISSION_REQUEST_CODE = 1001;
    private final Handler wifiPollHandler = new Handler(Looper.getMainLooper());
    private Runnable wifiPollRunnable;
    // URL e Modo dinâmicos compilados via Gradle Flavor (Passenger vs Tracker)
    private static final String APP_URL = BuildConfig.APP_URL;
    private static final boolean IS_TRACKER = BuildConfig.IS_TRACKER;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (IS_TRACKER) {
            // No modo Ônibus, mantém a tela 100% ativa no painel do veículo
            getWindow().addFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        }

        checkAndRequestPermissions();

        webView = new WebView(this);
        setContentView(webView);

        webView.clearCache(true);
        webView.setHorizontalScrollBarEnabled(false);
        webView.setOverScrollMode(WebView.OVER_SCROLL_NEVER);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setGeolocationEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        settings.setUseWideViewPort(false);
        settings.setLoadWithOverviewMode(false);
        settings.setSupportZoom(false);

        // Adiciona a ponte nativa para o JavaScript da aplicação web
        webView.addJavascriptInterface(new WebAppInterface(), "AndroidBridge");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                // Injeta garantia de acoplamento da ponte nativa diretamente no DOM
                String injectHook =
                        "(function() {" +
                        "  if (window.__locbusBridgeAttached) return;" +
                        "  window.__locbusBridgeAttached = true;" +
                        "  console.log('[LocBUS] Conectando ponte nativa de segundo plano...');" +
                        "  var btnConfirm = document.getElementById('btn-modal-confirm');" +
                        "  if (btnConfirm) {" +
                        "    btnConfirm.addEventListener('click', function() {" +
                        "      if (window.AndroidBridge) window.AndroidBridge.startBackgroundTracking();" +
                        "    });" +
                        "  }" +
                        "  var btnStop = document.getElementById('btn-stop-collab');" +
                        "  if (btnStop) {" +
                        "    btnStop.addEventListener('click', function() {" +
                        "      if (window.AndroidBridge) window.AndroidBridge.stopBackgroundTracking();" +
                        "    });" +
                        "  }" +
                        "})();";
                view.evaluateJavascript(injectHook, null);
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }
        });

        // Conecta o listener do serviço de segundo plano ao WebView
        LocationService.setUpdateCallback((lat, lng, accuracy, speed, heading, pointsSent) -> {
            runOnUiThread(() -> {
                if (webView != null) {
                    String js = String.format(java.util.Locale.US,
                            "if (window.onNativeLocationUpdate) { window.onNativeLocationUpdate(%f, %f, %f, %f, %f, %d); }",
                            lat, lng, accuracy, speed, heading, pointsSent);
                    webView.evaluateJavascript(js, null);
                }
            });
        });

        webView.loadUrl(APP_URL);

        wifiPollRunnable = new Runnable() {
            @Override
            public void run() {
                if (webView != null) {
                    try {
                        String telemetryJson = new WebAppInterface().getWifiTelemetry();
                        String js = "if (window.onNativeWifiUpdate) { window.onNativeWifiUpdate(" + telemetryJson + "); }";
                        webView.evaluateJavascript(js, null);
                    } catch (Exception ignored) {}
                }
                wifiPollHandler.postDelayed(this, 2500);
            }
        };

        if (IS_TRACKER) {
            startTrackerServiceIfPermitted();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (wifiPollRunnable != null) {
            wifiPollHandler.removeCallbacks(wifiPollRunnable);
            wifiPollHandler.post(wifiPollRunnable);
        }
    }

    @Override
    protected void onPause() {
        if (wifiPollRunnable != null) {
            wifiPollHandler.removeCallbacks(wifiPollRunnable);
        }
        super.onPause();
    }

    private void checkAndRequestPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            List<String> permissionsNeeded = new ArrayList<>();

            if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                permissionsNeeded.add(Manifest.permission.ACCESS_FINE_LOCATION);
            }

            if (checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                permissionsNeeded.add(Manifest.permission.ACCESS_COARSE_LOCATION);
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                if (checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                    permissionsNeeded.add(Manifest.permission.POST_NOTIFICATIONS);
                }
            }

            if (!permissionsNeeded.isEmpty()) {
                requestPermissions(permissionsNeeded.toArray(new String[0]), PERMISSION_REQUEST_CODE);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSION_REQUEST_CODE && IS_TRACKER) {
            startTrackerServiceIfPermitted();
        }
    }

    private void startTrackerServiceIfPermitted() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                if (!LocationService.isRunning) {
                    Intent intent = new Intent(this, LocationService.class);
                    intent.setAction(LocationService.ACTION_START);
                    ContextCompat.startForegroundService(this, intent);
                }
            }
        } else {
            if (!LocationService.isRunning) {
                Intent intent = new Intent(this, LocationService.class);
                intent.setAction(LocationService.ACTION_START);
                ContextCompat.startForegroundService(this, intent);
            }
        }
    }

    public class WebAppInterface {
        @JavascriptInterface
        public void startBackgroundTracking() {
            runOnUiThread(() -> {
                if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                    checkAndRequestPermissions();
                    Toast.makeText(MainActivity.this, "Permissão de localização necessária para segundo plano.", Toast.LENGTH_LONG).show();
                    return;
                }

                Intent intent = new Intent(MainActivity.this, LocationService.class);
                intent.setAction(LocationService.ACTION_START);
                ContextCompat.startForegroundService(MainActivity.this, intent);
                Toast.makeText(MainActivity.this, "Transmissão em 2º plano ATIVADA! (Tela pode ser bloqueada)", Toast.LENGTH_LONG).show();
            });
        }

        @JavascriptInterface
        public void stopBackgroundTracking() {
            runOnUiThread(() -> {
                Intent intent = new Intent(MainActivity.this, LocationService.class);
                intent.setAction(LocationService.ACTION_STOP);
                startService(intent);
                Toast.makeText(MainActivity.this, "Transmissão em 2º plano pausada.", Toast.LENGTH_SHORT).show();
            });
        }

        @JavascriptInterface
        public boolean isBackgroundTrackingActive() {
            return LocationService.isRunning;
        }

        @JavascriptInterface
        public boolean isNativeApp() {
            return true;
        }

        @JavascriptInterface
        public boolean isTrackerApp() {
            return IS_TRACKER;
        }

        @JavascriptInterface
        public String getWifiTelemetry() {
            try {
                Context ctx = getApplicationContext();
                WifiManager wifiManager = (WifiManager) ctx.getSystemService(Context.WIFI_SERVICE);
                ConnectivityManager connManager = (ConnectivityManager) ctx.getSystemService(Context.CONNECTIVITY_SERVICE);

                boolean isConnected = false;
                boolean isWifi = false;

                if (connManager != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    Network activeNetwork = connManager.getActiveNetwork();
                    if (activeNetwork != null) {
                        NetworkCapabilities caps = connManager.getNetworkCapabilities(activeNetwork);
                        if (caps != null) {
                            isConnected = caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
                            isWifi = caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI);
                        }
                    }
                }

                JSONObject json = new JSONObject();
                json.put("connected", isConnected);
                json.put("isWifi", isWifi);

                if (wifiManager != null) {
                    WifiInfo info = wifiManager.getConnectionInfo();
                    if (info != null) {
                        String rawSsid = info.getSSID();
                        String ssid = (rawSsid != null) ? rawSsid.replace("\"", "").trim() : "";
                        int rssi = info.getRssi();
                        int level;
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                            level = wifiManager.calculateSignalLevel(rssi);
                        } else {
                            level = WifiManager.calculateSignalLevel(rssi, 5);
                        }
                        int linkSpeed = info.getLinkSpeed();
                        int freq = 0;
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                            freq = info.getFrequency();
                        }

                        boolean isEduroam = "eduroam".equalsIgnoreCase(ssid);

                        json.put("ssid", ssid);
                        json.put("bssid", info.getBSSID() != null ? info.getBSSID() : "");
                        json.put("rssi", rssi);
                        json.put("level", level);
                        json.put("linkSpeedMbps", linkSpeed);
                        json.put("frequencyMhz", freq);
                        json.put("isEduroam", isEduroam);
                    }
                }
                return json.toString();
            } catch (Exception e) {
                return "{\"connected\":false,\"isWifi\":false,\"error\":\"" + e.getMessage() + "\"}";
            }
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (wifiPollRunnable != null) {
            wifiPollHandler.removeCallbacks(wifiPollRunnable);
        }
        LocationService.setUpdateCallback(null);
        super.onDestroy();
    }
}
