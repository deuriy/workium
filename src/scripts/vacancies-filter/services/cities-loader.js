export class CitiesLoader {
  constructor({
    endpoint = '/api/v1/cities',
    countryParam = 'country',
    arrayStyle = true,
    fetchOptions = {}
  } = {}) {
    this.endpoint = endpoint;
    this.countryParam = countryParam;
    this.arrayStyle = arrayStyle;
    this.fetchOptions = fetchOptions;
  }

  async load(params = {}, { signal } = {}) {
    const url = new URL(this.endpoint, window.location.origin);

    this.buildQuery(url.searchParams, params);

    console.log('Загружаем города с параметрами:', Object.fromEntries(url.searchParams.entries()));

    const response = await fetch(url.toString(), {
      ...this.fetchOptions,
      signal
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return response.json();
  }

  buildQuery(searchParams, params) {
    if (!params || typeof params !== 'object') {
      return;
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value == null) {
        return;
      }

      if (Array.isArray(value)) {
        const normalized = value
          .map((item) => String(item).trim())
          .filter(Boolean);

        if (!normalized.length) {
          return;
        }

        if (this.arrayStyle) {
          normalized.forEach((item) => {
            searchParams.append(`${key}[]`, item);
          });
        } else {
          searchParams.set(key, normalized.join(','));
        }

        return;
      }

      const normalized = String(value).trim();

      if (normalized) {
        searchParams.set(key, normalized);
      }
    });
  }
}