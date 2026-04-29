import { CheckboxTagsGroup } from '../components/checkbox-tags-group.js';
import { CitiesCheckboxes } from '../components/cities-checkboxes.js';
import { FilterTags } from '../components/filter-tags.js';
import { AdditionalFiltersSearch } from '../components/additional-filters-search.js';
import { CitiesFilterSearch } from '../components/cities-filter-search.js';
import { ResultField } from '../components/result-field.js';
import { RadiusField } from '../components/radius-field.js';
import { CalendarField } from '../components/calendar-field.js';
import { CurrencyField } from '../components/currency-field.js';
import { RadioTagsGroup } from '../components/radio-tags-group.js';
import { RangeSliderField } from '../components/range-slider-field.js';
import { CheckboxesGroupsField } from '../components/checkboxes-groups-field.js';
import { TextSearchField } from '../components/text-search-field.js';
import { VacanciesCount } from '../components/vacancies-count.js';

export class ComponentFactory {
  constructor({ registry = {}, uiRegistry = {} } = {}) {
    this.registry = {
      'checkbox-group': CheckboxTagsGroup,
      'cities-checkboxes': CitiesCheckboxes,
      'radius-field': RadiusField,
      'calendar-field': CalendarField,
      'currency-field': CurrencyField,
      'radio-group': RadioTagsGroup,
      'range-slider-field': RangeSliderField,
      'checkboxes-groups-field': CheckboxesGroupsField,
      'text-search-field': TextSearchField,
      'filter-tags': FilterTags,
      ...registry
    };

    this.uiRegistry = {
      'additional-filters-search': AdditionalFiltersSearch,
      'cities-filter-search': CitiesFilterSearch,
      'vacancies-count': VacanciesCount,
      'result-field': ResultField,
      ...uiRegistry
    };
  }

  build(config = {}) {
    const components = this.buildComponents(config.components || []);
    const filterTags = this.buildTags(config.tags);
    const uiPlugins = this.buildUi(config.ui || []);

    return {
      components,
      filterTags,
      uiPlugins
    };
  }

  buildComponents(componentConfigs = []) {
    const components = {};

    componentConfigs.forEach((componentConfig) => {
      const instances = this.buildComponentEntry(componentConfig);

      Object.entries(instances).forEach(([key, instance]) => {
        if (components[key]) {
          throw new Error(`ComponentFactory: duplicate component key "${key}"`);
        }

        components[key] = instance;
      });
    });

    return components;
  }

  buildComponentEntry(config) {
    if (!config?.type) {
      throw new Error('ComponentFactory: component config requires "type"');
    }

    if (config.mode === 'auto') {
      return this.buildAutoComponents(config);
    }

    const instance = this.createInstance(config);

    if (!config.key) {
      throw new Error(
        `ComponentFactory: component of type "${config.type}" requires "key"`
      );
    }

    return {
      [config.key]: instance
    };
  }

  buildAutoComponents(config) {
    if (!config.selector) {
      throw new Error(
        `ComponentFactory: auto component "${config.type}" requires "selector"`
      );
    }

    const elements = document.querySelectorAll(config.selector);
    const result = {};

    elements.forEach((element) => {
      const key = this.resolveKey(element, config);

      if (!key) {
        throw new Error(
          `ComponentFactory: failed to resolve component key for type "${config.type}"`
        );
      }

      const instance = this.createInstance({
        ...config,
        key,
        element
      });

      if (result[key]) {
        throw new Error(
          `ComponentFactory: duplicate auto component key "${key}" for type "${config.type}"`
        );
      }

      result[key] = instance;
    });

    return result;
  }

  buildTags(tagsConfig) {
    if (!tagsConfig) {
      return [];
    }

    const normalizedConfigs = Array.isArray(tagsConfig) ? tagsConfig : [tagsConfig];

    return normalizedConfigs
      .filter(Boolean)
      .filter((config) => config.enabled !== false)
      .flatMap((config, index) => this.buildTagsEntry(config, index));
  }

  buildTagsEntry(config, index = 0) {
    if (!config?.type && !config?.rootSelector && !config?.selector) {
      throw new Error(
        `ComponentFactory: tags config at index ${index} is invalid`
      );
    }

    if (config.mode === 'auto') {
      return this.buildAutoTags(config, index);
    }

    return [this.createTagsInstance(config, index)];
  }

  buildAutoTags(config, index = 0) {
    const selector = config.selector || config.rootSelector;

    if (!selector) {
      throw new Error(
        `ComponentFactory: auto tags config at index ${index} requires "selector" or "rootSelector"`
      );
    }

    const elements = document.querySelectorAll(selector);

    return Array.from(elements).map((element, elementIndex) => {
      return this.createTagsInstance(
        {
          ...config,
          rootElement: element
        },
        `${index}.${elementIndex}`
      );
    });
  }

