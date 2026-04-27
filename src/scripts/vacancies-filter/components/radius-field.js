import { BaseFilterComponent } from '../core/base-filter-component.js';

export class RadiusField extends BaseFilterComponent {
  constructor({
    containerSelector,
    filterKey = 'radius',
    inputSelector = 'input[type="radio"]',
    mapItem = null
  }) {
    super(filterKey);

    this.container = document.querySelector(containerSelector);

    if (!this.container) {
      throw new Error(`RadiusField container not found: ${containerSelector}`);
    }

    this.inputSelector = inputSelector;
    this.mapItem = typeof mapItem === 'function' ? mapItem : this.defaultMapItem;

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
    const selectedValue = [...selectedSet][0] || '';

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

  collectItems() {
    this.inputsMap.clear();

    const inputs = this.container.querySelectorAll(this.inputSelector);

    this.state.items = [...inputs].map((input) => {
      const rawItem = this.extractItem(input);
      const normalized = this.mapItem(rawItem);

      const item = {
        ...normalized,
        value: String(normalized.value),
        input
      };

      this.inputsMap.set(item.value, item);

      return item;
    });
  }

  extractItem(input) {
    const label = this.container.querySelector(`label[for="${input.id}"]`);

    return {
      input,
      label,
      value: input.value,
      text: label?.textContent?.trim() || '',
      entityId: input.dataset.filterItemId || ''
    };
  }

  destroy() {
    super.destroy();

    this.container.removeEventListener('change', this.handleChange);
    this.inputsMap.clear();
    this.state.items = [];
  }

  defaultMapItem(item) {
    return item;
  }
}