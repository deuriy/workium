export class FilterTags {
  constructor({
    rootSelector,
    store = null,
    maxVisibleItems = 4,
    mapTag = null,
    onRemove = null,
    onClear = null,
    onMoreClick = null
  }) {
    this.root = document.querySelector(rootSelector);

    if (!this.root) {
      throw new Error(`FilterTags: root element not found by selector "${rootSelector}"`);
    }

    this.store = store;
    this.maxVisibleItems = maxVisibleItems;
    this.mapTag = typeof mapTag === 'function' ? mapTag : null;
    this.onRemove = typeof onRemove === 'function' ? onRemove : null;
    this.onClear = typeof onClear === 'function' ? onClear : null;
    this.onMoreClick = typeof onMoreClick === 'function' ? onMoreClick : null;

    this.list = this.root.querySelector('.filter-tags__list');

    if (!this.list) {
      throw new Error('FilterTags: .filter-tags__list not found');
    }

    this.unsubscribe = null;
    this.tags = [];
    this.isExpanded = false;

    this.handleClick = this.handleClick.bind(this);
    this.handleStoreChange = this.handleStoreChange.bind(this);

    this.init();
  }

  init() {
    this.root.addEventListener('click', this.handleClick);

    if (this.store) {
      this.connectStore(this.store);
    }

    this.updateVisibility();
  }

  destroy() {
    this.root.removeEventListener('click', this.handleClick);
    this.disconnectStore();
  }

  connectStore(store) {
    if (!store || typeof store.subscribe !== 'function' || typeof store.getState !== 'function') {
      throw new Error('FilterTags: invalid store passed to connectStore()');
    }

    this.disconnectStore();

    this.store = store;
    this.unsubscribe = this.store.subscribe(this.handleStoreChange);

    this.handleStoreChange(this.store.getState());
  }

  disconnectStore() {
    if (typeof this.unsubscribe === 'function') {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  handleStoreChange(state) {
    const tags = this.normalizeStateToTags(state);
    this.render(tags);
  }

  normalizeStateToTags(state) {
    if (!state || typeof state !== 'object') {
      return [];
    }

    const tags = [];

    Object.entries(state).forEach(([name, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          const tag = this.normalizeTag({
            type: 'checkbox',
            name,
            value: item?.value ?? item,
            label: item?.label ?? item
          });

          if (tag) tags.push(tag);
        });

        return;
      }

      if (value !== null && value !== undefined && value !== '') {
        const tag = this.normalizeTag({
          type: 'input',
          name,
          value: value?.value ?? value,
          label: value?.label ?? value
        });

        if (tag) tags.push(tag);
      }
    });

    return tags;
  }

  normalizeTag(tag) {
    if (!tag || typeof tag !== 'object') {
      return null;
    }

    const normalized = {
      type: tag.type ?? 'input',
      name: tag.name ?? '',
      value: tag.value ?? '',
      label: tag.label ?? ''
    };

    if (!normalized.name || normalized.value === '' || normalized.label === '') {
      return null;
    }

    return this.mapTag ? this.mapTag(normalized) : normalized;
  }

  render(tags = []) {
    this.tags = Array.isArray(tags) ? tags.filter(Boolean) : [];

    if (this.tags.length <= this.maxVisibleItems) {
      this.isExpanded = false;
    }

    const visibleTags = this.isExpanded
      ? this.tags
      : this.tags.slice(0, this.maxVisibleItems);

    const tagsHtml = visibleTags.map((tag) => this.renderTag(tag)).join('');
    const moreButtonHtml = this.renderMoreButton();

    this.list.innerHTML = tagsHtml + moreButtonHtml;

    this.updateVisibility();
  }

  renderTag(tag) {
    const safeLabel = this.escapeHtml(String(tag.label));
    const safeType = this.escapeHtml(String(tag.type));
    const safeName = this.escapeHtml(String(tag.name));
    const safeValue = this.escapeHtml(String(tag.value));
    const ariaLabel = this.escapeHtml(`Видалити фільтр ${tag.label}`);

    return `
      <li
        class="filter-tags__item filter-tag"
        data-type="${safeType}"
        data-name="${safeName}"
        data-value="${safeValue}"
      >
        <span class="filter-tag__value">${safeLabel}</span>
        <button
          class="filter-tag__remove-btn"
          type="button"
          aria-label="${ariaLabel}"
        ></button>
      </li>
    `;
  }

  renderMoreButton() {
    const hiddenCount = this.tags.length - this.maxVisibleItems;

    if (this.isExpanded || hiddenCount <= 0) {
      return '';
    }

    return `
      <li class="filter-tags__more-item">
        <button class="filter-tags__more-btn more-btn" type="button">
          <span class="more-btn__text">Ще</span>
          <span class="more-btn__count count count--info-bg count--more-btn">+${hiddenCount}</span>
        </button>
      </li>
    `;
  }

  expandAll() {
    this.isExpanded = true;
    this.render(this.tags);
  }

  updateVisibility() {
    this.root.hidden = this.tags.length === 0;
  }

  handleClick(event) {
    const removeBtn = event.target.closest('.filter-tag__remove-btn');
    const clearBtn = event.target.closest('[data-clear-filter]');
    const moreBtn = event.target.closest('.filter-tags__more-btn');

    if (removeBtn) {
      const tagEl = removeBtn.closest('.filter-tag');

      if (!tagEl) return;

      const payload = {
        type: tagEl.dataset.type || '',
        name: tagEl.dataset.name || '',
        value: tagEl.dataset.value || ''
      };

      this.onRemove?.(payload, tagEl, this);
      return;
    }

    if (clearBtn) {
      this.onClear?.(this);
      return;
    }

    if (moreBtn) {
      this.expandAll();
      this.onMoreClick?.(this);
    }
  }

  escapeHtml(value) {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
}