  createTagsInstance(tagsConfig, index = 0) {
    const type = tagsConfig.type || 'filter-tags';
    const ComponentClass = this.registry[type];

    if (!ComponentClass) {
      throw new Error(`ComponentFactory: unknown tags type "${type}"`);
    }

    const props = { ...tagsConfig };

    delete props.enabled;
    delete props.type;
    delete props.mode;
    delete props.selector;

    if (!props.rootSelector && !props.rootElement) {
      throw new Error(
        `ComponentFactory: tags config at index ${index} requires "rootSelector" or "rootElement"`
      );
    }

    return new ComponentClass(props);
  }

  buildUi(uiConfigs = []) {
    if (!uiConfigs) {
      return [];
    }

    const normalizedConfigs = Array.isArray(uiConfigs) ? uiConfigs : [uiConfigs];

    return normalizedConfigs
      .filter(Boolean)
      .filter((config) => config.enabled !== false)
      .flatMap((config, index) => this.buildUiEntry(config, index));
  }

  buildUiEntry(config, index = 0) {
    if (!config?.type) {
      throw new Error(`ComponentFactory: ui config at index ${index} requires "type"`);
    }

    if (config.mode === 'auto') {
      return this.buildAutoUi(config, index);
    }

    return [this.createUiInstance(config, index)];
  }

  buildAutoUi(config, index = 0) {
    const selector = config.selector || config.rootSelector;

    if (!selector) {
      throw new Error(
        `ComponentFactory: auto ui config at index ${index} requires "selector" or "rootSelector"`
      );
    }

    const elements = document.querySelectorAll(selector);

    return Array.from(elements).map((element, elementIndex) => {
      return this.createUiInstance(
        {
          ...config,
          rootElement: element
        },
        `${index}.${elementIndex}`
      );
    });
  }

  createUiInstance(config, index = 0) {
    const ComponentClass = this.uiRegistry[config.type];

    if (!ComponentClass) {
      throw new Error(`ComponentFactory: unknown ui type "${config.type}"`);
    }

    const props = { ...config };

    delete props.enabled;
    delete props.type;
    delete props.mode;
    delete props.selector;

    const requiresRoot = ComponentClass.requiresRoot !== false;

    if (requiresRoot && !props.rootSelector && !props.rootElement) {
      throw new Error(
        `ComponentFactory: ui config at index ${index} requires "rootSelector" or "rootElement"`
      );
    }

    if (!props.filterKey && props.rootElement && config.filterKeyFrom) {
      props.filterKey = this.resolveKey(props.rootElement, {
        keyFrom: config.filterKeyFrom
      });
    }

    return new ComponentClass(props);
  }

  createInstance(config) {
    const ComponentClass = this.registry[config.type];

    if (!ComponentClass) {
      throw new Error(`ComponentFactory: unknown component type "${config.type}"`);
    }

    const props = this.resolveProps(config);

    return new ComponentClass(props);
  }

  resolveProps(config) {
    const props = { ...(config.props || {}) };

    if (config.key) {
      props.filterKey = config.key;
    }

    if (config.containerSelector) {
      props.containerSelector = config.containerSelector;
    }

    if (config.checkboxSelector) {
      props.checkboxSelector = config.checkboxSelector;
    }

    if (config.mapItem) {
      props.mapItem = config.mapItem;
    }

    if (config.element) {
      props.rootElement = config.element;
      props.containerElement = config.element;
      props.containerSelector = this.getElementSelector(config.element, config);
    }

    return props;
  }

  resolveKey(element, config) {
    if (typeof config.getKey === 'function') {
      return config.getKey(element);
    }

    if (!config.keyFrom) {
      return null;
    }

    if (config.keyFrom.startsWith('data-')) {
      const attrName = config.keyFrom.slice(5);
      return element.dataset[this.toCamelCase(attrName)] || null;
    }

    return element.getAttribute(config.keyFrom);
  }

  getElementSelector(element, config) {
    if (typeof config.getContainerSelector === 'function') {
      return config.getContainerSelector(element);
    }

    if (element.id) {
      return `#${element.id}`;
    }

    if (element.classList.length > 0) {
      return `.${[...element.classList].join('.')}`;
    }

    throw new Error(
      `ComponentFactory: cannot build selector for "${config.type}". Add id/class or provide getContainerSelector().`
    );
  }

  toCamelCase(value) {
    return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  register(type, ComponentClass) {
    if (!type) {
      throw new Error('ComponentFactory.register(type, ComponentClass): type is required');
    }

    this.registry[type] = ComponentClass;
  }

  registerUi(type, ComponentClass) {
    if (!type) {
      throw new Error('ComponentFactory.registerUi(type, ComponentClass): type is required');
    }

    this.uiRegistry[type] = ComponentClass;
  }
}