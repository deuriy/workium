export class Calendar {
  static getInstance(element) {
    return element?._calendarInstance || null;
  }

  static initAll(selector = '[data-calendar]') {
    document.querySelectorAll(selector).forEach(el => {
      if (!el._calendarInstance) {
        el._calendarInstance = new Calendar(el);
      }
    });
  }

  constructor(root) {
    this.root = root;
    this.field = root.querySelector('[data-calendar-field]');
    this.overlay = root.querySelector('.calendar-overlay');
    this.body = root.querySelector('.calendar__body');
    this.title = root.querySelector('.calendar__title');
    this.hiddenInput = root.querySelector('.calendar__input');

    this.applyBtn = root.querySelector('[data-apply-btn]');
    this.clearBtn = root.querySelector('[data-clear-btn]');
    this.cancelButtons = root.querySelectorAll('[data-cancel]');
    this.accuracyButtons = root.querySelectorAll('[data-accuracy]');

    this.overlayPlaceholder = document.createComment('calendar-overlay-placeholder');
    this.overlayOriginalParent = this.overlay?.parentNode || null;
    this.isOverlayMountedToBody = false;

    this.trans = JSON.parse(root.dataset.translations);
    this.months = this.trans.months_short;
    this.monthsFull = this.trans.months_full;
    this.weekdays = this.trans.weekdays_short;

    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);

    this.maxDate = new Date(this.today);
    this.maxDate.setMonth(this.maxDate.getMonth() + 3);

    this.state = {
      start: null,
      end: null,
      accuracy: 0
    };

    this.temp = structuredClone(this.state);

    this.hoverDate = null;

    this.initFromHidden();
    this.init();
    root._calendarInstance = this;
  }

  mountOverlay() {
    if (!this.overlay || this.isOverlayMountedToBody) return;

    this.overlayOriginalParent = this.overlay.parentNode;

    if (this.overlayOriginalParent) {
      this.overlayOriginalParent.insertBefore(this.overlayPlaceholder, this.overlay);
    }

    document.body.appendChild(this.overlay);
    document.documentElement.classList.add('calendar-overlay-open');
    this.isOverlayMountedToBody = true;
  }

  unmountOverlay() {
    if (!this.overlay || !this.isOverlayMountedToBody) return;

    this.overlay.classList.remove('is-open');

    if (this.overlayPlaceholder.parentNode) {
      this.overlayPlaceholder.parentNode.insertBefore(this.overlay, this.overlayPlaceholder);
      this.overlayPlaceholder.remove();
    } else if (this.overlayOriginalParent) {
      this.overlayOriginalParent.appendChild(this.overlay);
    }

    document.documentElement.classList.remove('calendar-overlay-open');
    this.isOverlayMountedToBody = false;
  }

  initFromHidden() {
    if (!this.hiddenInput) return;
  
    const value = this.hiddenInput.value?.trim();
    if (!value) return;
  
    const parseDate = (ts) => {
      const date = new Date(Number(ts) * 1000);
      date.setHours(0, 0, 0, 0);
      return date;
    };
  
    // диапазон
    if (value.includes('-')) {
      const [fromTs, toTs] = value.split('-');
  
      const start = parseDate(fromTs);
      const end = parseDate(toTs);
  
      this.state = {
        start,
        end,
        accuracy: 0
      };
    } 
    // одиночная дата
    else {
      const start = parseDate(value);
  
      this.state = {
        start,
        end: null,
        accuracy: 0
      };
    }
  
    this.temp = structuredClone(this.state);
  }

  init() {
    this.field.addEventListener('click', () => this.open());
    this.cancelButtons.forEach(btn => {
      btn.onclick = () => this.cancel();
    });

    if (this.applyBtn) {
      this.applyBtn.onclick = () => this.apply();
    }

    if (this.clearBtn) {
      this.clearBtn.onclick = () => this.clear();
    }

    this.accuracyButtons.forEach(btn => {
      btn.onclick = () => {
        this.root.querySelectorAll('[data-accuracy]')
          .forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.temp.accuracy = +btn.dataset.accuracy;
        this.updateTitle();
        this.updateHiddenInput();
        this.dispatchChangeEvent();
      };
    });

    // Close on overlay click
    this.overlay.addEventListener('click', (e) => {
      // закрываем только если клик по фону,
      // а не по самому modal-контенту
      if (e.target === this.overlay) {
        this.cancel();
      }
    });

    // Close on ESC
    this._handleEsc = (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('is-open')) {
        this.cancel();
      }
    };

    document.addEventListener('keydown', this._handleEsc);

    this.updateFieldState();

    this.field.textContent = this.format(this.state);
  }

  open() {
    this.temp = structuredClone(this.state);

    this.syncAccuracyButtons();
    this.toggleClearButton();
    this.updateHiddenInputFromState();

    this.mountOverlay();
    this.overlay.classList.add('is-open');

    this.render();
    this.dispatchOpenEvent();
  }

  cancel() {
    this.unmountOverlay();

    this.updateHiddenInputFromState();

    this.dispatchCancelEvent();
  }

  apply() {
    this.state = structuredClone(this.temp);
    this.field.textContent = this.format(this.state);

    this.updateFieldState();
    this.updateHiddenInputFromState();

    this.unmountOverlay();

    this.dispatchApplyEvent();
  }

  clear() {
    this.temp = { start: null, end: null, accuracy: 0 };

    this.syncAccuracyButtons();
    this.toggleClearButton();

    this.updateHiddenInput();

    this.accuracyButtons.forEach(b => {
      b.classList.remove('active');
    });

    const exactBtn = [...this.accuracyButtons].find(
      btn => btn.dataset.accuracy === '0'
    );

    exactBtn?.classList.add('active');

    this.render();

    // если очищаем полностью (и применим потом)
    if (!this.state.start) {
      this.updateFieldState();
    }

    this.dispatchChangeEvent();
  }

  render() {
    this.body.innerHTML = '';

    /* ===== MONTHS ===== */
    let cursor = new Date(this.today);
    cursor.setDate(1);

    for (let i = 0; i < 3; i++) {
      this.renderMonth(cursor);
      cursor.setMonth(cursor.getMonth() + 1);
    }
    this.updateTitle();
    this.toggleClearButton();
  }

  renderMonth(date) {
    const month = date.getMonth();
    const year = date.getFullYear();

    const block = document.createElement('div');
    block.className = 'month';

    const title = document.createElement('h4');
    title.textContent = `${this.monthsFull[month]} ${year}`;
    block.appendChild(title);

    /* ===== DAYS GRID ===== */
    const grid = document.createElement('div');
    grid.className = 'days';

    const isCurrentMonth =
      month === this.today.getMonth() &&
      year === this.today.getFullYear();

    let startDayNumber = 1;

    if (isCurrentMonth) {
      startDayNumber = this.today.getDate();
    }

    const firstDay = new Date(year, month, startDayNumber).getDay();
    const normalizedFirstDay = (firstDay + 6) % 7;

    for (let i = 0; i < normalizedFirstDay; i++) {
      const empty = document.createElement('div');
      grid.appendChild(empty);
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let d = startDayNumber; d <= daysInMonth; d++) {
      const dayDate = new Date(year, month, d);

      const btn = document.createElement('button');
      const btnText = document.createElement('span');
      btnText.textContent = d;
      btn.appendChild(btnText);

      btn.dataset.year = year;
      btn.dataset.month = month;
      btn.dataset.day = d;
      
      btn.addEventListener('mouseenter', () => {
        if (this.temp.start && !this.temp.end) {
          this.hoverDate = dayDate;
          this.updateHoverRange();
        }
      });

      btn.addEventListener('mouseleave', () => {
        if (this.temp.start && !this.temp.end) {
          this.hoverDate = null;
          this.updateHoverRange();
        }
      });

      const isDisabled = dayDate < this.today || dayDate > this.maxDate;

      if (isDisabled) {
        btn.classList.add('is-hidden');
        btn.disabled = true;
      } else {
        if (this.isSelected(dayDate)) btn.classList.add('selected');
        if (this.inRange(dayDate)) btn.classList.add('range');

        btn.onclick = () => this.select(dayDate);
      }

      grid.appendChild(btn);
    }

    block.appendChild(grid);
    this.body.appendChild(block);
  }

  select(date) {

    // если нет старта или диапазон уже завершён — начинаем новый выбор
    if (!this.temp.start || this.temp.end) {
      this.temp.start = date;
      this.temp.end = null;
    }

    // если клик по тому же самому дню — ничего не делаем
    else if (date.getTime() === this.temp.start.getTime()) {
      return;
    }

    // если клик по более ранней дате — меняем старт
    else if (date < this.temp.start) {
      this.temp.start = date;
    }

    // иначе устанавливаем конец диапазона
    else {
      this.temp.end = date;
    }

    this.render();
    this.hoverDate = null;
    this.updateHiddenInput();
    this.dispatchChangeEvent();
  }

  isSelected(d) {
    return (this.temp.start && d.getTime() === this.temp.start.getTime()) ||
      (this.temp.end && d.getTime() === this.temp.end.getTime());
  }

  inRange(d) {
    // обычный выбранный диапазон
    if (this.temp.start && this.temp.end) {
      return d > this.temp.start && d < this.temp.end;
    }

    // hover диапазон
    if (this.temp.start && !this.temp.end && this.hoverDate) {
      if (this.hoverDate <= this.temp.start) return false;

      return d > this.temp.start && d < this.hoverDate;
    }

    return false;
  }

  format({ start, end, accuracy }) {
    if (!start) return this.trans.choose;

    const accuracyLabel = this.getAccuracyLabel();

    const from = `${start.getDate()} ${this.months[start.getMonth()]}`;

    if (!end) {
      return accuracyLabel
        ? `${from} ${accuracyLabel}`
        : from;
    }

    const to = `${end.getDate()} ${this.months[end.getMonth()]}`;

    return accuracyLabel
      ? `${from} - ${to} ${accuracyLabel}`
      : `${from} - ${to}`;
  }

  updateTitle() {
    this.title.textContent = this.format(this.temp);
  }

  toggleClearButton() {
    if (!this.clearBtn) return;

    this.clearBtn.classList.toggle(
      'is-visible',
      !!this.temp.start
    );
  }

  updateFieldState() {
    if (this.state.start) {
      this.field.classList.add('is-filled');
    } else {
      this.field.classList.remove('is-filled');
    }
  }

  syncAccuracyButtons() {
    const buttons = this.accuracyButtons;

    buttons.forEach(btn => {
      btn.classList.toggle(
        'active',
        +btn.dataset.accuracy === this.temp.accuracy
      );
    });
  }

  getAccuracyLabel() {
    if (!this.temp.accuracy) return '';

    const btn = [...this.accuracyButtons].find(
      btn => +btn.dataset.accuracy === this.temp.accuracy
    );

    return btn ? btn.textContent.trim() : '';
  }

  updateHoverRange() {
    if (!this.temp.start || this.temp.end) return;

    const buttons = this.body.querySelectorAll('button');

    buttons.forEach(btn => {
      const year = +btn.dataset.year;
      const month = +btn.dataset.month;
      const day = +btn.dataset.day;

      const date = new Date(year, month, day);

      btn.classList.remove('range');

      if (
        this.hoverDate &&
        this.hoverDate > this.temp.start &&
        date > this.temp.start &&
        date < this.hoverDate
      ) {
        btn.classList.add('range');
      }
    });
  }

  getTimestampValue() {
    const { start, end, accuracy } = this.temp;
  
    if (!start) return '';
  
    const toTimestamp = (date) => Math.floor(date.getTime() / 1000);
  
    // Одиночная дата
    if (!end) {
  
      if (!accuracy) {
        return String(toTimestamp(start));
      }
  
      const fromDate = new Date(start);
      fromDate.setDate(fromDate.getDate() - accuracy);
  
      const toDate = new Date(start);
      toDate.setDate(toDate.getDate() + accuracy);
  
      return `${toTimestamp(fromDate)}-${toTimestamp(toDate)}`;
    }
  
    // Диапазон
    let fromDate = new Date(start);
    let toDate = new Date(end);
  
    if (accuracy) {
      fromDate.setDate(fromDate.getDate() - accuracy);
      toDate.setDate(toDate.getDate() + accuracy);
    }
  
    return `${toTimestamp(fromDate)}-${toTimestamp(toDate)}`;
  }

  updateHiddenInput() {
    if (!this.hiddenInput) return;
    this.hiddenInput.value = this.getTimestampValue();
  }

  updateHiddenInputFromState() {
    if (!this.hiddenInput) return;
  
    const currentTemp = this.temp;
    this.temp = this.state;              // временно подменяем
    this.hiddenInput.value = this.getTimestampValue();
    this.temp = currentTemp;             // возвращаем обратно
  }

  dispatchOpenEvent() {
    const { start, end, accuracy } = this.temp;
  
    const event = new CustomEvent('calendar:open', {
      bubbles: true,
      detail: {
        root: this.root,
        start,
        end,
        accuracy,
        value: this.getTimestampValue()
      }
    });
  
    this.root.dispatchEvent(event);
  }

  dispatchChangeEvent() {
    const { start, end, accuracy } = this.temp;
  
    const event = new CustomEvent('calendar:change', {
      bubbles: true,
      detail: {
        root: this.root,
        start,
        end,
        accuracy,
        value: this.getTimestampValue()
      }
    });
  
    this.root.dispatchEvent(event);
  }

  dispatchApplyEvent() {
    const event = new CustomEvent('calendar:apply', {
      bubbles: true,
      detail: {
        root: this.root,
        state: structuredClone(this.state),
        value: this.hiddenInput ? this.hiddenInput.value : ''
      }
    });
  
    this.root.dispatchEvent(event);
  }

  dispatchCancelEvent() {
    const event = new CustomEvent('calendar:cancel', {
      bubbles: true,
      detail: {
        root: this.root,
        state: structuredClone(this.state),
        value: this.hiddenInput ? this.hiddenInput.value : ''
      }
    });

    this.root.dispatchEvent(event);
  }

  /* ================= PUBLIC API ================= */

  openCalendar() {
    this.open();
  }

  closeCalendar() {
    this.cancel();
  }

  clearCalendar({ apply = true } = {}) {
    this.temp = { start: null, end: null, accuracy: 0 };

    if (apply) {
      this.state = structuredClone(this.temp);
      this.field.textContent = this.format(this.state);
      this.updateFieldState();
      this.updateHiddenInputFromState();
      this.dispatchApplyEvent();
    }

    this.render();
  }

  setDate({ start, end = null, accuracy = 0 }, { apply = true } = {}) {
    this.temp = {
      start: start ? new Date(start) : null,
      end: end ? new Date(end) : null,
      accuracy
    };

    if (apply) {
      this.state = structuredClone(this.temp);
      this.field.textContent = this.format(this.state);
      this.updateFieldState();
      this.updateHiddenInputFromState();
      this.dispatchApplyEvent();
    }

    this.render();
  }

  getState() {
    return structuredClone(this.state);
  }

  getValue() {
    return this.hiddenInput ? this.hiddenInput.value : '';
  }
}
