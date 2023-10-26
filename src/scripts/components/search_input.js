const template = document.createElement('template');

template.innerHTML = `
  <style>
    .search-input {
      position: relative;
    }

    input {
      width: 100%;
      height: 48px;
      padding-right: 11px;
      padding-left: 42px;
      border: 1px solid #dfe2e6;
      background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23A1A7B3' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.4' d='m19 19-5.197-5.197m0 0A7.5 7.5 0 1 0 3.196 3.196a7.5 7.5 0 0 0 10.607 10.607Z'/%3E%3C/svg%3E") 15px center/20px no-repeat;
      outline: none;
      border-radius: 12px;
      font-weight: 500;
      font-size: 14px;
      font-family: var(--base-font);
      color: #1f2126;
    }
    input.filled {
      padding-right: 32px;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    input::-webkit-search-decoration,
    input::-webkit-search-cancel-button,
    input::-webkit-search-results-button,
    input::-webkit-search-results-decoration {
      -webkit-appearance: none;
    }
    
    input:focus {
      border-color: #707A8C;
    }

    button {
      position: absolute;
      top: 0;
      right: 10px;
      bottom: 0;
      margin: auto;
      width: 24px;
      height: 48px;
      border: none;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 18 18'%3E%3Cpath stroke='%23A1A7B3' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.4' d='M1 17 17 1M1 1l16 16'/%3E%3C/svg%3E") center / 15px no-repeat;
      cursor: pointer;
    }
  </style>

  <div class="search-input">
    <input type="search" />
    <button type="button" hidden></button>
  </div>
`;

class SearchInput extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({mode: 'open'});
    shadow.append(template.content.cloneNode(true));

    this._input = shadow.querySelector('input');
    this._button = shadow.querySelector('button');
  }

  connectedCallback() {
    console.log('connectedCallback');
    
    this._onInput = this._onInput.bind(this);
    this._clearInput = this._clearInput.bind(this);

    this._input.addEventListener('input', this._onInput);
    this._button.addEventListener('click', this._clearInput);
  }

  _updateState() {
    console.log('Update state');

    this._button.hidden = !this._input.value;

    if (this._input.value) {
      this._input.classList.add('filled');
    } else {
      this._input.classList.remove('filled');
    }
  }

  _onInput(event) {
    this.value = event.target.value;
    this._updateState();
  }

  _clearInput() {
    this.value = '';
    this._input.focus();
  }

  get name() {
    return this.getAttribute('name');
  }
  
  set name(val) {
    if (val) {
      this.setAttribute('name', val);
      this._input.name = val;
    } else {
      this.removeAttribute('name');
      this._input.removeAttribute('name');
    }
  }

  get value() {
    return this.getAttribute('value');
  }
  
  set value(val) {
    if (val) {
      this.setAttribute('value', val);
      this._input.value = val;
    } else {
      this.removeAttribute('value');
      this._input.removeAttribute('value');
    }

    this._updateState();
  }

  get placeholder() {
    return this.getAttribute('placeholder');
  }
  
  set placeholder(val) {
    if (val) {
      this.setAttribute('placeholder', val);
      this._input.placeholder = val;
    } else {
      this.removeAttribute('placeholder');
      this._input.removeAttribute('placeholder');
    }
  }

  disconnectedCallback() {
    this._input.removeEventListener('input', this._onInput);
    this._button.removeEventListener('click', this._clearInput);

    console.log(`disconnectedCallback!`);
  }

  static get observedAttributes() {
    return [ 'name', 'value', 'placeholder' ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('attributeChangedCallback');

    this._input.setAttribute(name, newValue);
    this._input[name] = newValue;

    if (name === 'value') {
      this._updateState();
    }
  }
}

export { SearchInput }