import $ from "jquery";
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';
import select2 from 'select2';
import PerfectScrollbar from 'perfect-scrollbar';
import noUiSlider from 'nouislider';

let selectedFiltersCount = 0;

function toggleClearFilterButtons () {
  let $clearBtns = $('[data-clear-filter]');
  let selectedItemsLength = $('.filter .selected-items__item').length;
  let $filtersBtn = $('.btn-white--filter');
  let $filtersBtnCount = $filtersBtn.find('.btn-white__count');
  let $btnFilterScrollTop = $('.btn-filter--scroll-top');
  let $btnFilterScrollTopCount = $btnFilterScrollTop.find('.btn-filter__count');
  let isMobile = $(window).width() < 576;

  if (isMobile) {
    let $checkedLabels = $('.checkboxes-group--cities .checkbox__input:checked + .checkbox__label');
    selectedItemsLength += $checkedLabels.length;
  }

  if (selectedItemsLength) {
    $clearBtns.show();
    $filtersBtn.removeClass('btn-white--filter-dark-icon');
    $filtersBtnCount.removeClass('hidden').text(selectedItemsLength);
    $btnFilterScrollTop.addClass('btn-filter--non-zero');
    $btnFilterScrollTopCount.removeClass('hidden').text(selectedItemsLength);
  } else {
    $clearBtns.hide();
    $filtersBtn.addClass('btn-white--filter-dark-icon');
    $filtersBtnCount.addClass('hidden').text('');
    $btnFilterScrollTop.removeClass('btn-filter--non-zero');
    $btnFilterScrollTopCount.addClass('hidden').text('');
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
  console.log('checkDependentFilters');

  let $dependentFilters = $('[data-parent-filter-id]');

  $dependentFilters.each(function(index, el) {
    let parentFilterId = $(el).data('parent-filter-id')
    let parentFilterItemId = $(el).data('parent-filter-item-id');

    let $parentFilter = $(`.additional-filters [data-filter-id="${parentFilterId}"]`);
    let $parentFilterItem = $parentFilter.find(`[data-filter-item-id="${parentFilterItemId}"]`);

    console.log($(el));

    if (!$parentFilterItem.is(':checked')) {
      $(el).hide();
    } else {
      $(el).show();
    }
  });
}

function resetRangeSlider (rangeSlider) {
  let min = rangeSlider.dataset.min;
  let max = rangeSlider.dataset.max;

  rangeSlider.noUiSlider.set([min, max]);
}

function clearFilter () {
  let $searchInput = $('[data-search-input]');
  let $filterSelects = $('.filter select.filter-select, .additional-filters select.filter-select');
  // let $additionalFiltersGroups = $('.additional-filters .checkboxes-group, .additional-filters .radiobtns-group');
  let $allCheckboxes = $('.additional-filters .checkbox__input');
  let $allNonCheckedRadio = $(`.additional-filters .radiobtn__input[value=""]`);
  let $clearBtn = $(`.filter__clear-btn`);
  let $filtersBtn = $('.btn-white--filter .btn-white__count');
  // let $additionalFiltersClearBtn = $('.additional-filters__clear-btn');
  // let $additionalFiltersClearLink = $('.additional-filters__clear-link');

  $searchInput.val('').trigger('input').removeAttr('value');

  $filterSelects.next('.select2-container').find('.select2-selection').removeClass('select2-selection--selected');

  $filterSelects.each(function(index, el) {
    $(el).val('');
    $(el).find('option[selected]').removeAttr('selected');
    $(el).trigger('change');
  });

  let $rangeSlider = $(`.range-slider`);
  $rangeSlider.each(function(index, el) {
    resetRangeSlider(el);
  });

  $clearBtn.hide();

  // $additionalFiltersClearBtn.hide();
  // $additionalFiltersClearLink.hide();

  $allCheckboxes.prop('checked', false);
  $allNonCheckedRadio.prop('checked', true);

  $('.selected-items__item').remove();
  // $additionalFiltersGroups.show();

  // $('.selected-items--filter-params').hide();

  setVisibilitySelectedMoreItem(0);
  // checkDependentFilters();

  // toggleClearFilterButtons();

  $filtersBtn.addClass('hidden').text(0);
  $filtersBtn.closest('.btn-white--filter').addClass('btn-white--filter-dark-icon');
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
  $input.removeClass('form-text--filter-search-filled').val('').trigger('input');
  $input.parent().find('[data-clear-search-input]').hide();
}

function removeFilterTag (type, name, value) {
  let $selectedItem;

  if (['range', 'textfield'].includes(type)) {
    $selectedItem = $(`.selected-items__item[data-name="${name}"]`);
  } else if (['checkbox', 'radio'].includes(type)) {
    $selectedItem = findFilterTagByValue(name, value);
  }

  $selectedItem.remove();
}

function createOrUpdateTag (type, name, value, labelText) {
  console.log('createOrUpdateTag');

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

    if (name === 'kategoriia-pracivnika') {
      if (!value) {
        $label.text('Спеціалізація');
      } else {
        $select2Selection.addClass('select2-selection--selected');
      }
    }

    $(el).on('change', function (e, call) {
      // alert('Select changed!');
      let value = $(this).select2('val');

      if (name === 'kategoriia-pracivnika') {
        if (value !== '') {
          $select2Selection.addClass('select2-selection--selected');
          // createOrUpdateTag("select", name, value, `<strong>Категорія працівника:</strong> ${$label.text()}`);
        } else {
          $select2Selection.removeClass('select2-selection--selected');
          let $selectedItem = $(`.selected-items__item[data-type="select"][data-name="${name}"]`);

          $selectedItem.remove();

          $label.text('Спеціалізація');
        }
      }

      if (name === 'countries') {
        let $countriesSelects = $('select[name="countries"]');
        $countriesSelects.val(value);
      }

      // if (!['countries', 'currency'].includes(name)) {
      //   toggleClearFilterButtons();
      // }

      if (!['currency'].includes(name)) {
        toggleClearFilterButtons();
      }

      if (['kategoriia-pracivnika', 'distance'].includes(name)) {
        if (call !== 'fromCode') {
          setTimeout(() => {
            updateFilterUrl();
          });
        }
      }
    });
  });


  $(document).on('click', '.select-toggle', function(e) {
    let $targetElem = $($(this).attr('href'));

    setTimeout(() => {
      $targetElem.find('.ms-selectable__search-input').focus();
    });
  });

  // $('.filter__clear-btn, .additional-filters__clear-btn, .additional-filters__clear-filter-btn, .additional-filters__clear-link').click(clearFilter);

  $('[data-clear-filter]').click(() => {
    clearFilter();

    // setTimeout(() => {
    //   // alert('updateFilterUrl()');
    //   // updateFilterUrl();
    // });
  });


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
    let selectedItemsLength = $('.filter .selected-items__item').length;

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
          resetRangeSlider($rangeSlider[0]);

          break;

        case 'select':
          let $select = $(`select[name="${name}"]`);
          $select.val('').trigger('change');

          break;
      }
    }

    $selectedItemParent.remove();

    setTimeout(() => {
      toggleClearFilterButtons();
    });

    setVisibilitySelectedMoreItem(selectedItemsLength);
    checkDependentFilters();
    checkDefaultValue();

    event.preventDefault();
  });

  $('.filter .form-text:not([type="search"])').on('input', function(e) {
    setTimeout(() => {
      toggleClearFilterButtons();
    });
  });

  // Search in filter
  $('input[name="search_filter"]').on('input', function(event) {
    let searchValue = $(this).val().toLowerCase().trim();
    let $additionalFilters = $(this).closest('.additional-filters');
    let $additionalFiltersGroups = $additionalFilters.find('.checkboxes-group, .radiobtns-group, .filter-element--range');
    let $clearSearchBtn = $(this).siblings('.additional-filters__clear-search-btn');

    if (searchValue) {
      $clearSearchBtn.show();
    } else {
      $clearSearchBtn.hide();
    }

    $additionalFiltersGroups.each( (index, group) => {
      if ($(group).hasClass('checkboxes-group') || $(group).hasClass('radiobtns-group')) {
        let groupTitle = $(group).find('.checkboxes-group__title, .radiobtns-group__title').text().toLowerCase();
        let checkboxesLabels = Array.from($(group).find('.checkbox__label, .radiobtn__label')).map(label => {
          return $(label).text().toLowerCase();
        });

        if (groupTitle.includes(searchValue) || checkboxesLabels.find(label => label.includes(searchValue))) {
          $(group).removeClass('hidden');
        } else {
          $(group).addClass('hidden');
        }
      } else {
        let groupTitle = $(group).find('.filter-element__title').text().toLowerCase();

        if (groupTitle.includes(searchValue)) {
          $(group).removeClass('hidden');
        } else {
          $(group).addClass('hidden');
        }
      }
      
    });
  });

  $('.additional-filters__clear-search-btn').click(function(event) {
    $(this).hide();

    $(this).siblings('.form-text--filter-search').val('').trigger('input').focus();
  });

  // Adding selected checkboxes/radio buttons
  $('.additional-filters').find('.checkbox__input, .radiobtn__input').change(function(event) {
    let name = $(this).attr('name');
    let value = $(this).val();
    let labelText = $(this).parent().find('label').text();
    let selectedItemsLength = $('.selected-items__item').length;
    let $selectedItem = $(`.selected-items__item[data-name="${name}"][data-value="${value}"]`);

    if ($(this).is(':checkbox')) {
      if ($(this).is(':checked')) {
        createOrUpdateTag("checkbox", name, value, labelText);
      } else {
        $selectedItem.remove();
      }
    } else if ($(this).is(':radio')) {
      let groupTitle = $(this).closest('.radiobtns-group').find('.radiobtns-group__title').text();
      let $otherSelectedItems = $(`.selected-items__item[data-name="${name}"]`).not(`[data-value="${value}"]`);

      $otherSelectedItems.remove();

      if (value !== '') {
        let type = (name === 'kategoriia-pracivnika') ? 'select' : 'radio';
        createOrUpdateTag(type, name, value, `<strong>${groupTitle}:</strong> ${labelText}`);
      }

      if (name === 'kategoriia-pracivnika') {
        let $employeeCategorySelect = $('select[name="kategoriia-pracivnika"]');

        $employeeCategorySelect.val(value);
        $employeeCategorySelect.find('option[selected]').removeAttr('selected');
        $employeeCategorySelect.trigger('change', ['fromCode']);
      }
    }

    toggleClearFilterButtons();
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

  function updateFilterUrl () {
    let isMobile = $(window).width() < 576;
    let urlParamsArr = [];
    let requestParamsArr = [];
    let urlParams = '';
    let requestParams = '';

    // Get url params
    let selectedCountry = '',
        selectedCitiesSlugs = [];

    if (isMobile) {
      selectedCountry = $('.filter__countries-select--mobile').val();
      selectedCitiesSlugs = $('.checkbox__input[name="cities"]:checked').map(function(index, input) {
        return $(input).attr('data-seo-slug');
      });
    } else {
      selectedCountry = $('.filter__countries-select--desktop').val();
      selectedCitiesSlugs = $('.filter__cities-select--desktop option:selected').map(function(index, option) {
        return $(option).attr('data-seo-slug');
      });
    }

    // let selectedCitiesSlugs = $('select[name="cities"] option:selected').val().map(function(id, index) {
      // console.log(id);
      // console.log($(`select[name="cities"] option[value="${id}"]`));
      // return $(`select[name="cities"] option[value="${id}"]`).attr('data-seo-slug');
    // });

    // let selectedCitiesSlugs = $('select[name="cities"] option:selected').map(function(index, elem) {
    //   return $(elem).attr('data-seo-slug');
    // });

    // let selectedCitiesIds = $('[data-selected-cities]').attr('data-selected-cities');
    // let selectedCitiesSlugs = selectedCitiesIds.split(',').map(function(id, index) {
    //   return $(`select[name="cities"] option[value="${id}"]`).attr('data-seo-slug');
    // })

    // selectedCitiesSlugs = [...new Set(selectedCitiesSlugs)];


    // selectedCitiesSlugs = selectedCitiesSlugs.filter((value, index, array) => {
    //   array.indexOf(value) === index;
    // });


    let selectedCities = Array.from(selectedCitiesSlugs).join('/');

    if (selectedCountry) {
      urlParamsArr.push(selectedCountry);
    }

    urlParamsArr.push(selectedCities);
    // urlParamsArr.push(selectedCountry);

    let $selectedSegmentCheckboxes = $('.additional-filters .checkbox__input[data-segment]:not([data-exclude-field]):checked');
    $selectedSegmentCheckboxes.each(function(index, el) {
      if (el.value) {
        urlParamsArr.push(el.value);
      }
    });

    let $selectedSegmentRadioBtns = $('.additional-filters .radiobtn__input[data-segment]:not([data-exclude-field]):checked');
    $selectedSegmentRadioBtns.each(function(index, el) {
      if (el.value) {
        urlParamsArr.push(el.value);
      }
    });

    urlParams = urlParamsArr.join('/');

    // Get request params
    let searchValue = $('input[name="vacancy_name"]').val();
    if (searchValue) {
      requestParamsArr.push(`search=${searchValue}`);
    }

    let $selectedCheckboxes = $('.additional-filters .checkbox__input:not([data-segment]):not([data-exclude-field]):checked');
    $selectedCheckboxes.each(function(index, el) {
      if (el.value) {
        requestParamsArr.push(`${el.name}=${el.value}`);
      }
    });

    let $selectedRadioBtns = $('.additional-filters .radiobtn__input:not([data-segment]):not([data-exclude-field]):checked');
    $selectedRadioBtns.each(function(index, el) {
      if (el.value) {
        requestParamsArr.push(`${el.name}=${el.value}`);
      }
    });

    let $rangeSliders = $('.additional-filters .range-slider');
    $rangeSliders.each(function(index, el) {
      let values = el.noUiSlider.get();
      let rangeValues = el.noUiSlider.options.range;
      let name = el.dataset.name;

      console.log(el.noUiSlider.options);

      if (rangeValues.min != values[0] || rangeValues.max != values[1]) {
        let resultValue = `${name}=${values[0]}-${values[1]}`;
        requestParamsArr.push(resultValue);
      }
    });

    let selectedCandidatesType;

    if (isMobile) {
      selectedCandidatesType = $('.filter__sex-select--mobile').val();
    } else {
      selectedCandidatesType = $('.filter__sex-select--desktop').val();
    }

    let selectedCandidatesSlugs = selectedCandidatesType.map(function(value, index) {
      return $(`select[name="tip-kandidativ[]"] option[value="${value}"]`).attr('data-seo-slug');
    });

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

    let distance;
    
    if (isMobile) {
      distance = $('.filter__distance-select--mobile');
    } else {
      distance = $('.filter__distance-select--desktop');
    }

    if (distance.val() && selectedCountry && selectedCities) {
      requestParamsArr.push(`radius=${distance.val()}`);
    }

    requestParams = requestParamsArr.join('&');

    if (requestParams) {
      requestParams = '/?' + requestParams;
    }

    // let $lastSelectedTag = $('.filter .selected-items__item').last();
    // let lastSelectedTagObj = {
    //   type: $lastSelectedTag.attr('data-type'),
    //   name: $lastSelectedTag.attr('data-name'),
    //   value: $lastSelectedTag.attr('data-value'),
    // };

    // localStorage.setItem('lastSelectedTag', JSON.stringify(lastSelectedTagObj));

    console.log(`/vacancies/${urlParams}${requestParams}`);

    let $filterSearchBtn = $('.filter__search-btn');
    let $filterPreloaderWrapper = $('.filter__preloader-wrapper');
    let $additionalFiltersSubmitBtn = $('.additional-filters__submit-btn');
    let $additionalFiltersPreloaderWrapper = $('.additional-filters__preloader-wrapper');

    $filterSearchBtn.hide();
    $filterPreloaderWrapper.show();
    $additionalFiltersSubmitBtn.hide();
    $additionalFiltersPreloaderWrapper.show();

    window.location.href = `/vacancies/${urlParams}${requestParams}`;
  }

  // Creating filter URL
  $('form[name="vacancies_filter"]').on('submit', function(event) {
    event.preventDefault();

    updateFilterUrl();
  });

  function loadCitiesOfSelectedCountry (countryID) {
    // alert('loadCitiesOfSelectedCountry');

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

  if (selectedCountryId) {
    loadCitiesOfSelectedCountry(selectedCountryId);
  }

  // Loading cities via AJAX
  $('select[name="countries"]').on('change', function(event) {
    let countryID = $(this).find(':selected').data('id');

    loadCitiesOfSelectedCountry(countryID);

    setTimeout(() => {
      updateFilterUrl();
    }, 1000);
  });

  // Set current currency
  // let currencies = {
  //   'robota-v-polshi': 'zł',
  //   'robota-v-chehiyi': 'Kč',
  //   'robota-v-rumuniyi': 'lei',
  //   'robota-v-slovachchini': '€',
  //   'robota-v-nimechchini': '€',
  //   'robota-v-niderlandah': '€',
  //   'robota-v-litvi': '€',
  // };

  // $('select[name="countries"]').on('change', function(event) {
  //   let selectedCurrency = currencies[$(this).val()];

  //   $('.filter input[name="salary"]').attr('placeholder', `Від… (${selectedCurrency})`);
  //   $('.filter input[name="remuneration"]').attr('placeholder', `Від… (${selectedCurrency})`);
  // });

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

  function checkDefaultValue() {
    $('[data-hide-default-min-value]').each(function(index, el) {
      if ($(this).val() === $(this).attr('min')) {
        $(this).val('');
      }
    });
  }

  // checkDefaultValue();

  // Range slider tips
  // slider.noUiSlider.on('update', function (values, handle) {
  //   let tip = slider.querySelector('.range-slider__tip');
  //   let noUiOrigins = slider.querySelectorAll('.noUi-origin');
  //   let firstHandleOffset = noUiOrigins[0].style.transform;
  //   let secondHandleOffset = noUiOrigins[1].style.transform;

  //   firstHandleOffset = parseInt(firstHandleOffset.substring(firstHandleOffset.indexOf('(') + 1, firstHandleOffset.indexOf(')')));
  //   secondHandleOffset = parseInt(secondHandleOffset.substring(secondHandleOffset.indexOf('(') + 1, secondHandleOffset.indexOf(')')));

  //   let diff = secondHandleOffset - firstHandleOffset;
  //   tip.style.marginLeft = `${diff}%`;

  //   // slider.querySelector('.range-slider__tip').style.transform = 'translate(20%)';
  //   // inputFormat.value = values[handle];
  // });

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
    });

    let syncFromFieldIds = slider.dataset.syncFromFieldIds;
    let syncToFieldIds = slider.dataset.syncToFieldIds;
    let fieldsFrom = [];
    let fieldsTo = [];

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

      let name = slider.dataset.name;
      let value = `${values[0]}-${values[1]}`

      if (slider.dataset.min != values[0] || slider.dataset.max != values[1]) {
        let label = slider.closest('.filter-element').querySelector('.filter-element__title');
        // let labelText = `<strong>${label.textContent}:</strong> ${values[0]}-${values[1]}`;
        let labelText = value;

        createOrUpdateTag("range", name, value, labelText);
      } else {
        let $selectedItem = $(`.selected-items__item[data-name="${name}"]`);
        $selectedItem.remove();
      }
      // else {
      //   // let name = slider.dataset.name;
      //   // let $selectedItem = $(`.selected-items__item[data-name="${name}"]`);

      //   // $selectedItem.remove();
      // }

      toggleClearFilterButtons();
    });

    checkDefaultValue();

    ['input', 'change'].forEach(eventName => {
      fieldsFrom.forEach(field => {
        field.addEventListener(eventName, function (e) {
          slider.noUiSlider.set([this.value, null]);

          setTimeout(() => {
            toggleClearFilterButtons();
          });
        });
      });

      fieldsTo.forEach(field => {
        field.addEventListener(eventName, function (e) {
          slider.noUiSlider.set([null, this.value]);

          setTimeout(() => {
            toggleClearFilterButtons();
          });
        });
      });

      // setTimeout(() => {
      //   toggleClearFilterButtons();
      // });
    });
  });

  toggleClearFilterButtons();

  // Search input with close button
  $('[data-search-input]').on('input', function(event) {
    let name = $(this).attr('name');
    let value = $(this).val();
    let $clearBtn = $(this).next('.filter__clear-search-btn');
    let $searchBtnMobile = $('.filter__search-btn-mobile');
    let type = ['text', 'search'].includes($(this).attr('type')) ? 'textfield' : $(this).attr('type');

    if (value) {
      $clearBtn.show();
      $searchBtnMobile.show();
      $(this).addClass('form-text--filter-search-filled');
      // createOrUpdateTag('textfield', name, value, value);
    } else {
      $clearBtn.hide();
      $searchBtnMobile.hide();
      $(this).removeClass('form-text--filter-search-filled');
      // removeFilterTag(type, name, value);
    }

  });

  $('[data-clear-search-input]').on('click', function(event) {
    let $input = $(this).prev();
    let name = $input.attr('name');
    let value = $input.val();
    let type = ['text', 'search'].includes($input.attr('type')) ? 'textfield' : $input.attr('type');

    clearTextField($input);
    // removeFilterTag(type, name, value);

    $input.focus();

    // updateFilterUrl();
  });

  document.forms.vacancies_filter.addEventListener('updateVacanciesFilter', updateFilterUrl);


  // $('[data-remove-last-filter]').click(function(event) {
  //   let lastSelectedTagObj = JSON.parse(localStorage.getItem('lastSelectedTag'));

  //   let type = lastSelectedTagObj.type;
  //   let name = lastSelectedTagObj.name;
  //   let value = lastSelectedTagObj.value;

  //   let $filterSearchBtn = $('.filter__search-btn');
  //   let $selectedItem = null;
  //   // console.log(lastSelectedTagObj);
  //   // let $selectedItem = $(`.selected-items__item[data-name="${name}"]`);

  //   console.log('data-remove-last-filter type');
  //   console.log(type);

  //   switch (type) {
  //     case 'multiselect':
  //     case 'checkbox':
  //       // let $select = $(`select[name="${name}"]`);
  //       $selectedItem = $(`.selected-items__item[data-name="${name}"][data-value="${value}"]`);

  //       // $select.multiSelect('deselect', lastSelectedTagObj.value.toString());

  //       break;

  //     case 'textfield':
  //       // let $input = $(`input[name="${name}"]`);
  //       $selectedItem = $(`.selected-items__item[data-name="${name}"]`);

  //       // $input.val('');
  //       // $selectedItem.remove();

  //       break;
  //   }

  //   $selectedItem.find('.selected-item__remove-link').click();
  //   localStorage.removeItem('lastSelectedTag');

  //   // let $lastSelectedTag = $('.selected-items__item:last-child');
  //   let $lastSelectedTag = $('.filter .selected-items__item').last();
  //   lastSelectedTagObj = {
  //     type: $lastSelectedTag.attr('data-type'),
  //     name: $lastSelectedTag.attr('data-name'),
  //     value: $lastSelectedTag.attr('data-value'),
  //   };

  //   // console.log(urlParams);

  //   localStorage.setItem('lastSelectedTag', JSON.stringify(lastSelectedTagObj));
  //   console.log(lastSelectedTagObj);

  //   $filterSearchBtn.click();

  //   // window.location.href = `/vacancies/${urlParams}${requestParams}`;
  // });

  // $('[data-next-vacancies-page]').on('click', function(event) {
  //   let pageNumber = $('.pagination .page-item.active .page-link').text();
  // });
  
  
});