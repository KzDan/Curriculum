// Controla la instalación de la PWA y registra el Service Worker.
let installPrompt = null;
const installButton = document.getElementById('installButton');
const installNote = document.getElementById('installNote');
const offlineMessage = document.getElementById('offlineMessage');

// El navegador envía este evento cuando determina que la página se puede instalar.
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.hidden = false;
  installNote.hidden = false;
});

// La instalación siempre requiere confirmación del usuario.
installButton.addEventListener('click', async () => {
  if (!installPrompt) {
    offlineMessage.textContent = 'Si no aparece la ventana de instalación, abre el menú del navegador y elige “Instalar página como aplicación”.';
    return;
  }
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  installButton.hidden = true;
  installNote.hidden = true;
});

window.addEventListener('appinstalled', () => {
  installPrompt = null;
  installButton.hidden = true;
  installNote.hidden = true;
  offlineMessage.textContent = 'La aplicación se instaló correctamente.';
});

// Informa si hay conexión; el Service Worker sirve la versión guardada sin conexión.
function updateConnectionMessage() {
  offlineMessage.textContent = navigator.onLine
    ? 'Página lista para usar. Después de la primera carga, los archivos guardados estarán disponibles sin conexión.'
    : 'Estás sin conexión. Se mostrará la versión guardada si ya visitaste la página anteriormente.';
}
window.addEventListener('online', updateConnectionMessage);
window.addEventListener('offline', updateConnectionMessage);
updateConnectionMessage();

// El Service Worker solo puede funcionar en HTTPS o localhost.
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('./sw.js', { scope: './' });
    } catch (error) {
      console.error('No se pudo registrar el Service Worker:', error);
    }
  });
}
