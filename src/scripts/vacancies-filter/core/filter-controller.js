import { FilterStore } from './filter-store.js';
import { UrlSync } from '../services/url-sync.js';
import { FilterDependencies } from '../services/filter-dependencies.js';
import { FilterTagsBuilder } from '../services/filter-tags-builder.js';

export class FilterController {
  constructor({
    formSelector,
    components = {},
    filterTags = [],
    uiPlugins = [],
    syncUrl = true,
    restoreFromUrl = false,
    initialState = {},
    onSubmit = null,
    onChange = null,
    submitWithPhpArrayStyle = true,
    seoCountryFilterKey = 'country',
    countryUrlParam = 'countries',
    currency = null,
    languagePrefixes = [],
    basePathSegment = 'vacancies',

    // NEW
    citiesLoader = null,
    citiesFilterKey = 'cities',
    citiesRequestCountryFilterKey = 'countries',
    citiesRequestParam = 'country',
    citiesSearchParam = 'search',
    clearCitiesOnCountryChange = true,
    autoSyncCountriesWithCities
  }) {
    this.form = document.querySelector(formSelector);
    this.clearFilterButtons = Array.from(
      document.querySelectorAll('[data-clear-filter]')
    );

    if (!this.form) {
      throw new Error(`Form not found: ${formSelector}`);
    }

    this.components = components;
    this.filterTags = this.normalizeFilterTags(filterTags);
    this.uiPlugins = this.normalizeUiPlugins(uiPlugins);

    this.syncUrl = syncUrl;
    this.onSubmit = onSubmit;
    this.onChange = onChange;
    this.submitWithPhpArrayStyle = submitWithPhpArrayStyle;
    this.seoCountryFilterKey = seoCountryFilterKey;
    this.countryUrlParam = countryUrlParam;

    this.languagePrefixes = new Set(languagePrefixes.map(String));
    this.basePathSegment = String(basePathSegment || '').replace(/^\/+|\/+$/g, '');

    // NEW
    this.citiesLoader = citiesLoader;
    this.citiesFilterKey = citiesFilterKey;
    this.citiesRequestCountryFilterKey = citiesRequestCountryFilterKey;
    this.citiesRequestParam = citiesRequestParam;
    this.citiesSearchParam = citiesSearchParam;
    this.clearCitiesOnCountryChange = clearCitiesOnCountryChange;
    this.lastCitiesRequestKey = null;
    this.citiesAbortController = null;
    this.isCitiesLoading = false;
    this.autoSyncCountriesWithCities = autoSyncCountriesWithCities;
    this.preserveSelectedCitiesOnNextLoad = false;
    this.lastCountrySelectionKey = null;
    this.currencyConfig = currency;
    this.isResettingFilters = false;
    this.isManuallyClearingRadius = false;
    this.lastSelectedCitiesCount = 0;

    this.store = new FilterStore(initialState);

    this.lastCountrySelectionKey = this.buildCountrySelectionStateKey(
      this.store.getState()
    );

    this.dependencies = new FilterDependencies({
      citiesFilterKey: this.citiesFilterKey,
      countriesFilterKey: this.citiesRequestCountryFilterKey,
      currencyConfig: this.currencyConfig
    });

    this.registerParentChildVisibilityDependencies();
    this.registerRadiusVisibilityDependency();

    this.tagsBuilder = new FilterTagsBuilder(this.components);

    Object.values(this.components).forEach((component) => {
      component.controller = this;
      component.connectStore(this.store);
    });

    this.bindFilterTags();
    this.bindUiPlugins();
    this.bindEvents();

    if (restoreFromUrl) {
      this.restoreFromUrl();
    }

    this.applyDefaultSingleValues();

    this.unsubscribe = this.store.subscribe((state) => {
      this.handleStateChange(state);
    });

    this.dependencies.apply(this.getState(), this.store, {
      components: this.components
    });

    const serialized = this.serialize();

    this.toggleClearFilterButtons(serialized);
    this.syncTags(serialized);

    // NEW: первичная загрузка городов при старте страницы
    this.syncCitiesOptions();
    // this.toggleClearFilterButtons();

    this.dependencies.applyParentChildVisibility(this.getState(), this.store);
    this.dependencies.applyDependentVisibility(this.getState());
  }

