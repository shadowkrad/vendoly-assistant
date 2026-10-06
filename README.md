# ⚡ Vendoly Assistant (Chrome & Edge Extension)

Estensione browser Manifest V3 ufficiale per **Vendoly** (Taaaac Retail Suite) per l'automazione e il cross-listing rapido su **Vinted** e marketplace second-hand.

---

## 🎯 Funzionalità
- **Autofill 1-Click**: Invia un capo da Vendoly alla pagina di nuovo annuncio di Vinted (`vinted.it/items/new`).
- **Iniezione Automatica Immagini**: Converte le immagini salvate su Vendoly in file reali e le inietta nell'input di caricamento Vinted via `DataTransfer`.
- **Pre-compilazione Dati**: Popola titolo, descrizione con hashtag pertinenti, prezzo netto (0% commissioni) e mostra l'assistente HUD con brand, taglia e formato pacco raccomandato.
- **Review Mode Sicuro**: Consente al venditore di controllare l'anteprima dell'annuncio prima della pubblicazione definitiva.
- **Chiusura del cerchio**: Intercetta l'URL finale dell'annuncio pubblicato e aggiorna lo stato in Vendoly.

---

## 🚀 Installazione per Sviluppo & Test (Modalità Sviluppatore)

1. Apri Google Chrome o Microsoft Edge.
2. Vai su `chrome://extensions/` (o `edge://extensions/`).
3. Attiva lo switch **Modalità sviluppatore** (in alto a destra).
4. Clicca su **Carica estensione non pacchettizzata** (Load unpacked).
5. Seleziona questa cartella (`C:\Users\Alessio Guidelli\Google\Vendoly Assistant`).
6. L'icona di **Vendoly Assistant** apparirà nella barra delle estensioni del browser!

---

## 📦 Struttura del Progetto
```
.
├── manifest.json              # Configurazione Chrome Manifest V3
├── icons/                     # Icone estensione (16x16, 48x48, 128x128)
├── src/
│   ├── background/
│   │   └── service-worker.js  # Gestore eventi di background e storage
│   ├── content/
│   │   ├── vendoly-bridge.js  # Ponte tra Vendoly Web App e l'estensione
│   │   └── vinted-filler.js   # Script di autocompilazione su Vinted Web
│   ├── popup/
│   │   ├── popup.html         # Interfaccia grafica popup
│   │   ├── popup.js           # Gestione impostazioni utente
│   │   └── popup.css          # Stili dark-mode Vendoly
│   └── utils/
│       └── selectors.js       # Selettori DOM per Vinted
└── README.md
```

---

## 🔗 Repository GitHub
- **Remote**: `https://github.com/shadowkrad/vendoly-assistant.git`
- **Parte di**: *Taaaac Core & Vendoly Ecosystem*
