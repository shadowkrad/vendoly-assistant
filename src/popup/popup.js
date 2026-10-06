document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('reviewModeToggle');

  // Carica stato corrente
  chrome.storage.local.get(['autoSubmit'], (data) => {
    // Review mode è attivo quando autoSubmit è false
    toggle.checked = !data.autoSubmit;
  });

  // Salva stato al toggle
  toggle.addEventListener('change', () => {
    chrome.storage.local.set({ autoSubmit: !toggle.checked });
  });
});