  getCountryComponent() {
    return this.getComponent(this.seoCountryFilterKey);
  }

  getCountryEntityIdByValue(value) {
    const country = this.getCountryComponent()
      ?.getAllItems?.()
      .find((item) => String(item.value) === String(value));

    return country?.entityId ? String(country.entityId) : '';
  }

  getCountryValueByEntityId(entityId) {
    const country = this.getCountryComponent()
      ?.getAllItems?.()
      .find((item) => String(item.entityId) === String(entityId));

    return country?.value ? String(country.value) : '';
  }

  mapCountryValuesToEntityIds(values = []) {
    return values
      .map((value) => this.getCountryEntityIdByValue(value))
      .filter(Boolean);
  }

  mapCountryEntityIdsToValues(entityIds = []) {
    return entityIds
      .map((entityId) => this.getCountryValueByEntityId(entityId))
      .filter(Boolean);
  }

  stripLanguagePrefixFromSegments(segments = []) {
    if (!segments.length) {
      return segments;
    }

    return this.languagePrefixes.has(segments[0])
      ? segments.slice(1)
      : segments;
  }

  isKnownFilterValue(key, value) {
    if (key === this.citiesFilterKey) {
      return true;
    }

    const component = this.components[key];

    if (!component?.getAllItems) {
      return true;
    }

    const items = component.getAllItems();

    if (!items.length) {
      return true;
    }

    const values = items.map((item) => {
      return String(item.value ?? item.id ?? '');
    });

    return values.includes(String(value));
  }

  sanitizeRestoredFilters(filters = {}) {
    return Object.fromEntries(
      Object.entries(filters)
        .filter(([key]) => this.isRegisteredFilterKey(key))
        .map(([key, values]) => {
          const safeValues = values.filter((value) => {
            return this.isKnownFilterValue(key, value);
          });

          return [key, safeValues];
        })
        .filter(([, values]) => values.length > 0)
    );
  }

  shouldIgnoreFilterInSelectedState(key, values = []) {
    const component = this.components[key];

    if (component?.excludeFromSelectedState === true) {
      return true;
    }

    if (
      component?.defaultValue &&
      values.length === 1 &&
      String(values[0]) === String(component.defaultValue)
    ) {
      return true;
    }

    if (
      values.length > 0 &&
      values.every((value) => {
        return component?.shouldExcludeValueFromSelectedState?.(value);
      })
    ) {
      return true;
    }

    return false;
  }
  
  isRegisteredFilterKey(key) {
    return Object.prototype.hasOwnProperty.call(this.components, key);
  }

  isSingleValueFilter(key) {
    return this.components[key]?.isSingleValue === true;
  }

  registerParentChildVisibilityDependencies() {
    const groups = document.querySelectorAll(
      '[data-parent-filter-id][data-parent-filter-item-id][data-filter-key]'
    );

    groups.forEach((group) => {
      const parentFilterId = group.dataset.parentFilterId;
      const parentFilterItemId = group.dataset.parentFilterItemId;
      const targetFilterKey = group.dataset.filterKey;

      const parentGroup = document.querySelector(
        `[data-filter-id="${parentFilterId}"][data-filter-key]`
      );

      if (!parentGroup) {
        return;
      }

      const parentFilterKey = parentGroup.dataset.filterKey;

      const parentInput = parentGroup.querySelector(
        `[data-filter-item-id="${parentFilterItemId}"]`
      );

      if (!parentFilterKey || !parentInput?.value) {
        return;
      }

      this.dependencies.registerParentChildVisibility({
        parentFilterKey,
        parentItemValue: parentInput.value,
        targetFilterKey,
        targetElement: group,
        hiddenClass: 'hidden',
        clearWhenHidden: true
      });
    });
  }

  registerRadiusVisibilityDependency() {
    const radiusComponent = this.components.radius;

    if (!radiusComponent?.container) {
      return;
    }

    this.dependencies.registerDependentVisibility({
      sourceFilterKey: this.citiesFilterKey,
      targetElement: radiusComponent.container,
      hiddenClass: 'hidden'
    });
  }

