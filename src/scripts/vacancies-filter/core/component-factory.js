import { CheckboxTagsGroup } from '../components/checkbox-tags-group.js';
import { CitiesCheckboxes } from '../components/cities-checkboxes.js';
import { FilterTags } from '../components/filter-tags.js';

export class ComponentFactory {
  constructor({ registry = {} } = {}) {
    this.registry = {
      'checkbox-group': CheckboxTagsGroup,
      'cities-checkboxes': CitiesCheckboxes,
      'filter-tags': FilterTags,
      ...registry
    };
  }

  build(config = {}) {
    const components = this.buildComponents(config.components || []);
    const filterTags = this.buildTags(config.tags);

    return {
      components,
      filterTags
    };
  }

  buildComponents(componentConfigs = []) {
    const components = {};

    componentConfigs.forEach((componentConfig) => {
      const instances = this.buildComponentEntry(componentConfig);

      Object.entries(instances).forEach(([key, instance]) => {
        if (components[key]) {
          throw new Error(
            `ComponentFactory: duplicate component key "${key}"`
          );
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

      result[key] = instance;
    });

    return result;
  }

  buildTags(tagsConfig) {
    if (!tagsConfig || tagsConfig.enabled === false) {
      return null;
    }

    const type = tagsConfig.type || 'filter-tags';
    const ComponentClass = this.registry[type];

    if (!ComponentClass) {
      throw new Error(`ComponentFactory: unknown tags type "${type}"`);
    }

    const props = { ...tagsConfig };
    delete props.enabled;
    delete props.type;

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
}