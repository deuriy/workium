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
    externalResultsSelector = '[data-external-search-results]',
    externalSearchKeys = ['cities', 'currency'],
    externalSearchComponents = ['isCheckboxesGroupsField'],
    typingIdleDelay = 500,
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

    this.externalResultsSelector = externalResultsSelector;
    this.externalSearchKeys = externalSearchKeys;
    this.externalSearchComponents = externalSearchComponents;

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

    this.externalResults = this.root.querySelector(this.externalResultsSelector);

    this.groups = Array.from(
      this.root.querySelectorAll(AdditionalFiltersSearch.GROUP_SELECTOR)
    );

    this.groupMeta = this.groups.map((group) => this.createGroupMeta(group));

    this.handleInput = this.handleInput.bind(this);
    this.handleInputClick = this.handleInputClick.bind(this);
    this.handleClearClick = this.handleClearClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    // this.handleInputPointerDown = this.handleInputPointerDown.bind(this);
    this.handleBodyScroll = this.handleBodyScroll.bind(this);
    this.handleExternalResultsChange = this.handleExternalResultsChange.bind(this);
  }

  init() {
    if (!this.input) {
      return;
    }

    this.input.addEventListener('input', this.handleInput);
    this.input.addEventListener('click', this.handleInputClick);
    // this.input.addEventListener('pointerdown', this.handleInputPointerDown);

    if (this.clearButton) {
      this.clearButton.addEventListener('click', this.handleClearClick);
    }

    if (this.cancelButton) {
      this.cancelButton.addEventListener('click', this.handleCancelClick);
    }

    if (this.body && this.header) {
      this.body.addEventListener('scroll', this.handleBodyScroll, { passive: true });
    }

    if (this.externalResults) {
      this.externalResults.addEventListener('change', this.handleExternalResultsChange);
    }

    this.resetUiState();
  }

  destroy() {
    if (this.input) {
      this.input.removeEventListener('input', this.handleInput);
      this.input.removeEventListener('click', this.handleInputClick);
      // this.input.removeEventListener('pointerdown', this.handleInputPointerDown);
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

    if (this.externalResults) {
      this.externalResults.removeEventListener('change', this.handleExternalResultsChange);
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

  handleInputClick() {
    if (!this.header) {
      return;
    }

    this.header.classList.add(this.headerExtendedClass);

    this.input?.focus?.({
      preventScroll: true
    });
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

  isAvailableCountryValue(countryFilterKey, countryValue) {
    const countryComponent = this.controller?.getComponent?.(countryFilterKey);

    if (!countryComponent?.getAllItems) {
      return true;
    }

    const availableValues = countryComponent.getAllItems().map((item) => {
      return String(item.value ?? item.id ?? '');
    });

    return availableValues.includes(String(countryValue));
  }

  syncCountryForExternalItem({
    filterKey,
    component,
    countryValue = ''
  } = {}) {
    const citiesFilterKey = this.controller?.citiesFilterKey || 'cities';
    const countryFilterKey =
      this.controller?.citiesRequestCountryFilterKey || 'country';

    const shouldSyncCountry =
      filterKey === citiesFilterKey ||
      component?.isCheckboxesGroupsField === true;

    if (!shouldSyncCountry) {
      return;
    }

    if (!countryValue) {
      if (filterKey === citiesFilterKey) {
        this.controller?.applyCountriesFromSelectedCities?.();
      }

      return;
    }

    if (!this.isAvailableCountryValue(countryFilterKey, countryValue)) {
      return;
    }

    const selectedCountries =
      this.controller?.getSelected?.(countryFilterKey) || [];

    if (!selectedCountries.includes(countryValue)) {
      this.controller?.addValue?.(countryFilterKey, countryValue);
    }
  }

  handleExternalResultsChange(event) {
    const input = event.target;

    if (!input.matches('[data-external-filter-key][data-external-filter-value]')) {
      return;
    }

    const filterKey = input.dataset.externalFilterKey;
    const value = input.dataset.externalFilterValue;
    const countryValue = input.dataset.externalCountryValue || '';

    const component = this.controller?.getComponent?.(filterKey);

    if (!component) {
      return;
    }

    if (component.isSingleValue) {
      if (typeof component.applyValue === 'function') {
        component.applyValue(value);
      } else {
        component.setSelected([value]);
      }

      return;
    }

    if (input.checked) {
      component.select(value);

      this.syncCountryForExternalItem({
        filterKey,
        component,
        countryValue
      });

      return;
    }

    component.deselect(value);
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

  getExternalSearchComponents() {
    const components = this.controller?.components || {};

    return Object.entries(components).filter(([key, component]) => {
      if (this.externalSearchKeys.includes(key)) {
        return true;
      }

      if (component?.isCheckboxesGroupsField) {
        return true;
      }

      return false;
    });
  }

  renderExternalGroup(group, searchValue = '') {
    return `
      <div class="filter-element additional-filters__filter-element additional-filters__filter-element--external-search">
        ${
          group.popupTitle
            ? `<h3 class="filter-element__title">${this.escapeHtml(group.popupTitle)}</h3>`
            : ''
        }

        <h4 class="filter-element__title">
          ${this.escapeHtml(group.title)}
        </h4>

        ${
          group.subtitle
            ? `<div class="filter-element__subtitle">${this.escapeHtml(group.subtitle)}</div>`
            : ''
        }

        <div class="checkboxes-group checkboxes-group--row">
          <ul class="checkboxes-group__list">
            ${group.items.map((item) => this.renderExternalResult(item, searchValue)).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  getExternalComponentTitle(filterKey, component) {
    if (component?.container) {
      const title = component.container
        .closest('.filter-element, .checkboxes-group, .radiobtns-group, .fancybox-popup')
        ?.querySelector('.filter-element__title, .checkboxes-group__title, .radiobtns-group__title, .fancybox-popup__title')
        ?.textContent
        ?.trim();

      if (title) {
        return title;
      }
    }

    const resultFieldText = document
      .querySelector(`[data-result-field="${filterKey}"] [data-result-field-text]`)
      ?.textContent
      ?.trim();

    return resultFieldText || filterKey;
  }

  getExternalComponentSubtitle(filterKey, component) {
    if (!component?.container) {
      return '';
    }

    return component.container
      .closest('.filter-element, .checkboxes-group, .radiobtns-group, .fancybox-popup')
      ?.querySelector('.filter-element__subtitle, .checkboxes-group__subtitle, .radiobtns-group__subtitle, .fancybox-popup__subtitle')
      ?.textContent
      ?.trim() || '';
  }

  getExternalPopupTitle(filterKey, component) {
    const popup = component?.container?.closest?.(
      '.filter-element-popup, .fancybox-popup'
    );

    const popupTitle = popup
      ?.querySelector('.filter-element-popup__title, .fancybox-popup__title')
      ?.textContent
      ?.trim();

    if (popupTitle) {
      return popupTitle;
    }

    const resultFieldText = document
      .querySelector(`[data-result-field="${filterKey}"] [data-result-field-text]`)
      ?.textContent
      ?.trim();

    return resultFieldText || '';
  }

  getExternalComponentItems(filterKey, component) {
    if (!component?.getAllItems) {
      return [];
    }

    return component.getAllItems()
      .map((item) => {
        const value = String(item.value ?? item.id ?? '');

        const label = String(
          item.label?.textContent ||
          item.label ||
          item.text ||
          item.title ||
          item.value ||
          item.id ||
          ''
        ).trim();

        const subtitle = String(
          item.description ||
          item.country ||
          item.countryName ||
          item.province ||
          ''
        ).trim();

        const groupTitle = String(item.groupTitle || '').trim();
        const groupSubtitle = String(item.groupSubtitle || '').trim();

        const searchText = this.normalizeText([
          label,
          subtitle,
          groupTitle,
          groupSubtitle
        ].filter(Boolean).join(' '));

        return {
          filterKey,
          value,
          label,
          subtitle,
          groupKey: item.groupKey || filterKey,
          groupTitle: item.groupTitle || '',
          groupSubtitle: item.groupSubtitle || '',
          countryValue: item.countryValue || item.country_value || '',
          popupTitle: this.getExternalPopupTitle(filterKey, component),
          searchText,
          component,
          isSingleValue: component.isSingleValue === true,
        };
      })
      .filter((item) => item.value && item.label);
  }

  getExternalSearchResults(searchValue = '') {
    if (!searchValue) {
      return [];
    }

    return this.getExternalSearchComponents()
      .flatMap(([filterKey, component]) => {
        if (!component?.getAllItems) {
          return [];
        }

        return component.getAllItems()
          .map((item) => {
            const value = String(item.value ?? item.id ?? '');
            const label = String(
              item.label?.textContent ||
              item.text ||
              item.title ||
              item.value ||
              item.id ||
              ''
            ).trim();

            const searchText = this.normalizeText([
              label,
              item.country,
              item.countryName,
              item.description,
              item.countryValue
            ].filter(Boolean).join(' '));

            return {
              filterKey,
              value,
              label,
              searchText,
              component,
              isSingleValue: component.isSingleValue === true
            };
          })
          .filter((item) => {
            return item.value && item.label && item.searchText.includes(searchValue);
          });
      });
  }

  getExternalSearchGroups(searchValue = '') {
    if (!searchValue) {
      return [];
    }

    const groupsMap = new Map();

    this.getExternalSearchComponents().forEach(([filterKey, component]) => {
      const componentTitle = this.getExternalComponentTitle(filterKey, component);
      const componentSubtitle = this.getExternalComponentSubtitle(filterKey, component);

      const items = this.getExternalComponentItems(filterKey, component);

      items.forEach((item) => {
        const title = item.groupTitle || componentTitle;
        const subtitle = item.groupSubtitle || componentSubtitle;

        const titleMatches = this.normalizeText(title).includes(searchValue);
        const subtitleMatches = this.normalizeText(subtitle).includes(searchValue);
        const itemMatches = item.searchText.includes(searchValue);

        if (!(titleMatches || subtitleMatches || itemMatches)) {
          return;
        }

        const groupKey = item.groupKey || `${filterKey}:${title}`;

        if (!groupsMap.has(groupKey)) {
          groupsMap.set(groupKey, {
            filterKey,
            component,
            popupTitle: item.popupTitle || '',
            title,
            subtitle,
            items: []
          });
        }

        groupsMap.get(groupKey).items.push(item);
      });
    });

    return [...groupsMap.values()];
  }

  renderExternalResults(searchValue = '') {
    if (!this.externalResults) {
      return 0;
    }

    const groups = this.getExternalSearchGroups(searchValue);

    this.externalResults.classList.toggle(this.hiddenClass, groups.length === 0);

    if (!groups.length) {
      this.externalResults.innerHTML = '';
      return 0;
    }

    this.externalResults.innerHTML = groups
      .map((group) => this.renderExternalGroup(group, searchValue))
      .join('');

    return groups.reduce((total, group) => total + group.items.length, 0);
  }

  renderExternalResult(item, searchValue = '') {
    const id = `external_${item.filterKey}_${item.value}`.replace(/[^a-zA-Z0-9_-]/g, '_');
    const checked = item.component.has?.(item.value) ? ' checked' : '';
    const type = item.isSingleValue ? 'radio' : 'checkbox';

    const isHighlighted = this.normalizeText(item.label).includes(searchValue);

    const checkboxClass = [
      'checkbox',
      'checkbox--tag-style',
      isHighlighted ? this.highlightClass : '',
      isHighlighted ? this.highlightAnimationClass : ''
    ].filter(Boolean).join(' ');

    return `
      <li class="checkboxes-group__item">
        <div class="${checkboxClass}">
          <input
            class="checkbox__input checkbox__input--job-filter"
            type="${type}"
            id="${id}"
            name="external_${this.escapeHtml(item.filterKey)}"
            data-external-filter-key="${this.escapeHtml(item.filterKey)}"
            data-external-filter-value="${this.escapeHtml(item.value)}"
            data-external-country-value="${this.escapeHtml(item.countryValue || '')}"
            ${checked}
          >

          <label class="checkbox__label" for="${id}">
            ${this.escapeHtml(item.label)}
          </label>
        </div>
      </li>
    `;
  }

  applySearch(searchValue) {
    const hasSearch = searchValue.length > 0;

    this.toggleClearButton(hasSearch);
    this.toggleTagsBlock(!hasSearch);

    this.groupMeta.forEach((meta) => {
      this.updateGroupVisibility(meta, searchValue, hasSearch);
    });

    const externalResultsCount = this.renderExternalResults(searchValue);

    this.toggleNotFound(hasSearch, externalResultsCount);
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

  toggleNotFound(hasSearch = false, externalResultsCount = 0) {
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

    const hasAnyResults = hasVisibleGroups || externalResultsCount > 0;

    this.notFound.classList.toggle(this.hiddenClass, hasAnyResults);

    if (!hasAnyResults) {
      this.notFoundPlayer?.play?.();
    } else {
      this.notFoundPlayer?.stop?.();
    }
  }

  escapeHtml(value = '') {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  highlightText(text = '', searchValue = '') {
    const safeText = this.escapeHtml(text);

    if (!searchValue) {
      return safeText;
    }

    const normalizedText = this.normalizeText(text);
    const index = normalizedText.indexOf(searchValue);

    if (index === -1) {
      return safeText;
    }

    const original = String(text);
    const before = this.escapeHtml(original.slice(0, index));
    const match = this.escapeHtml(original.slice(index, index + searchValue.length));
    const after = this.escapeHtml(original.slice(index + searchValue.length));

    return `${before}<span class="${this.highlightClass}">${match}</span>${after}`;
  }

  isActuallyVisible(element) {
    return !!(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
  }
}