  buildCountrySelectionStateKey(state = this.getState()) {
    const selectedCountries =
      state[this.citiesRequestCountryFilterKey] || new Set();

    return JSON.stringify(
      [...selectedCountries].map(String).sort()
    );
  }

  pruneCitiesAfterCountryChange(state) {
    const prevCountrySelectionKey = this.lastCountrySelectionKey;
    const nextCountrySelectionKey = this.buildCountrySelectionStateKey(state);

    const didCountriesChange =
      nextCountrySelectionKey !== prevCountrySelectionKey;

    this.lastCountrySelectionKey = nextCountrySelectionKey;

    if (!didCountriesChange) {
      return state;
    }

    if (!this.clearCitiesOnCountryChange) {
      return state;
    }

    if (this.preserveSelectedCitiesOnNextLoad) {
      return state;
    }

    const prevCountries = new Set(JSON.parse(prevCountrySelectionKey || '[]'));
    const nextCountries = state[this.citiesRequestCountryFilterKey] || new Set();

    const removedCountries = [...prevCountries].filter((countryValue) => {
      return !nextCountries.has(countryValue);
    });

    if (!removedCountries.length) {
      return state;
    }

    const changed = this.dependencies.pruneCitiesByRemovedCountries(
      state,
      this.store,
      removedCountries
    );

    return changed ? this.getState() : state;
  }

  normalizeFilterTags(filterTags) {
    if (!filterTags) {
      return [];
    }

    return Array.isArray(filterTags) ? filterTags.filter(Boolean) : [filterTags];
  }

  normalizeUiPlugins(uiPlugins) {
    if (!uiPlugins) {
      return [];
    }

    return Array.isArray(uiPlugins) ? uiPlugins.filter(Boolean) : [uiPlugins];
  }

  isMainClearFilterButton(button) {
    return Boolean(button.closest('.filter__bottom'));
  }

  bindEvents() {
    this.handleSubmit = (event) => {
      event.preventDefault();
      this.submit();
    };

    this.handleReset = () => {
      setTimeout(() => {
        this.reset();
        this.syncCitiesOptions();
      }, 0);
    };

    this.form.addEventListener('submit', this.handleSubmit);
    this.form.addEventListener('reset', this.handleReset);

    this.resetButton = this.form.querySelector('[data-filter-reset]');

    if (this.resetButton) {
      this.handleResetButtonClick = (event) => {
        event.preventDefault();
        this.reset();
        this.syncCitiesOptions();
      };

      this.resetButton.addEventListener('click', this.handleResetButtonClick);
    }

    this.handleGlobalClearClick = (event) => {
      const btn = event.target.closest('[data-clear-filter]');

      if (!btn) {
        return;
      }

      event.preventDefault();

      this.resetCitiesRequestCache();
      this.reset();
      this.syncCitiesOptions();

      if (this.isMainClearFilterButton(btn)) {
        this.submitAfterStateUpdate();
      }
    };

    document.addEventListener('click', this.handleGlobalClearClick);
  }

  bindFilterTags() {
    if (!this.filterTags.length) {
      return;
    }

    this.filterTags.forEach((filterTagsInstance) => {
      filterTagsInstance.onRemove = (tag) => {
        this.removeTag(tag);

        if (this.isMainFilterTags(filterTagsInstance)) {
          this.submitAfterStateUpdate();
        }
      };

      filterTagsInstance.onClear = () => {
        this.reset();
        this.syncCitiesOptions();

        if (this.isMainFilterTags(filterTagsInstance)) {
          this.submitAfterStateUpdate();
        }
      };

      filterTagsInstance.onMoreClick = () => {
        // optional analytics hook
      };
    });
  }

  bindUiPlugins() {
    if (!this.uiPlugins.length) {
      return;
    }

    this.uiPlugins.forEach((plugin) => {
      plugin.controller = this;
      plugin.init?.();
    });
  }

  resetUiPlugins() {
    this.uiPlugins.forEach((plugin) => {
      plugin.resetUiState?.();
    });
  }

  resetCitiesRequestCache() {
    this.lastCitiesRequestKey = null;
  }

