export class FilterDependencies {
  constructor({
    citiesFilterKey = 'cities',
    countriesFilterKey = 'country'
  } = {}) {
    this.citiesFilterKey = citiesFilterKey;
    this.countriesFilterKey = countriesFilterKey;

    this.cityToCountry = new Map();
    this.isApplying = false;
  }

  setCityCountryMapping(cities = []) {
    this.cityToCountry.clear();

    cities.forEach((city) => {
      const cityId = city?.id;
      const countryValue =
        city?.country_value ||
        city?.country_slug ||
        city?.country_id;

      if (!cityId || !countryValue) {
        return;
      }

      this.cityToCountry.set(String(cityId), String(countryValue));
    });
  }

  apply(state, store, { syncCountriesWithCities = false } = {}) {
    if (this.isApplying) {
      return;
    }

    this.isApplying = true;

    try {
      if (syncCountriesWithCities) {
        this.syncCountriesWithCities(state, store);
      }
    } finally {
      this.isApplying = false;
    }
  }

  syncCountriesWithCities(state, store) {
    const selectedCities = state[this.citiesFilterKey] || new Set();
    const selectedCountries = state[this.countriesFilterKey] || new Set();

    if (!selectedCities.size) {
      return;
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

    if (changed) {
      store.setFilter(this.countriesFilterKey, [...nextCountries]);
    }
  }
}