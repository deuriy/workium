export class FilterDependencies {
  constructor() {
    this.cityToCountry = new Map();
    this.isApplying = false;
  }

  setCityCountryMapping(cities = []) {
    this.cityToCountry.clear();

    cities.forEach((city) => {
      if (!city?.id || !city?.country_id) {
        return;
      }

      this.cityToCountry.set(String(city.id), String(city.country_id));
    });
  }

  apply(state, store) {
    if (this.isApplying) {
      return;
    }

    this.isApplying = true;

    try {
      this.syncCountriesWithCities(state, store);
    } finally {
      this.isApplying = false;
    }
  }

  syncCountriesWithCities(state, store) {
    const selectedCities = state.cities || new Set();
    const selectedCountries = state.countries || new Set();

    if (!selectedCities.size) {
      return;
    }

    const nextCountries = new Set(selectedCountries);
    let changed = false;

    selectedCities.forEach((cityId) => {
      const countryId = this.cityToCountry.get(String(cityId));

      if (!countryId) {
        return;
      }

      if (!nextCountries.has(countryId)) {
        nextCountries.add(countryId);
        changed = true;
      }
    });

    if (changed) {
      store.setFilter('countries', [...nextCountries]);
    }
  }
}