  applyCountriesFromSelectedCities() {
    this.preserveSelectedCitiesOnNextLoad = true;

    const citiesComponent = this.getComponent(this.citiesFilterKey);

    const selectedCities =
      citiesComponent?.getKnownSelectedItems?.() ||
      this.getSelectedItems(this.citiesFilterKey) ||
      [];

    selectedCities.forEach((city) => {
      const countryValue = this.resolveCountryValue(
        city.countryValue ||
        city.country_value ||
        city.country_id ||
        ''
      );

      if (!countryValue) {
        return;
      }

      this.addValue(this.citiesRequestCountryFilterKey, countryValue);
    });
  }

  applyDefaultRadiusWhenCitySelected(state = this.getState()) {
    const selectedCities = state[this.citiesFilterKey] || new Set();
    const selectedRadius = state.radius || new Set();

    const selectedCitiesCount = selectedCities.size;
    const didAddCity = selectedCitiesCount > this.lastSelectedCitiesCount;

    this.lastSelectedCitiesCount = selectedCitiesCount;

    if (!selectedCitiesCount) {
      this.isManuallyClearingRadius = false;
      return;
    }

    if (didAddCity) {
      this.isManuallyClearingRadius = false;
    }

    if (selectedRadius.size) {
      return;
    }

    if (this.isManuallyClearingRadius) {
      return;
    }

    this.store.setFilter('radius', ['10']);
  }

  handleStateChange(state) {
    const currentState = this.pruneCitiesAfterCountryChange(state);

    this.dependencies.apply(currentState, this.store, {
      syncCountriesWithCities: this.autoSyncCountriesWithCities,
      components: this.components
    });

    this.applyDefaultRadiusWhenCitySelected(this.getState());

    const currentRadius = this.getSelected('radius');

    if (currentRadius.length) {
      this.isManuallyClearingRadius = false;
    }

    const serialized = this.serialize();

    this.toggleClearFilterButtons(serialized);

    this.syncTags(serialized);

    if (this.syncUrl) {
      UrlSync.write(serialized, {
        phpArrayStyle: this.submitWithPhpArrayStyle,
        seoCountryFilterKey: this.seoCountryFilterKey
      });
    }

    // NEW: при изменении стран подгружаем города
    this.syncCitiesOptions(currentState);

    if (typeof this.onChange === 'function') {
      this.onChange(serialized, state);
    }
  }

  getRegisteredFilters(filters = {}) {
    return Object.fromEntries(
      Object.entries(filters).filter(([key]) => {
        return this.isRegisteredFilterKey(key);
      })
    );
  }

  syncTags(filters) {
    if (!this.filterTags.length) {
      return;
    }

    const tags = this.tagsBuilder.build(this.getRegisteredFilters(filters));

    this.filterTags.forEach((filterTagsInstance) => {
      filterTagsInstance.setTags(tags);
    });
  }

  removeTag(tag) {
    if (!tag?.filterKey) {
      return;
    }

    if (tag.filterKey === 'radius') {
      this.isManuallyClearingRadius = true;
    }

    const component = this.components[tag.filterKey];

    if (component?.deselect) {
      component.deselect(tag.value);
      return;
    }

    this.store.removeValue(tag.filterKey, tag.value);
  }

  setCityCountryMapping(cities = []) {
    this.dependencies.setCityCountryMapping(cities);
  }

  setOptions(filterKey, options) {
    const component = this.components[filterKey];

    if (!component?.setOptions) {
      return;
    }

    component.setOptions(options);

    if (filterKey === this.citiesFilterKey) {
      this.setCityCountryMapping(options);
    }

    this.syncTags(this.serialize());
    this.syncResultFields(filterKey);
  }

  getComponent(filterKey) {
    return this.components[filterKey] || null;
  }

  setSelected(filterKey, values) {
    return this.store.setFilter(filterKey, values);
  }

  addValue(filterKey, value) {
    return this.store.addValue(filterKey, value);
  }

  removeValue(filterKey, value) {
    return this.store.removeValue(filterKey, value);
  }

  toggleValue(filterKey, value) {
    return this.store.toggleValue(filterKey, value);
  }

  clearFilter(filterKey) {
    return this.store.clearFilter(filterKey);
  }

