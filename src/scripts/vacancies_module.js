import $ from "jquery";
import Swiper, { Pagination } from 'swiper';
import select2 from 'select2';
import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.esm.js";
import PerfectScrollbar from 'perfect-scrollbar';

function isFilterChanged() {
  let $textFields = $('.filter .form-text');
  let $select2Selections = $('.filter .select2-selection.filter-select');
  let $citiesSelectToggle = $('.filter__cities-select-toggle');

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

  isFilterChanged() ? $clearBtn.show() : $clearBtn.hide();
}

function changeFiltersBodyMaxHeight (selectedItemsLength) {
  let $additionalFiltersHeaderBottom = $('.additional-filters__header-bottom');
  let $additionalFiltersBody = $('.additional-filters__body');

  if (selectedItemsLength) {
    $additionalFiltersBody.css('max-height', `calc(${473 - $additionalFiltersHeaderBottom.height()}px)`);
  } else {
    $additionalFiltersBody.css('max-height', '');
  }
}

function setVisibilitySelectedMoreItem (selectedItemsLength) {
  let $additionalFiltersSelectedItems = $('.additional-filters__selected-items');
  let $additionalFiltersSelectedMoreItem = $additionalFiltersSelectedItems.find('.selected-items__more-item');
  let moreItemsCount = selectedItemsLength - 11;

  if (selectedItemsLength > 11) {
    $additionalFiltersSelectedMoreItem.removeClass('hidden');
  } else {
    $additionalFiltersSelectedMoreItem.addClass('hidden');
  }

  $additionalFiltersSelectedMoreItem.find('.more-btn__count').text(`+${moreItemsCount}`);
}

function clearFilter () {
  let $filterSelects = $('.filter .filter-select, .additional-filters .filter-select');
  let $additionalFiltersGroups = $('.additional-filters .checkboxes-group, .additional-filters .radiobtns-group');
  let $allCheckboxes = $('.additional-filters .checkbox__input');
  let $allNonCheckedRadio = $(`.additional-filters .radiobtn__input[value=""]`);
  let $clearBtn = $(`.filter__clear-btn`);
  let $additionalFiltersClearBtn = $('.additional-filters__clear-btn');

  $filterSelects.next('.select2-container').find('.select2-selection').removeClass('select2-selection--selected');
  $filterSelects.each(function(index, el) {
    let value = '';

    if ($(el).hasClass('filter__countries-select') || $(el).hasClass('additional-filters__countries-select')) {
      value = 'poland';
    } else if ($(el).hasClass('filter__currencies-select')) {
      value = 'pln';
    }

    $(el).val(value).trigger('change');
  });

  $clearBtn.hide();
  $additionalFiltersClearBtn.hide();

  $allCheckboxes.prop('checked', false);
  $allNonCheckedRadio.prop('checked', true);

  $('.selected-items__item').remove();
  $additionalFiltersGroups.show();

  setVisibilitySelectedMoreItem(0);
  changeFiltersBodyMaxHeight(0);
}

function changeFilterParam () {
  // body... 
}

function removeItemFromArray (array, value) {
  let index = array.indexOf(value);

  if (index > -1) {
    array.splice(index, 1);
  }

  return array;
}

