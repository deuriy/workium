export const filterConfig = {
  formSelector: 'form[name="vacancies_filter"]',
  syncUrl: true,
  restoreFromUrl: true,

  tags: {
    enabled: true,
    type: 'filter-tags',
    rootSelector: '.filter-tags',
    maxVisibleItems: 4
  },

  components: [
    {
      type: 'checkbox-group',
      mode: 'auto',
      selector: '.checkboxes-group:not(.checkboxes-group--cities)',
      keyFrom: 'data-filter-key'
    },

    {
      type: 'cities-checkboxes',
      key: 'cities',
      containerSelector: '.checkboxes-group--cities .checkboxes-group__list'
    }
  ]
};