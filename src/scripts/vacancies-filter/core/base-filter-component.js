export class BaseFilterComponent {
  constructor(filterKey) {
    if (!filterKey) {
      throw new Error(`${this.constructor.name} requires "filterKey"`);
    }

    this.filterKey = filterKey;
    this.store = null;
    this.unsubscribe = null;
  }

  // =========================
  // STORE CONNECTION
  // =========================

  connectStore(store) {
    if (!store) {
      throw new Error(`${this.constructor.name}: store is required`);
    }

    this.disconnectStore();

    this.store = store;
    this.unsubscribe = this.store.subscribe((state) => {
      this.syncSelected(state[this.filterKey] || new Set());
    });

    this.syncSelected(this.store.getFilter(this.filterKey));
  }

  disconnectStore() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }

    this.store = null;
  }

  // =========================
  // OPTIONS API
  // =========================

  setOptions(_items = []) {
    // optional in descendants
  }

  getSelectedItems() {
    return [];
  }

  // =========================
  // PUBLIC SELECTION API
  // =========================

  setSelected(values = []) {
    const normalized = [...values].map(String);

    if (this.store) {
      this.store.setFilter(this.filterKey, normalized);
      return;
    }

    this.syncSelected(new Set(normalized));
  }

  toggle(value) {
    const normalized = String(value);

    if (this.store) {
      this.store.toggleValue(this.filterKey, normalized);
      return;
    }

    this.toggleLocal(normalized);
  }

  select(value) {
    const normalized = String(value);

    if (this.store) {
      this.store.addValue(this.filterKey, normalized);
      return;
    }

    this.selectLocal(normalized);
  }

  deselect(value) {
    const normalized = String(value);

    if (this.store) {
      this.store.removeValue(this.filterKey, normalized);
      return;
    }

    this.deselectLocal(normalized);
  }

  clear() {
    if (this.store) {
      this.store.clearFilter(this.filterKey);
      return;
    }

    this.syncSelected(new Set());
  }

  has(value) {
    const normalized = String(value);

    if (this.store) {
      return this.store.hasValue(this.filterKey, normalized);
    }

    return this.hasLocal(normalized);
  }

  getSelected() {
    if (this.store) {
      return [...this.store.getFilter(this.filterKey)];
    }

    return this.getSelectedLocal();
  }

  getLabel(value) {
    return this.getLabelLocal(String(value));
  }

  destroy() {
    this.disconnectStore();
  }

  // =========================
  // ABSTRACT METHODS
  // =========================

  syncSelected() {
    throw new Error(`${this.constructor.name}.syncSelected() must be implemented`);
  }

  toggleLocal() {
    throw new Error(`${this.constructor.name}.toggleLocal() must be implemented`);
  }

  selectLocal() {
    throw new Error(`${this.constructor.name}.selectLocal() must be implemented`);
  }

  deselectLocal() {
    throw new Error(`${this.constructor.name}.deselectLocal() must be implemented`);
  }

  hasLocal() {
    throw new Error(`${this.constructor.name}.hasLocal() must be implemented`);
  }

  getSelectedLocal() {
    throw new Error(`${this.constructor.name}.getSelectedLocal() must be implemented`);
  }

  getLabelLocal() {
    throw new Error(`${this.constructor.name}.getLabelLocal() must be implemented`);
  }
}