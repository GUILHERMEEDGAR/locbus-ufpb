/**
 * pwa.js - Módulo de Gerenciamento do Progressive Web App (PWA)
 * Registra o Service Worker, gerencia o prompt de instalação nativo e monitora o status de rede (online/offline).
 */

let deferredInstallPrompt = null;
const btnInstallPwa = document.getElementById('btn-install-pwa');
const offlineBanner = document.getElementById('offline-banner');

// 1. Registro do Service Worker no escopo raiz
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('[PWA] Service Worker registrado com sucesso no escopo:', reg.scope);
      })
      .catch(err => {
        console.warn('[PWA] Falha no registro do Service Worker:', err);
      });
  });
}

// 2. Captura do Evento de Instalação (beforeinstallprompt)
window.addEventListener('beforeinstallprompt', (event) => {
  // Impede o banner padrão automático do navegador
  event.preventDefault();
  deferredInstallPrompt = event;

  // Exibe o botão de instalação na interface
  if (btnInstallPwa) {
    btnInstallPwa.style.display = 'inline-flex';
  }
});

if (btnInstallPwa) {
  btnInstallPwa.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;

    btnInstallPwa.disabled = true;
    deferredInstallPrompt.prompt();

    const { outcome } = await deferredInstallPrompt.userChoice;
    console.log('[PWA] Escolha do usuário na instalação:', outcome);

    deferredInstallPrompt = null;
    btnInstallPwa.style.display = 'none';
    btnInstallPwa.disabled = false;
  });
}

// 3. Notificação quando o PWA for instalado com sucesso
window.addEventListener('appinstalled', () => {
  console.log('[PWA] LocBUS instalado no dispositivo com sucesso.');
  if (btnInstallPwa) {
    btnInstallPwa.style.display = 'none';
  }
});

// 4. Detecção e Notificação de Conexão Online/Offline
function updateOnlineStatus() {
  if (!offlineBanner) return;

  if (navigator.onLine) {
    offlineBanner.classList.remove('active');
    // Se o SSE estiver desconectado, reativa
    if (typeof initSSE === 'function') {
      initSSE();
    }
  } else {
    offlineBanner.classList.add('active');
  }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
document.addEventListener('DOMContentLoaded', updateOnlineStatus);

// 5. Suporte a Atalhos de Abas via URL (ex: /?tab=itinerario)
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const requestedTab = urlParams.get('tab') || window.location.hash.replace('#', '');

  if (requestedTab) {
    const targetBtn = document.querySelector(`.tab-btn[data-tab="tab-view-${requestedTab}"]`);
    if (targetBtn) {
      targetBtn.click();
    }
  }
});
