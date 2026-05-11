export class FilterStore {
  constructor(initialState = {}) {
    this.state = {};
    this.listeners = new Set();

    Object.entries(initialState).forEach(([key, values]) => {
      this.state[key] = new Set([...values].map(String));
    });
  }

  // =========================
  // SUBSCRIPTIONS
  // =========================

  subscribe(callback) {
    if (typeof callback !== 'function') {
      throw new Error('FilterStore.subscribe(callback): callback must be a function');
    }

    this.listeners.add(callback);

    return () => {
      this.listeners.delete(callback);
    };
  }

  emit() {
    const snapshot = this.getState();

    for (const callback of this.listeners) {
      callback(snapshot);
    }
  }

  // =========================
  // STATE READ API
  // =========================

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

  hasValue(key, value) {
    return (this.state[key] || new Set()).has(String(value));
  }

  serialize() {
    const result = {};

    Object.entries(this.state).forEach(([key, valueSet]) => {
      if (!valueSet.size) return;
      result[key] = [...valueSet];
    });

    return result;
  }

  // =========================
  // STATE WRITE API
  // =========================

  setFilter(key, values = []) {
    const nextSet = new Set([...values].map(String));
    const prevSet = this.state[key] || new Set();

    if (this.isSameSet(prevSet, nextSet)) {
      return false;
    }

    this.state[key] = nextSet;
    this.emit();

    return true;
  }

  addValue(key, value) {
    const normalized = String(value);
    const nextSet = new Set(this.state[key] || []);

    if (nextSet.has(normalized)) {
      return false;
    }

    nextSet.add(normalized);
    this.state[key] = nextSet;
    this.emit();

    return true;
  }

  removeValue(key, value) {
    const normalized = String(value);
    const prevSet = this.state[key];

    if (!prevSet || !prevSet.has(normalized)) {
      return false;
    }

    const nextSet = new Set(prevSet);
    nextSet.delete(normalized);
    this.state[key] = nextSet;
    this.emit();

    return true;
  }

  toggleValue(key, value) {
    const normalized = String(value);
    const nextSet = new Set(this.state[key] || []);

    if (nextSet.has(normalized)) {
      nextSet.delete(normalized);
    } else {
      nextSet.add(normalized);
    }

    const prevSet = this.state[key] || new Set();

    if (this.isSameSet(prevSet, nextSet)) {
      return false;
    }

    this.state[key] = nextSet;
    this.emit();

    return true;
  }

  clearFilter(key) {
    const prevSet = this.state[key];

    if (!prevSet || prevSet.size === 0) {
      return false;
    }

    this.state[key] = new Set();
    this.emit();

    return true;
  }

  resetAll() {
    let changed = false;

    Object.keys(this.state).forEach((key) => {
      if (this.state[key] instanceof Set && this.state[key].size > 0) {
        this.state[key] = new Set();
        changed = true;
      }
    });

    if (!changed) {
      return false;
    }

    this.emit();
    return true;
  }

  // =========================
  // UTILS
  // =========================

  isSameSet(a, b) {
    if (a.size !== b.size) {
      return false;
    }

    for (const value of a) {
      if (!b.has(value)) {
        return false;
      }
    }

    return true;
  }
}