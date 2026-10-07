/**
 * Vendoly Assistant - Bridge Content Script
 * Si inietta su Vendoly e fa da ponte tra la web app e l'estensione Chrome.
 */

(() => {
  console.log('[Vendoly Assistant] Bridge inizializzato su Vendoly.');

  // Segnala all'applicazione web che l'estensione è attiva
  function broadcastReady() {
    window.postMessage({ type: 'VENDOLY_ASSISTANT_AVAILABLE', version: '1.0.3' }, '*');
    document.documentElement.setAttribute('data-vendoly-assistant', 'installed');
    document.documentElement.setAttribute('data-vendoly-assistant-version', '1.0.3');
  }

  broadcastReady();

  // Ascolta messaggi da Vendoly (es. clic sul pulsante "⚡ Invia a Vinted")
  window.addEventListener('message', (event) => {
    if (!event.data) return;

    if (event.data.type === 'PING_VENDOLY_ASSISTANT') {
      broadcastReady();
      return;
    }

    if (event.data.source !== 'vendoly-web') return;

    if (event.data.type === 'START_VINTED_CROSSPOST') {
      const payload = event.data.payload;
      console.log('[Vendoly Assistant] Ricevuta richiesta di invio a Vinted:', payload);

      chrome.runtime.sendMessage(
        {
          type: 'CROSSPOST_TO_VINTED',
          payload
        },
        (response) => {
          window.postMessage({
            type: 'VENDOLY_CROSSPOST_STATUS',
            source: 'vendoly-assistant',
            success: response?.success || false
          }, '*');
        }
      );
    }
  });

  // Ascolta messaggi dal Service Worker (es. annuncio pubblicato con successo su Vinted)
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'VINTED_LISTING_CONFIRMED') {
      console.log('[Vendoly Assistant] Annuncio Vinted confermato, notifico Vendoly:', message.payload);
      window.postMessage({
        type: 'VINTED_LISTING_CONFIRMED',
        source: 'vendoly-assistant',
        payload: message.payload
      }, '*');
    }
  });
})();
