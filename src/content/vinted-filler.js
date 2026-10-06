/**
 * Vendoly Assistant - Vinted Autofill Content Script
 * Compila automaticamente foto, titolo, descrizione e prezzo su Vinted (/items/new).
 */

(() => {
  console.log('[Vendoly Assistant] Vinted script attivo.');

  // Verifica se c'è un prodotto in coda da compilare
  chrome.runtime.sendMessage({ type: 'GET_PENDING_ITEM' }, async (response) => {
    if (!response || !response.item) return;

    const item = response.item;
    console.log('[Vendoly Assistant] Inizio compilazione automatica per:', item.title);

    showFloatingBanner(`🤖 Vendoly Assistant: Compilazione in corso per "${item.title}"...`, 'info');

    // 1. Attendi che il DOM di Vinted sia pronto
    await waitForElement('input[name="title"], textarea[name="description"]', 10000);

    // 2. Inietta le Foto via DataTransfer
    if (item.images && item.images.length > 0) {
      showFloatingBanner(`📸 Caricamento di ${item.images.length} foto in corso...`, 'info');
      await injectImages(item.images);
    }

    // 3. Compila Titolo
    const titleInput = document.querySelector('input[name="title"], input[id="title"], [data-testid="title--input"]');
    if (titleInput) {
      setNativeInputValue(titleInput, item.title);
    }

    // 4. Compila Descrizione
    const descTextarea = document.querySelector('textarea[name="description"], textarea[id="description"], [data-testid="description--input"]');
    if (descTextarea) {
      setNativeInputValue(descTextarea, item.description);
    }

    // 5. Compila Prezzo
    const priceInput = document.querySelector('input[name="price"], input[id="price"], [data-testid="price--input"]');
    if (priceInput && item.price) {
      setNativeInputValue(priceInput, item.price.toString());
    }

    // 6. Mostra HUD di riepilogo con guida ai campi
    renderAssistantHUD(item);

    showFloatingBanner(`✅ Scheda compilata con successo! Verifica i dettagli e clicca Carica.`, 'success');
  });

  // Funzione per impostare i valori ingannando il Virtual DOM di React
  function setNativeInputValue(element, value) {
    const valueSetter = Object.getOwnPropertyDescriptor(element.__proto__, 'value')?.set ||
                        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set ||
                        Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
    if (valueSetter) {
      valueSetter.call(element, value);
    } else {
      element.value = value;
    }
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Inietta le immagini come oggetti File tramite DataTransfer
  async function injectImages(imageUrls) {
    try {
      const fileInput = document.querySelector('input[type="file"][multiple], input[type="file"][accept*="image"]');
      if (!fileInput) {
        console.warn('[Vendoly Assistant] Input file non trovato.');
        return;
      }

      const dt = new DataTransfer();
      for (let i = 0; i < imageUrls.length; i++) {
        const url = imageUrls[i];
        try {
          const res = await fetch(url);
          const blob = await res.blob();
          const ext = blob.type.includes('png') ? 'png' : 'jpg';
          const file = new File([blob], `vendoly_photo_${i + 1}.${ext}`, { type: blob.type });
          dt.items.add(file);
        } catch (e) {
          console.error('[Vendoly Assistant] Errore caricamento immagine:', url, e);
        }
      }

      if (dt.files.length > 0) {
        fileInput.files = dt.files;
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
        console.log(`[Vendoly Assistant] ${dt.files.length} foto iniettate nell'input file.`);
      }
    } catch (err) {
      console.error('[Vendoly Assistant] Errore iniezione immagini:', err);
    }
  }

  // Attende la presenza di un elemento nel DOM
  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve) => {
      const existing = document.querySelector(selector);
      if (existing) return resolve(existing);

      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeout);
    });
  }

  // Mostra un banner informativo fluttuante
  function showFloatingBanner(text, type = 'info') {
    let banner = document.getElementById('vendoly-assistant-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'vendoly-assistant-banner';
      banner.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999999;
        padding: 12px 18px;
        border-radius: 12px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 13px;
        font-weight: 600;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        transition: all 0.3s ease;
      `;
      document.body.appendChild(banner);
    }

    if (type === 'success') {
      banner.style.background = '#065f46';
      banner.style.color = '#ffffff';
      banner.style.border = '1px solid #10b981';
    } else {
      banner.style.background = '#0f172a';
      banner.style.color = '#ffffff';
      banner.style.border = '1px solid #06b6d4';
    }

    banner.textContent = text;

    if (type === 'success') {
      setTimeout(() => {
        banner.style.opacity = '0';
        setTimeout(() => banner.remove(), 400);
      }, 5000);
    }
  }

  // Mostra un pannellino di supporto laterale (HUD) con le specifiche del prodotto
  function renderAssistantHUD(item) {
    const hud = document.createElement('div');
    hud.id = 'vendoly-assistant-hud';
    hud.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999990;
      background: #0f172a;
      color: #f8fafc;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 16px;
      width: 320px;
      box-shadow: 0 20px 30px -10px rgba(0,0,0,0.5);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 12px;
    `;

    hud.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <span style="font-weight: 700; color: #38bdf8; display: flex; align-items: center; gap: 6px;">
          ⚡ Vendoly Assistant
        </span>
        <button id="vendoly-hud-close" style="background: none; border: none; color: #94a3b8; font-size: 16px; cursor: pointer;">✕</button>
      </div>
      <div style="background: #1e293b; border-radius: 10px; padding: 10px; margin-bottom: 12px; line-height: 1.5;">
        <div><b>Brand:</b> ${item.brand || 'Da selezionare'}</div>
        <div><b>Taglia:</b> ${item.size || 'Unica'}</div>
        <div><b>Condizione:</b> ${item.conditionLabel || item.condition || 'Ottimo'}</div>
        <div><b>Formato Pacco:</b> <span style="color: #34d399; font-weight: bold;">${item.parcelSize || 'Pacco Medio'}</span></div>
        <div><b>Prezzo Netto:</b> € ${item.price?.toFixed(2) || '0.00'}</div>
      </div>
      <div style="font-size: 11px; color: #94a3b8; text-align: center;">
        Titolo, descrizione e foto compilati automaticamente.
      </div>
    `;

    document.body.appendChild(hud);
    document.getElementById('vendoly-hud-close')?.addEventListener('click', () => hud.remove());
  }
})();
