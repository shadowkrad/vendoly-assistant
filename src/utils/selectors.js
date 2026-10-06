/**
 * Mappatura selettori DOM per Vinted Web (/items/new)
 */
const VINTED_SELECTORS = {
  // Input File Immagini
  fileInput: 'input[type="file"][multiple], input[type="file"][accept*="image"]',
  dropzone: '[data-testid="photo-dropzone"], .photo-dropzone, div[class*="Dropzone"]',

  // Titolo & Descrizione
  titleInput: 'input[name="title"], input[id="title"], [data-testid="title--input"]',
  descriptionTextarea: 'textarea[name="description"], textarea[id="description"], [data-testid="description--input"]',

  // Categorie
  categorySelector: '[data-testid="category-select"], button[id*="catalog"], div[class*="category-selector"]',

  // Brand
  brandInput: 'input[name="brand"], input[id="brand"], [data-testid="brand--input"]',

  // Taglia
  sizeSelector: '[data-testid="size-select"], button[id*="size"]',

  // Condizioni
  conditionGroup: '[data-testid="status-select"], div[class*="status-selector"]',

  // Prezzo
  priceInput: 'input[name="price"], input[id="price"], [data-testid="price--input"]',

  // Pacco Spedizione
  packageSizeOptions: '[data-testid="package-size"], div[class*="package-size"]',

  // Pulsante Pubblica
  submitButton: 'button[type="submit"], [data-testid="item-upload-button"], button[class*="Button--primary"]'
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VINTED_SELECTORS };
}
