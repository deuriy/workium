import { FilterStore } from "./filter_store";
import { UrlSync } from "./url_sync";

export class FilterController {
  constructor({ formSelector, components = {} }) {
    this.form = document.querySelector(formSelector);
    if (!this.form) {
      throw new Error(`Form not found: ${formSelector}`);
    }

    this.store = new FilterStore();
    this.components = components;

    Object.values(this.components).forEach(component => {
      component.connectStore(this.store);
    });

    this.store.subscribe((state) => {
      this.handleStateChange(state);
    });

    this.bindEvents();
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submit();
    });

    this.form.addEventListener('reset', () => {
      setTimeout(() => {
        this.reset();
      }, 0);
    });

    const resetButton = this.form.querySelector('[data-filter-reset]');
    if (resetButton) {
      resetButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.reset();
      });
    }
  }

  handleStateChange() {
    UrlSync.write(this.store.serialize());
  }

  setOptions(filterKey, options) {
    const component = this.components[filterKey];
    if (!component) return;

    component.setOptions(options);
  }

  setSelected(filterKey, values) {
    this.store.setFilter(filterKey, values);
  }

  getSelected(filterKey) {
    return [...this.store.getFilter(filterKey)];
  }

  getSelectedItems(filterKey) {
    const component = this.components[filterKey];
    if (!component) return [];

    return component.getSelectedItems();
  }

  getAllFilters() {
    return this.store.serialize();
  }

  restoreFromUrl() {
    const filters = UrlSync.read();

    Object.entries(filters).forEach(([key, values]) => {
      this.store.setFilter(key, values);
    });
  }

  reset() {
    this.store.resetAll();
  }

  submit() {
    const filters = this.getAllFilters();

    console.log('Submit filters:', filters);

    // сюда можно вставить:
    // - API request
    // - обновление вакансий
    // - updateFilterUrl()
    // - turbo/inertia/livewire/ajax fetch
  }

  buildQueryString({ phpArrayStyle = false } = {}) {
    const filters = this.getAllFilters();
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, values]) => {
      if (!Array.isArray(values) || !values.length) return;

      if (phpArrayStyle) {
        values.forEach(value => {
          params.append(`${key}[]`, value);
        });
      } else {
        params.set(key, values.join(','));
      }
    });

    return params.toString();
  }
}