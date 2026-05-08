import { BaseFilterComponent } from '../core/base-filter-component.js';
import { Calendar } from '../../calendar.js';

export class CalendarField extends BaseFilterComponent {
  constructor({
    containerElement = null,
    containerSelector,
    filterKey,
    calendarSelector = '.js-calendar',
    hiddenInputSelector = '.calendar__input',
    clearButtonSelector = '[data-result-field-clear]'
  }) {
    super(filterKey);

    this.container =
      containerElement instanceof Element
        ? containerElement
        : document.querySelector(containerSelector);

    if (!this.container) {
      throw new Error(`CalendarField container not found: ${containerSelector}`);
    }

    this.calendarSelector = calendarSelector;
    this.hiddenInputSelector = hiddenInputSelector;

    this.hiddenInput = this.container.querySelector(this.hiddenInputSelector);
    this.clearButton = this.container.querySelector(clearButtonSelector);
    this.handleClearButtonClick = this.handleClearButtonClick.bind(this);
    this.applyButton = this.container.querySelector('.js-apply');

    this.calendar =
      Calendar.getInstance(this.container) || new Calendar(this.container);

    this.isSingleValue = true;
    this.isSyncingFromStore = false;

    this.handleChange = this.handleChange.bind(this);
    this.handleApply = this.handleApply.bind(this);
    this.handleClear = this.handleClear.bind(this);

    this.container.addEventListener('calendar:change', this.handleChange);
    this.container.addEventListener('calendar:apply', this.handleApply);

    if (this.clearButton) {
      this.clearButton.addEventListener('click', this.handleClearButtonClick);
    }

    this.syncInitialValue();
  }

  syncInitialValue() {
    const value = this.getValue();

    if (value) {
      this.setSelected([value]);
    }
  }

  updateVacanciesCountDraft(value = this.getValue(), options = {}) {
    this.controller?.updateVacanciesCountWithOverrides?.(
      {
        [this.filterKey]: value ? [value] : []
      },
      options
    );
  }

  handleChange(event) {
    if (this.isSyncingFromStore) {
      return;
    }

    const value = event.detail?.value || this.getValue();

    this.updateVacanciesCountDraft(value, {
      button: this.applyButton
    });
  }

  handleApply(event) {
    if (this.isSyncingFromStore) {
      return;
    }

    const value = event.detail?.value || this.getValue();

    this.updateVacanciesCountDraft(value);

    if (value) {
      this.setSelected([value]);
    } else {
      this.clear();
    }
  }

  handleClear() {
    this.clear();
  }

  handleClearButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();

    this.clear();
  }

  getValue() {
    return this.hiddenInput?.value?.trim() || '';
  }

  setOptions() {
    // optional
  }

  getSelectedItems() {
    const selected = this.getSelected();

    if (!selected.length) {
      return [];
    }

    return [
      {
        value: selected[0],
        label: this.getLabelLocal(selected[0])
      }
    ];
  }

  getAllItems() {
    return [];
  }

  syncSelected(selectedSet) {
    const value = [...selectedSet][0] || '';

    if (this.hiddenInput && this.hiddenInput.value !== value) {
      this.hiddenInput.value = value;
    }

    this.isSyncingFromStore = true;

    try {
      if (!value) {
        this.calendar?.clearCalendar?.({ apply: true });
        return;
      }

      this.applyValueToCalendar(value);
    } finally {
      this.isSyncingFromStore = false;
    }
  }

  applyValueToCalendar(value) {
    const parsed = this.parseValue(value);

    if (!parsed?.start) {
      return;
    }

    this.calendar?.setDate?.(
      {
        start: parsed.start,
        end: parsed.end,
        accuracy: 0
      },
      {
        apply: true
      }
    );
  }

  parseValue(value = '') {
    const normalized = String(value).trim();

    if (!normalized) {
      return null;
    }

    const toDate = (timestamp) => {
      const date = new Date(Number(timestamp) * 1000);

      if (Number.isNaN(date.getTime())) {
        return null;
      }

      date.setHours(0, 0, 0, 0);

      return date;
    };

    if (normalized.includes('-')) {
      const [from, to] = normalized.split('-');

      return {
        start: toDate(from),
        end: toDate(to)
      };
    }

    return {
      start: toDate(normalized),
      end: null
    };
  }

  toggleLocal(value) {
    this.selectLocal(value);
  }

  selectLocal(value) {
    const normalized = String(value);

    if (this.hiddenInput) {
      this.hiddenInput.value = normalized;
    }

    this.applyValueToCalendar(normalized);
  }

  deselectLocal(value) {
    if (this.getValue() !== String(value)) {
      return;
    }

    this.clearLocal();
  }

  hasLocal(value) {
    return this.getValue() === String(value);
  }

  getSelectedLocal() {
    const value = this.getValue();

    return value ? [value] : [];
  }

  getLabelLocal() {
    return this.calendar?.field?.textContent?.trim() || this.getValue();
  }

  clearLocal() {
    if (this.hiddenInput) {
      this.hiddenInput.value = '';
    }

    this.calendar?.clearCalendar?.({ apply: true });
  }

  destroy() {
    super.destroy();

    this.container.removeEventListener('calendar:change', this.handleChange);
    this.container.removeEventListener('calendar:apply', this.handleApply);

    if (this.clearButton) {
      this.clearButton.removeEventListener('click', this.handleClearButtonClick);
    }    
  }
}