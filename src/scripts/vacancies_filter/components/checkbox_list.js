export class CheckboxListComponent {
  constructor({ containerSelector, filterKey, renderItem = null }) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      throw new Error(`Container not found: ${containerSelector}`);
    }

    this.filterKey = filterKey;
    this.renderItem = renderItem || this.defaultRenderItem;

    this.options = [];
    this.nodesMap = new Map();
    this.store = null;

    this.container.addEventListener('change', (e) => {
      if (!e.target.matches('.checkbox__input')) return;
      if (!this.store) return;

      this.store.toggleFilterValue(this.filterKey, e.target.value);
    });
  }

  connectStore(store) {
    this.store = store;

    this.unsubscribe = this.store.subscribe((state) => {
      this.syncSelected(state[this.filterKey] || new Set());
    });
  }

  disconnectStore() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  setOptions(options) {
    this.options = options.map(item => ({
      ...item,
      id: String(item.id)
    }));

    this.render();
  }

  getSelectedItems() {
    if (!this.store) return [];

    const selected = this.store.getFilter(this.filterKey);
    return this.options.filter(item => selected.has(item.id));
  }

  syncSelected(selectedSet) {
    this.nodesMap.forEach((node, id) => {
      const shouldBeChecked = selectedSet.has(id);

      if (node._refs.input.checked !== shouldBeChecked) {
        node._refs.input.checked = shouldBeChecked;
      }
    });
  }

  render() {
    const newMap = new Map();

    this.options.forEach(item => {
      const id = item.id;

      let node = this.nodesMap.get(id);

      if (!node) {
        node = this.renderItem(item, this.filterKey);
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

    if (this.store) {
      this.syncSelected(this.store.getFilter(this.filterKey));
    }
  }

  defaultRenderItem(item, filterKey) {
    const li = document.createElement('li');
    li.className = 'checkboxes-group__item';
    li.dataset.id = item.id;

    const checkboxDiv = document.createElement('div');
    checkboxDiv.className = 'checkbox';

    const input = document.createElement('input');
    input.className = 'checkbox__input';
    input.type = 'checkbox';
    input.name = filterKey;
    input.value = item.id;
    input.id = `${filterKey}_${item.id}`;

    if (item.seo_slug) {
      input.dataset.seoSlug = item.seo_slug;
    }

    const label = document.createElement('label');
    label.className = 'checkbox__label checkbox__label--align-start';
    label.setAttribute('for', input.id);

    const wrapper = document.createElement('div');
    wrapper.className = 'checkbox__label-wrapper';

    const title = document.createElement('div');
    title.className = 'checkbox__title';
    title.textContent = item.origin || item.title || item.name || '';

    const description = document.createElement('div');
    description.className = 'checkbox__description';
    description.textContent = item.province || item.description || '';

    wrapper.append(title, description);
    label.appendChild(wrapper);
    checkboxDiv.append(input, label);
    li.appendChild(checkboxDiv);

    li._refs = {
      input,
      title,
      description
    };

    return li;
  }

  updateNode(node, item) {
    const { input, title, description } = node._refs;

    const newTitle = item.origin || item.title || item.name || '';
    const newDescription = item.province || item.description || '';

    if (title.textContent !== newTitle) {
      title.textContent = newTitle;
    }

    if (description.textContent !== newDescription) {
      description.textContent = newDescription;
    }

    if (item.seo_slug && input.dataset.seoSlug !== item.seo_slug) {
      input.dataset.seoSlug = item.seo_slug;
    }
  }
}