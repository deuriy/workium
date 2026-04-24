import { BaseFilterComponent } from '../core/base-filter-component.js';

export class CheckboxTagsGroup extends BaseFilterComponent {
  constructor({
    containerSelector,
    filterKey,
    checkboxSelector = '.checkbox__input',
    mapItem = null
  }) {
    super(filterKey);

    this.container = document.querySelector(containerSelector);

    if (!this.container) {
      throw new Error(`CheckboxTagsGroup container not found: ${containerSelector}`);
    }

    this.checkboxSelector = checkboxSelector;
    this.mapItem = typeof mapItem === 'function' ? mapItem : this.defaultMapItem;

    this.state = {
      items: []
    };

    this.inputsMap = new Map();

    this.handleChange = this.handleChange.bind(this);

    this.collectItems();
    this.container.addEventListener('change', this.handleChange);
  }

  // =========================
  // EVENTS
  // =========================

  handleChange(event) {
    const target = event.target;

    if (!target.matches(this.checkboxSelector)) {
      return;
    }

    this.toggle(target.value);
  }

  // =========================
  // OPTIONS / DATA API
  // =========================

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

  // =========================
  // CONTRACT IMPLEMENTATION
  // =========================

  syncSelected(selectedSet) {
    this.inputsMap.forEach((item, value) => {
      const shouldBeChecked = selectedSet.has(value);

      if (item.input.checked !== shouldBeChecked) {
        item.input.checked = shouldBeChecked;
      }
    });
  }

  toggleLocal(value) {
    const item = this.inputsMap.get(value);

    if (!item) {
      return;
    }

    item.input.checked = !item.input.checked;
  }

  selectLocal(value) {
    const item = this.inputsMap.get(value);

    if (!item) {
      return;
    }

    item.input.checked = true;
  }

  deselectLocal(value) {
    const item = this.inputsMap.get(value);

    if (!item) {
      return;
    }

    item.input.checked = false;
  }

  hasLocal(value) {
    return this.inputsMap.get(value)?.input.checked ?? false;
  }

  getSelectedLocal() {
    return [...this.inputsMap.entries()]
      .filter(([, item]) => item.input.checked)
      .map(([value]) => value);
  }

  getLabelLocal(value) {
    return this.inputsMap.get(String(value))?.label?.textContent?.trim() ?? String(value);
  }

  // =========================
  // DOM COLLECTION
  // =========================

  collectItems() {
    this.inputsMap.clear();

    const inputs = this.container.querySelectorAll(this.checkboxSelector);

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
      entityId: input.dataset.entityId || ''
    };
  }

  // =========================
  // LIFECYCLE
  // =========================

  destroy() {
    super.destroy();

    this.container.removeEventListener('change', this.handleChange);
    this.inputsMap.clear();
    this.state.items = [];
  }

  // =========================
  // MAPPING
  // =========================

  defaultMapItem(item) {
    return item;
  }
}