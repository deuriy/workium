import $ from "jquery";
import Swiper, { Pagination } from 'swiper';
import select2 from 'select2';
import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.esm.js";
import PerfectScrollbar from 'perfect-scrollbar';
import noUiSlider from 'nouislider';
// import { FilterTag } from './components/filter_tag.js';
// import { SearchInput } from './components/search_input.js';

// window.customElements.define('search-input', SearchInput);

let selectedFiltersCount = 0;

// function isFilterChanged() {
//   let $textFields = $('.filter .form-text');
//   let $select2Selections = $('.filter .select2-selection.filter-select');
//   let $citiesSelectToggle = $('.filter__cities-select-toggle .select-toggle__label');
//   let $sexSelectToggle = $('.filter__sex-select-toggle .select-toggle__label');
//   let result = false;

//   for (const input of $textFields) {
//     if ($(input).val() !== '') {
//       result = true;
//     }
//   }

//   // console.log('!!!');

//   for (const selection of $select2Selections) {
//     if ($(selection).hasClass('select2-selection--selected')) {
//       result = true;
//     }
//   }

//   // console.log($citiesSelectToggle);

//   $citiesSelectToggle.each(function(index, el) {
//     // console.log($(el).text().trim());

//     if ($(el).text().trim() !== 'Усі міста') {
//       result = true;
//     }
//   });

//   // if ($citiesSelectToggle.text().trim() !== 'Усі міста') {
//   //   return true;
//   // }

//   // console.log($sexSelectToggle);

//   $sexSelectToggle.each(function(index, el) {
//     // console.log($(el).text().trim());

//     if ($(el).text().trim() !== 'Стать') {
//       result = true;
//     }
//   });

//   // if ($sexSelectToggle.text().trim() !== 'Стать') {
//   //   return true;
//   // }

//   // console.log(result);

//   return result;
// }

// function checkFilterFill() {
//   let $clearBtn = $('.filter__clear-btn');
//   let $additionalClearBtn = $('.additional-filters__clear-btn');

//   isFilterChanged() ? $clearBtn.show() : $clearBtn.hide();
//   isFilterChanged() ? $additionalClearBtn.show() : $additionalClearBtn.hide();
// }

function toggleClearButtons () {
  let $additionalFilters = $('.additional-filters');
  let $clearBtn = $('.filter__clear-btn');
  let $additionalFiltersClearBtn = $additionalFilters.find('.additional-filters__clear-btn');
  let $additionalFiltersClearLink = $additionalFilters.find('.additional-filters__clear-link');
  let selectedItemsLength = $additionalFilters.find('.selected-items__item').length;
  let $filtersBtn = $('.btn-white--filter');
  let $filtersBtnCount = $filtersBtn.find('.btn-white__count');

  // console.log(`selectedItemsLength: ${selectedItemsLength}`);

  if (selectedItemsLength) {
    // $selectedItems.show();
    $clearBtn.show();
    $additionalFiltersClearBtn.show();
    $additionalFiltersClearLink.show();
    $filtersBtn.removeClass('btn-white--filter-dark-icon');
    $filtersBtnCount.removeClass('hidden').text(selectedItemsLength);
  } else {
    // $selectedItems.hide();
    $clearBtn.hide();
    $additionalFiltersClearBtn.hide();
    $additionalFiltersClearLink.hide();
    $filtersBtn.addClass('btn-white--filter-dark-icon');
    $filtersBtnCount.addClass('hidden').text('');
  }
}

function setVisibilitySelectedMoreItem (selectedItemsLength) {
  $('.selected-items').each(function(index, item) {
    let $moreItem = $(item).find('.selected-items__more-item');
    let moreItemsCount = selectedItemsLength - 11;

    if (selectedItemsLength > 11) {
      $moreItem.removeClass('hidden');
    } else {
      $moreItem.addClass('hidden');
    }

    $moreItem.find('.more-btn__count').text(`+${moreItemsCount}`);
  });
}

function checkDependentFilters () {
  let $dependentFilters = $('[data-parent-filter-id]');

  $dependentFilters.each(function(index, el) {
    let parentFilterId = $(el).data('parent-filter-id')
    let parentFilterItemId = $(el).data('parent-filter-item-id');

    let $parentFilter = $(`.additional-filters [data-filter-id="${parentFilterId}"]`);
    let $parentFilterItem = $parentFilter.find(`[data-filter-item-id="${parentFilterItemId}"]`);

    if (!$parentFilterItem.is(':checked')) {
      $(el).hide();
    } else {
      $(el).show();
    }
  });
}

