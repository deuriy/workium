import $ from "jquery";
import Swiper, { Pagination } from 'swiper';
import select2 from 'select2';
import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.esm.js";
import multi from "multi.js/dist/multi-es6.min.js";

// console.log(multi);

// function formatStateResult(state) {
//   if (!state.element || !state.element.dataset.icon) {
//     return state.text;
//   }

//   console.log(state.element);

//   let $state = $(
//     `<span class="Select_iconWrapper"><img src="${state.element.dataset.icon}" class="Select_icon" /><span class="Select_text">${state.text}</span></span>`
//   );

//   return $state;
// }

// function formatStateSelection(state) {
//   if (!state.element || !state.element.dataset.icon) {
//     return state.text;
//   }

//   console.log(state.element);

//   let $state = $(
//     `<span class="Select_iconWrapper"><img src="${state.element.dataset.icon}" class="Select_icon" /></span>`
//   );

//   return $state;
// }

$(() => {
  select2($);
  // multi($);

  // $('#cities-select').multi();

  let citiesSelect = document.querySelector(".cities-select");
  multi(citiesSelect, {
    // 'non_selected_header': 'All options',
    // 'selected_header': 'Selected options',
    "search_placeholder": "Введіть назву міста…",
    "hide_empty_groups": true
  });

  $('.dropdown-block--cities-select .multi-wrapper .search-input').wrapAll('<div class="multi-wrapper__header"></div>');
  $('.dropdown-block--cities-select .multi-wrapper .non-selected-wrapper, .dropdown-block--cities-select .multi-wrapper .selected-wrapper').wrapAll('<div class="multi-wrapper__body"></div>');

  $('.dropdown-block--cities-select .multi-wrapper__header').append(`
      <div class="multi-wrapper__label-wrapper">
        <div class="multi-wrapper__label">Обрані міста</div>
        <a href="#" class="btn-beige btn-beige--filter multi-wrapper__clear-btn">Очистити</a>
      </div>`
  );

  $('.dropdown-block--cities-select .multi-wrapper').addClass('multi-wrapper--default');
  $('.dropdown-block--cities-select .multi-wrapper').append(`
      <div class="multi-wrapper__footer">
        <button type="button" class="btn-grey btn-grey--multi-wrapper multi-wrapper__apply-btn">Застосувати</button>
      </div>`
  );

  $('.dropdown-block--cities-select .multi-wrapper__body').append('<div class="multi-wrapper__no-results">У вас ще немає обраних міст...</div>');

  $(document).on('click', 'a.item', function(event) {
    if ($('.dropdown-block--cities-select .selected-wrapper .selected').length) {
      $('.multi-wrapper').removeClass('multi-wrapper--default multi-wrapper--empty');
    } else {
      $('.multi-wrapper').addClass('multi-wrapper--empty');
    }

    setTimeout(() => {
      $('.dropdown-block--cities-select').addClass('dropdown-block--visible');
    });
  });

  $('.dropdown-block--cities-select .multi-wrapper__clear-btn').click(function(e) {
    console.log($('#cities-select option:selected'));

    $('#cities-select option:selected').prop('selected', false);
    $('#cities-select').trigger('change');
    console.log($('#cities-select option:selected'));

    $('.dropdown-block--cities-select .selected-wrapper .item').remove();
    $('.dropdown-block--cities-select .non-selected-wrapper .item.selected').removeClass('selected');
    $('.multi-wrapper').addClass('multi-wrapper--empty');

    e.preventDefault();
  });

  $('.dropdown-block--cities-select .multi-wrapper__apply-btn').click(function(event) {
    $(this).closest('.dropdown-block').removeClass('dropdown-block--visible');
  });

  $(document).on('click', function(e) {
    if ($('.dropdown-block--cities-select').hasClass('dropdown-block--visible')) {
      console.log(e);
    }
  });


  // let $citiesSelect = $('.cities-select').select2({
  //   // dropdownCssClass: ':all:',
  //   // selectionCssClass: ':all:',
  //   placeholder: 'Пошук...',
  //   theme: 'cities-select',
  //   closeOnSelect: false,
  //   multiple: true,
  //   // allowClear: true,
  //   dropdownAutoWidth: true,
  //   // selectOnClose: true,
  //   // templateResult: formatStateResult,
  //   // templateSelection: formatStateSelection,
  //   // dropdownAutoWidth: true,
  //   minimumResultsForSearch: -1
  // });

  $('.filter__cities-select-toggle').click(function(e) {
    console.log('mfewfw');

    setTimeout(() => {
      console.log($('.dropdown-block--cities-select .search-input'));
      $('.dropdown-block--cities-select .search-input').focus();
    }, 20);

    // setTimeout(() => {
    //   if (!$citiesSelect.select2('isOpen')) {
    //     $citiesSelect.select2('open');
    //   } else {
    //     $citiesSelect.select2('close');
    //   }
    // });
    // $citiesSelect.select2('open');
    // console.log($citiesSelect.select2('isOpen'));

  //   e.preventDefault();
  });

  $('.filter__clear-btn').click(function(e) {
    $(this).closest('.filter').find('.selected-items__item').remove();

    e.preventDefault();
  });

  // $citiesSelect.on('select2:selecting', function (e) {

  //   // $('.select2-selection__choice').remove();

  //   // setTimeout(() => {
  //   //   $('.select2-selection__choice').remove();
  //   // });
  //   // console.log(e);
  //   // let $selectResults = $('.select2-results');
  //   // let $selectSearchDropdown = $('.select2-search--dropdown');

  //   // $selectSearchDropdown.append('<div>Обрані міста</div>');
  //   // $selectResults.append('<div class="select2-results__selected">Выбранные результаты</div>');

  //   // console.log($selectResults);
  //   // console.log('before open');
  // });

  // $citiesSelect.one('select2:open', function (e) {
  //   // console.log(e);
  //   let $selectResults = $('.select2-results');
  //   let $selectSearchDropdown = $('.select2-search--dropdown');
  //   let $selectDropdown = $('.select2-dropdown');

  //   $selectSearchDropdown.append('<div>Обрані міста</div>');
  //   $selectResults.append('<div class="select2-results__selected">Выбранные результаты</div>');
  //   $selectDropdown.append('<div class="select2-dropdown__btn-wrapper"><button type="button" class="select2-dropdown__apply-btn">Застосувати</button></div>');

  //   // console.log($selectResults);
  //   // console.log('before open');
  // });

  // $citiesSelect.on('select2:closing', function (e) {
  //   console.log(e.params.args);
  //   // e.preventDefault();
  // });

  // $citiesSelect.on('select2:selecting', function (e) {
  //   console.log(e.params.args);
  //   console.log('selecting');
  //   // e.preventDefault();
  // });

  // let selectedCities = [];

  // $(document).on('click', '.select2-container--cities-select .select2-dropdown__apply-btn', function(e) {
  //   // console.log('kdkddk');
  //   $citiesSelect.select2('close');
  //   console.log($citiesSelect.select2('data'));

  //   e.preventDefault();
  // });

  // $(document).on('click', '.select2-selection--multiple', function(event) {
  //   $citiesSelect.select2('open');
  //   console.log('!!!!');
  // });

  // $citiesSelect.select2('open');

  // $('.cities-select')

  // $('.tags-select').select2({
  //   dropdownCssClass: ':all:',
  //   selectionCssClass: ':all:',
  //   theme: 'tags-select',
  //   // templateResult: formatStateResult,
  //   // templateSelection: formatStateSelection,
  //   dropdownAutoWidth: true,
  //   minimumResultsForSearch: -1
  // });
  
  $('.tags-select').select2({
    dropdownCssClass: ':all:',
    selectionCssClass: ':all:',
    theme: 'tags-select',
    // templateResult: formatStateResult,
    // templateSelection: formatStateSelection,
    dropdownAutoWidth: true,
    minimumResultsForSearch: -1
  });

  Fancybox.bind(".additional-filters-popup-link", {
    dragToClose: false,
    mainClass: 'fancybox--additional-filters-popup',

    tpl: {
      closeButton: '<button data-fancybox-close class="fancybox-close-button hidden-xxs" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path stroke="#A1A7B3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M1 17 17 1M1 1l16 16"></path></svg></button>'
    }
  });

  $('.filter-tag').click(function(event) {
    $(this).toggleClass('filter-tag--selected');

    event.preventDefault();
  });

  $('.checkboxes-group__title').click(function(event) {
    $(this).closest('.checkboxes-group').toggleClass('checkboxes-group--closed');
  });

  $('.radiobtns-group__title').click(function(event) {
    $(this).closest('.radiobtns-group').toggleClass('radiobtns-group--closed');
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

  $('.filter .selected-item__remove-link').click(function(e) {
    $(this).closest('.selected-items__item').remove();

    e.preventDefault();
  });

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

  // Clear button
  $('.additional-filters__clear-btn').click(function(event) {
    let $additionalFilters = $(this).closest('.additional-filters');
    let $additionalFiltersGroups = $additionalFilters.find('.checkboxes-group, .radiobtns-group');
    let $allCheckboxes = $additionalFilters.find('.checkbox__input');
    let $allNonCheckedRadio = $additionalFilters.find(`.radiobtn__input[value=""]`);

    $allCheckboxes.prop('checked', false);
    $allNonCheckedRadio.prop('checked', true);

    $additionalFilters.find('.form-text--filter-search').val('');
    $additionalFilters.find('.selected-items__item').remove();

    $(this).hide();
    $additionalFiltersGroups.show();

    event.preventDefault();
  });
});