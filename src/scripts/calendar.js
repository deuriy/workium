class Calendar {
  constructor(root) {
    this.root = root;
    this.field = root.querySelector('.js-calendar-field');
    this.overlay = root.querySelector('.calendar-overlay');
    this.body = root.querySelector('.js-body');
    this.title = root.querySelector('.js-title');

    this.trans = JSON.parse(root.dataset.translations);
    this.months = this.trans.months_short;
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

    this.init();
  }

  init() {
    this.field.addEventListener('click', () => this.open());
    this.root.querySelectorAll('.js-cancel')
      .forEach(btn => btn.onclick = () => this.cancel());

    this.root.querySelector('.js-apply')
      .onclick = () => this.apply();

    this.root.querySelector('.js-clear')
      .onclick = () => this.clear();

    this.root.querySelectorAll('[data-accuracy]')
      .forEach(btn => {
        btn.onclick = () => {
          this.root.querySelectorAll('[data-accuracy]')
            .forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.temp.accuracy = +btn.dataset.accuracy;
          this.updateTitle();
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

  }

  open() {
    this.temp = structuredClone(this.state);

    this.overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // блок скролла

    this.render();
  }

  cancel() {
    this.overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  apply() {
    this.state = structuredClone(this.temp);
    this.field.textContent = this.format(this.state);

    this.overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  clear() {
    this.temp = { start: null, end: null, accuracy: 0 };
    this.root.querySelectorAll('[data-accuracy]')
      .forEach(b => b.classList.remove('active'));
    this.root.querySelector('[data-accuracy="0"]').classList.add('active');
    this.render();
  }

  render() {
    this.body.innerHTML = '';
    let cursor = new Date(this.today);
    cursor.setDate(1);

    for (let i = 0; i < 3; i++) {
      this.renderMonth(cursor);
      cursor.setMonth(cursor.getMonth() + 1);
    }
    this.updateTitle();
  }

  renderMonth(date) {
    const month = date.getMonth();
    const year = date.getFullYear();

    const block = document.createElement('div');
    block.className = 'month';

    const title = document.createElement('h4');
    title.textContent = `${this.months[month]} ${year}`;
    block.appendChild(title);

    /* ===== WEEKDAYS ===== */
    const weekdaysRow = document.createElement('div');
    weekdaysRow.className = 'weekdays';

    this.weekdays.forEach(day => {
      const el = document.createElement('div');
      el.textContent = day;
      weekdaysRow.appendChild(el);
    });

    block.appendChild(weekdaysRow);

    /* ===== DAYS GRID ===== */
    const grid = document.createElement('div');
    grid.className = 'days';

    const firstDay = new Date(year, month, 1).getDay();
    const normalizedFirstDay = (firstDay + 6) % 7; // Monday first

    for (let i = 0; i < normalizedFirstDay; i++) {
      const empty = document.createElement('div');
      grid.appendChild(empty);
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const dayDate = new Date(year, month, d);

      if (dayDate < this.today || dayDate > this.maxDate) continue;

      const btn = document.createElement('button');
      btn.textContent = d;

      if (this.isSelected(dayDate)) btn.classList.add('selected');
      if (this.inRange(dayDate)) btn.classList.add('range');

      btn.onclick = () => this.select(dayDate);

      grid.appendChild(btn);
    }

    block.appendChild(grid);
    this.body.appendChild(block);
  }

  select(date) {
    if (!this.temp.start || this.temp.end) {
      this.temp.start = date;
      this.temp.end = null;
    } else if (date < this.temp.start) {
      this.temp.start = date;
    } else {
      this.temp.end = date;
    }
    this.render();
  }

  isSelected(d) {
    return (this.temp.start && d.getTime() === this.temp.start.getTime()) ||
      (this.temp.end && d.getTime() === this.temp.end.getTime());
  }

  inRange(d) {
    return this.temp.start && this.temp.end &&
      d > this.temp.start && d < this.temp.end;
  }

  format({ start, end, accuracy }) {
    if (!start) return this.trans.choose;

    const from = `${start.getDate()} ${this.months[start.getMonth()]}`;
    if (!end) {
      return accuracy ? `${from} ±${accuracy}` : from;
    }

    const to = `${end.getDate()} ${this.months[end.getMonth()]}`;
    return accuracy
      ? `${from} - ${to} ±${accuracy}`
      : `${from} - ${to}`;
  }

  updateTitle() {
    this.title.textContent = this.format(this.temp);
  }
}

/* --- Init all calendars --- */
document.querySelectorAll('.js-calendar')
  .forEach(el => new Calendar(el));
