# ⚡ Vendoly Assistant — Release Notes

## Versione 1.0.0 (Allineata a Vendoly v1.0.3)

> **Vendoly Assistant** è l'estensione browser ufficiale Manifest V3 per **Google Chrome** e **Microsoft Edge**, progettata per automatizzare il cross-listing rapido dei capi e articoli da **Vendoly** verso **Vinted** a commissione 0%.

---

### 1. 🚀 Integrazione Vinted Web Automatica (1-Click Autofill)
- **Deep-link Diretto**: al clic su *"⚡ Invia a Vinted"* o *"Autocompila con Vendoly Assistant"* su Vendoly, l'estensione apre automaticamente la scheda di nuovo annuncio su `https://www.vinted.it/items/new`.
- **Iniezione Foto via DataTransfer**:
  - Risolve il limite del browser prelevando le immagini salvate su Vendoly in formato Blob/File reale.
  - Inietta i file direttamente nel campo `<input type="file" multiple>` di Vinted simulando l'azione umana e scatenando gli eventi nativi di upload React.
- **Compilazione Istantanea Campi Base**:
  - **Titolo ottimizzato**: include nome del capo, brand e stato.
  - **Descrizione professionale**: struttura con misure in cm, composizione, note difetti, garanzia originalità, istruzioni spedizione locker/InPost e hashtag SEO per l'algoritmo di ricerca Vinted.
  - **Prezzo Netto**: precompilato con l'importo calcolato su Vendoly (0% commissioni).

---

### 2. 🛡️ Vendoly Assistant HUD & Review Mode (Sicurezza Totale)
- **HUD Laterale di Assistenza**:
  - Pannello fluttuante discreto in basso a destra su Vinted che riassume i metadati chiave del capo da impostare nei menu a tendina:
    - **Brand**: marca del prodotto da selezionare nel filtro.
    - **Taglia**: taglia standard Vinted.
    - **Condizione**: mappatura Vendoly (`Nuovo con cartellino`, `Ottime condizioni`, ecc.).
    - **Formato Pacco Consigliato**: indicazione visiva chiara (**Piccolo**, **Medio** o **Grande** in base al peso o categoria calcolati da Vendoly).
- **Banner di Stato in Tempo Reale**:
  - Notifiche visive con lo stato di avanzamento (`Caricamento foto in corso...`, `Campi compilati!`).
- **Review Mode Attivo di Default**:
  - L'estensione non preme il tasto di pubblicazione alla cieca: lascia al negoziante la libertà di verificare in 2 secondi l'anteprima prima di cliccare "Carica".
  - Opzione disattivabile dal popup dell'estensione per chi desidera l'autocompilazione full auto.

---

### 3. 🔄 Bridge Bidirezionale con Vendoly Core
- **Handshake Automatico**:
  - L'estensione inietta uno script bridge leggero sulle pagine di Vendoly (`localhost`, `vendoly.it`).
  - Vendoly rileva all'istante la presenza dell'estensione mostrando il badge verde *"Assistant Attivo"* nel modal di pubblicazione rapida.
- **Chiusura del Cerchio & Kill-Switch**:
  - Una volta pubblicato l'annuncio su Vinted, l'estensione rileva l'URL finale (`/items/{id}`) e lo notifica a Vendoly per impostare lo stato `ChannelListing: ACTIVE`.
  - In questo modo il Kill-Switch anti-doppia vendita di Vendoly resta armato e vigile in caso di vendita al banco cassa.

---

### 4. 🌐 Compatibilità & Supporto
- **Manifest V3 nativo**: pienamente conforme alle più recenti policy di sicurezza di Google e Chromium.
- **Browser supportati**: Google Chrome, Microsoft Edge, Brave, Opera.
- **Dominio Vinted multi-nazione**: supporta `vinted.it`, `vinted.fr`, `vinted.es`, `vinted.de` e `vinted.com`.
