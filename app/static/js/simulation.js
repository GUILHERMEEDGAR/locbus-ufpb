/**
 * simulation.js - Controle de Simulação em Tempo Real da Rota LocBUS
 * Integra-se ao motor de Server-Sent Events (SSE) para atualização instantânea em todos os clientes conectados.
 */

const btnDemoMode = document.getElementById('btn-demo-mode');

if (btnDemoMode) {
  btnDemoMode.addEventListener('click', () => {
    btnDemoMode.disabled = true;
    btnDemoMode.textContent = '⏳ Avançando...';

    fetch('/api/v1/simulation/step', {
      method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
      const p = data.simulated_point;
      const step = data.step;
      const total = data.total_steps;

      // O SSE já transmite a atualização para todos os navegadores conectados instantaneamente.
      // Aplicamos também de forma local e otimista para feedback de latência zero:
      if (typeof updateBusMarker === 'function' && p) {
        updateBusMarker(p.lat, p.lon, 8.5, true);
      }

      if (typeof applyStatusToUI === 'function' && data.status) {
        applyStatusToUI(data.status);
      }

      btnDemoMode.textContent = `⚡ Passo ${step}/${total}: ${p.desc}`;
      setTimeout(() => {
        btnDemoMode.disabled = false;
        btnDemoMode.textContent = '⚡ Avançar Rota';
      }, 1200);
    })
    .catch(err => {
      console.error('Erro na simulação:', err);
      btnDemoMode.disabled = false;
      btnDemoMode.textContent = '⚡ Simular Rota';
    });
  });
}
