package br.edu.ufpb.locbus.mockgps;

import android.Manifest;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.provider.Settings;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.slider.Slider;
import com.google.android.material.switchmaterial.SwitchMaterial;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class MainActivity extends AppCompatActivity {

    private static final int PERMISSION_REQ_CODE = 1010;

    private TextView tvStatusBadge;
    private Spinner spinnerRoutes;
    private TextView tvRouteDetails;
    private TextView tvSpeedDisplay;
    private Slider sliderSpeed;
    private Button btnSpeed15, btnSpeed35, btnSpeed50;
    private SwitchMaterial switchLoop;
    private TextView tvCurrentPointName;
    private TextView tvCurrentCoordinates;
    private ProgressBar progressRoute;
    private TextView tvProgressPercent;
    private TextView tvElapsedTime;

    private MaterialButton btnStart;
    private MaterialButton btnPause;
    private MaterialButton btnStop;
    private View btnOpenDevSettings;

    private List<RouteManager.Route> routesList;
    private int selectedRouteIndex = 0;
    private float selectedSpeedKmh = 35.0f;

    private MockGpsService mockService;
    private boolean isBound = false;

    private final ServiceConnection serviceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            MockGpsService.LocalBinder binder = (MockGpsService.LocalBinder) service;
            mockService = binder.getService();
            isBound = true;
            syncUIState();
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            mockService = null;
            isBound = false;
        }
    };

    private final BroadcastReceiver statusReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (MockGpsService.ACTION_STATUS_UPDATE.equals(intent.getAction())) {
                String error = intent.getStringExtra(MockGpsService.EXTRA_ERROR);
                if (error != null) {
                    showErrorDialog(error);
                    return;
                }

                double lat = intent.getDoubleExtra(MockGpsService.EXTRA_LAT, 0.0);
                double lon = intent.getDoubleExtra(MockGpsService.EXTRA_LON, 0.0);
                float speed = intent.getFloatExtra(MockGpsService.EXTRA_SPEED, 0.0f);
                String pointName = intent.getStringExtra(MockGpsService.EXTRA_POINT_NAME);
                int progress = intent.getIntExtra(MockGpsService.EXTRA_PROGRESS, 0);
                int elapsed = intent.getIntExtra(MockGpsService.EXTRA_ELAPSED_SECONDS, 0);
                boolean running = intent.getBooleanExtra(MockGpsService.EXTRA_IS_RUNNING, false);
                boolean paused = intent.getBooleanExtra(MockGpsService.EXTRA_IS_PAUSED, false);

                updateUI(lat, lon, speed, pointName, progress, elapsed, running, paused);
            }
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initViews();
        setupRoutesSpinner();
        setupSpeedControls();
        setupActionButtons();
        checkAndRequestPermissions();

        // Inicia e conecta ao serviço
        Intent serviceIntent = new Intent(this, MockGpsService.class);
        startService(serviceIntent);
        bindService(serviceIntent, serviceConnection, Context.BIND_AUTO_CREATE);
    }

    private void initViews() {
        tvStatusBadge = findViewById(R.id.tv_status_badge);
        spinnerRoutes = findViewById(R.id.spinner_routes);
        tvRouteDetails = findViewById(R.id.tv_route_details);
        tvSpeedDisplay = findViewById(R.id.tv_speed_display);
        sliderSpeed = findViewById(R.id.slider_speed);
        btnSpeed15 = findViewById(R.id.btn_speed_15);
        btnSpeed35 = findViewById(R.id.btn_speed_35);
        btnSpeed50 = findViewById(R.id.btn_speed_50);
        switchLoop = findViewById(R.id.switch_loop);
        tvCurrentPointName = findViewById(R.id.tv_current_point_name);
        tvCurrentCoordinates = findViewById(R.id.tv_current_coordinates);
        progressRoute = findViewById(R.id.progress_route);
        tvProgressPercent = findViewById(R.id.tv_progress_percent);
        tvElapsedTime = findViewById(R.id.tv_elapsed_time);

        btnStart = findViewById(R.id.btn_start);
        btnPause = findViewById(R.id.btn_pause);
        btnStop = findViewById(R.id.btn_stop);
        btnOpenDevSettings = findViewById(R.id.btn_open_dev_settings);

        btnOpenDevSettings.setOnClickListener(v -> openDeveloperSettings());
    }

    private void setupRoutesSpinner() {
        routesList = RouteManager.getAvailableRoutes();
        List<String> titles = new ArrayList<>();
        for (RouteManager.Route r : routesList) {
            titles.add(r.title);
        }

        ArrayAdapter<String> adapter = new ArrayAdapter<>(
                this,
                android.R.layout.simple_spinner_dropdown_item,
                titles
        );
        spinnerRoutes.setAdapter(adapter);

        spinnerRoutes.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                selectedRouteIndex = position;
                RouteManager.Route selected = routesList.get(position);
                tvRouteDetails.setText(selected.description);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
    }

    private void setupSpeedControls() {
        sliderSpeed.addOnChangeListener((slider, value, fromUser) -> {
            selectedSpeedKmh = value;
            tvSpeedDisplay.setText(String.format(Locale.getDefault(), "%.0f km/h", selectedSpeedKmh));
            if (isBound && mockService != null) {
                mockService.setSpeedKmh(selectedSpeedKmh);
            }
        });

        btnSpeed15.setOnClickListener(v -> sliderSpeed.setValue(15.0f));
        btnSpeed35.setOnClickListener(v -> sliderSpeed.setValue(35.0f));
        btnSpeed50.setOnClickListener(v -> sliderSpeed.setValue(50.0f));

        switchLoop.setOnCheckedChangeListener((buttonView, isChecked) -> {
            if (isBound && mockService != null) {
                mockService.setLoopEnabled(isChecked);
            }
        });
    }

    private void setupActionButtons() {
        btnStart.setOnClickListener(v -> {
            if (!isBound || mockService == null) return;
            RouteManager.Route route = routesList.get(selectedRouteIndex);
            boolean success = mockService.startSimulation(route.waypoints, selectedSpeedKmh, switchLoop.isChecked());
            if (success) {
                Toast.makeText(this, "Simulação Iniciada!", Toast.LENGTH_SHORT).show();
            }
        });

        btnPause.setOnClickListener(v -> {
            if (!isBound || mockService == null) return;
            if (mockService.isPaused()) {
                mockService.resumeSimulation();
            } else {
                mockService.pauseSimulation();
            }
        });

        btnStop.setOnClickListener(v -> {
            if (!isBound || mockService == null) return;
            mockService.stopSimulation();
            Toast.makeText(this, "Simulação Parada", Toast.LENGTH_SHORT).show();
        });
    }

    private void syncUIState() {
        if (!isBound || mockService == null) return;
        boolean running = mockService.isRunning();
        boolean paused = mockService.isPaused();
        updateUI(0, 0, selectedSpeedKmh, mockService.getCurrentPointName(), mockService.getProgressPercent(), 0, running, paused);
    }

    private void updateUI(double lat, double lon, float speed, String pointName, int progress, int elapsedSeconds, boolean isRunning, boolean isPaused) {
        if (isRunning) {
            if (isPaused) {
                tvStatusBadge.setText("PAUSADO");
                tvStatusBadge.setBackgroundResource(R.drawable.bg_badge_paused);
                btnPause.setText("▶");
            } else {
                tvStatusBadge.setText("SIMULANDO");
                tvStatusBadge.setBackgroundResource(R.drawable.bg_badge_running);
                btnPause.setText("⏸");
            }
            btnStart.setEnabled(false);
            btnPause.setEnabled(true);
            btnStop.setEnabled(true);
            spinnerRoutes.setEnabled(false);
        } else {
            tvStatusBadge.setText("PARADO");
            tvStatusBadge.setBackgroundResource(R.drawable.bg_badge_idle);
            btnStart.setEnabled(true);
            btnPause.setEnabled(false);
            btnStop.setEnabled(false);
            spinnerRoutes.setEnabled(true);
        }

        if (pointName != null && !pointName.isEmpty()) {
            tvCurrentPointName.setText(pointName);
        }
        if (lat != 0.0 || lon != 0.0) {
            tvCurrentCoordinates.setText(String.format(Locale.getDefault(), "Lat: %.6f | Lon: %.6f (%.0f km/h)", lat, lon, speed));
        }

        progressRoute.setProgress(progress);
        tvProgressPercent.setText(String.format(Locale.getDefault(), "Progresso: %d%%", progress));

        int mins = elapsedSeconds / 60;
        int secs = elapsedSeconds % 60;
        tvElapsedTime.setText(String.format(Locale.getDefault(), "Tempo: %02d:%02d", mins, secs));
    }

    private void openDeveloperSettings() {
        try {
            Intent intent = new Intent(Settings.ACTION_APPLICATION_DEVELOPMENT_SETTINGS);
            startActivity(intent);
        } catch (Exception e) {
            Toast.makeText(this, "Abra Configurações > Opções do Desenvolvedor > App de Local Fictício", Toast.LENGTH_LONG).show();
        }
    }

    private void showErrorDialog(String message) {
        new AlertDialog.Builder(this)
                .setTitle("Configuração Necessária")
                .setMessage(message)
                .setPositiveButton("Abrir Opções de Desenvolvedor", (dialog, which) -> openDeveloperSettings())
                .setNegativeButton("OK", null)
                .show();
    }

    private void checkAndRequestPermissions() {
        List<String> needed = new ArrayList<>();
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            needed.add(Manifest.permission.ACCESS_FINE_LOCATION);
        }
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            needed.add(Manifest.permission.ACCESS_COARSE_LOCATION);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                needed.add(Manifest.permission.POST_NOTIFICATIONS);
            }
        }

        if (!needed.isEmpty()) {
            ActivityCompat.requestPermissions(this, needed.toArray(new String[0]), PERMISSION_REQ_CODE);
        }
    }

    @Override
    protected void onStart() {
        super.onStart();
        IntentFilter filter = new IntentFilter(MockGpsService.ACTION_STATUS_UPDATE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(statusReceiver, filter, Context.RECEIVER_NOT_EXPORTED);
        } else {
            registerReceiver(statusReceiver, filter);
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
        try {
            unregisterReceiver(statusReceiver);
        } catch (Exception ignored) {
        }
    }

    @Override
    protected void onDestroy() {
        if (isBound) {
            unbindService(serviceConnection);
            isBound = false;
        }
        super.onDestroy();
    }
}

