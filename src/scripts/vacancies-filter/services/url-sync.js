export class UrlSync {
  static read() {
    const params = new URLSearchParams(window.location.search);
    const result = {};

    for (const [key, value] of params.entries()) {
      result[key] = this.parseCsv(value);
    }

    return result;
  }

  static write(filters) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, values]) => {
      if (!Array.isArray(values) || values.length === 0) {
        return;
      }

      params.set(key, values.join(','));
    });

    const query = params.toString();
    const newUrl = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname;

    window.history.replaceState({}, '', newUrl);
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