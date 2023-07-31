import $ from "jquery";
import Swiper, { Pagination } from 'swiper';
import select2 from 'select2';
import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.esm.js";
import multi from "multi.js/dist/multi-es6.min.js";

function isFilterFilled() {
  let $textFields = $('.filter .form-text');
  let $select2Selections = $('.filter .select2-selection.filter-select');
  let $citiesSelectToggle = $('.filter__cities-select-toggle');

  console.log($select2Selections);

  for (const input of $textFields) {
    if ($(input).val() !== '') {
      return true;
    }
  }

  for (const selection of $select2Selections) {
    if ($(selection).hasClass('select2-selection--selected')) {
      return true;
    }
  }

  if ($citiesSelectToggle.text() !== 'Усі міста') {
    return true;
  }

  return false;
}

function checkFilterFill() {
  let $clearBtn = $('.filter__clear-btn');

  isFilterFilled() ? $clearBtn.show() : $clearBtn.hide();
}

$(() => {
  select2($);

  let $filterSelects = $('.filter-select').select2({
    dropdownCssClass: ':all:',
    selectionCssClass: ':all:',
    theme: 'filter-select',
    dropdownAutoWidth: true,
    minimumResultsForSearch: -1
  });

  $filterSelects.each(function(index, el) {
    let $select2Selection = $(el).next('.select2-container').find('.select2-selection');

    switch ($(el).attr('name')) {
      case 'experience':
        $select2Selection.find('.select2-selection__rendered').text('Досвід');
        break;
      case 'sex':
        $select2Selection.find('.select2-selection__rendered').text('Стать');
        break;
    }

    $(el).on('change', function (e) {
      console.log('Select2:select!');

      if ($(el).select2('val') !== '') {
        if (!($(el).attr('name') === 'countries' && $(el).val() === 'poland') && !($(el).attr('name') === 'currency' && $(el).val() === 'pln')) {
          $select2Selection.addClass('select2-selection--selected');
        } else {
          $select2Selection.removeClass('select2-selection--selected');
        }
      } else {
        $select2Selection.removeClass('select2-selection--selected');

        switch ($(el).attr('name')) {
          case 'experience':
            $select2Selection.find('.select2-selection__rendered').text('Досвід');
            break;
          case 'sex':
            $select2Selection.find('.select2-selection__rendered').text('Стать');
            break;
        }
      }

      checkFilterFill();
    });
  });

  let citiesSelects = document.querySelectorAll(".cities-select");
  citiesSelects.forEach(select => {
    multi(select, {
      "search_placeholder": "Введіть назву міста…",
      "hide_empty_groups": true
    });
  });

  $('.dropdown-block--cities-select').each(function(index, el) {
    $(el).find('.multi-wrapper .search-input').wrap('<div class="multi-wrapper__header"></div>');
    $(el).find('.multi-wrapper .non-selected-wrapper, .multi-wrapper .selected-wrapper').wrapAll('<div class="multi-wrapper__body"></div>');

    $(el).find('.multi-wrapper__header').append(`
        <div class="multi-wrapper__label-wrapper">
          <div class="multi-wrapper__label">Обрані міста</div>
          <a href="#" class="btn-beige btn-beige--filter multi-wrapper__clear-btn">Очистити</a>
        </div>`
    );

    $(el).find('.multi-wrapper').addClass('multi-wrapper--default');
    $(el).find('.multi-wrapper').append(`
        <div class="multi-wrapper__footer">
          <button type="button" class="btn-grey btn-grey--multi-wrapper multi-wrapper__apply-btn">Застосувати</button>
        </div>`
    );

    $(el).find('.multi-wrapper__body').append('<div class="multi-wrapper__no-results">У вас ще немає обраних міст...</div>');
  });

  $(document).on('click', 'a.item', function(e) {
    // setTimeout(() => {
      // let $multiWrapperBody = $(this).closest('.multi-wrapper__body');
      // let $citiesDropdownBlock = $('.dropdown-block--cities-select.dropdown-block--visible');
      // let $dropdownBlockID = $citiesDropdownBlock.attr('id');
      // let $selectToggle = $(`.select-toggle[href="#${$dropdownBlockID}"]`);
      // let $selectedCities = $citiesDropdownBlock.find('.selected-wrapper .selected');

      // $selectToggle.attr('data-selected-cities', 'my-value');

      // $(this).show();

      // console.log($selectToggle);
      // console.log($selectedCities);
      // console.log($multiWrapperBody);
      // console.log($(this).parent());

      // console.log($(e.target).parents('.multi-wrapper'));
      // console.log($selectedCities);
    // });
    

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
    $('#cities-select option:selected').prop('selected', false);
    $('#cities-select').trigger('change');

    $('.dropdown-block--cities-select .selected-wrapper .item').remove();
    $('.dropdown-block--cities-select .non-selected-wrapper .item.selected').removeClass('selected');
    $('.multi-wrapper').addClass('multi-wrapper--empty');

    e.preventDefault();
  });

  $('.dropdown-block--cities-select .multi-wrapper__apply-btn').click(function(event) {
    let $dropdownBlock = $(this).closest('.dropdown-block');
    let $selectedCities = $dropdownBlock.find('.selected-wrapper .item.selected');
    let $dropdownBlockID = $dropdownBlock.attr('id');
    let $selectToggle = $(`.select-toggle[href="#${$dropdownBlockID}"]`);
    let selectToggleText = $selectToggle.data('default-placeholder');

    $dropdownBlock.removeClass('dropdown-block--visible');

    if ($selectedCities.length) {
      selectToggleText = $selectedCities.length === 1 ? $selectedCities[0].textContent : $selectedCities[0].textContent + `<span class="count count--info-bg count--selected-cities select-toggle__count">+${$selectedCities.length - 1}</span>`;
      $selectToggle.addClass('select-toggle--selected');
    } else {
      $dropdownBlock.find('.multi-wrapper--empty').removeClass('multi-wrapper--empty').addClass('multi-wrapper--default');
      $selectToggle.removeClass('select-toggle--selected');
    }

    $selectToggle.html(selectToggleText);

    console.log($selectedCities.map((index, element) => $(element).attr('multi-index')));
    $selectToggle.attr('data-selected-cities', $selectedCities.map((index, element) => $(element).attr('multi-index')).toArray());
    console.log($selectToggle.data('selected-cities'));

    checkFilterFill();
  });


  $(document).on('click', function(e) {
    if ($('.dropdown-block--cities-select').hasClass('dropdown-block--visible')) {
      if (!$(e.target).closest('.dropdown-block').length && !$(e.target).closest('a.item').length) {
        let $visibleDropdownBlock = $('.dropdown-block--cities-select.dropdown-block--visible');
        let $selectedCities = $visibleDropdownBlock.find('.selected-wrapper .item.selected');
        let $dropdownBlockID = $visibleDropdownBlock.attr('id');
        let $selectToggle = $(`.select-toggle[href="#${$dropdownBlockID}"]`);
        let selectToggleText = $selectToggle.data('default-placeholder');

        $visibleDropdownBlock.find('.multi-wrapper__clear-btn').click();
        $selectToggle.html(selectToggleText);

        if (!$selectedCities.length) {
          $visibleDropdownBlock.find('.multi-wrapper--empty').removeClass('multi-wrapper--empty').addClass('multi-wrapper--default');
        } else {
          $selectToggle.removeClass('select-toggle--selected');
        }

        // let $prevSelectedCitiesIDs = $selectToggle.attr('data-selected-cities');
        // // console.log($prevSelectedCitiesIDs);
        // if ($prevSelectedCitiesIDs === '') return;

        // $prevSelectedCitiesIDs = $prevSelectedCitiesIDs.split(',');

        // $.each($prevSelectedCitiesIDs, function( index, value ) {
        //   // console.log(value);
        //   // console.log( $visibleDropdownBlock.find(`.non-selected-wrapper .item[multi-index="${value}"]`) );
        //   $visibleDropdownBlock.find(`.non-selected-wrapper .item[multi-index="${value}"]`).click();
        //   setTimeout(() => {
        //     console.log($('#cities-select option:selected'));
        //   });
          
        // });
      }
    }
  });


  $(document).on('click', '.filter__cities-select-toggle', function(e) {
    setTimeout(() => {
      $('#cities-dropdown-block .search-input').focus();
    }, 100);
  });

  $(document).on('click', '.filter__filter-cities-select-toggle', function(e) {
    setTimeout(() => {
      $('#filter-cities-dropdown-block .search-input').focus();
    }, 100);
  });

  $('.filter__clear-btn').click(function(e) {
    let $filter = $(this).closest('.filter');
    let $filterSelects = $filter.find('.filter-select');
    let $additionalFiltersClearBtn = $('.additional-filters__clear-btn');

    let $multiWrapperClearBtn = $('.dropdown-block--cities-select .multi-wrapper__clear-btn');
    let $citiesSelectToggle = $filter.find('.filter__cities-select-toggle');
    let citiesSelectToggleText = $citiesSelectToggle.data('default-placeholder');

    $filterSelects.next('.select2-container').find('.select2-selection').removeClass('select2-selection--selected');
    $filterSelects.each(function(index, el) {
      let value = '';

      if ($(el).hasClass('filter__countries-select')) {
        value = 'poland';
      } else if ($(el).hasClass('filter__currencies-select')) {
        value = 'pln';
      }

      $(el).val(value).trigger('change');
    });

    $additionalFiltersClearBtn.click();

    $multiWrapperClearBtn.click();
    $('.filter__cities-dropdown-block .multi-wrapper').removeClass('multi-wrapper--empty').addClass('multi-wrapper--default');

    $citiesSelectToggle.html(citiesSelectToggleText);
    $citiesSelectToggle.removeClass('select-toggle--selected');

    $(this).hide();
  });

  // $('.tags-select').select2({
  //   dropdownCssClass: ':all:',
  //   selectionCssClass: ':all:',
  //   theme: 'tags-select',
  //   dropdownAutoWidth: true,
  //   minimumResultsForSearch: -1
  // });

  // Fancybox.bind(".additional-filters-popup-link", {
  //   dragToClose: false,
  //   mainClass: 'fancybox--additional-filters-popup',

  //   tpl: {
  //     closeButton: '<button data-fancybox-close class="fancybox-close-button hidden-xxs" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path stroke="#A1A7B3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M1 17 17 1M1 1l16 16"></path></svg></button>'
  //   }
  // });

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

  $(document).on('click', '.filter .selected-item__remove-link', function(e) {
    let $selectedItem = $(this).closest('.selected-items__item');
    let $otherSelectedItem = $(`.additional-filters .selected-items__item[data-name="${$selectedItem.data('name')}"][data-value="${$selectedItem.data('value')}"]`);

    $selectedItem.remove();
    $otherSelectedItem.find('.selected-item__remove-link').click();

    e.preventDefault();
  });

  // $('.filter .form-text[type="number"]').on('input', function(e) {
    // let charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
    // let charStr = String.fromCharCode(charCode);

    // console.log('kddkkdkdk');
    // console.log(charStr);

    // this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');

    // if (!charStr.match(/^[0-9]+$/)) {
      // e.preventDefault();    
    // }
  // });

  $('.filter .form-text').on('input', function(e) {
    checkFilterFill();
  });

  // Search in filter
  $('input[name="search_filter"]').on('input', function(event) {
    let searchValue = $(this).val().toLowerCase().trim();
    let $additionalFilters = $(this).closest('.additional-filters');
    let $additionalFiltersGroups = $additionalFilters.find('.checkboxes-group, .radiobtns-group');

    $additionalFiltersGroups.each( (index, group) => {
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
    let $clearBtn = $('.additional-filters__clear-btn');

    searchValue ? $clearBtn.show() : $clearBtn.hide();
  });

  // Removing selected items
  $(document).on('click', '.additional-filters .selected-item__remove-link', function(event) {
    let $selectedItemParent = $(this).closest('.selected-items__item');
    let $additionalFilters = $selectedItemParent.closest('.additional-filters');
    let $clearBtn = $additionalFilters.find('.additional-filters__clear-btn');

    if ($selectedItemParent.data('name') !== undefined && $selectedItemParent.data('value') !== undefined) {
      let selectedItemName = $selectedItemParent.data('name');

      if ($selectedItemParent.data('type') === 'checkbox') {

        let selectedItemValue = $selectedItemParent.data('value');
        let $selectedCheckbox = $additionalFilters.find(`.checkbox__input[name="${selectedItemName}"][value="${selectedItemValue}"]`);

        $selectedCheckbox.prop("checked", false);

        let $otherSelectedItem = $(`.filter .selected-items__item[data-name="${selectedItemName}"][data-value="${selectedItemValue}"]`);
        $otherSelectedItem.remove();

      } else if ($selectedItemParent.data('type') === 'radio') {
        let $nonCheckedRadio = $additionalFilters.find(`.radiobtn__input[name="${selectedItemName}"][value=""]`);
        $nonCheckedRadio.prop('checked', true);
      }
    }

    $selectedItemParent.remove();
    $additionalFilters.find('.selected-items__item').length ? $clearBtn.show() : $clearBtn.hide();

    event.preventDefault();
  });

  // Adding selected checkboxes/radio buttons
  $('.additional-filters .checkbox__input, .additional-filters .radiobtn__input').click(function(event) {
    let labelText = $(this).parent().find('label').text();
    let $additionalFilters = $(this).closest('.additional-filters');
    let $selectedItemsList = $('.selected-items__list');
    let $selectedItem = $(`.selected-items__item[data-name="${$(this).attr('name')}"][data-value="${$(this).val()}"]`);
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
        $selectedItem.remove();
      }
    } else if ($(this).is(':radio')) {
      let groupTitle = $(this).closest('.radiobtns-group').find('.radiobtns-group__title').text();
      let $otherSelectedItems = $(`.selected-items__item[data-name="${$(this).attr('name')}"]`).not(`[data-value="${$(this).val()}"]`);
      $otherSelectedItems.remove();

      if (!$selectedItem.length && $(this).val() !== '') {
        $selectedItemsList.append(`
          <li class="selected-items__item" data-type="radio" data-name="${$(this).attr('name')}" data-value="${$(this).val()}">
            <div class="selected-item">
              <div class="selected-item__value"><strong>${groupTitle}:</strong> ${labelText}</div>
              <a href="#" class="selected-item__remove-link"></a>
            </div>
          </li>`);
      }
    }

    $additionalFilters.find('.selected-items__item').length ? $clearBtn.show() : $clearBtn.hide();
  });

  // Clear additional filters
  $('.additional-filters__clear-btn').click(function(event) {
    let $additionalFilters = $(this).closest('.additional-filters');
    let $additionalFiltersGroups = $additionalFilters.find('.checkboxes-group, .radiobtns-group');
    let $allCheckboxes = $additionalFilters.find('.checkbox__input');
    let $allNonCheckedRadio = $additionalFilters.find(`.radiobtn__input[value=""]`);

    $allCheckboxes.prop('checked', false);
    $allNonCheckedRadio.prop('checked', true);

    $additionalFilters.find('.form-text--filter-search').val('');
    $('.selected-items__item').remove();

    $(this).hide();
    $additionalFiltersGroups.show();
  });

  $('.additional-filters__clear-filter-btn').click(function(event) {
    $('.additional-filters__clear-btn').click();
  });
});