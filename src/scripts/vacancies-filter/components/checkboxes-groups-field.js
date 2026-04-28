import { BaseFilterComponent } from '../core/base-filter-component.js';

export class CheckboxesGroupsField extends BaseFilterComponent {
  constructor({
    containerElement = null,
    containerSelector,
    filterKey,
    inputSelector = '.checkbox__input[type="checkbox"]',
    groupSelector = '.checkboxes-groups__item',
    applySelector = '[data-apply-checkboxes-groups]',
    clearSelector = '[data-clear-checkboxes-groups]',
    countriesFilterKey = 'country',
    hiddenClass = 'hidden'
  }) {
    super(filterKey);

    this.container =
      containerElement instanceof Element
        ? containerElement
        : document.querySelector(containerSelector);

    if (!this.container) {
      throw new Error(`CheckboxesGroupsField container not found: ${containerSelector}`);
    }

    this.inputSelector = inputSelector;
    this.groupSelector = groupSelector;
    this.applySelector = applySelector;
    this.clearSelector = clearSelector;
    this.countriesFilterKey = countriesFilterKey;
    this.hiddenClass = hiddenClass;
    this.isCheckboxesGroupsField = true;

    this.inputsMap = new Map();
    this.groups = [];

    this.draftValues = new Set();
    this.appliedValues = new Set();

    this.handleChange = this.handleChange.bind(this);
    this.handleApply = this.handleApply.bind(this);
    this.handleClear = this.handleClear.bind(this);

    this.collectItems();

    this.applyButton = this.container.querySelector(this.applySelector);
    this.clearButton = this.container.querySelector(this.clearSelector);

    this.container.addEventListener('change', this.handleChange);

    if (this.applyButton) {
      this.applyButton.addEventListener('click', this.handleApply);
    }

    if (this.clearButton) {
      this.clearButton.addEventListener('click', this.handleClear);
    }
  }

  connectStore(store) {
    super.connectStore(store);

    this.countriesUnsubscribe = this.store.subscribe((state) => {
      this.updateGroupsVisibility(state);
    });

    this.updateGroupsVisibility(this.store.getState());
  }

  disconnectStore() {
    if (this.countriesUnsubscribe) {
      this.countriesUnsubscribe();
      this.countriesUnsubscribe = null;
    }

    super.disconnectStore();
  }

  collectItems() {
    this.inputsMap.clear();

    this.groups = [...this.container.querySelectorAll(this.groupSelector)];

    this.container.querySelectorAll(this.inputSelector).forEach((input) => {
      const label = this.container.querySelector(`label[for="${input.id}"]`);

      this.inputsMap.set(String(input.value), {
        input,
        label,
        value: String(input.value),
        countryValue: input.closest(this.groupSelector)?.dataset.countryValue || ''
      });
    });
  }

  handleChange(event) {
    const target = event.target;

    if (!target.matches(this.inputSelector)) {
      return;
    }

    const value = String(target.value);

    if (target.checked) {
      this.draftValues.add(value);
    } else {
      this.draftValues.delete(value);
    }
  }

  handleApply() {
    this.setSelected([...this.draftValues]);
  }

  handleClear(event) {
    event.preventDefault();

    this.draftValues.clear();

    this.inputsMap.forEach((item) => {
      item.input.checked = false;
    });

    this.clear();
  }

  resetDraftFromStore() {
    this.draftValues = new Set(this.getSelected());

    this.inputsMap.forEach((item, value) => {
      item.input.checked = this.draftValues.has(value);
    });
  }

  updateGroupsVisibility(state = {}) {
    const selectedCountries = state[this.countriesFilterKey] || new Set();
    const hasCountryFilter = selectedCountries.size > 0;

    this.groups.forEach((group) => {
      const countryValue = group.dataset.countryValue || '';

      const shouldShow =
        !hasCountryFilter ||
        !countryValue ||
        selectedCountries.has(countryValue);

      group.classList.toggle(this.hiddenClass, !shouldShow);
    });
  }

  syncSelected(selectedSet) {
    this.appliedValues = new Set([...selectedSet].map(String));
    this.draftValues = new Set(this.appliedValues);

    this.inputsMap.forEach((item, value) => {
      item.input.checked = this.appliedValues.has(value);
    });
  }

  toggleLocal(value) {
    const normalized = String(value);

    if (this.appliedValues.has(normalized)) {
      this.appliedValues.delete(normalized);
    } else {
      this.appliedValues.add(normalized);
    }

    this.syncSelected(this.appliedValues);
  }

  selectLocal(value) {
    this.appliedValues.add(String(value));
    this.syncSelected(this.appliedValues);
  }

  deselectLocal(value) {
    this.appliedValues.delete(String(value));
    this.syncSelected(this.appliedValues);
  }

  hasLocal(value) {
    return this.appliedValues.has(String(value));
  }

  getSelectedLocal() {
    return [...this.appliedValues];
  }

  getLabelLocal(value) {
    return this.inputsMap.get(String(value))?.label?.textContent?.trim() ?? String(value);
  }

  getSelectedItems() {
    const selected = new Set(this.getSelected());

    return [...this.inputsMap.values()].filter((item) => {
      return selected.has(item.value);
    });
  }

  getAllItems() {
    return [...this.inputsMap.values()];
  }

  destroy() {
    super.destroy();

    this.container.removeEventListener('change', this.handleChange);

    if (this.applyButton) {
      this.applyButton.removeEventListener('click', this.handleApply);
    }

    if (this.clearButton) {
      this.clearButton.removeEventListener('click', this.handleClear);
    }

    this.inputsMap.clear();
    this.groups = [];
  }
}