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
    submitWithPhpArrayStyle = false,
    seoCountryFilterKey = 'country'
  }) {
    this.form = document.querySelector(formSelector);

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

    this.store = new FilterStore(initialState);
    this.dependencies = new FilterDependencies();
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
      }, 0);
    };

    this.form.addEventListener('submit', this.handleSubmit);
    this.form.addEventListener('reset', this.handleReset);

    this.resetButton = this.form.querySelector('[data-filter-reset]');

    if (this.resetButton) {
      this.handleResetButtonClick = (event) => {
        event.preventDefault();
        this.reset();
      };

      this.resetButton.addEventListener('click', this.handleResetButtonClick);
    }
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

  handleStateChange(state) {
    this.dependencies.apply(state, this.store);

    const serialized = this.serialize();

    this.syncTags(serialized);

    if (this.syncUrl) {
      UrlSync.write(serialized, {
        phpArrayStyle: this.submitWithPhpArrayStyle,
        seoCountryFilterKey: this.seoCountryFilterKey
      });
    }

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

    if (filterKey === 'cities') {
      this.setCityCountryMapping(options);
    }
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
    return this.store.resetAll();
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
  }
}