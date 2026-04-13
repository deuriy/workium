console.log(window.translations?.filter?.more);

export const filterConfig = {
  formSelector: 'form[name="vacancies_filter"]',
  syncUrl: true,
  restoreFromUrl: true,

  tags: {
    enabled: true,
    type: 'filter-tags',
    mode: 'auto',
    selector: '.filter-tags',

    maxVisibleItems: {
      mobile: 7,
      desktop: 11,
      breakpoint: 768
    },

    texts: {
      more: window.translations?.filter?.more || 'More',
      hide: window.translations?.filter?.hide || 'Hide'
    }
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