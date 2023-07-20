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

  // Adding selected items on search by filter
  $('input[name="search_filter"]').on('input', function(event) {
    let searchValue = $(this).val().toLowerCase().trim();
    let $additionalFilters = $(this).closest('.additional-filters');
    let $selectedItemsList = $additionalFilters.find('.additional-filters__selected-items .selected-items__list');
    let $searchValueSelectedItem = $selectedItemsList.find('.selected-items__item--search-value');
    let $clearBtn = $additionalFilters.find('.additional-filters__clear-btn');

    if (searchValue !== '') {
      if (!$searchValueSelectedItem.length) {

        $selectedItemsList.prepend(`
          <li class="selected-items__item selected-items__item--search-value">
            <div class="selected-item">
              <div class="selected-item__value">${searchValue}</div>
              <a href="#" class="selected-item__remove-link"></a>
            </div>
          </li>`);
      } else {
        $searchValueSelectedItem.find('.selected-item__value').text(searchValue);
      }
    } else {
      $searchValueSelectedItem.remove();
    }

    if ($additionalFilters.find('.selected-items__item').length) {
      $clearBtn.show();
    } else {
      $clearBtn.hide();
    }
  });

  // Removing selected items
  $(document).on('click', '.additional-filters .selected-item__remove-link', function(event) {
    let $selectedItemParent = $(this).closest('.selected-items__item');
    let $additionalFilters = $selectedItemParent.closest('.additional-filters');
    let $clearBtn = $additionalFilters.find('.additional-filters__clear-btn');

    if ($selectedItemParent.hasClass('selected-items__item--search-value')) {
      let $additionalFiltersGroups = $additionalFilters.find('.checkboxes-group, .radiobtns-group');

      $additionalFilters.find('.form-text--filter-search').val('');
      $additionalFiltersGroups.show();
    } else if ($selectedItemParent.data('name') !== undefined && $selectedItemParent.data('value') !== undefined) {
      let selectedItemName = $selectedItemParent.data('name');

      if ($selectedItemParent.data('type') === 'checkbox') {
        let selectedItemValue = $selectedItemParent.data('value');
        let $selectedCheckbox = $additionalFilters.find(`.checkbox__input[name="${selectedItemName}"][value="${selectedItemValue}"]`);

        $selectedCheckbox.prop("checked", false);
      } else if ($selectedItemParent.data('type') === 'radio') {
        let $nonCheckedRadio = $additionalFilters.find(`.radiobtn__input[name="${selectedItemName}"][value=""]`);
        $nonCheckedRadio.prop('checked', true);
      }
    }

    $selectedItemParent.remove();

    if ($additionalFilters.find('.selected-items__item').length) {
      $clearBtn.show();
    } else {
      $clearBtn.hide();
    }

    event.preventDefault();
  });

  // Adding selected checkboxes/radio buttons
  $('.additional-filters .checkbox__input, .additional-filters .radiobtn__input').click(function(event) {
    let labelText = $(this).parent().find('label').text();
    let $additionalFilters = $(this).closest('.additional-filters');
    let $selectedItemsList = $additionalFilters.find('.additional-filters__selected-items .selected-items__list');
    let $selectedCheckboxItem = $additionalFilters.find(`.selected-items__item[data-name="${$(this).attr('name')}"][data-value="${$(this).val()}"]`);
    let $clearBtn = $additionalFilters.find('.additional-filters__clear-btn');

    if ($(this).is(':checkbox')) {
      if ($(this).is(':checked')) {
        $selectedItemsList.append(`
          <li class="selected-items__item" data-type="checkbox" data-name="${$(this).attr('name')}" data-value="${$(this).val()}">
            <div class="selected-item">
              <div class="selected-item__value">${labelText}</div>
              <a href="#" class="selected-item__remove-link"></a>
            </div>
          </li>`);
      } else {
        $selectedCheckboxItem.remove();
      }
    } else if ($(this).is(':radio')) {
      let groupTitle = $(this).closest('.radiobtns-group').find('.radiobtns-group__title').text();
      let $otherSelectedCheckboxes = $additionalFilters.find(`.selected-items__item[data-name="${$(this).attr('name')}"]`).not(`[data-value="${$(this).val()}"]`);
      $otherSelectedCheckboxes.remove();

      if (!$selectedCheckboxItem.length && $(this).val() !== '') {
        $selectedItemsList.append(`
          <li class="selected-items__item" data-type="radio" data-name="${$(this).attr('name')}" data-value="${$(this).val()}">
            <div class="selected-item">
              <div class="selected-item__value"><strong>${groupTitle}:</strong> ${labelText}</div>
              <a href="#" class="selected-item__remove-link"></a>
            </div>
          </li>`);
      }
    }

    if ($additionalFilters.find('.selected-items__item').length) {
      $clearBtn.show();
    } else {
      $clearBtn.hide();
    }
  });

  $('.additional-filters__clear-btn').click(function(event) {
    let $additionalFilters = $(this).closest('.additional-filters');
    let $additionalFiltersGroups = $additionalFilters.find('.checkboxes-group, .radiobtns-group');
    let $allCheckboxes = $additionalFilters.find('.checkbox__input');
    let $allNonCheckedRadio = $additionalFilters.find(`.radiobtn__input[value=""]`);

    console.log($allNonCheckedRadio);

    $allCheckboxes.prop('checked', false);
    $allNonCheckedRadio.prop('checked', true);

    $additionalFilters.find('.form-text--filter-search').val('');
    $additionalFilters.find('.selected-items__item').remove();

    $(this).hide();
    $additionalFiltersGroups.show();

    event.preventDefault();
  });

  // Clear button
  // $('')
});