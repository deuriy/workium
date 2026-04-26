export class CitiesFilterSearch {
  constructor({
    rootElement = null,
    rootSelector = null,
    inputSelector = '.cities-filter__search-input',
    clearButtonSelector = '.cities-filter__clear-search-btn',
    clearCitiesSelector = '[data-clear-cities]',
    applyButtonSelector = '[data-apply-cities]',
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
    this.applyButtonSelector = applyButtonSelector;
    this.hiddenClass = hiddenClass;
    this.citiesFilterKey = citiesFilterKey;

    this.controller = null;

    this.input = this.root.querySelector(this.inputSelector);
    this.clearButton = this.root.querySelector(this.clearButtonSelector);
    this.clearCitiesButton = this.root.querySelector(this.clearCitiesSelector);
    this.applyButton = this.root.querySelector(this.applyButtonSelector);

    this.unsubscribe = null;

    this.initialSelectedCities = [];
    this.isCitiesApplied = false;

    this.handleInput = this.handleInput.bind(this);
    this.handleClearClick = this.handleClearClick.bind(this);
    this.handleClearCitiesClick = this.handleClearCitiesClick.bind(this);
    this.handleApplyCitiesClick = this.handleApplyCitiesClick.bind(this);
  }

  init() {
    if (this.input) {
      this.input.addEventListener('input', this.handleInput);
    }

    if (this.clearButton) {
      this.clearButton.addEventListener('click', this.handleClearClick);
    }

    if (this.clearCitiesButton) {
      this.clearCitiesButton.addEventListener('click', this.handleClearCitiesClick);
    }

    if (this.applyButton) {
      this.applyButton.addEventListener('click', this.handleApplyCitiesClick);
    }

    this.unsubscribe = this.controller?.store?.subscribe?.(() => {
      this.updateClearCitiesButton();
    });

    this.updateClearButton();
    this.updateClearCitiesButton();
  }

  destroy() {
    if (this.input) {
      this.input.removeEventListener('input', this.handleInput);
    }

    if (this.clearButton) {
      this.clearButton.removeEventListener('click', this.handleClearClick);
    }

    if (this.clearCitiesButton) {
      this.clearCitiesButton.removeEventListener('click', this.handleClearCitiesClick);
    }

    if (this.applyButton) {
      this.applyButton.removeEventListener('click', this.handleApplyCitiesClick);
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

  handleClearCitiesClick(event) {
    event.preventDefault();

    this.controller?.clearFilter?.(this.citiesFilterKey);
    this.updateClearCitiesButton();
  }

  handleApplyCitiesClick() {
    this.applyCitiesSelection();
  }

  updateClearButton() {
    if (!this.clearButton || !this.input) {
      return;
    }

    const hasValue = this.input.value.trim().length > 0;

    this.clearButton.classList.toggle(this.hiddenClass, !hasValue);
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

  resetUiState() {
    if (!this.input) {
      return;
    }

    this.input.value = '';
    this.getCitiesComponent()?.clearSearchQuery?.();
    this.updateClearButton();
    this.updateClearCitiesButton();
  }

  rememberCitiesSnapshot() {
    this.initialSelectedCities = this.controller?.getSelected?.(this.citiesFilterKey) || [];
    this.isCitiesApplied = false;
  }

  applyCitiesSelection() {
    this.controller?.applyCountriesFromSelectedCities?.();
    this.isCitiesApplied = true;
  }

  restoreCitiesSnapshotIfNeeded() {
    if (this.isCitiesApplied) {
      this.initialSelectedCities = [];
      this.isCitiesApplied = false;
      return;
    }

    this.controller?.setSelected?.(
      this.citiesFilterKey,
      this.initialSelectedCities
    );

    this.initialSelectedCities = [];
    this.isCitiesApplied = false;
  }
}