export class CitiesCheckboxes {
  constructor({
    containerSelector,
    filterKey = 'cities',
    mapItem = null
  }) {
    this.container = document.querySelector(containerSelector);
    
    if (!this.container) {
      throw new Error(`CitiesCheckboxes container not found: ${containerSelector}`);
    }

    this.filterKey = filterKey;
    this.mapItem = mapItem || this.defaultMapItem;

    this.store = null;
    this.unsubscribe = null;

    this.state = {
      items: []
    };

    this.nodesMap = new Map(); // id -> node

    // 🔥 Event delegation
    this.handleChange = this.handleChange.bind(this);
    this.container.addEventListener('change', this.handleChange);
  }

  // =========================
  // STORE CONNECTION
  // =========================

  connectStore(store) {
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
  }

  handleChange(event) {
    const target = event.target;

    if (!target.matches('.checkbox__input')) return;

    const id = String(target.value);

    if (this.store) {
      this.store.toggleFilterValue(this.filterKey, id);
      return;
    }

    // fallback если store не подключен
    this.toggleLocal(id);
  }

  // --- PUBLIC API ---

  setCities(cities = []) {
    this.state.items = cities.map((item) => {
      const normalized = this.mapItem(item);

      return {
        ...normalized,
        id: String(normalized.id)
      };
    });

    this.render();

    if (this.store) {
      this.syncSelected(this.store.getFilter(this.filterKey));
    }
  }

  setSelected(selectedArr = []) {
    if (this.store) {
      this.store.setFilter(this.filterKey, selectedArr.map(String));
      return;
    }

    this.syncSelected(new Set(selectedArr.map(String)));
  }

  toggle(id) {
    id = String(id);

    if (this.store) {
      this.store.toggleFilterValue(this.filterKey, id);
      return;
    }

    this.toggleLocal(id);
  }

  select(id) {
    id = String(id);

    if (this.store) {
      this.store.addValue(this.filterKey, id);
      return;
    }

    const node = this.nodesMap.get(id);
    if (!node) return;

    node._refs.input.checked = true;
  }

  deselect(id) {
    id = String(id);

    if (this.store) {
      this.store.removeValue(this.filterKey, id);
      return;
    }

    const node = this.nodesMap.get(id);
    if (!node) return;

    node._refs.input.checked = false;
  }

  clear() {
    if (this.store) {
      this.store.clearFilter(this.filterKey);
      return;
    }

    this.syncSelected(new Set());
  }

  has(id) {
    id = String(id);

    if (this.store) {
      return this.store.hasValue(this.filterKey, id);
    }

    const node = this.nodesMap.get(id);
    return !!node?._refs.input.checked;
  }
  
  getSelected() {
    if (this.store) {
      return [...this.store.getFilter(this.filterKey)];
    }

    return [...this.nodesMap.entries()]
      .filter(([, node]) => node._refs.input.checked)
      .map(([id]) => id);
  }

  getSelectedItems() {
    const selected = new Set(this.getSelected());

    return this.state.items.filter((item) => selected.has(item.id));
  }

  getAllItems() {
    return [...this.state.items];
  }

  destroy() {
    this.disconnectStore();
    this.container.removeEventListener('change', this.handleChange);
    this.nodesMap.clear();
    this.state.items = [];
  }

  toggleLocal(id) {
    const node = this.nodesMap.get(id);
    if (!node) return;

    node._refs.input.checked = !node._refs.input.checked;
  }

  syncSelected(selectedSet) {
    this.nodesMap.forEach((node, id) => {
      const shouldBeChecked = selectedSet.has(id);

      if (node._refs.input.checked !== shouldBeChecked) {
        node._refs.input.checked = shouldBeChecked;
      }
    });
  }

  // --- CORE RENDER (incremental diff) ---

  render() {
    const newMap = new Map();

    this.state.items.forEach((item) => {
      const id = item.id;

      let node = this.nodesMap.get(id);

      if (!node) {
        node = this.createNode(item);
        this.container.appendChild(node);
      } else {
        this.updateNode(node, item);
      }

      newMap.set(id, node);
    });

    this.nodesMap.forEach((node, id) => {
      if (!newMap.has(id)) {
        node.remove();
      }
    });

    this.nodesMap = newMap;
  }

  // --- NODE CREATION ---

  createNode(item) {
    const li = document.createElement('li');
    li.className = 'checkboxes-group__item';
    li.dataset.id = item.id;

    const checkbox = document.createElement('div');
    checkbox.className = 'checkbox';

    const input = document.createElement('input');
    input.className = 'checkbox__input';
    input.type = 'checkbox';
    input.name = this.filterKey;
    input.value = item.id;
    input.id = `${this.filterKey}_${item.id}`;

    if (item.seoSlug) {
      input.dataset.seoSlug = item.seoSlug;
    }

    const label = document.createElement('label');
    label.className = 'checkbox__label checkbox__label--align-start';
    label.setAttribute('for', input.id);

    const wrapper = document.createElement('div');
    wrapper.className = 'checkbox__label-wrapper';

    const title = document.createElement('div');
    title.className = 'checkbox__title';

    const titleText = document.createTextNode(item.title || '');
    title.appendChild(titleText);

    const country = document.createElement('span');
    country.className = 'checkbox__country';
    country.textContent = item.country ? ` · ${item.country}` : '';

    title.appendChild(country);

    const description = document.createElement('div');
    description.className = 'checkbox__description';
    description.textContent = item.description || '';

    wrapper.append(title, description);
    label.appendChild(wrapper);
    checkbox.append(input, label);
    li.appendChild(checkbox);

    li._refs = {
      input,
      titleText,
      country,
      description
    };

    return li;
  }

  // --- NODE UPDATE (без querySelector) ---

  updateNode(node, item) {
    const { input, titleText, country, description } = node._refs;

    const nextTitle = item.title || '';
    const nextCountry = item.country ? ` · ${item.country}` : '';
    const nextDescription = item.description || '';
    const nextSeoSlug = item.seoSlug || '';
    const currentSeoSlug = input.dataset.seoSlug || '';

    if (titleText.textContent !== nextTitle) {
      titleText.textContent = nextTitle;
    }

    if (country.textContent !== nextCountry) {
      country.textContent = nextCountry;
    }

    if (description.textContent !== nextDescription) {
      description.textContent = nextDescription;
    }

    if (currentSeoSlug !== nextSeoSlug) {
      if (nextSeoSlug) {
        input.dataset.seoSlug = nextSeoSlug;
      } else {
        delete input.dataset.seoSlug;
      }
    }
  }

  defaultMapItem(item) {
    return {
      id: item.id,
      title: item.origin || item.title || item.name || '',
      description: item.province || item.description || '',
      country: item.country_name || item.country || '',
      seoSlug: item.seo_slug || ''
    };
  }
}