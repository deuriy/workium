import { BaseFilterComponent } from '../core/base-filter-component.js';

export class CurrencyField extends BaseFilterComponent {
  constructor({
    containerSelector,
    filterKey = 'currency',
    inputSelector = '.radiobtn__input',
    applySelector = '[data-apply-currencies]',
    defaultValue = 'EUR'
  }) {
    super(filterKey);

    this.container = document.querySelector(containerSelector);

    if (!this.container) {
      throw new Error(`CurrencyField container not found: ${containerSelector}`);
    }

    this.inputSelector = inputSelector;
    this.applyButton = document.querySelector(applySelector);
    this.defaultValue = String(defaultValue);

    this.isSingleValue = true;
    this.excludeFromTags = true;
    this.preserveOnReset = true;
    this.excludeFromSelectedState = true;
    this.excludeFromUrl = true;

    this.isManuallySelected = false;
    this.draftValue = this.defaultValue;

    this.inputsMap = new Map();

    this.handleChange = this.handleChange.bind(this);
    this.handleApply = this.handleApply.bind(this);

    this.collectItems();
    this.draftValue = this.getSelectedLocal()[0] || this.defaultValue;

    this.container.addEventListener('change', this.handleChange);

    if (this.applyButton) {
      this.applyButton.addEventListener('click', this.handleApply);
    }
  }

  getLabelHtml(value) {
    const item = this.inputsMap.get(String(value));

    if (!item?.label) {
      return String(value);
    }

    const label = item.label.cloneNode(true);

    const description = label.querySelector('.radiobtn__currency-description');

    if (description) {
      const span = document.createElement('span');
      span.className = 'result-field__currency-name';
      span.innerHTML = description.innerHTML;

      description.replaceWith(span);
    }

    return label.innerHTML.trim();
  }

  getAllItems() {
    return [...this.inputsMap.values()].map((item) => ({
      ...item,
      value: String(item.value),
      label: item.label?.textContent?.trim() || String(item.value)
    }));
  }

  collectItems() {
    this.inputsMap.clear();

    this.container.querySelectorAll(this.inputSelector).forEach((input) => {
      const label = this.container.querySelector(`label[for="${input.id}"]`);

      this.inputsMap.set(String(input.value), {
        input,
        label,
        value: String(input.value)
      });
    });
  }

  handleChange(event) {
    const target = event.target;

    if (!target.matches(this.inputSelector)) {
      return;
    }

    this.draftValue = String(target.value);
  }

  handleApply() {
    const value = this.draftValue || this.defaultValue;

    this.isManuallySelected = true;
    this.setSelected([value]);

    this.resetDraftFromStore();
  }

  applyValue(value) {
    const normalized = String(value || this.defaultValue);

    this.isManuallySelected = true;
    this.draftValue = normalized;

    this.setSelected([normalized]);

    this.syncSelected(new Set([normalized]));
  }

  syncSelected(selectedSet) {
    const value = [...selectedSet][0] || this.defaultValue;

    this.inputsMap.forEach((item, itemValue) => {
      item.input.checked = itemValue === value;
    });

    this.draftValue = value;
  }

  setAutoValue(value) {
    if (this.isManuallySelected) {
      return false;
    }

    const normalized = String(value || this.defaultValue);

    if (this.has(normalized)) {
      return false;
    }

    this.setSelected([normalized]);

    return true;
  }

  setDefaultValue() {
    return this.setAutoValue(this.defaultValue);
  }

  toggleLocal(value) {
    this.selectLocal(value);
  }

  selectLocal(value) {
    const normalized = String(value);
    const item = this.inputsMap.get(normalized);

    if (!item) {
      return;
    }

    item.input.checked = true;
    this.draftValue = normalized;
  }

  deselectLocal(value) {
    const item = this.inputsMap.get(String(value));

    if (item) {
      item.input.checked = false;
    }
  }

  hasLocal(value) {
    return this.inputsMap.get(String(value))?.input.checked ?? false;
  }

  getSelectedLocal() {
    const selected = [...this.inputsMap.entries()]
      .find(([, item]) => item.input.checked);

    return selected ? [selected[0]] : [];
  }

  getLabelLocal(value) {
    return this.inputsMap.get(String(value))?.label?.textContent?.trim() ?? String(value);
  }

  getSelectedItems() {
    return this.getSelected().map((value) => ({
      value,
      label: this.getLabelLocal(value)
    }));
  }

  resetDraftFromStore() {
    const value = this.getSelected()[0] || this.defaultValue;

    this.draftValue = value;
    this.syncSelected(new Set([value]));
  }

  destroy() {
    super.destroy();

    this.container.removeEventListener('change', this.handleChange);

    if (this.applyButton) {
      this.applyButton.removeEventListener('click', this.handleApply);
    }

    this.inputsMap.clear();
  }
}