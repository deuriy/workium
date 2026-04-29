export class FilterTagsBuilder {
  constructor(components = {}) {
    this.components = components;
  }

  build(filters = {}) {
    const tags = [];

    Object.entries(filters).forEach(([filterKey, values]) => {
      if (!Array.isArray(values) || values.length === 0) {
        return;
      }

      const component = this.components[filterKey];

      if (component?.excludeFromTags) {
        return;
      }

      if (
        component?.isReadyForTags &&
        !component.isReadyForTags()
      ) {
        return;
      }

      values.forEach((value) => {
        if (component?.shouldExcludeValueFromTags?.(value)) {
          return;
        }
        
        const label = component?.getLabel?.(value) ?? value;

        tags.push({
          filterKey,
          value: String(value),
          label: String(label)
        });
      });
    });

    tags.sort((a, b) => {
      const componentA = this.components[a.filterKey];
      const componentB = this.components[b.filterKey];

      const priorityA = componentA?.tagPriority ?? 0;
      const priorityB = componentB?.tagPriority ?? 0;

      return priorityA - priorityB;
    });

    return tags;
  }
}