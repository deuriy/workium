export class FilterStore {
  constructor(initialState = {}) {
    this.state = {};
    this.listeners = new Set();

    Object.entries(initialState).forEach(([key, values]) => {
      this.state[key] = new Set([...values].map(String));
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);

    return () => {
      this.listeners.delete(callback);
    };
  }

  emit() {
    const stateSnapshot = this.getState();

    for (const callback of this.listeners) {
      callback(stateSnapshot);
    }
  }

  getState() {
    const snapshot = {};

    Object.entries(this.state).forEach(([key, valueSet]) => {
      snapshot[key] = new Set(valueSet);
    });

    return snapshot;
  }

  getFilter(key) {
    return new Set(this.state[key] || []);
  }

  setFilter(key, values) {
    this.state[key] = new Set([...values].map(String));
    this.emit();
  }

  toggleFilterValue(key, value) {
    value = String(value);

    if (!this.state[key]) {
      this.state[key] = new Set();
    }

    if (this.state[key].has(value)) {
      this.state[key].delete(value);
    } else {
      this.state[key].add(value);
    }

    this.emit();
  }

  clearFilter(key) {
    if (!this.state[key]) return;

    this.state[key].clear();
    this.emit();
  }

  resetAll() {
    Object.keys(this.state).forEach(key => {
      if (this.state[key] instanceof Set) {
        this.state[key].clear();
      }
    });

    this.emit();
  }

  serialize() {
    const result = {};

    Object.entries(this.state).forEach(([key, valueSet]) => {
      result[key] = [...valueSet];
    });

    return result;
  }
}