function clearFilter () {
  let $filterSelects = $('.filter select.filter-select, .additional-filters select.filter-select');
  let $additionalFiltersGroups = $('.additional-filters .checkboxes-group, .additional-filters .radiobtns-group');
  let $allCheckboxes = $('.additional-filters .checkbox__input');
  let $allNonCheckedRadio = $(`.additional-filters .radiobtn__input[value=""]`);
  let $clearBtn = $(`.filter__clear-btn`);
  let $filtersBtn = $('.btn-white--filter .btn-white__count');
  let $additionalFiltersClearBtn = $('.additional-filters__clear-btn');
  let $additionalFiltersClearLink = $('.additional-filters__clear-link');

  // console.log($filterSelects);

  $filterSelects.next('.select2-container').find('.select2-selection').removeClass('select2-selection--selected');
  $filterSelects.each(function(index, el) {
    let value = '';

    // console.log($(el).attr('name'));

    // if ($(el).hasClass('filter__countries-select') || $(el).hasClass('additional-filters__countries-select')) {
    //   value = 'poland';
    // }

    if ($(el).hasClass('filter__currencies-select')) {
      value = 'pln';
    }

    if ($(el).attr('name') !== 'countries') {
      $(el).val(value).trigger('change');
    }
  });

  $clearBtn.hide();
  $additionalFiltersClearBtn.hide();
  $additionalFiltersClearLink.hide();

  $allCheckboxes.prop('checked', false);
  $allNonCheckedRadio.prop('checked', true);

  $('.selected-items__item').remove();
  $additionalFiltersGroups.show();

  // $('.selected-items--filter-params').hide();

  setVisibilitySelectedMoreItem(0);
  checkDependentFilters();
  $filtersBtn.addClass('hidden').text(0);
}

function removeItemFromArray (array, value) {
  let index = array.indexOf(value);

  if (index > -1) {
    array.splice(index, 1);
  }

  return array;
}

function findFilterTagByValue (name, value) {
  let $container = $('.selected-items__list');
  let $selectedItem = $container.find(`.selected-items__item[data-name="${name}"][data-value="${value}"]`);

  return $selectedItem;
}

// function findFilterTagById (id) {
//   let $container = $('.selected-items__list');
//   let $selectedItem = $container.find(`.selected-items__item[data-name="${name}"][data-value="${value}"]`);

//   return $selectedItem;
// }

function clearTextField ($input) {
  $input.removeClass('form-text--filter-search-filled').val('');
  $input.parent().find('[data-clear-search-input]').hide();
}

function removeFilterTag (type, name, value) {
  let $selectedItem;

  if (['range', 'textfield'].includes(type)) {
    $selectedItem = $(`.selected-items__item[data-name="${name}"]`);
    // console.log('first');
  } else if (['checkbox', 'radio'].includes(type)) {
    $selectedItem = findFilterTagByValue(name, value);
    // console.log('second');
  }

  // console.log($selectedItem);

  $selectedItem.remove();
}

function createOrUpdateTag (type, name, value, labelText) {
  let $container = $('.selected-items__list');
  let $selectedItem = findFilterTagByValue(name, value);

  if ($selectedItem.length) return;

  let htmlStr = `
              <li class="selected-items__item" data-type="${type}" data-name="${name}" data-value="${value}">
                <div class="selected-item">
                  <div class="selected-item__value">${labelText}</div>
                  <a href="#" class="selected-item__remove-link"></a>
                </div>
              </li>`;

  if (['range', 'textfield', 'select'].includes(type)) {
    $selectedItem = $(`.selected-items__item[data-name="${name}"]`);

    if ($selectedItem.length) {
      $selectedItem.attr('data-type', type);
      $selectedItem.attr('data-name', name);
      $selectedItem.attr('data-value', value);
      $selectedItem.find('.selected-item__value').html(labelText);

      return;
    }
  }

  $container.append(htmlStr);
}


