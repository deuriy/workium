import { BaseFilterComponent } from '../core/base-filter-component.js';

export class RadioTagsGroup extends BaseFilterComponent {
  constructor({
    containerElement = null,
    containerSelector,
    filterKey,
    inputSelector = '.checkbox__input[type="radio"], .radiobtn__input[type="radio"]',
    defaultValue = 'all',
    excludeValuesFromTags = ['all']
  }) {
    super(filterKey);

    this.container =
      containerElement instanceof Element
        ? containerElement
        : document.querySelector(containerSelector);

    if (!this.container) {
      throw new Error(`RadioTagsGroup container not found: ${containerSelector}`);
    }

    this.inputSelector = inputSelector;
    this.defaultValue = String(defaultValue);
    this.excludeValuesFromTags = new Set(excludeValuesFromTags.map(String));

    this.isSingleValue = true;

    this.state = {
      items: []
    };

    this.inputsMap = new Map();

    this.handleChange = this.handleChange.bind(this);

    this.collectItems();
    this.container.addEventListener('change', this.handleChange);
  }

  handleChange(event) {
    const target = event.target;

    if (!target.matches(this.inputSelector)) {
      return;
    }

    this.setSelected([target.value]);
  }

  setOptions() {
    this.refresh();
  }

  refresh() {
    this.collectItems();

    if (this.store) {
      this.syncSelected(this.store.getFilter(this.filterKey));
    }
  }

  getSelectedItems() {
    const selected = new Set(this.getSelected());

    return this.state.items.filter((item) => selected.has(item.value));
  }

  getAllItems() {
    return [...this.state.items];
  }

  syncSelected(selectedSet) {
    const selectedValue = [...selectedSet][0] || this.defaultValue;

    this.inputsMap.forEach((item, value) => {
      item.input.checked = value === selectedValue;
    });
  }

  toggleLocal(value) {
    this.selectLocal(value);
  }

  selectLocal(value) {
    const item = this.inputsMap.get(String(value));

    if (!item) {
      return;
    }

    item.input.checked = true;
  }

  deselectLocal(value) {
    const item = this.inputsMap.get(String(value));

    if (!item) {
      return;
    }

    item.input.checked = false;

    if (value !== this.defaultValue) {
      this.selectLocal(this.defaultValue);
    }
  }

  hasLocal(value) {
    return this.inputsMap.get(String(value))?.input.checked ?? false;
  }

  getSelectedLocal() {
    const selected = [...this.inputsMap.entries()]
      .find(([, item]) => item.input.checked);

    return selected ? [selected[0]] : [this.defaultValue];
  }

  getLabelLocal(value) {
    return this.inputsMap.get(String(value))?.label?.textContent?.trim() ?? String(value);
  }

  shouldExcludeValueFromTags(value) {
    return this.excludeValuesFromTags.has(String(value));
  }

  collectItems() {
    this.inputsMap.clear();

    const inputs = this.container.querySelectorAll(this.inputSelector);

    this.state.items = [...inputs].map((input) => {
      const label = this.container.querySelector(`label[for="${input.id}"]`);

      const item = {
        input,
        label,
        value: String(input.value),
        text: label?.textContent?.trim() || '',
        entityId: input.dataset.filterItemId || ''
      };

      this.inputsMap.set(item.value, item);

      return item;
    });
  }

  destroy() {
    super.destroy();

    this.container.removeEventListener('change', this.handleChange);
    this.inputsMap.clear();
    this.state.items = [];
  }
}