import { BaseFilterComponent } from '../core/base-filter-component.js';
import noUiSlider from 'nouislider';

const CURRENCY_RANGES = {
  EUR: { min: 0, max: 10000, symbol: '€' },
  PLN: { min: 0, max: 50000, symbol: 'zł' },
  CZK: { min: 0, max: 250000, symbol: 'Kč' },
  USD: { min: 0, max: 12000, symbol: '$' },
  UAH: { min: 0, max: 400000, symbol: '₴' },
  MDL: { min: 0, max: 200000, symbol: 'L' }
};

export class RangeSliderField extends BaseFilterComponent {
  constructor({
    containerElement = null,
    containerSelector,
    filterKey,
    sliderSelector = '.range-slider--range',
    fromInputSelector = '.range-slider-element__input:first-of-type',
    toInputSelector = '.range-slider-element__input:last-of-type',
    suffixSelector = '.range-slider-element__input-suffix',
    currencyFilterKey = 'currency',
    converterEndpoint = 'https://workium.test/api/v1/currency-converter'
  }) {
    super(filterKey);

    this.container =
      containerElement instanceof Element
        ? containerElement
        : document.querySelector(containerSelector);

    if (!this.container) {
      throw new Error(`RangeSliderField container not found: ${containerSelector}`);
    }

    this.slider = this.container.querySelector(sliderSelector);
    this.inputs = [...this.container.querySelectorAll('.range-slider-element__input')];

    this.fromInput = this.inputs[0];
    this.toInput = this.inputs[1];

    this.suffixes = [...this.container.querySelectorAll(suffixSelector)];

    if (!this.slider || !this.fromInput || !this.toInput) {
      throw new Error(`RangeSliderField "${filterKey}" has invalid HTML structure`);
    }

    this.currencyFilterKey = currencyFilterKey;
    this.converterEndpoint = converterEndpoint;

    this.isCurrencyRange = this.container.dataset.rangeCurrency === 'true';

    this.defaultMin = this.toNumber(this.slider.dataset.min);
    this.defaultMax = this.toNumber(this.slider.dataset.max);

    this.min = this.defaultMin;
    this.max = this.defaultMax;

    this.currentCurrency = 'EUR';

    this.isSingleValue = true;
    this.isSyncing = false;
    this.isChangingCurrency = false;

    this.handleSliderUpdate = this.handleSliderUpdate.bind(this);
    this.handleInputInput = this.handleInputInput.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSliderCommit = this.handleSliderCommit.bind(this);

    this.initSlider();
    this.bindEvents();
  }

  connectStore(store) {
    super.connectStore(store);

    this.currencyUnsubscribe = this.store.subscribe((state) => {
      this.handleCurrencyChange(state);
    });

    const initialState = this.store.getState();

    this.currentCurrency =
      [...(initialState[this.currencyFilterKey] || new Set())][0] || 'EUR';

    this.updateSuffixes();
  }

  disconnectStore() {
    if (this.currencyUnsubscribe) {
      this.currencyUnsubscribe();
      this.currencyUnsubscribe = null;
    }

    super.disconnectStore();
  }

  initSlider() {
    if (!noUiSlider) {
      throw new Error('RangeSliderField: noUiSlider is not loaded');
    }

    const minValue = this.toNumber(this.slider.dataset.minValue, this.min);
    const maxValue = this.toNumber(this.slider.dataset.maxValue, this.max);

    if (this.slider.noUiSlider) {
      this.slider.noUiSlider.destroy();
    }

    noUiSlider.create(this.slider, {
      start: [minValue, maxValue],
      connect: true,
      range: {
        min: this.min,
        max: this.max
      },
      format: {
        to: (value) => Math.round(Number(value)),
        from: (value) => Math.round(Number(value))
      }
    });

    this.slider.noUiSlider.on('update', this.handleSliderUpdate);
    this.slider.noUiSlider.on('change', this.handleSliderCommit);
    this.slider.noUiSlider.on('set', this.handleSliderCommit);

    this.setInputs(minValue, maxValue);
    this.updateSuffixes();
  }

  bindEvents() {
    this.fromInput.addEventListener('input', this.handleInputInput);
    this.toInput.addEventListener('input', this.handleInputInput);

    this.fromInput.addEventListener('change', this.handleInputChange);
    this.toInput.addEventListener('change', this.handleInputChange);
  }

  handleSliderUpdate(values) {
    const from = this.clamp(values[0]);
    const to = this.clamp(values[1]);

    this.setInputs(from, to);
    this.updateSuffixes();
  }

