export class UrlSync {
  static read({ seoCountryFilterKey = 'country' } = {}) {
    const params = new URLSearchParams(window.location.search);
    const result = {};

    for (const [rawKey, value] of params.entries()) {
      const key = this.normalizeReadKey(rawKey);
      const parsedValues = this.parseCsv(value);

      if (!parsedValues.length) {
        continue;
      }

      if (!result[key]) {
        result[key] = [];
      }

      result[key].push(...parsedValues);
    }

    const pathnameCountry = this.readCountryFromPath(window.location.pathname);

    if (pathnameCountry.length) {
      result[seoCountryFilterKey] = pathnameCountry;
    }

    return result;
  }

  static write(
    filters,
    { phpArrayStyle = false, seoCountryFilterKey = 'country' } = {}
  ) {
    const normalizedFilters = this.normalizeFilters(filters);
    const params = new URLSearchParams();

    const countryValues = Array.isArray(normalizedFilters[seoCountryFilterKey])
      ? normalizedFilters[seoCountryFilterKey]
      : [];

    if (countryValues.length > 1) {
      if (phpArrayStyle) {
        countryValues.forEach((value) => {
          params.append(`${seoCountryFilterKey}[]`, value);
        });
      } else {
        params.set(seoCountryFilterKey, countryValues.join(','));
      }
    }

    Object.entries(normalizedFilters).forEach(([key, values]) => {
      if (!Array.isArray(values) || values.length === 0) {
        return;
      }

      if (key === seoCountryFilterKey) {
        return;
      }

      if (phpArrayStyle) {
        values.forEach((value) => {
          params.append(`${key}[]`, value);
        });
      } else {
        params.set(key, values.join(','));
      }
    });

    const singleCountrySlug = this.getSingleCountrySlug(countryValues);
    const basePath = this.getBasePath(window.location.pathname, countryValues);
    const pathname = singleCountrySlug
      ? `${basePath === '/' ? '' : basePath}/${singleCountrySlug}`
      : basePath || '/';

    const query = params.toString();
    const newUrl = query ? `${pathname}?${query}` : pathname;

    window.history.replaceState({}, '', newUrl);
  }

  static normalizeReadKey(key = '') {
    return key.endsWith('[]') ? key.slice(0, -2) : key;
  }

  static normalizeFilters(filters = {}) {
    const result = {};

    Object.entries(filters || {}).forEach(([key, values]) => {
      if (!Array.isArray(values)) {
        return;
      }

      result[key] = values.map((value) => String(value).trim()).filter(Boolean);
    });

    return result;
  }

  static readCountryFromPath(pathname = '') {
    const normalizedPath = this.normalizePath(pathname);
    const segments = normalizedPath.split('/').filter(Boolean);

    if (segments.length < 2) {
      return [];
    }

    return [segments[segments.length - 1]];
  }

  static getSingleCountrySlug(countryValues = []) {
    if (!Array.isArray(countryValues) || countryValues.length !== 1) {
      return '';
    }

    return String(countryValues[0]).trim();
  }

  static getBasePath(currentPathname = '', countryValues = []) {
    const normalizedPath = this.normalizePath(currentPathname);

    if (!normalizedPath || normalizedPath === '/') {
      return '/';
    }

    const segments = normalizedPath.split('/').filter(Boolean);

    if (!segments.length) {
      return '/';
    }

    const currentPathCountrySlug = segments.length > 1
      ? segments[segments.length - 1]
      : '';

    const hasCountryInPath = currentPathCountrySlug.startsWith('robota-v-');

    if (hasCountryInPath) {
      return `/${segments.slice(0, -1).join('/')}` || '/';
    }

    return `/${segments.join('/')}`;
  }

  static normalizePath(pathname = '') {
    const normalized = String(pathname || '')
      .replace(/\/{2,}/g, '/')
      .replace(/\/+$/, '');

    return normalized || '/';
  }

  static parseCsv(value) {
    if (!value) {
      return [];
    }

    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
}