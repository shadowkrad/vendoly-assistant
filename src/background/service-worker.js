/**
 * Vendoly Assistant - Service Worker (Manifest V3)
 * Coordina il passaggio dati tra Vendoly e Vinted.
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('[Vendoly Assistant] Estensione installata con successo.');
  chrome.storage.local.set({
    autoSubmit: false, // Default: Review mode (il commerciante controlla prima di pubblicare)
    vendolyOrigin: 'http://localhost:3000',
    pendingItem: null
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 1. Messaggio ricevuto da Vendoly: Richiesta di apertura annuncio su Vinted
  if (message.type === 'CROSSPOST_TO_VINTED') {
    const product = message.payload;
    console.log('[Vendoly Assistant] Ricevuto prodotto da Vendoly:', product.title);

    // Salva il prodotto nello storage temporaneo
    chrome.storage.local.set({ pendingItem: product }, () => {
      // Apri la scheda di creazione annuncio su Vinted
      chrome.tabs.create({ url: 'https://www.vinted.it/items/new' }, (tab) => {
        sendResponse({ success: true, tabId: tab.id });
      });
    });
    return true; // Asincrono
  }

  // 2. Richiesta dati da parte di Vinted Content Script
  if (message.type === 'GET_PENDING_ITEM') {
    chrome.storage.local.get(['pendingItem', 'autoSubmit'], (data) => {
      sendResponse({
        item: data.pendingItem || null,
        autoSubmit: data.autoSubmit || false
      });
      // Puliamo il pending item una volta consumato per evitare ripopolamenti accidentali
      if (data.pendingItem) {
        chrome.storage.local.set({ pendingItem: null });
      }
    });
    return true;
  }

  // 3. Notifica di annuncio pubblicato con successo su Vinted
  if (message.type === 'ITEM_PUBLISHED_ON_VINTED') {
    const { externalUrl, externalId, productId } = message;
    console.log('[Vendoly Assistant] Annuncio pubblicato su Vinted:', externalUrl);

    // Notifica le schede Vendoly aperte per aggiornare lo stato in ChannelListing
    chrome.tabs.query({ url: ['*://localhost/*', '*://*.vendoly.it/*'] }, (tabs) => {
      for (const tab of tabs) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'VINTED_LISTING_CONFIRMED',
          payload: { externalUrl, externalId, productId }
        }).catch(() => {});
      }
    });

    sendResponse({ success: true });
    return true;
  }
});
