import { FilterController } from './core/filter-controller.js';
import { ComponentFactory } from './core/component-factory.js';
import { CitiesLoader } from './services/cities-loader.js';
import { filterConfig } from './filter.config.js';

export function initVacanciesFilter() {
  const factory = new ComponentFactory();

  const { components, filterTags, uiPlugins } = factory.build(filterConfig);

  const citiesLoader = filterConfig.cities
    ? new CitiesLoader({
        endpoint: filterConfig.cities.endpoint,
        countryParam: filterConfig.cities.requestParam,
        arrayStyle: filterConfig.cities.arrayStyle
      })
    : null;

  const filterController = new FilterController({
    formSelector: filterConfig.formSelector,
    components,
    filterTags,
    uiPlugins,
    syncUrl: filterConfig.syncUrl,
    restoreFromUrl: filterConfig.restoreFromUrl,
    submitWithPhpArrayStyle: filterConfig.submitWithPhpArrayStyle,
    seoCountryFilterKey: filterConfig.seoCountryFilterKey,

    citiesLoader,
    citiesFilterKey: filterConfig.cities?.filterKey || 'cities',
    citiesRequestCountryFilterKey:
      filterConfig.cities?.requestCountryFilterKey || 'countries',
    citiesRequestParam: filterConfig.cities?.requestParam || 'country',
    clearCitiesOnCountryChange:
      filterConfig.cities?.clearOnCountryChange ?? true,

    onChange(filters, state) {
      console.log('Changed:', filters, state);
    },

    onSubmit(filters, state) {
      console.log('Submit:', filters, state);
    }
  });

  window.vacanciesFilter = filterController;

  return filterController;
}