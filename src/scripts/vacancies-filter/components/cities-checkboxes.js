import { BaseFilterComponent } from '../core/base-filter-component.js';

export class CitiesCheckboxes extends BaseFilterComponent {
  constructor({
    containerSelector,
    filterKey = 'cities',
    mapItem = null,
    hiddenClass = 'hidden'
  }) {
    super(filterKey);

    this.container = document.querySelector(containerSelector);

    if (!this.container) {
      throw new Error(`CitiesCheckboxes container not found: ${containerSelector}`);
    }

    this.mapItem = typeof mapItem === 'function' ? mapItem : this.defaultMapItem;
    this.isOptionsLoaded = false;

    this.state = {
      items: []
    };

    this.nodesMap = new Map();
    this.hiddenClass = hiddenClass;
    this.searchQuery = '';

    this.handleChange = this.handleChange.bind(this);
    this.container.addEventListener('change', this.handleChange);
  }

  // =========================
  // EVENTS
  // =========================

  handleChange(event) {
    const target = event.target;

    if (!target.matches('.checkbox__input')) {
      return;
    }

    this.toggle(target.value);
  }

  // =========================
  // OPTIONS / DATA API
  // =========================

  setCities(cities = []) {
    this.isOptionsLoaded = true;

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

  setOptions(items = []) {
    this.setCities(items);
  }

  getSelectedItems() {
    const selected = new Set(this.getSelected());

    return this.state.items.filter((item) => selected.has(item.id));
  }

  getAllItems() {
    return [...this.state.items];
  }

  // =========================
  // CONTRACT IMPLEMENTATION
  // =========================

  syncSelected(selectedSet) {
    this.nodesMap.forEach((node, id) => {
      const shouldBeChecked = selectedSet.has(id);

      if (node._refs.input.checked !== shouldBeChecked) {
        node._refs.input.checked = shouldBeChecked;
      }
    });
  }

  toggleLocal(id) {
    const node = this.nodesMap.get(String(id));

    if (!node) {
      return;
    }

    node._refs.input.checked = !node._refs.input.checked;
  }

  selectLocal(id) {
    const node = this.nodesMap.get(String(id));

    if (!node) {
      return;
    }

    node._refs.input.checked = true;
  }

  deselectLocal(id) {
    const node = this.nodesMap.get(String(id));

    if (!node) {
      return;
    }

    node._refs.input.checked = false;
  }

  hasLocal(id) {
    const node = this.nodesMap.get(String(id));
    return !!node?._refs.input.checked;
  }

  getSelectedLocal() {
    return [...this.nodesMap.entries()]
      .filter(([, node]) => node._refs.input.checked)
      .map(([id]) => id);
  }

  getLabelLocal(value) {
    const normalizedValue = String(value);

    const item = this.state.items.find((item) => String(item.id) === normalizedValue);

    if (item?.title) {
      return item.title;
    }

    const node = this.nodesMap.get(normalizedValue);

    return node?._refs?.itemTitle || String(value);
  }

  isReadyForTags() {
    return this.isOptionsLoaded;
  }

  setSearchQuery(query = '') {
    this.searchQuery = this.normalizeSearchQuery(query);
    this.render();

    if (this.store) {
      this.syncSelected(this.store.getFilter(this.filterKey));
    }
  }

  clearSearchQuery() {
    this.setSearchQuery('');
  }

  normalizeSearchQuery(value = '') {
    return String(value).toLowerCase().trim();
  }

  getItemSearchText(item) {
    return [
      item.title,
      item.description,
      item.country,
      item.text
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
  }

  getSelectedIdSet() {
    if (this.store) {
      return this.store.getFilter(this.filterKey);
    }

    return new Set(this.getSelectedLocal());
  }

  getVisibleItems() {
    const items = [...this.state.items];

    if (this.searchQuery) {
      return items.filter((item) => {
        return this.getItemSearchText(item).includes(this.searchQuery);
      });
    }

    const selectedIds = this.getSelectedIdSet();

    const selectedItems = [];
    const restItems = [];

    items.forEach((item) => {
      if (selectedIds.has(String(item.id))) {
        selectedItems.push(item);
      } else {
        restItems.push(item);
      }
    });

    return [...selectedItems, ...restItems];
  }

  // =========================
  // RENDER
  // =========================

  // render() {
  //   const nextMap = new Map();

  //   this.state.items.forEach((item) => {
  //     const id = item.id;
  //     let node = this.nodesMap.get(id);

  //     if (!node) {
  //       node = this.createNode(item);
  //       this.container.appendChild(node);
  //     } else {
  //       this.updateNode(node, item);
  //     }

  //     nextMap.set(id, node);
  //   });

  //   this.nodesMap.forEach((node, id) => {
  //     if (!nextMap.has(id)) {
  //       node.remove();
  //     }
  //   });

  //   this.nodesMap = nextMap;
  // }

  render() {
    const currentIds = new Set(this.state.items.map((item) => String(item.id)));
    const visibleItems = this.getVisibleItems();

    this.nodesMap.forEach((node, id) => {
      if (!currentIds.has(id)) {
        node.remove();
        this.nodesMap.delete(id);
      }
    });

    this.state.items.forEach((item) => {
      const id = String(item.id);
      let node = this.nodesMap.get(id);

      if (!node) {
        node = this.createNode(item);
        this.nodesMap.set(id, node);
      } else {
        this.updateNode(node, item);
      }

      node.remove();
    });

    visibleItems.forEach((item) => {
      const node = this.nodesMap.get(String(item.id));

      if (node) {
        this.container.appendChild(node);
      }
    });
  }

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
    title.textContent = item.title || '';

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
      title,
      country,
      description,
      itemTitle: item.title || ''
    };

    return li;
  }

  updateNode(node, item) {
    const { input, title, country, description } = node._refs;

    const nextTitle = item.title || '';
    node._refs.itemTitle = nextTitle;
    const nextCountry = item.country ? ` · ${item.country}` : '';
    const nextDescription = item.description || '';
    const nextSeoSlug = item.seoSlug || '';
    const currentSeoSlug = input.dataset.seoSlug || '';

    const titleTextOnly = title.childNodes[0]?.textContent ?? '';

    if (titleTextOnly !== nextTitle) {
      if (title.firstChild) {
        title.firstChild.textContent = nextTitle;
      } else {
        title.textContent = nextTitle;
        title.appendChild(country);
      }
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

  destroy() {
    super.destroy();
    this.container.removeEventListener('change', this.handleChange);
    this.nodesMap.clear();
    this.state.items = [];
  }

  defaultMapItem(item) {
    return {
      id: item.id,
      title: item.origin || item.title || item.name || '',
      description: item.province || item.description || '',
      country: item.country_name || item.country || '',
      countryValue: item.country_value || '',
      seoSlug: item.seo_slug || ''
    };
  }
}