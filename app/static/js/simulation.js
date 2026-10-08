/**
 * simulation.js - Controle de Simulação em Tempo Real da Rota Circular LocBUS
 * Suporte a execução contínua (Play/Pause), avanço passo a passo, reset e ajuste de velocidade.
 * Circuito Completo: Ida (CCHLA -> CI) e Volta (CI -> CCHLA).
 */

let simulationInterval = null;
let simulationSpeedMs = 2000;
let isSimulationRunning = false;

const btnPlayPause = document.getElementById('btn-sim-play-pause');
const btnStep = document.getElementById('btn-sim-step');
const btnReset = document.getElementById('btn-sim-reset');
const btnDemoHeader = document.getElementById('btn-demo-mode');
const speedButtons = document.querySelectorAll('.btn-speed');
const simStepBadge = document.getElementById('sim-step-badge');
const simDirectionText = document.getElementById('sim-direction-text');
const simProgressBar = document.getElementById('sim-progress-bar');
const simPlayIcon = document.getElementById('sim-play-icon');
const simPlayLabel = document.getElementById('sim-play-label');
const btnToggleSimPanel = document.getElementById('btn-toggle-sim-panel');
const simulationPanel = document.getElementById('simulation-panel');

if (btnToggleSimPanel && simulationPanel) {
  btnToggleSimPanel.addEventListener('click', () => {
    const isHidden = simulationPanel.style.display === 'none';
    simulationPanel.style.display = isHidden ? 'block' : 'none';
    btnToggleSimPanel.classList.toggle('active', isHidden);
  });
}

function advanceSimulationStep() {
  return fetch('/api/v1/simulation/step', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      const p = data.simulated_point;
      const step = data.step;
      const total = data.total_steps;
      const status = data.status;

      // 1. Atualiza visual no mapa Leaflet
      if (typeof updateBusMarker === 'function' && p) {
        updateBusMarker(p.lat, p.lon, 6.0, true);
      }

      // 2. Atualiza UI dos cartões de status
      if (typeof applyStatusToUI === 'function' && status) {
        applyStatusToUI(status);
      }

      // 3. Atualiza badges do painel de simulação
      if (simStepBadge && p) {
        simStepBadge.textContent = `Ponto ${step} de ${total}: ${p.desc}`;
      }

      if (simDirectionText && p) {
        const sentido = (p.origem === 'CCHLA' && p.destino === 'CI') ? 'Ida (CCHLA → CI)' : 'Volta (CI → CCHLA)';
        simDirectionText.innerHTML = `Sentido: <strong>${sentido}</strong>`;
      }

      if (simProgressBar) {
        const pct = Math.round((step / total) * 100);
        simProgressBar.style.width = `${pct}%`;
      }

      if (btnDemoHeader) {
        btnDemoHeader.textContent = isSimulationRunning ? `⚡ Ponto ${step}/${total}` : `⚡ Passo ${step}/${total}`;
      }

      return data;
    })
    .catch(err => {
      console.error('Erro ao avançar simulação:', err);
    });
}

function startContinuousSimulation() {
  if (isSimulationRunning) return;
  isSimulationRunning = true;
  updatePlayButtonUI(true);

  // Executa imediatamente o primeiro passo e continua no intervalo
  advanceSimulationStep();
  simulationInterval = setInterval(advanceSimulationStep, simulationSpeedMs);
}

function pauseContinuousSimulation() {
  if (!isSimulationRunning) return;
  isSimulationRunning = false;
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
  updatePlayButtonUI(false);
}

function toggleSimulation() {
  if (isSimulationRunning) {
    pauseContinuousSimulation();
  } else {
    startContinuousSimulation();
  }
}

function updatePlayButtonUI(running) {
  if (simPlayIcon && simPlayLabel) {
    simPlayIcon.textContent = running ? '⏸' : '▶';
    simPlayLabel.textContent = running ? 'Pausar Simulação' : 'Continuar Simulação';
  }
  if (btnPlayPause) {
    btnPlayPause.classList.toggle('btn-sim-pause', running);
    btnPlayPause.classList.toggle('btn-sim-play', !running);
  }
  if (btnDemoHeader) {
    btnDemoHeader.classList.toggle('sim-active', running);
    if (!running) {
      btnDemoHeader.textContent = '⚡ Simular Rota';
    }
  }
}

function resetSimulation() {
  pauseContinuousSimulation();
  fetch('/api/v1/simulation/reset', { method: 'POST' })
    .then(res => res.json())
    .then(() => {
      if (simStepBadge) simStepBadge.textContent = 'Ponto 1 de 31: Parado no Terminal CCHLA';
      if (simDirectionText) simDirectionText.innerHTML = 'Sentido: <strong>Ida (CCHLA → CI)</strong>';
      if (simProgressBar) simProgressBar.style.width = '3%';
      if (btnDemoHeader) btnDemoHeader.textContent = '⚡ Simular Rota';
      if (typeof updateBusMarker === 'function') {
        updateBusMarker(-7.1397, -34.8450, 0, false);
      }
    })
    .catch(err => console.error('Erro ao reiniciar simulação:', err));
}

// Event Listeners
if (btnPlayPause) {
  btnPlayPause.addEventListener('click', toggleSimulation);
}

if (btnStep) {
  btnStep.addEventListener('click', () => {
    pauseContinuousSimulation();
    advanceSimulationStep();
  });
}

if (btnReset) {
  btnReset.addEventListener('click', resetSimulation);
}

if (btnDemoHeader) {
  btnDemoHeader.addEventListener('click', toggleSimulation);
}

// Seletor de Velocidade
speedButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    speedButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    simulationSpeedMs = parseInt(btn.getAttribute('data-speed'), 10) || 2000;

    // Se estiver rodando, reinicia o timer com a nova velocidade
    if (isSimulationRunning) {
      clearInterval(simulationInterval);
      simulationInterval = setInterval(advanceSimulationStep, simulationSpeedMs);
    }
  });
});
