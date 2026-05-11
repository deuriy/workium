import { BaseFilterComponent } from '../core/base-filter-component.js';

export class TextSearchField extends BaseFilterComponent {
  constructor({
    rootElement = null,
    containerElement = null,
    containerSelector = null,
    filterKey = 'search',
    inputSelector = '[data-search-input]',
  } = {}) {
    super(filterKey);

    this.input =
      rootElement instanceof HTMLInputElement
        ? rootElement
        : containerElement instanceof HTMLInputElement
          ? containerElement
          : document.querySelector(containerSelector || inputSelector);

    if (!this.input) {
      throw new Error(`TextSearchField input not found`);
    }

    this.isSingleValue = true;
    this.tagPriority = -100;

    this.handleInput = this.handleInput.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.input.addEventListener('input', this.handleInput);
    this.input.addEventListener('change', this.handleChange);
  }

  handleInput() {
    const value = this.getInputValue();

    if (!value) {
      this.clear();
    }
  }

  handleChange() {
    this.commit();
  }

  commit() {
    const value = this.getInputValue();

    if (value) {
      this.setSelected([value]);
    } else {
      this.clear();
    }
  }

  getInputValue() {
    return this.input.value.trim();
  }

  syncSelected(selectedSet) {
    const value = [...selectedSet][0] || '';

    if (this.input.value !== value) {
      this.input.value = value;
    }
  }

  toggleLocal(value) {
    this.selectLocal(value);
  }

  selectLocal(value) {
    this.input.value = String(value);
  }

  deselectLocal(value) {
    if (this.input.value === String(value)) {
      this.input.value = '';
    }
  }

  hasLocal(value) {
    return this.input.value === String(value);
  }

  getSelectedLocal() {
    const value = this.getInputValue();

    return value ? [value] : [];
  }

  getLabelLocal(value) {
    return String(value);
  }

  getSelectedItems() {
    const value = this.getInputValue();

    return value
      ? [{ value, label: this.getLabelLocal(value) }]
      : [];
  }

  destroy() {
    super.destroy();

    this.input.removeEventListener('input', this.handleInput);
    this.input.removeEventListener('change', this.handleChange);
  }
}