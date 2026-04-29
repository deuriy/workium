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
    searchParam: 'term',
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
      typingIdleDelay: 500
    },
    {
      enabled: true,
      type: 'cities-filter-search',
      rootSelector: '#cities-popup',
      inputSelector: '.cities-filter__search-input',
      clearButtonSelector: '.cities-filter__clear-search-btn',
      clearCitiesSelector: '[data-clear-cities]',
      applyButtonSelector: '[data-apply-cities]',
      hiddenClass: 'hidden',
      citiesFilterKey: 'cities',
      otherCountriesTitle: window.translations?.filter?.other_countries || 'В інших країнах'
    },
    {
      enabled: true,
      type: 'result-field',
      mode: 'auto',
      selector: '[data-result-field]',
      filterKeyFrom: 'data-result-field'
    },
    {
      enabled: true,
      type: 'vacancies-count',
      endpoint: '/api/v1/vacancies-count',
      debounceDelay: 350
    }
  ],

  components: [
    {
      type: 'checkbox-group',
      mode: 'auto',
      selector: '.checkboxes-group:not(.checkboxes-group--cities):not(.checkboxes-tabs--radius):not([data-radio-filter]):not(.checkboxes-group--filter-element-popup)',
      keyFrom: 'data-filter-key'
    },

    {
      type: 'radio-group',
      mode: 'auto',
      selector: '.checkboxes-group[data-radio-filter]',
      keyFrom: 'data-filter-key',
      props: {
        defaultValue: 'all',
        excludeValuesFromTags: ['all']
      }
    },

    {
      type: 'radius-field',
      key: 'radius',
      containerSelector: '.radius-field'
    },

    {
      type: 'calendar-field',
      mode: 'auto',
      selector: '.js-calendar',
      keyFrom: 'data-filter-key'
    },

    {
      type: 'currency-field',
      key: 'currency',
      containerSelector: '.radiobtns-group--currencies',
      props: {
        defaultValue: 'EUR'
      }
    },

    {
      type: 'range-slider-field',
      mode: 'auto',
      selector: '.filter-element--range[data-filter-key]',
      keyFrom: 'data-filter-key',
      props: {
        currencyFilterKey: 'currency',
        converterEndpoint: 'https://filter.workium.uno/api/v1/currency-converter'
      }
    },

    {
      type: 'checkboxes-groups-field',
      mode: 'auto',
      selector: '[data-checkboxes-groups-field]',
      keyFrom: 'data-checkboxes-groups-field',
      props: {
        countriesFilterKey: 'country',
        hiddenClass: 'hidden'
      }
    },

    {
      type: 'text-search-field',
      mode: 'auto',
      selector: '[data-search-input]',
      keyFrom: 'data-filter-key',
    },

    {
      type: 'cities-checkboxes',
      key: 'cities',
      containerSelector: '.checkboxes-group--cities .checkboxes-group__list'
    }
  ],

  currency: {
    filterKey: 'currency',
    countriesFilterKey: 'country',
    defaultValue: 'EUR',

    countryCurrencyMap: {
      'robota-v-polshi': 'PLN',
      'robota-v-chehiyi': 'CZK',
      'robota-v-ukraine': 'UAH',
      'robota-v-usa': 'USD',
      'robota-v-moldovi': 'MDL',
    }
  }
};