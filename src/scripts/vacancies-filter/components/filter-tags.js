export class FilterTags {
  constructor({
    rootSelector,
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

    this.list = this.root.querySelector('.filter-tags__list');

    if (!this.list) {
      throw new Error('FilterTags: .filter-tags__list not found');
    }

    this.maxVisibleItems = maxVisibleItems;
    this.mapTag = typeof mapTag === 'function' ? mapTag : null;

    this.onRemove = typeof onRemove === 'function' ? onRemove : null;
    this.onClear = typeof onClear === 'function' ? onClear : null;
    this.onMoreClick = typeof onMoreClick === 'function' ? onMoreClick : null;

    this.tags = [];
    this.isExpanded = false;

    this.handleClick = this.handleClick.bind(this);

    this.root.addEventListener('click', this.handleClick);
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

  destroy() {
    this.root.removeEventListener('click', this.handleClick);
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

  updateVisibility() {
    this.root.hidden = this.tags.length === 0;
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
      this.expandAll();
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