  reset() {
    this.isResettingFilters = true;

    try {
      this.resetCitiesRequestCache();

      const preservedState = this.getPreservedResetState();

      const changed = this.store.resetAll();

      Object.entries(preservedState).forEach(([key, values]) => {
        this.store.setFilter(key, values);
      });

      this.applyDefaultSingleValues();

      this.dependencies.apply(this.getState(), this.store, {
        syncCountriesWithCities: this.autoSyncCountriesWithCities,
        components: this.components
      });

      this.syncCitiesOptions();

      return changed;
    } finally {
      queueMicrotask(() => {
        this.isResettingFilters = false;
      });
    }
  }

  resetCitiesRequestCache() {
    this.lastCitiesRequestKey = null;
  }

  hasSelectedFilters(filters = this.serialize()) {
    return Object.entries(filters).some(([key, values]) => {
      if (this.shouldIgnoreFilterInSelectedState(key, values)) {
        return false;
      }

      return Array.isArray(values) && values.length > 0;
    });
  }

  toggleClearFilterButtons(filters = this.serialize()) {
    const hasSelected = this.hasSelectedFilters(filters);

    this.clearFilterButtons.forEach((button) => {
      button.classList.toggle('hidden', !hasSelected);
    });
  }

  getCurrentLanguagePrefix(pathname = window.location.pathname) {
    const segments = this.normalizePath(pathname)
      .split('/')
      .filter(Boolean);

    const firstSegment = segments[0];

    return this.languagePrefixes?.has?.(firstSegment)
      ? firstSegment
      : '';
  }

  stripLanguagePrefix(pathname = '') {
    const normalizedPath = this.normalizePath(pathname);
    const segments = normalizedPath.split('/').filter(Boolean);

    if (segments.length && this.languagePrefixes?.has?.(segments[0])) {
      return `/${segments.slice(1).join('/')}` || '/';
    }

    return normalizedPath;
  }

  addLanguagePrefix(pathname = '/', languagePrefix = '') {
    const normalizedPath = this.normalizePath(pathname);

    if (!languagePrefix) {
      return normalizedPath;
    }

    return `/${languagePrefix}${normalizedPath === '/' ? '' : normalizedPath}`;
  }

  markRestoredManualValues(filters = {}) {
    Object.entries(filters).forEach(([key, values]) => {
      const component = this.components[key];

      if (!component || !values?.length) {
        return;
      }

      component.markAsManuallySelected?.(values[0]);
    });
  }

  resolveCountryValue(countryValueOrEntityId = '') {
    const raw = String(countryValueOrEntityId || '');

    if (!raw) {
      return '';
    }

    const countryComponent = this.getCountryComponent();

    const country = countryComponent?.getAllItems?.().find((item) => {
      return (
        String(item.value || '') === raw ||
        String(item.entityId || '') === raw
      );
    });

    return country?.value ? String(country.value) : '';
  }

  normalizeCountryUrlFilter(filters = {}) {
    const normalized = { ...filters };

    const countryEntityIds = normalized[this.countryUrlParam];

    if (Array.isArray(countryEntityIds) && countryEntityIds.length) {
      const countryValues = this.mapCountryEntityIdsToValues(countryEntityIds);

      if (countryValues.length) {
        normalized[this.seoCountryFilterKey] = countryValues;
      }

      delete normalized[this.countryUrlParam];
    }

    return normalized;
  }

  restoreFromUrl() {
    const filters = UrlSync.read({
      seoCountryFilterKey: this.seoCountryFilterKey,
      languagePrefixes: [...this.languagePrefixes],
      basePathSegment: this.basePathSegment
    });

    const normalizedFilters = this.normalizeCountryUrlFilter(filters);
    const safeFilters = this.sanitizeRestoredFilters(normalizedFilters);

    this.markRestoredManualValues(safeFilters);

    Object.entries(safeFilters).forEach(([key, values]) => {
      this.store.setFilter(key, values);
    });
  }

  applyDefaultSingleValues() {
    Object.entries(this.components).forEach(([key, component]) => {
      if (!component?.isSingleValue || !component?.defaultValue) {
        return;
      }

      if (this.getSelected(key).length) {
        return;
      }

      this.store.setFilter(key, [component.defaultValue]);
    });
  }

