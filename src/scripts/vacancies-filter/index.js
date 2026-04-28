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
    currency: filterConfig.currency,

    citiesLoader,
    citiesFilterKey: filterConfig.cities?.filterKey || 'cities',
    citiesRequestCountryFilterKey:
      filterConfig.cities?.requestCountryFilterKey || 'country',
    citiesRequestParam: filterConfig.cities?.requestParam || 'country_ids',
    citiesSearchParam: filterConfig.cities?.searchParam || 'term',
    clearCitiesOnCountryChange:
      filterConfig.cities?.clearOnCountryChange ?? true,
    
    autoSyncCountriesWithCities: false,

    onChange(filters, state) {
      console.log('Changed:', filters, state);
    },

    onSubmit(filters, state) {
      console.log('Submit:', filters, state);
    }
  });

  window.vacanciesFilter = filterController;

  bindFancyboxDrafts(uiPlugins, filterController);

  return filterController;
}

function bindFancyboxDrafts(uiPlugins = [], filterController = null) {
  if (!window.Fancybox?.bind) {
    return;
  }

  const citiesPopupPlugin = uiPlugins.find((plugin) => {
    return plugin.constructor.name === 'CitiesFilterSearch';
  });

  if (citiesPopupPlugin) {
    window.Fancybox.bind('[data-src="#cities-popup"]', {
      dragToClose: false,

      on: {
        ready() {
          citiesPopupPlugin.rememberCitiesSnapshot();
        },

        close() {
          citiesPopupPlugin.restoreCitiesSnapshotIfNeeded();
          citiesPopupPlugin.resetUiState();
        }
      }
    });
  }

  const currencyComponent = filterController?.getComponent?.('currency');

  if (currencyComponent) {
    window.Fancybox.bind('[data-src="#currencies-popup"]', {
      dragToClose: false,
      
      on: {
        ready() {
          console.log('Ready!');
          currencyComponent.resetDraftFromStore?.();
        },

        reveal() {
          console.log('reveal!');
          currencyComponent.resetDraftFromStore?.();
        },

        close() {
          console.log('close!');
          currencyComponent.resetDraftFromStore?.();
        }
      }
    });
  }

  const checkboxesGroupsComponents = Object.values(filterController.components)
  .filter((component) => component.isCheckboxesGroupsField);

  checkboxesGroupsComponents.forEach((component) => {
    if (!component.container?.id) {
      return;
    }

    window.Fancybox.bind(`[data-src="#${component.container.id}"]`, {
      on: {
        ready() {
          component.resetDraftFromStore();
        },

        reveal() {
          component.resetDraftFromStore();
        },

        close() {
          component.resetDraftFromStore();
        }
      }
    });
  });
}