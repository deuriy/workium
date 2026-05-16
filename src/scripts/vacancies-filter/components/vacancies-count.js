export class VacanciesCount {
  static requiresRoot = false;
  
  constructor({
    endpoint = '/api/v1/vacancies-count',
    buttonSelector = '[data-vacancies-count-button]',
    textSelector = '[data-vacancies-count-text]',
    baseTextAttribute = 'vacanciesCountBaseText',
    debounceDelay = 350,
    loadingClass = 'btn-default--filter-loading'
  } = {}) {
    this.endpoint = endpoint;
    this.buttonSelector = buttonSelector;
    this.textSelector = textSelector;
    this.baseTextAttribute = baseTextAttribute;
    this.debounceDelay = debounceDelay;
    this.loadingClass = loadingClass;

    this.controller = null;
    this.unsubscribe = null;
    this.timeout = null;
    this.abortController = null;
    this.lastRequestKey = '';
    this.lastResponse = null;
    this.pendingRequestKey = '';
    this.pendingRequest = null;

    this.buttons = [];
    this.loadingTimeout = null;
    this.loadingDelay = 120; // ms
  }

  init() {
    this.buttons = [...document.querySelectorAll(this.buttonSelector)].map((button) => {
      const textNode = button.querySelector(this.textSelector);

      return {
        button,
        textNode,
        mode: button.dataset.vacanciesCountMode || 'apply',
        baseText:
          button.dataset[this.baseTextAttribute] ||
          textNode?.textContent?.trim() ||
          button.textContent?.trim() ||
          '',
        emptyText: button.dataset.vacanciesCountEmptyText || ''
      };
    });

    console.log('this.buttons');
    console.log(this.buttons);

    this.unsubscribe = this.controller?.store?.subscribe?.(() => {
      this.scheduleUpdate();
    });

    this.scheduleUpdate({ immediate: true });
  }

  scheduleUpdate({ immediate = false, overrides = null, options = {} } = {}) {
    clearTimeout(this.timeout);

    if (immediate) {
      this.update(overrides, options);
      return;
    }

    this.timeout = window.setTimeout(() => {
      this.update(overrides, options);
    }, this.debounceDelay);
  }

  updateWithOverrides(overrides = {}, options = {}) {
    this.scheduleUpdate({
      immediate: true,
      overrides,
      options
    });
  }

  async update(overrides = null, options = {}) {
    const query = this.controller?.buildQueryString?.({
      phpArrayStyle: this.controller.submitWithPhpArrayStyle,
      overrides,
      includeSingleSeoCountry: true
    }) || '';

    const requestKey = query;

    if (requestKey === this.lastRequestKey) {
      if (this.lastResponse) {
        this.render(this.lastResponse.label, this.lastResponse.count, options);
        return;
      }

      if (this.pendingRequestKey === requestKey && this.pendingRequest) {
        this.setLoading(true, options);

        try {
          await this.pendingRequest;

          if (this.lastResponse) {
            this.render(this.lastResponse.label, this.lastResponse.count, options);
          }
        } catch {
          // The original request handler owns error reporting for this request.
        } finally {
          this.setLoading(false, options);
        }
      }

      return;
    }

    this.lastRequestKey = requestKey;
    this.lastResponse = null;

    if (this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();

    this.setLoading(true, options);

    try {
      const url = query
        ? `${this.endpoint}?${query}`
        : this.endpoint;

      this.pendingRequestKey = requestKey;
      this.pendingRequest = fetch(url, {
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        signal: this.abortController.signal
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Vacancies count HTTP error: ${response.status}`);
          }

          return response.json();
        })
        .then((data) => {
          const label =
            data.label ||
            data.text ||
            data.count_text ||
            data.vacancies_label ||
            '';

          const count =
            typeof data.count === 'number'
              ? data.count
              : typeof data.total === 'number'
                ? data.total
                : null;

          const result = {
            label,
            count
          };

          if (this.pendingRequestKey === requestKey) {
            this.lastResponse = result;
          }

          return result;
        });

      const { label, count } = await this.pendingRequest;

      this.render(label, count, options);
    } catch (error) {
      if (error?.name === 'AbortError') {
        return;
      }

      if (this.pendingRequestKey === requestKey) {
        this.lastRequestKey = '';
      }

      console.error('VacanciesCount failed:', error);
    } finally {
      if (this.pendingRequestKey === requestKey) {
        this.pendingRequestKey = '';
        this.pendingRequest = null;
      }

      this.setLoading(false, options);
    }
  }

  render(countLabel = '', count = null, options = {}) {
    const targetButtons = options.button
      ? this.buttons.filter(({ button }) => button === options.button)
      : this.buttons;

    const hasVacancies =
      typeof count === 'number'
        ? count > 0
        : Boolean(countLabel);

    targetButtons.forEach(({ button, textNode, baseText, emptyText, mode }) => {
      let text = baseText;

      if (!hasVacancies) {
        text = emptyText || baseText;
      } else if (mode === 'main') {
        text = `${baseText} ${countLabel}`;
      } else {
        text = `${baseText} · ${countLabel}`;
      }

      if (textNode) {
        textNode.textContent = text;
      } else {
        button.textContent = text;
      }
    });
  }

  setLoading(isLoading, options = {}) {
    const targetButtons = options.button
      ? this.buttons.filter(({ button }) => button === options.button)
      : this.buttons;

    if (isLoading) {
      clearTimeout(this.loadingTimeout);

      this.loadingTimeout = setTimeout(() => {
        targetButtons.forEach(({ button }) => {
          button.classList.add(this.loadingClass);
        });
      }, this.loadingDelay);

      return;
    }

    clearTimeout(this.loadingTimeout);

    targetButtons.forEach(({ button }) => {
      button.classList.remove(this.loadingClass);
    });
  }

  destroy() {
    clearTimeout(this.timeout);

    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}