  getSelected(filterKey) {
    return [...this.store.getFilter(filterKey)];
  }

  getSelectedItems(filterKey) {
    const component = this.components[filterKey];

    if (!component?.getSelectedItems) {
      return [];
    }

    return component.getSelectedItems();
  }

  getSelectedCountryValues() {
    return this.getSelected(this.citiesRequestCountryFilterKey);
  }

  getPreservedResetState() {
    const preservedState = {};

    Object.entries(this.components).forEach(([key, component]) => {
      if (!component?.preserveOnReset) {
        return;
      }

      const values = this.getSelected(key);

      if (values.length) {
        preservedState[key] = values;
      }
    });

    return preservedState;
  }

  async searchCitiesOptions(query = '') {
    if (!this.citiesLoader) {
      return;
    }

    const searchValue = String(query).trim();

    if (!searchValue) {
      this.resetCitiesRequestCache();
      await this.syncCitiesOptions();
      return;
    }

    if (this.citiesAbortController) {
      this.citiesAbortController.abort();
    }

    this.citiesAbortController = new AbortController();

    try {
      const response = await this.citiesLoader.load(
        {
          [this.citiesSearchParam]: searchValue
        },
        {
          signal: this.citiesAbortController.signal
        }
      );

      const cities = Array.isArray(response)
        ? response
        : Array.isArray(response?.results)
          ? response.results
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.cities)
              ? response.cities
              : [];

      const citiesWithCountries = this.attachCountryValuesToCities(cities);

      const citiesComponent = this.getComponent(this.citiesFilterKey);

      if (citiesComponent?.setSearchResults) {
        citiesComponent.setSearchResults(citiesWithCountries);
      } else {
        this.setOptions(this.citiesFilterKey, citiesWithCountries);
      }

      this.setCityCountryMapping([
        ...citiesWithCountries,
      ]);

      citiesComponent?.setSelectedCountryValues?.(
        this.getSelectedCountryValues()
      );

      this.syncTags(this.serialize());
    } catch (error) {
      if (error?.name === 'AbortError') {
        return;
      }

      console.error('Failed to search cities:', error);
      this.setOptions(this.citiesFilterKey, []);
    }
  }

  reloadCitiesOptions() {
    this.lastCitiesRequestKey = null;

    return this.syncCitiesOptions();
  }

  getState() {
    return this.store.getState();
  }

  serialize() {
    return this.store.serialize();
  }

  normalizePath(pathname = '') {
    const normalized = String(pathname || '')
      .replace(/\/{2,}/g, '/')
      .replace(/\/+$/, '');

    return normalized || '/';
  }

  getSeoCountryValues(filters = {}) {
    const values = filters[this.seoCountryFilterKey];
    return Array.isArray(values) ? values : [];
  }

  buildCountryUrlPart(countryValues = []) {
    if (!Array.isArray(countryValues) || countryValues.length !== 1) {
      return '';
    }

    return String(countryValues[0]).trim();
  }

  getSubmitBasePath(pathname = '', countryValues = []) {
    const normalizedPath = this.normalizePath(pathname);

    if (normalizedPath === '/') {
      return '/';
    }

    const segments = normalizedPath.split('/').filter(Boolean);

    if (!segments.length) {
      return '/';
    }

    const currentPathCountrySlug = segments.length > 1
      ? segments[segments.length - 1]
      : '';

    const hasCountryInPath = currentPathCountrySlug.startsWith('robota-v-');

    if (hasCountryInPath) {
      return `/${segments.slice(0, -1).join('/')}` || '/';
    }

    return `/${segments.join('/')}`;
  }

  shouldExcludeValueFromUrl(key, value) {
    const component = this.components[key];

    if (component?.shouldExcludeValueFromUrl?.(value)) {
      return true;
    }

    return false;
  }

  updateVacanciesCountWithOverrides(overrides = {}, options = {}) {
    this.uiPlugins.forEach((plugin) => {
      plugin.updateWithOverrides?.(overrides, options);
    });
  }

  isMainFilterTags(filterTagsInstance) {
    return filterTagsInstance?.root?.classList?.contains('filter-tags--main-filter');
  }

  shouldExcludeFilterFromUrl(key) {
    return this.components[key]?.excludeFromUrl === true;
  }

  buildQueryString({
    phpArrayStyle = false,
    overrides = null,
    includeSingleSeoCountry = false
  } = {}) {
    const filters = {
      ...this.serialize(),
      ...(overrides || {})
    };

    const params = new URLSearchParams();
    const countryValues = this.getSeoCountryValues(filters);

    const countryEntityIds = this.mapCountryValuesToEntityIds(countryValues);

    if (
      countryEntityIds.length > 1 ||
      (includeSingleSeoCountry && countryEntityIds.length === 1)
    ) {
      if (phpArrayStyle) {
        countryEntityIds.forEach((entityId) => {
          params.append(`${this.countryUrlParam}[]`, entityId);
        });
      } else {
        params.set(this.countryUrlParam, countryEntityIds.join(','));
      }
    }

    Object.entries(filters).forEach(([key, values]) => {
      if (this.shouldExcludeFilterFromUrl(key)) {
        return;
      }

      if (!Array.isArray(values) || values.length === 0) {
        return;
      }

      if (key === this.seoCountryFilterKey) {
        return;
      }

      const urlValues = values.filter((value) => {
        return !this.shouldExcludeValueFromUrl(key, value);
      });

      if (!urlValues.length) {
        return;
      }

      if (this.isSingleValueFilter(key)) {
        params.set(key, String(urlValues[0]));
        return;
      }

      if (phpArrayStyle) {
        urlValues.forEach((value) => {
          params.append(`${key}[]`, value);
        });
      } else {
        params.set(key, urlValues.join(','));
      }
    });

    return params
      .toString()
      .replace(/%5B/g, '[')
      .replace(/%5D/g, ']');
  }

  buildSubmitUrl({ phpArrayStyle = this.submitWithPhpArrayStyle } = {}) {
    const action = this.form.getAttribute('action');
    const fallbackBaseUrl = window.location.pathname;

    const url = new URL(
      action && action.trim() ? action : fallbackBaseUrl,
      window.location.origin
    );

    const filters = this.serialize();
    const countryValues = this.getSeoCountryValues(filters);

    const languagePrefix = this.getCurrentLanguagePrefix(window.location.pathname);

    const pathWithoutLanguage = this.stripLanguagePrefix(url.pathname);
    const basePath = this.getSubmitBasePath(pathWithoutLanguage, countryValues);
    const singleCountrySlug = this.buildCountryUrlPart(countryValues);

    const nextPathWithoutLanguage = singleCountrySlug
      ? `${basePath === '/' ? '' : basePath}/${singleCountrySlug}`
      : basePath;

    url.pathname = this.addLanguagePrefix(
      nextPathWithoutLanguage,
      languagePrefix
    );

    url.search = this.buildQueryString({ phpArrayStyle });

    return url.toString();
  }

  buildCitiesRequestKey(countryValues = []) {
    return JSON.stringify([...countryValues].map(String).sort());
  }

  pruneSelectedCitiesByOptions(cities = []) {
    const availableCityIds = new Set(
      cities
        .map((city) => city?.id)
        .filter(Boolean)
        .map(String)
    );

    const selectedCityIds = this.getSelected(this.citiesFilterKey);

    const nextSelectedCityIds = selectedCityIds.filter((id) => availableCityIds.has(id));

    if (selectedCityIds.length !== nextSelectedCityIds.length) {
      this.setSelected(this.citiesFilterKey, nextSelectedCityIds);
    }
  }

  attachCountryValuesToCities(cities = []) {
    const countryComponent = this.getComponent(this.citiesRequestCountryFilterKey);

    if (!countryComponent?.getAllItems) {
      return cities;
    }

    const countries = countryComponent.getAllItems();

    const countryValueByEntityId = new Map();

    countries.forEach((country) => {
      if (!country.entityId || !country.value) {
        return;
      }

      countryValueByEntityId.set(String(country.entityId), String(country.value));
    });

    return cities.map((city) => {
      const countryEntityId = String(city.country_id || '');
      const countryValue = countryValueByEntityId.get(countryEntityId);

      return {
        ...city,
        country_entity_id: countryEntityId,
        country_value: countryValue || city.country_value || ''
      };
    });
  }

  async syncCitiesOptions(state = this.getState()) {
    if (!this.citiesLoader) {
      return;
    }

    const countryComponent = this.getComponent(this.citiesRequestCountryFilterKey);

    const countryIds = countryComponent?.getSelectedItems?.()
      .map((item) => item.entityId)
      .filter(Boolean)
      .map(String) || [];

    const requestKey = this.buildCitiesRequestKey(countryIds);

    if (requestKey === this.lastCitiesRequestKey) {
      return;
    }

    this.lastCitiesRequestKey = requestKey;

    if (this.citiesAbortController) {
      this.citiesAbortController.abort();
    }

    this.citiesAbortController = new AbortController();

    try {
      this.isCitiesLoading = true;

      const requestParams = countryIds.length
        ? { [this.citiesRequestParam]: countryIds }
        : {};

      const response = await this.citiesLoader.load(requestParams, {
        signal: this.citiesAbortController.signal
      });

      const cities = Array.isArray(response)
        ? response
        : Array.isArray(response?.results)
          ? response.results
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.cities)
              ? response.cities
              : [];

      let citiesWithCountries = this.attachCountryValuesToCities(cities);

      if (this.preserveSelectedCitiesOnNextLoad) {
        citiesWithCountries = this.mergeSelectedKnownCities(citiesWithCountries);
      }

      this.setOptions(this.citiesFilterKey, citiesWithCountries);

      // if (this.clearCitiesOnCountryChange && !this.preserveSelectedCitiesOnNextLoad) {
      //   this.pruneSelectedCitiesByOptions(citiesWithCountries);
      // }

      this.preserveSelectedCitiesOnNextLoad = false;
    } catch (error) {
      if (error?.name === 'AbortError') {
        return;
      }

      console.error('Failed to load cities:', error);
      this.setOptions(this.citiesFilterKey, []);
    } finally {
      this.isCitiesLoading = false;
    }
  }

  syncResultFields(filterKey = null) {
    this.uiPlugins.forEach((plugin) => {
      if (!plugin.isResultField) {
        return;
      }

      if (filterKey && plugin.filterKey !== filterKey) {
        return;
      }

      plugin.update?.();
    });
  }

  mergeSelectedKnownCities(cities = []) {
    const citiesComponent = this.getComponent(this.citiesFilterKey);

    if (!citiesComponent?.getKnownSelectedItems) {
      return cities;
    }

    const mergedMap = new Map();

    cities.forEach((city) => {
      mergedMap.set(String(city.id), city);
    });

    citiesComponent.getKnownSelectedItems().forEach((city) => {
      mergedMap.set(String(city.id), {
        ...city,
        country_value: city.country_value || city.countryValue || ''
      });
    });

    return [...mergedMap.values()];
  }

  commitBeforeSubmit() {
    Object.values(this.components).forEach((component) => {
      component.commit?.();
    });
  }

  submit() {
    this.commitBeforeSubmit();
    
    const serialized = this.serialize();
    const rawState = this.getState();
    const submitUrl = this.buildSubmitUrl();

    if (typeof this.onSubmit === 'function') {
      const result = this.onSubmit(serialized, rawState, submitUrl);

      if (result === false) {
        return;
      }
    }

    window.location.href = submitUrl;
  }

  submitAfterStateUpdate() {
    window.setTimeout(() => {
      this.submit();
    }, 0);
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }

    if (this.citiesAbortController) {
      this.citiesAbortController.abort();
      this.citiesAbortController = null;
    }

    this.form.removeEventListener('submit', this.handleSubmit);
    this.form.removeEventListener('reset', this.handleReset);

    if (this.resetButton && this.handleResetButtonClick) {
      this.resetButton.removeEventListener('click', this.handleResetButtonClick);
    }

    Object.values(this.components).forEach((component) => {
      component.destroy?.();
    });

    this.filterTags.forEach((filterTagsInstance) => {
      filterTagsInstance.destroy?.();
    });

    this.uiPlugins.forEach((plugin) => {
      plugin.destroy?.();
    });

    document.removeEventListener('click', this.handleGlobalClearClick);
  }
}