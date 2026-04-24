export class CitiesFilterSearch {
  constructor({
    rootElement = null,
    rootSelector = null,
    inputSelector = '.cities-filter__search-input',
    clearButtonSelector = '.cities-filter__clear-search-btn',
    clearCitiesSelector = '[data-clear-cities]',
    hiddenClass = 'hidden',
    citiesFilterKey = 'cities'
  } = {}) {
    this.root =
      rootElement instanceof Element
        ? rootElement
        : document.querySelector(rootSelector);

    if (!this.root) {
      throw new Error(
        `CitiesFilterSearch: root element not found by selector "${rootSelector}"`
      );
    }

    this.inputSelector = inputSelector;
    this.clearButtonSelector = clearButtonSelector;
    this.clearCitiesSelector = clearCitiesSelector;
    this.hiddenClass = hiddenClass;
    this.citiesFilterKey = citiesFilterKey;

    this.controller = null;

    this.input = this.root.querySelector(this.inputSelector);
    this.clearButton = this.root.querySelector(this.clearButtonSelector);
    this.clearCitiesButton = this.root.querySelector(this.clearCitiesSelector);

    this.handleInput = this.handleInput.bind(this);
    this.handleClearClick = this.handleClearClick.bind(this);
    this.handleClearCitiesClick = this.handleClearCitiesClick.bind(this);
  }

  init() {
    if (this.input) {
      this.input.addEventListener('input', this.handleInput);
    }

    if (this.clearButton) {
      this.clearButton.addEventListener('click', this.handleClearClick);
    }

    if (this.clearCitiesButton) {
      this.clearCitiesButton.addEventListener(
        'click',
        this.handleClearCitiesClick
      );
    }

    this.unsubscribe = this.controller?.store?.subscribe?.(() => {
      this.updateClearCitiesButton();
    });

    this.updateClearButton();
    this.updateClearCitiesButton();
  }

  handleClearCitiesClick(event) {
    event.preventDefault();

    this.controller?.clearFilter?.(this.citiesFilterKey);
    this.updateClearCitiesButton();
  }

  updateClearCitiesButton() {
    if (!this.clearCitiesButton) {
      return;
    }

    const selectedCities = this.controller?.getSelected?.(this.citiesFilterKey) || [];
    const hasSelectedCities = selectedCities.length > 0;

    this.clearCitiesButton.classList.toggle(
      this.hiddenClass,
      !hasSelectedCities
    );
  }

  destroy() {
    if (this.input) {
      this.input.removeEventListener('input', this.handleInput);
    }

    if (this.clearButton) {
      this.clearButton.removeEventListener('click', this.handleClearClick);
    }

    if (this.clearCitiesButton) {
      this.clearCitiesButton.removeEventListener(
        'click',
        this.handleClearCitiesClick
      );
    }

    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  getCitiesComponent() {
    return this.controller?.getComponent?.(this.citiesFilterKey) || null;
  }

  handleInput(event) {
    const value = event.target.value || '';

    this.getCitiesComponent()?.setSearchQuery?.(value);
    this.updateClearButton();
  }

  handleClearClick() {
    if (!this.input) {
      return;
    }

    this.input.value = '';

    this.getCitiesComponent()?.clearSearchQuery?.();
    this.updateClearButton();

    this.input.focus();
  }

  updateClearButton() {
    if (!this.clearButton || !this.input) {
      return;
    }

    const hasValue = this.input.value.trim().length > 0;

    this.clearButton.classList.toggle(this.hiddenClass, !hasValue);
  }

  resetUiState() {
    if (!this.input) {
      return;
    }

    this.input.value = '';
    this.getCitiesComponent()?.clearSearchQuery?.();
    this.updateClearButton();
  }
}