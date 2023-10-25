// class FilterTag extends HTMLElement {
//   constructor() {
//     super();
//     this.removeElement = this.removeElement.bind(this);
//     // this.addEventListener('click', () => this.remove());
//   }

//   connectedCallback() {
//     //implementation

//     this.innerHTML = `<div class="selected-item">
//                         <div class="selected-item__value">8-90</div>
//                         <a href="javascript:;" class="selected-item__remove-link"></a>
//                       </div>`;

//     this.querySelector('.selected-item__remove-link').addEventListener('click', this.removeElement);
//   }

//   removeElement() {
//     // console.log('Remove!!');
//     this.remove();
//   }

//   disconnectedCallback() {
//     //implementation
//     console.log('Remove element!!');
//   }

//   attributeChangedCallback(name, oldVal, newVal) {
//     //implementation
//   }

//   adoptedCallback() {
//     //implementation
//   }

// }

// window.customElements.define('filter-tag', FilterTag);

// export { FilterTag }