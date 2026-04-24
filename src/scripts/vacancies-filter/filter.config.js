export const filterConfig = {
  formSelector: 'form[name="vacancies_filter"]',
  syncUrl: false,
  restoreFromUrl: true,

  submitWithPhpArrayStyle: true,
  seoCountryFilterKey: 'country',

  cities: {
    endpoint: '/api/v1/cities',
    filterKey: 'cities',
    requestCountryFilterKey: 'country',
    requestParam: 'country_ids',
    arrayStyle: true,
    clearOnCountryChange: true
  },

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

  ui: [
    {
      enabled: true,
      type: 'additional-filters-search',
      mode: 'auto',
      selector: '.additional-filters',

      inputSelector: 'input[name="search_filter"]',
      clearButtonSelector: '.additional-filters__clear-search-btn',
      cancelButtonSelector: '.additional-filters__cancel-search-link',
      bodySelector: '.additional-filters__body',
      headerSelector: '.additional-filters__header',
      notFoundSelector: '.additional-filters__not-found',

      hiddenClass: 'hidden',
      headerStickyClass: 'additional-filters__header--sticky',
      headerExtendedClass: 'additional-filters__header--search-extended',
      highlightClass: 'checkbox--highlighted',
      highlightAnimationClass: 'checkbox--highlighted-animation',
      typingIdleDelay: 500,
      zoomPlayerId: 'zoom-search-player'
    }
  ],

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