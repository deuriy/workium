export class AdditionalFiltersSearch {
  static GROUP_SELECTOR = [
    '.checkboxes-group',
    '.radiobtns-group',
    '.filter-element'
  ].join(', ');

  constructor({
    rootElement = null,
    rootSelector = null,
    inputSelector = 'input[name="search_filter"]',
    clearButtonSelector = '.additional-filters__clear-search-btn',
    cancelButtonSelector = '.additional-filters__cancel-search-link',
    bodySelector = '.additional-filters__body',
    headerSelector = '.additional-filters__header',
    notFoundSelector = '.additional-filters__not-found',
    tagsSelector = '.additional-filters__tags',
    highlightTargetSelector = '.checkbox, .radiobtn',
    highlightClass = 'checkbox--highlighted',
    highlightAnimationClass = 'checkbox--highlighted-animation',
    hiddenClass = 'hidden',
    searchHiddenClass = 'is-search-hidden',
    headerStickyClass = 'additional-filters__header--sticky',
    headerExtendedClass = 'additional-filters__header--search-extended',
    typingIdleDelay = 500
  } = {}) {
    this.root =
      rootElement instanceof Element
        ? rootElement
        : document.querySelector(rootSelector);

    if (!this.root) {
      throw new Error(
        `AdditionalFiltersSearch: root element not found by selector "${rootSelector}"`
      );
    }

    this.inputSelector = inputSelector;
    this.clearButtonSelector = clearButtonSelector;
    this.cancelButtonSelector = cancelButtonSelector;
    this.bodySelector = bodySelector;
    this.headerSelector = headerSelector;
    this.notFoundSelector = notFoundSelector;
    this.tagsSelector = tagsSelector;
    this.highlightTargetSelector = highlightTargetSelector;

    this.highlightClass = highlightClass;
    this.highlightAnimationClass = highlightAnimationClass;
    this.hiddenClass = hiddenClass;
    this.searchHiddenClass = searchHiddenClass;
    this.headerStickyClass = headerStickyClass;
    this.headerExtendedClass = headerExtendedClass;

    this.typingIdleDelay = typingIdleDelay;

    this.isTyping = false;
    this.typingTimeout = null;

    this.input = this.root.querySelector(this.inputSelector);
    this.header = this.root.querySelector(this.headerSelector);
    this.body = this.root.querySelector(this.bodySelector);
    this.clearButton = this.root.querySelector(this.clearButtonSelector);
    this.cancelButton = this.root.querySelector(this.cancelButtonSelector);
    this.notFound = this.root.querySelector(this.notFoundSelector);
    this.notFoundPlayer = this.notFound?.querySelector('lottie-player, dotlottie-player') || null;
    this.tagsBlock = this.root.querySelector(this.tagsSelector);

    this.groups = Array.from(
      this.root.querySelectorAll(AdditionalFiltersSearch.GROUP_SELECTOR)
    );

    this.groupMeta = this.groups.map((group) => this.createGroupMeta(group));

    this.handleInput = this.handleInput.bind(this);
    this.handleClearClick = this.handleClearClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleInputPointerDown = this.handleInputPointerDown.bind(this);
    this.handleBodyScroll = this.handleBodyScroll.bind(this);
  }

  init() {
    if (!this.input) {
      return;
    }

    this.input.addEventListener('input', this.handleInput);
    this.input.addEventListener('pointerdown', this.handleInputPointerDown);

    if (this.clearButton) {
      this.clearButton.addEventListener('click', this.handleClearClick);
    }

    if (this.cancelButton) {
      this.cancelButton.addEventListener('click', this.handleCancelClick);
    }

    if (this.body && this.header) {
      this.body.addEventListener('scroll', this.handleBodyScroll, { passive: true });
    }

    this.resetUiState();
  }

  destroy() {
    if (this.input) {
      this.input.removeEventListener('input', this.handleInput);
      this.input.removeEventListener('pointerdown', this.handleInputPointerDown);
    }

    if (this.clearButton) {
      this.clearButton.removeEventListener('click', this.handleClearClick);
    }

    if (this.cancelButton) {
      this.cancelButton.removeEventListener('click', this.handleCancelClick);
    }

    if (this.body) {
      this.body.removeEventListener('scroll', this.handleBodyScroll);
    }

    clearTimeout(this.typingTimeout);
    this.typingTimeout = null;
  }

  resetUiState() {
    this.isTyping = false;

    clearTimeout(this.typingTimeout);
    this.typingTimeout = null;

    if (this.body) {
      this.body.scrollTop = 0;
    }

    if (this.header) {
      this.header.classList.remove(this.headerStickyClass);
      this.header.classList.remove(this.headerExtendedClass);
    }

    if (this.input) {
      this.input.value = '';
      this.input.blur();
    }

    this.applySearch('');
  }

  createGroupMeta(group) {
    const isOptionsGroup =
      group.classList.contains('checkboxes-group') ||
      group.classList.contains('radiobtns-group');

    const titleElement = group.querySelector(
      '.checkboxes-group__title, .radiobtns-group__title, .filter-element__title'
    );

    const title = this.normalizeText(titleElement?.textContent || '');

    const labels = isOptionsGroup
      ? Array.from(group.querySelectorAll('.checkbox__label, .radiobtn__label'))
      : [];

    const labelMeta = labels.map((label) => ({
      label,
      text: this.normalizeText(label.textContent || ''),
      highlightTarget:
        label.closest(this.highlightTargetSelector) || label.parentElement || label
    }));

    return {
      group,
      isOptionsGroup,
      title,
      labelMeta
    };
  }

  normalizeText(value) {
    return String(value).toLowerCase().trim();
  }

  handleInput(event) {
    const searchValue = this.normalizeText(event.target.value);

    this.isTyping = true;
    clearTimeout(this.typingTimeout);

    this.typingTimeout = window.setTimeout(() => {
      this.isTyping = false;
    }, this.typingIdleDelay);

    this.applySearch(searchValue);
  }

  handleInputPointerDown() {
    if (this.header) {
      this.header.classList.add(this.headerExtendedClass);
    }
  }

  handleClearClick() {
    if (!this.input) {
      return;
    }

    this.input.value = '';
    this.applySearch('');
    this.input.focus();
  }

  handleCancelClick(event) {
    event.preventDefault();

    if (this.header) {
      this.header.classList.remove(this.headerExtendedClass);
    }

    if (!this.input) {
      return;
    }

    this.input.value = '';
    this.applySearch('');
    this.input.blur();
  }

  handleBodyScroll() {
    if (this.input && document.activeElement === this.input && this.isTyping) {
      return;
    }

    this.updateStickyHeader();
  }

  updateStickyHeader() {
    if (!this.header || !this.body) {
      return;
    }

    this.header.classList.toggle(this.headerStickyClass, this.body.scrollTop > 0);
  }

  applySearch(searchValue) {
    const hasSearch = searchValue.length > 0;

    this.toggleClearButton(hasSearch);
    this.toggleTagsBlock(!hasSearch);

    this.groupMeta.forEach((meta) => {
      this.updateGroupVisibility(meta, searchValue, hasSearch);
    });

    this.toggleNotFound(hasSearch);
  }

  updateGroupVisibility(meta, searchValue, hasSearch) {
    const { group, isOptionsGroup, title, labelMeta } = meta;

    if (!hasSearch) {
      group.classList.remove(this.searchHiddenClass);
      this.clearHighlights(labelMeta);
      return;
    }

    if (!isOptionsGroup) {
      const matchesTitle = title.includes(searchValue);
      group.classList.toggle(this.searchHiddenClass, !matchesTitle);
      return;
    }

    this.clearHighlights(labelMeta);

    const matchedLabels = labelMeta.filter(({ text }) => text.includes(searchValue));

    matchedLabels.forEach(({ highlightTarget }) => {
      highlightTarget.classList.add(
        this.highlightClass,
        this.highlightAnimationClass
      );
    });

    const matchesTitle = title.includes(searchValue);
    group.classList.toggle(
      this.searchHiddenClass,
      !(matchesTitle || matchedLabels.length > 0)
    );
  }

  clearHighlights(labelMeta) {
    labelMeta.forEach(({ highlightTarget }) => {
      highlightTarget.classList.remove(
        this.highlightClass,
        this.highlightAnimationClass
      );
    });
  }

  toggleClearButton(visible) {
    if (!this.clearButton) {
      return;
    }

    this.clearButton.classList.toggle(this.hiddenClass, !visible);
  }

  toggleTagsBlock(visible) {
    if (!this.tagsBlock) {
      return;
    }

    this.tagsBlock.classList.toggle(this.searchHiddenClass, !visible);
  }

  toggleNotFound(hasSearch = false) {
    if (!this.notFound) {
      return;
    }

    if (!hasSearch) {
      this.notFound.classList.add(this.hiddenClass);
      this.notFoundPlayer?.stop?.();
      return;
    }

    const hasVisibleGroups = this.groups.some((group) => {
      if (
        group.classList.contains(this.hiddenClass) ||
        group.classList.contains(this.searchHiddenClass)
      ) {
        return false;
      }

      return this.isActuallyVisible(group);
    });

    this.notFound.classList.toggle(this.hiddenClass, hasVisibleGroups);

    if (!hasVisibleGroups) {
      this.notFoundPlayer?.play?.();
    } else {
      this.notFoundPlayer?.stop?.();
    }
  }

  isActuallyVisible(element) {
    return !!(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
  }
}