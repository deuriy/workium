import $ from "jquery";
import Swiper, { Pagination } from 'swiper';
import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.esm.js";

document.addEventListener('DOMContentLoaded', function () {
  Fancybox.bind(".additional-filters-popup-link", {
    dragToClose: false,
    mainClass: 'fancybox--additional-filters-popup',

    tpl: {
      closeButton: '<button data-fancybox-close class="fancybox-close-button hidden-xxs" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path stroke="#A1A7B3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M1 17 17 1M1 1l16 16"></path></svg></button>'
    }
  });

  document.addEventListener('click', function (e) {
    let filterTag = e.target.closest('.filter-tag');

    if (!filterTag) return;

    filterTag.classList.toggle('filter-tag--selected');
  });

  document.addEventListener('click', function (e) {
    let checkboxesGroupTitle = e.target.closest('.checkboxes-group__title');

    if (!checkboxesGroupTitle) return;

    let checkboxesGroup = checkboxesGroupTitle.closest('.checkboxes-group');

    if (!checkboxesGroup) return;

    checkboxesGroup.classList.toggle('checkboxes-group--closed');
  });

  document.addEventListener('click', function (e) {
    let radioBtnsGroupTitle = e.target.closest('.radiobtns-group__title');

    if (!radioBtnsGroupTitle) return;

    let radioBtnsGroup = radioBtnsGroupTitle.closest('.radiobtns-group');

    if (!radioBtnsGroup) return;

    radioBtnsGroup.classList.toggle('radiobtns-group--closed');
  });

  if (document.documentElement.clientWidth < 768) {
  	const promoBlocksSwiper = new Swiper('.promo-blocks-swiper', {
      modules: [Pagination],
      loop: true,
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 8,

      pagination: {
  	    el: '.promo-blocks-swiper__pagination',
  	    bulletActiveClass: 'swiper-pagination-bullet--active',
  	    // clickable: true
  	  },
    });
  }

  // Search in filter
  $('input[name="search_filter"]').on('input', function(event) {
    let searchValue = $(this).val().toLowerCase().trim();
    let $additionalFilters = $(this).closest('.additional-filters');
    let $additionalFiltersGroups = $additionalFilters.find('.checkboxes-group, .radiobtns-group');

    Array.from($additionalFiltersGroups).forEach( group => {
      let groupTitle = $(group).find('.checkboxes-group__title, .radiobtns-group__title').text().toLowerCase();

      let checkboxesLabels = Array.from($(group).find('.checkbox__label, .radiobtn__label')).map(label => {
        return $(label).text().toLowerCase();
      });

      if (groupTitle.includes(searchValue) || checkboxesLabels.find(label => label.includes(searchValue))) {
        $(group).show();
      } else {
        $(group).hide();
      }
    });
  });
});