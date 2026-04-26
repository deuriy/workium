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

    this.store = new FilterStore(initialState);

    this.dependencies = new FilterDependencies({
      citiesFilterKey: this.citiesFilterKey,
      countriesFilterKey: this.citiesRequestCountryFilterKey
    });

    this.tagsBuilder = new FilterTagsBuilder(this.components);

    Object.values(this.components).forEach((component) => {
      component.connectStore(this.store);
    });

    this.unsubscribe = this.store.subscribe((state) => {
      this.handleStateChange(state);
    });

    this.bindFilterTags();
    this.bindUiPlugins();
    this.bindEvents();

    if (restoreFromUrl) {
      this.restoreFromUrl();
    }

    // NEW: первичная загрузка городов при старте страницы
    this.syncCitiesOptions();
    this.toggleClearFilterButtons();
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

      if (!btn) return;

      event.preventDefault();

      this.resetCitiesRequestCache();
      this.reset();
      this.syncCitiesOptions();
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
      };

      filterTagsInstance.onClear = () => {
        this.reset();
        this.syncCitiesOptions();
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
    this.dependencies.syncCountriesWithCities(this.getState(), this.store);
  }

  handleStateChange(state) {
    this.dependencies.apply(state, this.store, {
      syncCountriesWithCities: this.autoSyncCountriesWithCities
    });

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
    this.syncCitiesOptions(state);

    if (typeof this.onChange === 'function') {
      this.onChange(serialized, state);
    }
  }

  syncTags(filters) {
    if (!this.filterTags.length) {
      return;
    }

    const tags = this.tagsBuilder.build(filters);

    this.filterTags.forEach((filterTagsInstance) => {
      filterTagsInstance.setTags(tags);
    });
  }

  removeTag(tag) {
    if (!tag?.filterKey) {
      return;
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
    this.resetCitiesRequestCache();

    const changed = this.store.resetAll();

    this.syncCitiesOptions();

    return changed;
  }

  resetCitiesRequestCache() {
    this.lastCitiesRequestKey = null;
  }

  hasSelectedFilters(filters = this.serialize()) {
    return Object.values(filters).some((values) => {
      return Array.isArray(values) && values.length > 0;
    });
  }

  toggleClearFilterButtons(filters = this.serialize()) {
    const hasSelected = this.hasSelectedFilters(filters);

    this.clearFilterButtons.forEach((button) => {
      button.classList.toggle('hidden', !hasSelected);
    });
  }

  restoreFromUrl() {
    const filters = UrlSync.read({
      seoCountryFilterKey: this.seoCountryFilterKey
    });

    Object.entries(filters).forEach(([key, values]) => {
      this.store.setFilter(key, values);
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

  buildQueryString({ phpArrayStyle = false } = {}) {
    const filters = this.serialize();
    const params = new URLSearchParams();
    const countryValues = this.getSeoCountryValues(filters);

    if (countryValues.length > 1) {
      if (phpArrayStyle) {
        countryValues.forEach((value) => {
          params.append(`${this.seoCountryFilterKey}[]`, value);
        });
      } else {
        params.set(this.seoCountryFilterKey, countryValues.join(','));
      }
    }

    Object.entries(filters).forEach(([key, values]) => {
      if (!Array.isArray(values) || values.length === 0) {
        return;
      }

      if (key === this.seoCountryFilterKey) {
        return;
      }

      if (phpArrayStyle) {
        values.forEach((value) => {
          params.append(`${key}[]`, value);
        });
      } else {
        params.set(key, values.join(','));
      }
    });

    return params.toString();
  }

  buildSubmitUrl({ phpArrayStyle = this.submitWithPhpArrayStyle } = {}) {
    const action = this.form.getAttribute('action');
    const fallbackBaseUrl = action && action.trim() ? action : window.location.pathname;

    const url = new URL(fallbackBaseUrl, window.location.origin);
    const filters = this.serialize();
    const countryValues = this.getSeoCountryValues(filters);

    const basePath = this.getSubmitBasePath(url.pathname, countryValues);
    const singleCountrySlug = this.buildCountryUrlPart(countryValues);

    url.pathname = singleCountrySlug
      ? `${basePath === '/' ? '' : basePath}/${singleCountrySlug}`
      : basePath;

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
      const countryValue = countryValueByEntityId.get(String(city.country_id));

      return {
        ...city,
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

      if (this.clearCitiesOnCountryChange && !this.preserveSelectedCitiesOnNextLoad) {
        this.pruneSelectedCitiesByOptions(citiesWithCountries);
      }

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

  submit() {
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