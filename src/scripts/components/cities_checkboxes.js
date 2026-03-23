class CitiesCheckboxes {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) throw new Error('Container not found');

    this.state = {
      cities: [],
      selected: new Set()
    };

    this.nodesMap = new Map(); // id -> node

    // 🔥 Event delegation
    this.container.addEventListener('change', (e) => {
      if (e.target.matches('.checkbox__input')) {
        this.toggleCity(e.target.value);
      }
    });
  }

  // --- PUBLIC API ---

  setCities(cities) {
    this.state.cities = cities.map(item => ({
      ...item,
      id: String(item.id)
    }));

    this.render();
  }

  setSelected(selectedArr) {
    this.state.selected = new Set(selectedArr.map(String));

    // обновляем только нужные элементы
    this.nodesMap.forEach((node, id) => {
      const shouldBeChecked = this.state.selected.has(id);
      if (node._refs.input.checked !== shouldBeChecked) {
        node._refs.input.checked = shouldBeChecked;
      }
    });
  }

  toggleCity(id) {
    id = String(id);

    const node = this.nodesMap.get(id);
    if (!node) return;

    const input = node._refs.input;

    if (this.state.selected.has(id)) {
      this.state.selected.delete(id);
      input.checked = false;
    } else {
      this.state.selected.add(id);
      input.checked = true;
    }
  }

  // --- CORE RENDER (incremental diff) ---

  render() {
    const newMap = new Map();

    // добавление + обновление
    this.state.cities.forEach(item => {
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

    // удаление старых элементов
    this.nodesMap.forEach((node, id) => {
      if (!newMap.has(id)) {
        node.remove();
      }
    });

    this.nodesMap = newMap;

    // синхронизация checked (без полного прохода при toggle)
    this.setSelected([...this.state.selected]);
  }

  // --- NODE CREATION ---

  createNode(item) {
    const li = document.createElement('li');
    li.className = 'checkboxes-group__item';
    li.dataset.id = item.id;

    const checkboxDiv = document.createElement('div');
    checkboxDiv.className = 'checkbox';

    const input = document.createElement('input');
    input.className = 'checkbox__input';
    input.type = 'checkbox';
    input.name = 'cities';
    input.value = item.id;
    input.id = `city_${item.id}`;
    input.dataset.seoSlug = item.seo_slug;

    const label = document.createElement('label');
    label.className = 'checkbox__label checkbox__label--align-start';
    label.setAttribute('for', input.id);

    const wrapper = document.createElement('div');
    wrapper.className = 'checkbox__label-wrapper';

    const title = document.createElement('div');
    title.className = 'checkbox__title';
    title.textContent = item.origin;

    const description = document.createElement('div');
    description.className = 'checkbox__description';
    description.textContent = item.province;

    wrapper.append(title, description);
    label.appendChild(wrapper);
    checkboxDiv.append(input, label);
    li.appendChild(checkboxDiv);

    // 🔥 кэш ссылок (0 querySelector в будущем)
    li._refs = {
      input,
      title,
      description
    };

    return li;
  }

  // --- NODE UPDATE (без querySelector) ---

  updateNode(node, item) {
    const { input, title, description } = node._refs;

    if (title.textContent !== item.origin) {
      title.textContent = item.origin;
    }

    if (description.textContent !== item.province) {
      description.textContent = item.province;
    }

    if (input.dataset.seoSlug !== item.seo_slug) {
      input.dataset.seoSlug = item.seo_slug;
    }
  }
}

export { CitiesCheckboxes }