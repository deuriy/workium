export class FilterDependencies {
  constructor({
    citiesFilterKey = 'cities',
    countriesFilterKey = 'country',
    currencyConfig = null
  } = {}) {
    this.citiesFilterKey = citiesFilterKey;
    this.countriesFilterKey = countriesFilterKey;
    this.currencyConfig = currencyConfig;

    this.cityToCountry = new Map();
    this.isApplying = false;
    this.dependentVisibilityItems = [];
  }

  registerDependentVisibility({
    sourceFilterKey,
    targetElement,
    hiddenClass = 'hidden'
  } = {}) {
    if (!sourceFilterKey || !(targetElement instanceof Element)) {
      return;
    }

    this.dependentVisibilityItems.push({
      sourceFilterKey,
      targetElement,
      hiddenClass
    });
  }

  applyCurrencyDependency(state, store) {
    if (!this.currencyConfig) {
      return;
    }

    const {
      filterKey = 'currency',
      countriesFilterKey = this.countriesFilterKey,
      defaultValue = 'EUR',
      countryCurrencyMap = {}
    } = this.currencyConfig;

    const selectedCountries = state[countriesFilterKey] || new Set();
    const selectedCurrencies = state[filterKey] || new Set();

    const currentCurrency = [...selectedCurrencies][0] || '';
    const currencyComponent = this.components?.[filterKey];

    if (currencyComponent?.isManuallySelected) {
      return;
    }

    let nextCurrency = defaultValue;

    if (selectedCountries.size === 1) {
      const countryValue = [...selectedCountries][0];
      nextCurrency = countryCurrencyMap[countryValue] || defaultValue;
    }

    if (currentCurrency === nextCurrency) {
      return;
    }

    store.setFilter(filterKey, [nextCurrency]);
  }

  applyDependentVisibility(state = {}) {
    this.dependentVisibilityItems.forEach((item) => {
      const selectedValues = state[item.sourceFilterKey] || new Set();
      const shouldShow = selectedValues.size > 0;

      item.targetElement.classList.toggle(item.hiddenClass, !shouldShow);
    });
  }

  setCityCountryMapping(cities = [], { reset = false } = {}) {
    if (reset) {
      this.cityToCountry.clear();
    }

    cities.forEach((city) => {
      const cityId = city?.id;

      const countryValue =
        city?.country_value ||
        city?.countryValue ||
        city?.country_slug ||
        city?.countrySlug;

      if (!cityId || !countryValue) {
        return;
      }

      this.cityToCountry.set(String(cityId), String(countryValue));
    });
  }

  apply(state, store, {
    syncCountriesWithCities = false,
    components = {}
  } = {}) {
    if (this.isApplying) {
      return;
    }

    this.isApplying = true;

    this.components = components;
    this.applyCurrencyDependency(state, store);

    try {
      if (syncCountriesWithCities) {
        this.syncCountriesWithCities(state, store);
      }

      this.applyDependentVisibility(state);
    } finally {
      this.isApplying = false;
    }
  }

  syncCountriesWithCities(state, store) {
    const selectedCities = state[this.citiesFilterKey] || new Set();
    const selectedCountries = state[this.countriesFilterKey] || new Set();

    if (!selectedCities.size) {
      return false;
    }

    const nextCountries = new Set(selectedCountries);
    let changed = false;

    selectedCities.forEach((cityId) => {
      const countryValue = this.cityToCountry.get(String(cityId));

      if (!countryValue) {
        return;
      }

      if (!nextCountries.has(countryValue)) {
        nextCountries.add(countryValue);
        changed = true;
      }
    });

    if (!changed) {
      return false;
    }

    return store.setFilter(this.countriesFilterKey, [...nextCountries]);
  }

  // pruneCitiesByCountries(state, store) {
  //   const selectedCities = state[this.citiesFilterKey] || new Set();
  //   const selectedCountries = state[this.countriesFilterKey] || new Set();

  //   if (!selectedCities.size) {
  //     return false;
  //   }

  //   if (!selectedCountries.size) {
  //     return store.clearFilter(this.citiesFilterKey);
  //   }

  //   const nextCities = [];
  //   let changed = false;

  //   selectedCities.forEach((cityId) => {
  //     const normalizedCityId = String(cityId);
  //     const countryValue = this.cityToCountry.get(normalizedCityId);

  //     if (countryValue && !selectedCountries.has(countryValue)) {
  //       changed = true;
  //       return;
  //     }

  //     nextCities.push(normalizedCityId);
  //   });

  //   if (!changed) {
  //     return false;
  //   }

  //   return store.setFilter(this.citiesFilterKey, nextCities);
  // }

  pruneCitiesByRemovedCountries(state, store, removedCountries = []) {
    const selectedCities = state[this.citiesFilterKey] || new Set();

    if (!selectedCities.size || !removedCountries.length) {
      return false;
    }

    const removedCountriesSet = new Set(
      removedCountries.map((value) => String(value))
    );

    const nextCities = [];
    let changed = false;

    selectedCities.forEach((cityId) => {
      const normalizedCityId = String(cityId);
      const countryValue = this.cityToCountry.get(normalizedCityId);

      if (countryValue && removedCountriesSet.has(countryValue)) {
        changed = true;
        return;
      }

      nextCities.push(normalizedCityId);
    });

    if (!changed) {
      return false;
    }

    return store.setFilter(this.citiesFilterKey, nextCities);
  }
}