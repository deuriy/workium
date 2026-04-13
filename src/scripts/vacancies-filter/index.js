import { FilterController } from './core/filter-controller.js';
import { ComponentFactory } from './core/component-factory.js';
import { filterConfig } from './filter.config.js';

export function initVacanciesFilter() {
  const factory = new ComponentFactory();

  const { components, filterTags, uiPlugins } = factory.build(filterConfig);

  const filterController = new FilterController({
    formSelector: filterConfig.formSelector,
    components,
    filterTags,
    uiPlugins,
    syncUrl: filterConfig.syncUrl,
    restoreFromUrl: filterConfig.restoreFromUrl,

    onChange(filters, state) {
      console.log('Changed:', filters, state);
    },

    onSubmit(filters, state) {
      console.log('Submit:', filters, state);
    }
  });

  return filterController;
}