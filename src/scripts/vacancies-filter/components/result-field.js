export class ResultField {
  constructor({
    filterKey,
    rootElement = null,
    rootSelector = null,
    fieldSelector = '[data-result-field-button]',
    textSelector = '[data-result-field-text]',
    countSelector = '[data-result-field-count]',
    clearSelector = '[data-result-field-clear]',
    selectedRootClass = 'result-field-block--selected',
    selectedFieldClass = 'result-field--selected'
  } = {}) {
    if (!filterKey) {
      throw new Error('ResultField requires "filterKey"');
    }

    this.filterKey = filterKey;

    this.root =
      rootElement instanceof Element
        ? rootElement
        : document.querySelector(rootSelector || `[data-result-field="${filterKey}"]`);

    if (!this.root) {
      throw new Error(`ResultField root not found for "${filterKey}"`);
    }

    this.field = this.root.querySelector(fieldSelector);
    this.text = this.root.querySelector(textSelector);
    this.count = this.root.querySelector(countSelector);
    this.clearButton = this.root.querySelector(clearSelector);

    this.selectedRootClass = selectedRootClass;
    this.selectedFieldClass = selectedFieldClass;

    this.placeholder =
      this.field?.dataset?.placeholder ||
      this.text?.textContent?.trim() ||
      '';

    this.controller = null;
    this.unsubscribe = null;

    this.isResultField = true;

    this.handleClearClick = this.handleClearClick.bind(this);
  }

  init() {
    if (this.clearButton) {
      this.clearButton.addEventListener('click', this.handleClearClick);
    }

    this.unsubscribe = this.controller?.store?.subscribe?.(() => {
      this.update();
    });

    this.update();
  }

  destroy() {
    if (this.clearButton) {
      this.clearButton.removeEventListener('click', this.handleClearClick);
    }

    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  handleClearClick(event) {
    event.preventDefault();

    this.controller?.clearFilter?.(this.filterKey);
  }

  update() {
    if (!this.text) {
      return;
    }

    const selectedValues = this.controller?.getSelected?.(this.filterKey) || [];
    const hasSelected = selectedValues.length > 0;

    const component = this.controller?.getComponent?.(this.filterKey);

    const labels = selectedValues.map((value) => {
      return component?.getLabel?.(value) || value;
    });

    this.text.textContent = hasSelected
      ? labels.join(', ')
      : this.placeholder;

    this.root.classList.toggle(this.selectedRootClass, hasSelected);
    this.field?.classList.toggle(this.selectedFieldClass, hasSelected);

    if (this.count) {
      const count = selectedValues.length;
      this.count.textContent = count > 0 ? `+${count}` : '';
    }
  }
}