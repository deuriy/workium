export class FilterTags {
  constructor({
    rootElement = null,
    rootSelector = null,
    maxVisibleItems = 4,
    mapTag = null,
    onRemove = null,
    onClear = null,
    onMoreClick = null,
    texts = {}
  }) {
    this.root =
      rootElement instanceof Element
        ? rootElement
        : document.querySelector(rootSelector);

    if (!this.root) {
      throw new Error(
        `FilterTags: root element not found by selector "${rootSelector}"`
      );
    }

    this.list = this.root.querySelector('.filter-tags__list');

    if (!this.list) {
      throw new Error('FilterTags: .filter-tags__list not found');
    }

    this.maxVisibleItemsConfig = maxVisibleItems;
    this.mediaQueryList = null;
    this.maxVisibleItems = this.resolveMaxVisibleItems();

    this.mapTag = typeof mapTag === 'function' ? mapTag : null;

    this.onRemove = typeof onRemove === 'function' ? onRemove : null;
    this.onClear = typeof onClear === 'function' ? onClear : null;
    this.onMoreClick = typeof onMoreClick === 'function' ? onMoreClick : null;

    this.tags = [];
    this.isExpanded = false;

    this.texts = {
      more: texts.more || 'More',
      hide: texts.hide || 'Hide'
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleBreakpointChange = this.handleBreakpointChange.bind(this);

    this.root.addEventListener('click', this.handleClick);
    this.bindResponsiveVisibility();

    // this.updateVisibility();
  }

  resolveMaxVisibleItems() {
    const config = this.maxVisibleItemsConfig;

    if (typeof config === 'number' && Number.isFinite(config)) {
      return config;
    }

    if (!config || typeof config !== 'object') {
      return 4;
    }

    const mobile = Number(config.mobile);
    const desktop = Number(config.desktop);
    const breakpoint = Number(config.breakpoint) || 768;

    const mobileValue = Number.isFinite(mobile) ? mobile : 7;
    const desktopValue = Number.isFinite(desktop) ? desktop : mobileValue;

    return window.innerWidth >= breakpoint ? desktopValue : mobileValue;
  }

  getBreakpoint() {
    const config = this.maxVisibleItemsConfig;

    if (!config || typeof config !== 'object') {
      return null;
    }

    const breakpoint = Number(config.breakpoint);

    return Number.isFinite(breakpoint) ? breakpoint : 768;
  }

  bindResponsiveVisibility() {
    const breakpoint = this.getBreakpoint();

    if (breakpoint === null) {
      return;
    }

    this.mediaQueryList = window.matchMedia(`(min-width: ${breakpoint}px)`);

    if (typeof this.mediaQueryList.addEventListener === 'function') {
      this.mediaQueryList.addEventListener('change', this.handleBreakpointChange);
      return;
    }

    if (typeof this.mediaQueryList.addListener === 'function') {
      this.mediaQueryList.addListener(this.handleBreakpointChange);
    }
  }

  unbindResponsiveVisibility() {
    if (!this.mediaQueryList) {
      return;
    }

    if (typeof this.mediaQueryList.removeEventListener === 'function') {
      this.mediaQueryList.removeEventListener('change', this.handleBreakpointChange);
      return;
    }

    if (typeof this.mediaQueryList.removeListener === 'function') {
      this.mediaQueryList.removeListener(this.handleBreakpointChange);
    }
  }

  handleBreakpointChange() {
    const nextMaxVisibleItems = this.resolveMaxVisibleItems();

    if (nextMaxVisibleItems === this.maxVisibleItems) {
      return;
    }

    this.maxVisibleItems = nextMaxVisibleItems;

    if (this.tags.length <= this.maxVisibleItems) {
      this.isExpanded = false;
    }

    this.render();
  }

  setTags(tags = []) {
    this.tags = Array.isArray(tags) ? tags.filter(Boolean) : [];

    if (this.tags.length <= this.maxVisibleItems) {
      this.isExpanded = false;
    }

    this.render();
  }

  clear() {
    this.tags = [];
    this.render();
  }

  expandAll() {
    this.isExpanded = true;
    this.render();
    this.onMoreClick?.(this);
  }

  collapse() {
    this.isExpanded = false;
    this.render();

    this.root.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  destroy() {
    this.root.removeEventListener('click', this.handleClick);
    this.unbindResponsiveVisibility();
  }

  render() {
    const visibleTags = this.isExpanded
      ? this.tags
      : this.tags.slice(0, this.maxVisibleItems);

    this.list.innerHTML =
      visibleTags.map((tag) => this.renderTag(tag)).join('') +
      this.renderMoreButton();

    this.updateVisibility();
  }

  renderTag(tag) {
    const safe = this.escape(tag);

    return `
      <li
        class="filter-tags__item filter-tag"
        data-filter-key="${safe.filterKey}"
        data-value="${safe.value}"
      >
        <span class="filter-tag__value">${safe.label}</span>
        <button class="filter-tag__remove-btn" type="button"></button>
      </li>
    `;
  }

  renderMoreButton() {
    const hiddenCount = this.tags.length - this.maxVisibleItems;

    if (hiddenCount <= 0) {
      return '';
    }

    const isActive = this.isExpanded;
    const text = isActive ? this.texts.hide : this.texts.more;

    return `
      <li class="filter-tags__more-item">
        <button
          class="filter-tags__more-btn more-btn${isActive ? ' more-btn--expanded' : ''}"
          type="button"
        >
          <span class="more-btn__text">${text}</span>
          ${
            !isActive
              ? `<span class="more-btn__count count count--info-bg count--more-btn">+${hiddenCount}</span>`
              : ''
          }
        </button>
      </li>
    `;
  }

  updateVisibility() {
    const isEmpty = this.tags.length === 0;
    this.root.classList.toggle('hidden', isEmpty);
  }

  handleClick(event) {
    const removeBtn = event.target.closest('.filter-tag__remove-btn');
    const clearBtn = event.target.closest('[data-clear-filter]');
    const moreBtn = event.target.closest('.filter-tags__more-btn');

    if (removeBtn) {
      const tagEl = removeBtn.closest('.filter-tag');

      if (!tagEl) {
        return;
      }

      this.onRemove?.(
        {
          filterKey: tagEl.dataset.filterKey || '',
          value: tagEl.dataset.value || ''
        },
        tagEl,
        this
      );

      return;
    }

    if (clearBtn) {
      this.onClear?.(this);
      return;
    }

    if (moreBtn) {
      if (this.isExpanded) {
        this.collapse();
      } else {
        this.expandAll();
      }
    }
  }

  escape(tag) {
    const esc = (v) =>
      String(v ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');

    const normalized = {
      filterKey: esc(tag.filterKey),
      value: esc(tag.value),
      label: esc(tag.label)
    };

    return this.mapTag ? this.mapTag(normalized) : normalized;
  }
}