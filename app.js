document.addEventListener('DOMContentLoaded', () => {
  // Service Worker Registration for PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.error('Service Worker registration failed', err));
  }

  // Request initial capabilities and state from Native Bridge
  setTimeout(() => {
    window.Bridge.requestCapabilities();
    window.Bridge.requestServiceStatus();
    
    // Sync native layer with current settings
    window.Bridge.updateSettings(window.Settings.settings);
  }, 100);
});