  handleSliderCommit(values) {
    if (this.isSyncing || this.isChangingCurrency) {
      return;
    }

    const from = this.clamp(values[0]);
    const to = this.clamp(values[1]);

    this.syncStoreFromValues(from, to);
  }

  handleInputInput() {
    if (this.isSyncing || this.isChangingCurrency) {
      return;
    }

    this.updateSuffixes();
  }

  handleInputChange() {
    if (this.isChangingCurrency) {
      return;
    }

    let from = this.clamp(this.fromInput.value);
    let to = this.clamp(this.toInput.value);

    if (to < from) {
      to = from;
    }

    this.setValue(from, to, {
      updateStore: true
    });
  }

  syncStoreFromValues(from, to) {
    const normalizedFrom = this.clamp(from);
    const normalizedTo = this.clamp(to);

    if (this.isDefaultRange(normalizedFrom, normalizedTo)) {
      this.clear();
      return;
    }

    this.setSelected([this.formatValue(normalizedFrom, normalizedTo)]);
  }

  syncSelected(selectedSet) {
    const value = [...selectedSet][0] || '';

    if (!value) {
      this.resetLocal();
      return;
    }

    const parsed = this.parseValue(value);

    if (!parsed) {
      this.resetLocal();
      return;
    }

    this.setValue(parsed.from, parsed.to, {
      updateStore: false
    });
  }

  setValue(from, to, { updateStore = false } = {}) {
    const normalizedFrom = this.clamp(from);
    const normalizedTo = this.clamp(to);

    this.isSyncing = true;

    this.setInputs(normalizedFrom, normalizedTo);
    this.setSlider(normalizedFrom, normalizedTo);

    this.isSyncing = false;

    if (updateStore) {
      this.syncStoreFromValues(normalizedFrom, normalizedTo);
    }

    this.updateSuffixes();
  }

  setInputs(from, to) {
    this.fromInput.value = String(Math.round(Number(from)));
    this.toInput.value = String(Math.round(Number(to)));

    this.fromInput.min = String(this.min);
    this.fromInput.max = String(this.max);
    this.toInput.min = String(this.min);
    this.toInput.max = String(this.max);
  }

  setSlider(from, to) {
    if (!this.slider.noUiSlider) {
      return;
    }

    this.slider.noUiSlider.set([
      Math.round(Number(from)),
      Math.round(Number(to))
    ]);
  }

  updateSliderRange(min, max) {
    this.min = Number(min);
    this.max = Number(max);

    if (!this.slider.noUiSlider) {
      return;
    }

    this.slider.noUiSlider.updateOptions({
      range: {
        min: this.min,
        max: this.max
      }
    });

    this.fromInput.min = String(this.min);
    this.fromInput.max = String(this.max);
    this.toInput.min = String(this.min);
    this.toInput.max = String(this.max);
  }

  resetLocal() {
    this.setValue(this.min, this.max, {
      updateStore: false
    });
  }

  toggleLocal(value) {
    this.selectLocal(value);
  }

  selectLocal(value) {
    const parsed = this.parseValue(value);

    if (!parsed) {
      return;
    }

    this.setValue(parsed.from, parsed.to, {
      updateStore: false
    });
  }

  deselectLocal() {
    this.resetLocal();
  }

  hasLocal(value) {
    return this.getSelectedLocal()[0] === String(value);
  }

  getSelectedLocal() {
    const from = this.toNumber(this.fromInput.value, this.min);
    const to = this.toNumber(this.toInput.value, this.max);

    if (this.isDefaultRange(from, to)) {
      return [];
    }

    return [this.formatValue(from, to)];
  }

  getLabelLocal(value) {
    const parsed = this.parseValue(value);

    if (!parsed) {
      return String(value);
    }

    return `${parsed.from}-${parsed.to} ${this.getSuffix()}`.trim();
  }

  getSelectedItems() {
    return this.getSelected().map((value) => ({
      value,
      label: this.getLabelLocal(value)
    }));
  }

  parseValue(value = '') {
    const [from, to] = String(value).split('-');

    if (from == null || to == null) {
      return null;
    }

    return {
      from: this.clamp(from),
      to: this.clamp(to)
    };
  }

  formatValue(from, to) {
    return `${Math.round(Number(from))}-${Math.round(Number(to))}`;
  }

  isDefaultRange(from, to) {
    return Number(from) === Number(this.min) && Number(to) === Number(this.max);
  }

  getSuffix() {
    return this.suffixes[0]?.textContent?.trim() || '';
  }

  updateSuffixes() {
    if (!this.isCurrencyRange) {
      return;
    }

    const symbol = CURRENCY_RANGES[this.currentCurrency]?.symbol || '€';

    this.suffixes.forEach((suffix) => {
      suffix.textContent = symbol;
    });
  }