$(() => {
  select2($);

  let selectedCitiesIdx = [];
  let currentSelectedCitiesIdx = [];

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
      let name = $(this).attr('name');
      let value = $(this).select2('val');

      if (value !== '') {
        if (name !== 'countries' && name !== 'currency') {
          $select2Selection.addClass('select2-selection--selected');
        } else {
          $select2Selection.removeClass('select2-selection--selected');
        }

        switch (name) {
          case 'countries':
            if (e.params === undefined || e.params.calledFromCode === undefined) {
              $('select[name="countries"]').val(value).trigger({
                type: 'change',
                params: {
                  calledFromCode: true
                }
              });
            }

            break;
          case 'experience':
            // console.log(value);
            // console.log($(`.additional-filters .radiobtn__input[value="${value}"]`));
            if (e.params === undefined || e.params.calledFromCode === undefined) {
              $(`.additional-filters .radiobtn__input[value="${value}"]`).click();
            }

            break;
          case 'sex':
            if (e.params === undefined || e.params.calledFromCode === undefined) {
              $(`.additional-filters .checkbox__input[value="${value}"]`).click();
            }

            break;
        }
      } else {
        $select2Selection.removeClass('select2-selection--selected');

        switch (name) {
          case 'experience':
            $select2Selection.find('.select2-selection__rendered').text('Досвід');

            if (e.params === undefined || e.params.calledFromCode === undefined) {
              $(`.additional-filters .radiobtn__input[value="${value}"]`).click();
            }

            break;
          case 'sex':
            $select2Selection.find('.select2-selection__rendered').text('Стать');

            if (e.params === undefined || e.params.calledFromCode === undefined) {
              $(`.additional-filters .checkbox__input[value="${value}"]`).click();
            }

            break;
        }
      }

      checkFilterFill();
    });
  });


  $(document).on('click', '.select-toggle', function(e) {
    let $targetElem = $($(this).attr('href'));

    setTimeout(() => {
      $targetElem.find('.ms-selectable__search-input').focus();
    });
  });

  $('.filter__clear-btn, .additional-filters__clear-btn, .additional-filters__clear-filter-btn').click(clearFilter);


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
      // loop: true,
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
    let name = $selectedItem.data('name');
    let value = $selectedItem.data('value');
    let $otherSelectedItem = $(`.additional-filters .selected-items__item[data-name="${name}"][data-value="${value}"]`);

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

  $('.filter .form-text:not([type="search"])').on('input', function(e) {
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

  // Show/hide clear button on search by filter
  // $('input[name="search_filter"]').on('input', function(event) {
  //   let searchValue = $(this).val().toLowerCase().trim();
  //   let $clearBtn = $('.additional-filters__clear-btn');

  //   searchValue ? $clearBtn.show() : $clearBtn.hide();
  // });

  // Removing selected items
  $(document).on('click', '.additional-filters .selected-item__remove-link', function(event) {
    let $selectedItemParent = $(this).closest('.selected-items__item');
    let $additionalFilters = $selectedItemParent.closest('.additional-filters');
    let $clearBtn = $('.filter__clear-btn');
    let $additionalClearBtn = $additionalFilters.find('.additional-filters__clear-btn');

    let name = $selectedItemParent.data('name');
    let value = $selectedItemParent.data('value');
    let inputType = $selectedItemParent.data('type');

    if (name !== undefined && value !== undefined) {
      switch (inputType) {
        case 'checkbox':
          let $selectedCheckbox = $additionalFilters.find(`.checkbox__input[name="${name}"][value="${value}"]`);
          $selectedCheckbox.prop("checked", false);

          let $otherSelectedItem = $(`.filter .selected-items__item[data-name="${name}"][data-value="${value}"]`);
          $otherSelectedItem.remove();

          if (['filters[men]', 'filters[women]', 'filters[couples]'].includes(name)) {
            $('.filter__sex-select').val('').trigger({
              type: 'change',
              params: {
                calledFromCode: true
              }
            });
          }

          break;
        case 'radio':
          let $nonCheckedRadio = $additionalFilters.find(`.radiobtn__input[name="${name}"][value=""]`);
          $nonCheckedRadio.prop('checked', true);

          if (['filters[5]'].includes(name)) {
            $('.filter__experience-select').val('').trigger({
              type: 'change',
              params: {
                calledFromCode: true
              }
            });
          }

          break;
      }      
    }

    $selectedItemParent.remove();

    let selectedItemsLength = $additionalFilters.find('.selected-items__item').length;

    if (selectedItemsLength) {
      $clearBtn.show();
      $additionalClearBtn.show();
    } else {
      $clearBtn.hide();
      $additionalClearBtn.hide();
    }

    setVisibilitySelectedMoreItem(selectedItemsLength);
    event.preventDefault();
  });

  // Adding selected checkboxes/radio buttons
  $('.additional-filters .checkbox__input, .additional-filters .radiobtn__input').click(function(event) {
    let name = $(this).attr('name');
    let value = $(this).val();
    let labelText = $(this).parent().find('label').text();
    let $additionalFilters = $(this).closest('.additional-filters');
    let $selectedItemsList = $('.selected-items__list');
    let $selectedItem = $(`.selected-items__item[data-name="${name}"][data-value="${value}"]`);
    let $clearBtn = $('.filter__clear-btn');
    let $additionalClearBtn = $additionalFilters.find('.additional-filters__clear-btn');

    if ($(this).is(':checkbox')) {
      if ($(this).is(':checked')) {
        $selectedItemsList.append(`
          <li class="selected-items__item" data-type="checkbox" data-name="${name}" data-value="${value}">
            <div class="selected-item">
              <div class="selected-item__value">${labelText}</div>
              <a href="#" class="selected-item__remove-link"></a>
            </div>
          </li>`);

        if (['filters[men]', 'filters[women]', 'filters[couples]'].includes(name)) {
          $('.selected-items--filter').find(`.selected-items__item[data-name="${name}"]`).remove();
          $('.filter__sex-select').val(value).trigger({
            type: 'change',
            params: {
              calledFromCode: true
            }
          });
        }
      } else {
        $selectedItem.remove();
      }
    } else if ($(this).is(':radio')) {
      let groupTitle = $(this).closest('.radiobtns-group').find('.radiobtns-group__title').text();
      let $otherSelectedItems = $(`.selected-items__item[data-name="${name}"]`).not(`[data-value="${value}"]`);
      $otherSelectedItems.remove();

      if (!$selectedItem.length && value !== '') {
        $selectedItemsList.append(`
          <li class="selected-items__item" data-type="radio" data-name="${name}" data-value="${value}">
            <div class="selected-item">
              <div class="selected-item__value"><strong>${groupTitle}:</strong> ${labelText}</div>
              <a href="#" class="selected-item__remove-link"></a>
            </div>
          </li>`);

        if (['filters[5]'].includes(name)) {
          $('.selected-items--filter').find(`.selected-items__item[data-name="${name}"]`).remove();
        }
      }

      $('.filter__experience-select').val(value).trigger({
        type: 'change',
        params: {
          calledFromCode: true
        }
      });
    }

    let selectedItemsLength = $additionalFilters.find('.selected-items__item').length;

    if (selectedItemsLength) {
      $clearBtn.show();
      $additionalClearBtn.show();
    } else {
      $clearBtn.hide();
      $additionalClearBtn.hide();
    }

    setVisibilitySelectedMoreItem(selectedItemsLength);
    changeFiltersBodyMaxHeight(selectedItemsLength);
  });

  $('.selected-items__more-btn').click(function(event) {
    let $selectedItems = $(this).closest('.selected-items');

    $(this).toggleClass('more-btn--active');

    if ($(this).hasClass('more-btn--active')) {
      $(this).find('.more-btn__text').text('Приховати');
    } else {
      $(this).find('.more-btn__text').text('Ще');
    }

    $selectedItems.toggleClass('selected-items--expanded');
  });
});