$(() => {
  select2($);

  let selectedCitiesIdx = [];
  let currentSelectedCitiesIdx = [];
  let $filterSelects = $();

  $('.filter-select').each(function(index, el) {
    if ($(window).width() > 575 || ($(window).width() < 576 && !$(el).hasClass('hidden-xs'))) {
      let $item = $(el).select2({
        dropdownCssClass: ':all:',
        selectionCssClass: ':all:',
        theme: 'filter-select',
        dropdownAutoWidth: true,
        minimumResultsForSearch: -1
      });

      $filterSelects = $filterSelects.add($item);
    }
  });

  $filterSelects.each(function(index, el) {
    let $select2Selection = $(el).next('.select2-container').find('.select2-selection');
    let name = $(el).attr('name');
    let value = $(el).select2('val');
    let $label = $select2Selection.find('.select2-selection__rendered');

    // console.log(name);

    if (name === 'kategoriia-pracivnika') {
      if (!value) {
        $label.text('Спеціалізація');
      } else {
        $select2Selection.addClass('select2-selection--selected');
      }
    }

    $(el).on('change', function (e) {
      let value = $(this).select2('val');

      if (name === 'kategoriia-pracivnika') {
        if (value !== '') {
          $select2Selection.addClass('select2-selection--selected');
          createOrUpdateTag("select", name, value, `<strong>Категорія працівника:</strong> ${$label.text()}`);
        } else {
          $select2Selection.removeClass('select2-selection--selected');
          let $selectedItem = $(`.selected-items__item[data-type="select"][data-name="${name}"]`);
          // console.log($selectedItem);

          $selectedItem.remove();

          $label.text('Спеціалізація');
        }
      }

      if (!['countries', 'currency'].includes(name)) {
        toggleClearButtons();
      }
    });
  });


  $(document).on('click', '.select-toggle', function(e) {
    let $targetElem = $($(this).attr('href'));

    setTimeout(() => {
      $targetElem.find('.ms-selectable__search-input').focus();
    });
  });

  $('.filter__clear-btn, .additional-filters__clear-btn, .additional-filters__clear-filter-btn, .additional-filters__clear-link').click(clearFilter);


  $('.filter-tag').click(function(event) {
    $(this).toggleClass('filter-tag--selected');

    event.preventDefault();
  });


  if ($(window).width() < 768) {
    
    document.querySelectorAll('.promo-blocks-swiper:not(.swiper-initialized)').forEach(item => {
      let slidesCount = $(item).find('.swiper-slide').length;

      const promoBlocksSwiper = new Swiper(item, {
        modules: [Pagination],
        // loop: true,
        slidesPerView: 'auto',
        centeredSlides: slidesCount < 2,
        spaceBetween: 8,

        pagination: {
          el: '.promo-blocks-swiper__pagination',
          bulletActiveClass: 'swiper-pagination-bullet--active',
          // clickable: true
        },
      });

      if (promoBlocksSwiper.slides.length === 1) {
        $(promoBlocksSwiper.pagination.el).hide();
      }
    });
  }

  // Removing selected items
  $(document).on('click', '.selected-item__remove-link', function(event) {
    let $selectedItemParent = $(this).closest('.selected-items__item');
    // let $additionalFilters = $selectedItemParent.closest('.additional-filters');
    let selectedItemsLength = $('.selected-items__item').length;

    let name = $selectedItemParent.data('name');
    let value = $selectedItemParent.data('value');
    let type = $selectedItemParent.data('type');

    if (['range', 'textfield', 'multiselect'].includes(type)) {
      let $otherSelectedItem = $(`.selected-items__item[data-name="${name}"][data-value="${value}"]`);
      $otherSelectedItem.remove();
    }

    // console.log(type);

    if (![name, value].includes(undefined)) {
      switch (type) {
        case 'checkbox':
          let $selectedCheckbox = $(`.checkbox__input[name="${name}"][value="${value}"]`);
          $selectedCheckbox.prop("checked", false);

          let $otherSelectedItem = $(`.selected-items__item[data-name="${name}"][data-value="${value}"]`);
          $otherSelectedItem.remove();

          break;
        case 'radio':
          let $nonCheckedRadio = $(`.radiobtn__input[name="${name}"][value=""]`);
          $nonCheckedRadio.prop('checked', true);

          // console.log($nonCheckedRadio);

          break;
        case 'range':
          let $rangeSlider = $(`.range-slider[data-name="${name}"]`);
          let min = $rangeSlider.data('min');
          let max = $rangeSlider.data('max');

          $rangeSlider[0].noUiSlider.set([min, max]);

          break;

        case 'select':
          let $select = $(`select[name="${name}"]`);
          $select.val('').trigger('change');

          break;
      }
    }

    $selectedItemParent.remove();

    setTimeout(() => {
      toggleClearButtons();
    });

    setVisibilitySelectedMoreItem(selectedItemsLength);
    checkDependentFilters();
    checkDefaultValue();

    // console.log('233323');

    event.preventDefault();
  });

  $('.filter .form-text:not([type="search"])').on('input', function(e) {
    // checkFilterFill();

    setTimeout(() => {
      toggleClearButtons();
    });
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

  // Adding selected checkboxes/radio buttons
  $('.additional-filters').find('.checkbox__input, .radiobtn__input').change(function(event) {
    let name = $(this).attr('name');
    let value = $(this).val();
    let labelText = $(this).parent().find('label').text();
    let selectedItemsLength = $('.selected-items__item').length;
    let $selectedItem = $(`.selected-items__item[data-name="${name}"][data-value="${value}"]`);

    // console.log('Checkbox trigger!!');

    if ($(this).is(':checkbox')) {
      if ($(this).is(':checked')) {
        createOrUpdateTag("checkbox", name, value, labelText);
      } else {
        $selectedItem.remove();
      }
    } else if ($(this).is(':radio')) {
      let groupTitle = $(this).closest('.radiobtns-group').find('.radiobtns-group__title').text();
      let $otherSelectedItems = $(`.selected-items__item[data-name="${name}"]`).not(`[data-value="${value}"]`);

      // console.log($otherSelectedItems);

      $otherSelectedItems.remove();

      console.log(value);

      if (value !== '') {
        createOrUpdateTag("radio", name, value, `<strong>${groupTitle}:</strong> ${labelText}`);
      }
    }

    toggleClearButtons();
    setVisibilitySelectedMoreItem(selectedItemsLength);
    checkDependentFilters();
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

  // Creating filter URL
  $('.filter__search-btn, .additional-filters__submit-btn').on('click', function(event) {
    event.preventDefault();

    let urlParamsArr = [];
    let requestParamsArr = [];
    let urlParams = '';
    let requestParams = '';

    // Get url params
    let selectedCountry = $('select[name="countries"]').val();
    // let selectedCitiesSlugs = $('select[name="cities"] option:selected').val().map(function(id, index) {
      // console.log(id);
      // console.log($(`select[name="cities"] option[value="${id}"]`));
      // return $(`select[name="cities"] option[value="${id}"]`).attr('data-seo-slug');
    // });
    console.log(selectedCountry);

    // let selectedCitiesSlugs = $('select[name="cities"] option:selected').map(function(index, elem) {
    //   return $(elem).attr('data-seo-slug');
    // });
    // console.log($('select[name="cities"] option:selected'));

    let selectedCitiesIds = $('[data-selected-cities]').attr('data-selected-cities');
    let selectedCitiesSlugs = selectedCitiesIds.split(',').map(function(id, index) {
      return $(`select[name="cities"] option[value="${id}"]`).attr('data-seo-slug');
    })

    // console.log($(`.selected-items__item[name="cities"]`));
    // console.log(`selectedCitiesSlugs`);
    // console.log(selectedCitiesSlugs);

    selectedCitiesSlugs = [...new Set(selectedCitiesSlugs)];
    // selectedCitiesSlugs = selectedCitiesSlugs.filter((value, index, array) => {
    //   array.indexOf(value) === index;
    // });

    console.log(`selectedCitiesSlugs`);
    console.log(selectedCitiesSlugs);


    let selectedCities = Array.from(selectedCitiesSlugs).join('/');
    // let selectedCities = selectedCitiesSlugs;
    // console.log(selectedCities);

    urlParamsArr.push(selectedCountry, selectedCities);
    // urlParamsArr.push(selectedCountry);

    // let $selectedSegmentCheckboxes = $('.additional-filters .checkbox__input[data-segment]:checked');
    // $selectedSegmentCheckboxes.each(function(index, el) {
    //   if (el.value) {
    //     urlParamsArr.push(el.value);
    //   }
    // });

    // let $selectedSegmentRadioBtns = $('.additional-filters .radiobtn__input[data-segment]:checked');
    // $selectedSegmentRadioBtns.each(function(index, el) {
    //   if (el.value) {
    //     urlParamsArr.push(el.value);
    //   }
    // });

    urlParams = urlParamsArr.join('/');

    // Get request params
    let searchValue = $('input[name="vacancy_name"]').val();
    if (searchValue) {
      requestParamsArr.push(`search=${searchValue}`);
    }

    // let $selectedCheckboxes = $('.additional-filters .checkbox__input:not([data-segment]):checked');
    // $selectedCheckboxes.each(function(index, el) {
    //   if (el.value) {
    //     requestParamsArr.push(`${el.name}=${el.value}`);
    //   }
    // });

    // let $selectedRadioBtns = $('.additional-filters .radiobtn__input:not([data-segment]):checked');
    // $selectedRadioBtns.each(function(index, el) {
    //   if (el.value) {
    //     requestParamsArr.push(`${el.name}=${el.value}`);
    //   }
    // });

    // let $rangeSliders = $('.additional-filters .range-slider');
    // $rangeSliders.each(function(index, el) {
    //   let values = el.noUiSlider.get();
    //   let name = el.dataset.name;
    //   let resultValue = `${name}=${values[0]}-${values[1]}`;

    //   requestParamsArr.push(resultValue);
    // });


    let selectedCandidatesType = $('select[name="tip-kandidativ[]"]').val();
    console.log(selectedCandidatesType);

    let selectedCandidatesSlugs = selectedCandidatesType.map(function(value, index) {
      return $(`select[name="tip-kandidativ[]"] option[value="${value}"]`).attr('data-seo-slug');
    });
    console.log(selectedCandidatesSlugs);

    selectedCandidatesSlugs = [...new Set(selectedCandidatesSlugs)];
    // let selectedCandidates = Array.from(selectedCandidatesSlugs).map(function(slug, index) {
    //   return `${name}=${slug}`;
    // });

    selectedCandidatesSlugs.forEach(item => {
      requestParamsArr.push(`tip-kandidativ[]=${item}`);
    });


    let catWorkerValue = $('select[name="kategoriia-pracivnika"]').val();
    if (catWorkerValue) {
      requestParamsArr.push(`kategoriia-pracivnika=${catWorkerValue}`);
    }


    requestParams = requestParamsArr.join('&');

    if (requestParams) {
      requestParams = '/?' + requestParams;
    }

    let $lastSelectedTag = $('.filter .selected-items__item').last();
    let lastSelectedTagObj = {
      type: $lastSelectedTag.attr('data-type'),
      name: $lastSelectedTag.attr('data-name'),
      value: $lastSelectedTag.attr('data-value'),
    };

    console.log(urlParams);

    localStorage.setItem('lastSelectedTag', JSON.stringify(lastSelectedTagObj));
    console.log(lastSelectedTagObj);
    console.log(`/vacancies/${urlParams}${requestParams}`);

    window.location.href = `/vacancies/${urlParams}${requestParams}`;
  });

  function loadCitiesViaAJAX (countryID) {
    $.ajax({
      url: `https://workium.pl/api/v1/cities?country_id=${countryID}`,

      success: function(data) {
        document.dispatchEvent(new CustomEvent("citiesLoaded", {
          detail: { data }
        }));
      },

      error: function(data){
        console.log(data);
      }
    });
  }

  let selectedCountryId = $('select[name="countries"] option:selected').data('id');
  loadCitiesViaAJAX(selectedCountryId);

  // Loading cities via AJAX
  $('select[name="countries"]').on('change', function(event) {
    let countryID = $(this).find(':selected').data('id');

    loadCitiesViaAJAX(countryID);
  });

  // Set current currency
  let currencies = {
    'robota-v-polshi': 'zł',
    'robota-v-chehiyi': 'Kč',
    'robota-v-rumuniyi': 'lei',
    'robota-v-slovachchini': '€',
    'robota-v-nimechchini': '€',
    'robota-v-niderlandah': '€',
    'robota-v-litvi': '€',
  };

  $('select[name="countries"]').on('change', function(event) {
    let selectedCurrency = currencies[$(this).val()];

    $('.filter input[name="salary"]').attr('placeholder', `Від… (${selectedCurrency})`);
    $('.filter input[name="remuneration"]').attr('placeholder', `Від… (${selectedCurrency})`);
  });

  // Dependent filters
  checkDependentFilters();
  $('.additional-filters').find('.checkbox__input, .radiobtn__input').on('change', function(event) {
    checkDependentFilters();
  });

  // Synchronized selects
  $('select[data-sync-field]').on('change', function(event) {
    $(this).find('option').each((index, option) => {
      let syncFieldIDs = $(option).data('sync-field-ids');

      syncFieldIDs.split(',').forEach(id => {
        let $syncField = $(`#${id.trim()}`);
        let type = $syncField.attr('type');

        if (type === 'checkbox') {
          let name = $syncField.attr('name');
          let value = $syncField.attr('value');
          let $selectedItem = findFilterTagByValue(name, value);
          let labelText = $syncField.next('label').text();

          if ($(option).is(':selected')) {
            $syncField.prop('checked', true);
            createOrUpdateTag("checkbox", name, value, labelText);
          } else {
            $syncField.prop('checked', false);
            $selectedItem.remove();
          }
        }
        
      });
    });
  });

  // console.log(noUiSlider);

  function checkDefaultValue() {
    $('[data-hide-default-min-value]').each(function(index, el) {
      if ($(this).val() === $(this).attr('min')) {
        $(this).val('');
      }
    });
  }

  // checkDefaultValue();

  const sliders = document.querySelectorAll('.range-slider');

  sliders.forEach(slider => {
    let min = parseInt(slider.dataset.min);
    let max = parseInt(slider.dataset.max);
    let minValue = parseInt(slider.dataset.minValue);
    let maxValue = parseInt(slider.dataset.maxValue);

    noUiSlider.create(slider, {
      start: [minValue, maxValue],
      connect: true,
      range: {
        'min': min,
        'max': max
      },

      format: {
        to: function (value) {
          return parseInt(value);
        },

        from: function (value) {
          return parseInt(value);
        },
      },

      // tooltips: true,
    });

    // slider.noUiSlider.on('update', function (values, handle) {
    //   let tip = slider.querySelector('.range-slider__tip');
    //   let noUiOrigins = slider.querySelectorAll('.noUi-origin');
    //   let firstHandleOffset = noUiOrigins[0].style.transform;
    //   let secondHandleOffset = noUiOrigins[1].style.transform;

    //   firstHandleOffset = parseInt(firstHandleOffset.substring(firstHandleOffset.indexOf('(') + 1, firstHandleOffset.indexOf(')')));
    //   secondHandleOffset = parseInt(secondHandleOffset.substring(secondHandleOffset.indexOf('(') + 1, secondHandleOffset.indexOf(')')));

    //   let diff = secondHandleOffset - firstHandleOffset;
    //   tip.style.marginLeft = `${diff}%`;

    //   console.log(firstHandleOffset);
    //   console.log(secondHandleOffset);
    //   // slider.querySelector('.range-slider__tip').style.transform = 'translate(20%)';
    //   // inputFormat.value = values[handle];
    // });

    let syncFromFieldIds = slider.dataset.syncFromFieldIds;
    let syncToFieldIds = slider.dataset.syncToFieldIds;
    let fieldsFrom = [];
    let fieldsTo = [];

    // console.log(syncFromFieldIds);
    // console.log(syncToFieldIds);

    syncFromFieldIds.split(',').forEach(id => {
      let field = document.getElementById(id.trim());

      if (field) {
        fieldsFrom.push(field);
      }
    });

    syncToFieldIds.split(',').forEach(id => {
      let field = document.getElementById(id.trim());

      if (field) {
        fieldsTo.push(field);
      }
    });

    slider.noUiSlider.on('update', function (values, handle) {
      fieldsFrom.forEach(field => {
        field.value = values[0];
      });

      fieldsTo.forEach(field => {
        field.value = values[1];
      });

      // console.log(`minValue: ${slider.dataset.minValue}`);
      // console.log(`values[0]: ${values[0]}`);
      // console.log(`maxValue: ${slider.dataset.maxValue}`);
      // console.log(`values[1]: ${values[1]}`);
      // console.log('-----------');

      if (slider.dataset.minValue != values[0] || slider.dataset.maxValue != values[1]) {
        let name = slider.dataset.name;
        let value = `${values[0]}-${values[1]}`
        let label = slider.closest('.filter-element').querySelector('.filter-element__title');
        // let labelText = `<strong>${label.textContent}:</strong> ${values[0]}-${values[1]}`;
        let labelText = value;

        createOrUpdateTag("range", name, value, labelText);
      }
      // else {
      //   // let name = slider.dataset.name;
      //   // let $selectedItem = $(`.selected-items__item[data-name="${name}"]`);

      //   // $selectedItem.remove();
      // }

      toggleClearButtons();
    });

    checkDefaultValue();

    ['input', 'change'].forEach(eventName => {
      fieldsFrom.forEach(field => {
        field.addEventListener(eventName, function (e) {
          // console.log(e);
          // console.log(`${eventName} from`);
          slider.noUiSlider.set([this.value, null]);

          setTimeout(() => {
            toggleClearButtons();
          });
        });
      });

      fieldsTo.forEach(field => {
        field.addEventListener(eventName, function (e) {
          // console.log(e);
          // console.log(`${eventName} to`);
          slider.noUiSlider.set([null, this.value]);

          setTimeout(() => {
            toggleClearButtons();
          });
        });
      });

      // setTimeout(() => {
      //   console.log('fmwmgmwmwwmg');
      //   toggleClearButtons();
      // });
    });

    // console.log(slider);
  });

  // checkFilterFill();
  toggleClearButtons();

  // Search input with close button
  $('[data-search-input]').on('input', function(event) {
    let name = $(this).attr('name');
    let value = $(this).val();
    let $clearBtn = $(this).next('.filter__clear-search-btn');
    let type = ['text', 'search'].includes($(this).attr('type')) ? 'textfield' : $(this).attr('type');

    if (value) {
      $clearBtn.show();
      $(this).addClass('form-text--filter-search-filled');
      createOrUpdateTag('textfield', name, value, value);
    } else {
      $clearBtn.hide();
      $(this).removeClass('form-text--filter-search-filled');
      removeFilterTag(type, name, value);
    }

  });

  $('[data-clear-search-input]').on('click', function(event) {
    let $input = $(this).prev();
    let name = $input.attr('name');
    let value = $input.val();
    let type = ['text', 'search'].includes($input.attr('type')) ? 'textfield' : $input.attr('type');

    // console.log(name, value, type);

    clearTextField($input);
    removeFilterTag(type, name, value);

    $input.focus();
  });


  $('[data-remove-last-filter]').click(function(event) {
    let lastSelectedTagObj = JSON.parse(localStorage.getItem('lastSelectedTag'));

    let type = lastSelectedTagObj.type;
    let name = lastSelectedTagObj.name;
    let value = lastSelectedTagObj.value;

    let $filterSearchBtn = $('.filter__search-btn');
    let $selectedItem = null;
    // console.log(lastSelectedTagObj);
    // let $selectedItem = $(`.selected-items__item[data-name="${name}"]`);

    console.log('data-remove-last-filter type');
    console.log(type);

    switch (type) {
      case 'multiselect':
      case 'checkbox':
        // let $select = $(`select[name="${name}"]`);
        $selectedItem = $(`.selected-items__item[data-name="${name}"][data-value="${value}"]`);

        // $select.multiSelect('deselect', lastSelectedTagObj.value.toString());

        break;

      case 'textfield':
        // let $input = $(`input[name="${name}"]`);
        $selectedItem = $(`.selected-items__item[data-name="${name}"]`);

        // $input.val('');
        // $selectedItem.remove();

        break;
    }

    $selectedItem.find('.selected-item__remove-link').click();
    localStorage.removeItem('lastSelectedTag');

    // let $lastSelectedTag = $('.selected-items__item:last-child');
    let $lastSelectedTag = $('.filter .selected-items__item').last();
    lastSelectedTagObj = {
      type: $lastSelectedTag.attr('data-type'),
      name: $lastSelectedTag.attr('data-name'),
      value: $lastSelectedTag.attr('data-value'),
    };

    // console.log(urlParams);

    localStorage.setItem('lastSelectedTag', JSON.stringify(lastSelectedTagObj));
    console.log(lastSelectedTagObj);

    $filterSearchBtn.click();

    // window.location.href = `/vacancies/${urlParams}${requestParams}`;
  });

  
  
});