  async handleCurrencyChange(state) {
    if (!this.isCurrencyRange) {
      return;
    }

    const nextCurrency =
      [...(state[this.currencyFilterKey] || new Set())][0] || 'EUR';

    if (nextCurrency === this.currentCurrency) {
      return;
    }

    const prevCurrency = this.currentCurrency || 'EUR';

    const currentSelectedValue = this.getSelected()[0] || '';
    const parsedSelectedValue = currentSelectedValue
      ? this.parseValue(currentSelectedValue)
      : null;

    const hadCustomValue = !!parsedSelectedValue;

    const prevFrom = parsedSelectedValue
      ? parsedSelectedValue.from
      : this.min;

    const prevTo = parsedSelectedValue
      ? parsedSelectedValue.to
      : this.max;

    this.currentCurrency = nextCurrency;

    await this.applyCurrencyChange({
      fromCurrency: prevCurrency,
      toCurrency: nextCurrency,
      prevFrom,
      prevTo,
      hadCustomValue
    });
  }

  async applyCurrencyChange({
    fromCurrency,
    toCurrency,
    prevFrom,
    prevTo,
    hadCustomValue
  }) {
    const nextRange = CURRENCY_RANGES[toCurrency] || CURRENCY_RANGES.EUR;

    this.isChangingCurrency = true;

    try {
      this.updateSliderRange(nextRange.min, nextRange.max);
      this.updateSuffixes();

      if (!hadCustomValue) {
        this.setValue(this.min, this.max, {
          updateStore: false
        });

        return;
      }

      const converted = await this.convertRange(
        fromCurrency,
        toCurrency,
        prevFrom,
        prevTo
      );

      const nextFrom = this.clamp(converted.from);
      const nextTo = this.clamp(converted.to);

      this.setValue(nextFrom, nextTo, {
        updateStore: false
      });

      if (this.isDefaultRange(nextFrom, nextTo)) {
        this.clear();
      } else {
        this.setSelected([this.formatValue(nextFrom, nextTo)]);
      }
    } finally {
      queueMicrotask(() => {
        this.isChangingCurrency = false;
      });
    }
  }

  async convertRange(fromCurrency, toCurrency, fromValue, toValue) {
    if (fromCurrency === toCurrency) {
      return {
        from: Math.round(fromValue),
        to: Math.round(toValue)
      };
    }

    try {
      const [fromResult, toResult] = await Promise.all([
        this.convertAmount(fromCurrency, toCurrency, fromValue),
        this.convertAmount(fromCurrency, toCurrency, toValue)
      ]);

      return {
        from: Math.round(fromResult),
        to: Math.round(toResult)
      };
    } catch (error) {
      console.error('RangeSliderField currency conversion failed:', error);

      return {
        from: Math.round(fromValue),
        to: Math.round(toValue)
      };
    }
  }

  async convertAmount(fromCurrency, toCurrency, amount) {
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute('content');

    const response = await fetch(this.converterEndpoint, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {})
      },
      body: JSON.stringify({
        from: fromCurrency,
        to: toCurrency,
        amount: Number(amount)
      })
    });

    if (!response.ok) {
      throw new Error(`Currency converter HTTP error: ${response.status}`);
    }

    const data = await response.json();

    const result =
      data.result ??
      data.converted_amount ??
      data.convertedAmount ??
      data.amount_converted ??
      data.value ??
      data.data?.result ??
      data.data?.amount ??
      data.data?.converted_amount;

    return Math.round(Number(result ?? amount));
  }

  clamp(value) {
    const number = this.toNumber(value, this.min);

    if (number < this.min) {
      return this.min;
    }

    if (number > this.max) {
      return this.max;
    }

    return Math.round(number);
  }

  toNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number) ? number : fallback;
  }

  shouldExcludeValueFromUrl(value) {
    const parsed = this.parseValue(value);

    if (!parsed) {
      return false;
    }

    return this.isDefaultRange(parsed.from, parsed.to);
  }

  shouldExcludeValueFromSelectedState(value) {
    const parsed = this.parseValue(value);

    if (!parsed) {
      return false;
    }

    return this.isDefaultRange(parsed.from, parsed.to);
  }

  destroy() {
    super.destroy();

    this.fromInput.removeEventListener('input', this.handleInputInput);
    this.toInput.removeEventListener('input', this.handleInputInput);

    this.fromInput.removeEventListener('change', this.handleInputChange);
    this.toInput.removeEventListener('change', this.handleInputChange);

    if (this.slider?.noUiSlider) {
      this.slider.noUiSlider.destroy();
    }
  }
}