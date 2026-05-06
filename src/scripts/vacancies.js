import $ from "jquery";
import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.esm.js";
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';
// import select2 from 'select2';
import PerfectScrollbar from 'perfect-scrollbar';
// import noUiSlider from 'nouislider';
// import { Calendar } from "./calendar";

import { initVacanciesFilter } from "./vacancies-filter";
import { FancyboxIOSScrollLock } from "./fancybox-ios-scrolllock";

// let $ageSwitch = $('input[name="age_switch"]');

// let selectedCitiesIds = [];
// let currentSelectedCitiesIds = [];

// let citySearchInputValue = '';
// let searchCitiesTimeoutID = null;

// function removeItemFromArray(array, value) {
//   let index = array.indexOf(value);

//   if (index > -1) {
//     array.splice(index, 1);
//   }

//   return array;
// }

// function clearCitiesCheckboxes() {
//   currentSelectedCitiesIds = [];

//   let $citiesCheckboxInput = $('.checkboxes-group--cities .checkbox__input');
//   $citiesCheckboxInput.prop('checked', false);
//   $(this).hide();
// }

// function setCheckedCityCheckboxesTitle() {
//   let $citiesBtn = $('.additional-filters__cities-btn');
//   let $citiesBtnText = $citiesBtn.find('.btn-white__text');
//   let $citiesBtnCount = $citiesBtn.find('.count');
//   let $checkedLabels = $('.checkboxes-group--cities .checkbox__input:checked + .checkbox__label');

//   if (!$checkedLabels.length) {
//     $citiesBtnText.text($citiesBtn.data('placeholder'));
//     $citiesBtnCount.hide();
//   } else if ($checkedLabels.length == 1) {
//     $citiesBtnText.text($($checkedLabels[0]).find('.checkbox__title').text());
//     $citiesBtnCount.hide();
//   } else {
//     $citiesBtnText.text($($checkedLabels[0]).find('.checkbox__title').text());
//     $citiesBtnCount.text(`+${$checkedLabels.length - 1}`);
//     $citiesBtnCount.show();
//   }

//   toggleClearFilterButtons();
// }

// function toggleClearCitiesButtons() {
//   let $checkedInputs = $('.checkboxes-group--cities .checkbox__input:checked');
//   let $clearBtn = $('.cities-filter__clear-btn');

//   if (!$checkedInputs.length) {
//     $clearBtn.hide();
//   } else {
//     $clearBtn.show();
//   }
// }

// function getFilterUrl(changedAdditionalFilters = false) {
//   let isMobile = $(window).width() < 576;
//   let urlParamsArr = [];
//   let requestParamsArr = [];
//   let urlParams = '';
//   let requestParams = '';

//   // Get url params
//   // let selectedCountry = '';

//   // if (isMobile) {
//   //   selectedCountry = $('.filter__countries-select--mobile').val();
//   //   selectedCitiesSlugs = $('.checkbox__input[name="cities"]:checked').map(function (index, input) {
//   //     return $(input).attr('data-seo-slug');
//   //   });
//   // } else {
//   //   selectedCountry = $('.filter__countries-select--desktop').val();
//   //   selectedCitiesSlugs = $('.filter__cities-select--desktop option:selected').map(function (index, option) {
//   //     return $(option).attr('data-seo-slug');
//   //   });
//   // }

//   // console.log(citiesComponent.getSelected());
//   // console.log(filterController.getSelected());

//   // let selectedCitiesSlugs = [];
//   // let selectedCities = Array.from(selectedCitiesSlugs).join('/');
//   // if (selectedCountry) {
//   //   urlParamsArr.push(selectedCountry);
//   // }

//   // urlParamsArr.push(selectedCities);

//   // console.log('selectedCities');
//   // console.log(selectedCities);
//   // console.log('selectedCountry');
//   // console.log(selectedCountry);

//   // const selectedSegmentCheckboxes = document.querySelectorAll('.additional-filters .checkbox__input[data-segment]:not([data-exclude-field]):checked');
//   // selectedSegmentCheckboxes.forEach(el => {
//   //   if (el.value) {
//   //     urlParamsArr.push(el.value);
//   //   }
//   // });

//   // const selectedSegmentRadioBtns = document.querySelectorAll('.additional-filters .radiobtn__input[data-segment]:not([data-exclude-field]):checked');
//   // selectedSegmentRadioBtns.forEach(el => {
//   //   if (el.value) {
//   //     urlParamsArr.push(el.value);
//   //   }
//   // });

//   // urlParams = urlParamsArr.join('/');

//   // Get request params
//   // let searchValue = document.querySelector('input[name="vacancy_name"]')?.value;
//   // if (searchValue) {
//   //   requestParamsArr.push(`search=${encodeURIComponent(searchValue)}`);
//   // }

//   // const selectedCheckboxes = document.querySelectorAll('.additional-filters .checkbox__input:not([data-segment]):not([data-exclude-field]):checked');
//   // selectedCheckboxes.forEach(el => {
//   //   if (el.value && !(el.name === 'zitlo[]' && el.value === 'all')) {
//   //     requestParamsArr.push(`${el.name}=${el.value}`);
//   //   }
//   // });

//   // const selectedRadioBtns = document.querySelectorAll('.additional-filters .radiobtn__input:not([data-segment]):not([data-exclude-field]):checked');
//   // selectedRadioBtns.forEach(el => {
//   //   if (el.value) {
//   //     requestParamsArr.push(`${el.name}=${el.value}`);
//   //   }
//   // });

//   const sliders = document.querySelectorAll('.additional-filters .range-slider--single');
//   sliders.forEach(el => {
//     let value = el.noUiSlider.get();
//     let rangeValues = el.noUiSlider.options.range;
//     let name = el.dataset.name;
//     let ageSwitch = document.querySelector('input[name="age_switch"]');

//     if (name === 'vik' && ageSwitch.checked) {
//       return;
//     }

//     if ((rangeValues.min != value)) {
//       let resultValue = `${name}=${value}`;
//       requestParamsArr.push(resultValue);
//     }
//   });

//   document.querySelectorAll('.additional-filters .range-slider--range').forEach(el => {
//     let values = el.noUiSlider.get();
//     let rangeValues = el.noUiSlider.options.range;
//     let name = el.dataset.name;
//     let ageSwitch = document.querySelector('input[name="age_switch"]');

//     if (name === 'vik' && !ageSwitch.checked) {
//       return;
//     }

//     if (rangeValues.min != values[0] || rangeValues.max != values[1]) {
//       let resultValue = `${name}=${values[0]}-${values[1]}`;
//       requestParamsArr.push(resultValue);
//     }
//   });

//   // document.querySelectorAll('.additional-filters .calendar__input').forEach(el => {
//   //   if (!el.value) return;

//   //   let resultValue = `${el.name}=${el.value}`;
//   //   requestParamsArr.push(resultValue);
//   // });

//   // let selectedCandidatesType = isMobile ? $('.filter__sex-select--mobile').val() : $('.filter__sex-select--desktop').val();

//   // let selectedCandidatesSlugs = selectedCandidatesType.map(function (value, index) {
//   //   return $(`select[name="tip-kandidativ[]"] option[value="${value}"]`).attr('data-seo-slug');
//   // });

//   // [...new Set(selectedCandidatesSlugs)].forEach(item => {
//   //   requestParamsArr.push(`tip-kandidativ[]=${item}`);
//   // });


//   // let catWorkerValue = document.querySelector('select[name="kategoriia-pracivnika"]')?.value;
//   // if (catWorkerValue) {
//   //   requestParamsArr.push(`kategoriia-pracivnika=${catWorkerValue}`);
//   // }

//   // const distance = isMobile ? document.querySelector('.filter__distance-select--mobile') : document.querySelector('.filter__distance-select--desktop');

//   // if (distance.value && selectedCountry && selectedCities) {
//   // if (distance && distance.value) {
//   //   requestParamsArr.push(`radius=${distance.value}`);
//   // }

//   if (changedAdditionalFilters) {
//     requestParamsArr.push('open-popup=1');
//   }

//   requestParams = requestParamsArr.join('&');

//   if (urlParams) {
//     urlParams = '/' + urlParams.replace(/\/+$/, '');
//   }

//   if (requestParams) {
//     requestParams = '?' + requestParams;
//   }

//   return urlParams + requestParams;
// }

// function updateFilterUrl() {
//   let isMobile = $(window).width() < 576;
//   let $filterSearchBtn = $('.filter__search-btn');
//   let $additionalFiltersSubmitBtn = $('.additional-filters__submit-btn');
//   let $vacanciesTogglePlusBtn = $('.vacancies__toggle-plus-btn');
//   let $vacanciesPreloaderWrapper = $('.vacancies__preloader-wrapper');

//   $filterSearchBtn.addClass('btn-default--filter-loading');
//   $additionalFiltersSubmitBtn.addClass('btn-default--filter-loading');

//   if (isMobile) {
//     $vacanciesTogglePlusBtn.hide();
//     $vacanciesPreloaderWrapper.show();
//   }

//   $.get(`/vacancies`).done(function () {
//     const lang = document.documentElement.lang;
//     window.location.href = `/${lang}/vacancies${getFilterUrl()}`;
//   });
// }

// function addAllSelectedCities(allSelectedCitiesIds) {
//   if (!allSelectedCitiesIds.length) return;

//   let cities = [];
//   let urlParams = allSelectedCitiesIds.map(cityId => `city_ids[]=${cityId}`).join('&');

//   let url = `api/v1/cities?${urlParams}`;

//   $.ajax({
//     url: url,

//     success: function (data) {
//       cities = data.results;

//       cities.forEach((item, index) => {
//         addCityCheckbox(item, allSelectedCitiesIds);
//       });

//       selectedCitiesIds = [...allSelectedCitiesIds];
//       currentSelectedCitiesIds = [...allSelectedCitiesIds];

//       setCheckedCityCheckboxesTitle();
//       toggleClearCitiesButtons();
//     },

//     error: function (data) {
//       console.log(data);
//     }
//   });
// }

// function addCityCheckbox(item, selectedCitiesArr) {
//   let $citiesCheckboxesList = $('.checkboxes-group--cities .checkboxes-group__list');
//   $citiesCheckboxesList.append(`<li class="checkboxes-group__item">
//                                       <div class="checkbox">
//                                         <input class="checkbox__input" name="cities" value="${item.id}" type="checkbox" id="city_${item.id}" data-seo-slug="${item.seo_slug}"${selectedCitiesArr.includes(item.id.toString()) ? ' checked' : ''}>
//                                         <label class="checkbox__label checkbox__label--align-start" for="city_${item.id}">
//                                           <div class="checkbox__label-wrapper">
//                                             <div class="checkbox__title">${item.origin}</div>
//                                             <div class="checkbox__description">${item.province}</div>
//                                           </div>
//                                         </label>
//                                       </div>
//                                     </li>`);
// }

// function syncInputFields($input) {
//   let syncFieldIDs = $input.data('sync-field-ids');

//   if (!syncFieldIDs) return;

//   syncFieldIDs.split(',').forEach(id => {
//     let $syncField = $(`#${id.trim()}`);

//     if (!$syncField.length) return;

//     let nodeName = $syncField.prop('tagName').toLowerCase();

//     switch (nodeName) {
//       case 'input':
//         let type = $syncField.attr('type');

//         if (['text', 'number'].includes(type)) {
//           let value = $input.val();
//           $syncField.val(value);
//           $syncField[0].dispatchEvent(new Event('change'));
//         }

//         break;
//     }

//   });
// }

// function clearTextField($input) {
//   $input.removeClass('form-text--filter-search-filled').val('');
//   $input.parent().find('[data-clear-search-input]').hide();
// }

// function copyText(input) {
//   input.select();
//   input.setSelectionRange(0, 99999);

//   document.execCommand("copy");
// }

async function copyText(input) {
  try {
    await navigator.clipboard.writeText(input.value);
    console.log('Текст скопирован');
  } catch (error) {
    console.error('Ошибка копирования:', error);
  }
}

function copyVacancyText(isMultiVacancy = true) {
  let $vacancyTextWrapper = $('.vacancy-card__text-wrapper');
  let vacancyTitle = $vacancyTextWrapper.find('.vacancy-card__title').text().trim();
  let vacancyText = $vacancyTextWrapper.find('.vacancy-card__text').text().trim();
  let vacancyBefore = "";

  if (!$vacancyTextWrapper.length) return;

  if (!isMultiVacancy) {
    let vacancyCategory = $('.vacancy-card__category').text().trim();
    let companyName = $('.vacancy-card__company-name').text().trim();

    vacancyBefore = vacancyCategory + ' ' + companyName + '\r\n';
  }

  $vacancyTextWrapper.after(`<textarea class="vacancy-card__textarea">${vacancyBefore + vacancyTitle + '\r\n' + vacancyText}</textarea>`);

  let $vacancyCardTextarea = $('.vacancy-card__textarea');

  copyText($vacancyCardTextarea[0]);
  $vacancyCardTextarea.remove();
}

// function toggleClearFilterButtons() {
//   let $clearBtns = $('[data-clear-filter]');
//   let selectedItemsLength = $('.filter .filter-tags__item').length;
//   let $filtersBtn = $('.btn-white--filter');
//   let $filtersBtnCount = $filtersBtn.find('.btn-white__count');
//   let $btnFilterScrollTop = $('.btn-filter--scroll-top');
//   let $btnFilterScrollTopCount = $btnFilterScrollTop.find('.btn-filter__count');
//   let isMobile = $(window).width() < 576;

//   if (isMobile) {
//     let $checkedLabels = $('.checkboxes-group--cities .checkbox__input:checked + .checkbox__label');
//     selectedItemsLength += $checkedLabels.length;
//   }

//   if (selectedItemsLength) {
//     $clearBtns.show();
//     $('.additional-filters__filter-tags').show();
//     $filtersBtn.removeClass('btn-white--filter-dark-icon');
//     $filtersBtnCount.removeClass('hidden').text(selectedItemsLength);
//     $btnFilterScrollTop.addClass('btn-filter--non-zero');
//     $btnFilterScrollTopCount.removeClass('hidden').text(selectedItemsLength);
//   } else {
//     $clearBtns.hide();
//     $('.additional-filters__filter-tags').hide();
//     $filtersBtn.addClass('btn-white--filter-dark-icon');
//     $filtersBtnCount.addClass('hidden').text('');
//     $btnFilterScrollTop.removeClass('btn-filter--non-zero');
//     $btnFilterScrollTopCount.addClass('hidden').text('');
//   }
// }

// function setVisibilitySelectedMoreItem(selectedItemsLength) {
//   let isMobile = $(window).width() < 576;
//   let visibleCount = isMobile ? 7 : 11;

//   $('.filter-tags').each(function (index, selectedItemsWrapper) {
//     let $moreItem = $(selectedItemsWrapper).find('.filter-tags__more-item');
//     let moreItemsCount = selectedItemsLength - visibleCount;

//     if (selectedItemsLength > visibleCount) {
//       $moreItem.removeClass('hidden');
//     } else {
//       $moreItem.addClass('hidden');
//     }

//     $moreItem.find('.more-btn__count').text(`+${moreItemsCount}`);
//   });
// }

// function checkDependentFilters() {
//   let $dependentFilters = $('[data-parent-filter-id]');

//   $dependentFilters.each(function (index, el) {
//     let parentFilterId = $(el).data('parent-filter-id')
//     let parentFilterItemId = $(el).data('parent-filter-item-id');

//     let $parentFilter = $(`.additional-filters [data-filter-id="${parentFilterId}"]`);
//     if (!$parentFilter.length) return;

//     let $parentFilterItemAll = $parentFilter.find(`[value="all"]:checked`);
//     if ($parentFilterItemAll.length) {
//       $(el).show();
//       return;
//     }

//     let $parentFilterItem = $parentFilter.find(`[data-filter-item-id="${parentFilterItemId}"]`);

//     if (!$parentFilterItem.length) {
//       let parentFilterTagName = $parentFilter.prop('tagName').toLowerCase();

//       if (parentFilterTagName === 'select') {
//         $(el).hide();
//       }

//       return;
//     }

//     let tagName = $parentFilterItem.prop('tagName').toLowerCase();
//     let compareOp = tagName === 'option' ? ':selected' : ':checked';

//     if (!$parentFilterItem.is(compareOp)) {
//       $(el).hide();
//     } else {
//       $(el).show();
//     }
//   });
// }

// function resetRangeSlider(rangeSlider) {
//   if (rangeSlider.classList.contains('range-slider--single')) {
//     let min = rangeSlider.dataset.min;

//     rangeSlider.noUiSlider.set(min);

//     let syncFieldIds = rangeSlider.dataset.syncFieldIds;

//     syncFieldIds.split(',').forEach(id => {
//       let field = document.getElementById(id.trim());

//       if (field) {
//         field.value = min;
//       }
//     });

//   } else if (rangeSlider.classList.contains('range-slider--range')) {
//     let min = rangeSlider.dataset.min;
//     let max = rangeSlider.dataset.max;

//     rangeSlider.noUiSlider.set([min, max]);

//     let syncFromFieldIds = rangeSlider.dataset.syncFromFieldIds;
//     let syncToFieldIds = rangeSlider.dataset.syncToFieldIds;

//     syncFromFieldIds.split(',').forEach(id => {
//       let field = document.getElementById(id.trim());

//       if (field) {
//         field.value = min;
//       }
//     });

//     syncToFieldIds.split(',').forEach(id => {
//       let field = document.getElementById(id.trim());

//       if (field) {
//         field.value = max;
//       }
//     });
//   }
// }

// function clearTagRelatedFields($filterTag) {
//   // let isMainFilter = !!$filterTag.closest('.filter-tags--main-filter').length;
//   let $selectedRadio = null;

//   let name = $filterTag.data('name');
//   let value = $filterTag.data('value');
//   let type = $filterTag.data('type');

//   if (['range', 'textfield', 'multiselect', 'date-range'].includes(type)) {
//     let $otherSelectedItem = $(`.filter-tags__item[data-name="${name}"][data-value="${value}"]`);
//     $otherSelectedItem.remove();
//   }

//   if (![name, value].includes(undefined)) {
//     switch (type) {
//       case 'checkbox':
//         let $selectedCheckbox = $(`.checkbox__input[name="${name}"][value="${value}"]`);
//         $selectedCheckbox.prop("checked", false);

//         let $otherSelectedItem = $(`.filter-tags__item[data-name="${name}"][data-value="${value}"]`);
//         $otherSelectedItem.remove();

//         syncInputFields($selectedCheckbox);

//         break;
//       case 'radio':
//         $selectedRadio = $(`.radiobtn__input[name="${name}"][value="${value}"]`);
//         $selectedRadio.prop('checked', false);

//         let $nonCheckedRadio = $(`.radiobtn__input[name="${name}"][value=""]`);
//         syncInputFields($nonCheckedRadio);

//         break;
//       case 'textfield':
//         let $input = $(`input[name="${name}"]`).val('');
//         clearTextField($input);

//         break;
//       case 'range':
//         let $rangeSlider = $(`.range-slider[data-name="${name}"]`);
//         $rangeSlider.each(function (index, el) {
//           resetRangeSlider(el);
//         });

//         break;

//       case 'date-range':
//         const calendarInput = document.querySelector(`.calendar__input[name="${name}"][value="${value}"]`);
//         const calendarEl = calendarInput.closest('.js-calendar');
//         const calendar = Calendar.getInstance(calendarEl);

//         calendar.clearCalendar();

//         break;

//       case 'select':
//         let $select = $(`select[name="${name}"]`);
//         $select.val('').trigger('change', ['fromCode']);

//         $selectedRadio = $(`.radiobtn__input[name="${name}"][value="${value}"]`);
//         $selectedRadio.prop('checked', false);

//         break;
//     }
//   }

//   $filterTag.remove();

//   setTimeout(() => {
//     toggleClearFilterButtons();

//     // if (isMainFilter && document.forms.vacancies_filter) {
//       // updateFilterUrl();
//       // document.forms.vacancies_filter.dispatchEvent(new CustomEvent("updateVacanciesFilter"));
//     // }
//   });

//   let selectedItemsLength = $('.filter .filter-tags__item').length;
//   setVisibilitySelectedMoreItem(selectedItemsLength);

//   checkDependentFilters();
// }

// function undoChangesToAdditionalFilters() {
//   const checkboxesAndRadio = document.querySelectorAll('.additional-filters .checkbox__input, .additional-filters .radiobtn__input');
//   checkboxesAndRadio.forEach(el => {
//     let type = el.getAttribute('type');
//     let name = el.getAttribute('name');
//     let value = el.getAttribute('value');
//     let labelText = el.parentNode.querySelector('label').textContent;
//     let $filterTag = findFilterTagByValue(name, value);

//     if (el.dataset.defaultChecked !== undefined) {
//       el.checked = true;

//       if (!(el.name === 'zitlo[]' && el.value === 'all')) {
//         createOrUpdateTag(type, name, value, labelText);
//       }
//     } else {
//       el.checked = false;
//       clearTagRelatedFields($filterTag);
//     }
//   });

//   document.querySelectorAll(`.range-slider--range`).forEach(el => {
//     const inputFrom = document.getElementById(el.dataset.syncFromFieldIds);
//     const inputTo = document.getElementById(el.dataset.syncToFieldIds);

//     el.noUiSlider.set([el.dataset.minValue, el.dataset.maxValue]);

//     if (inputFrom) inputFrom.value = el.dataset.minValue;
//     if (inputTo) inputTo.value = el.dataset.maxValue;
//   });

//   toggleClearFilterButtons();

//   // if (document.forms.vacancies_filter) {
//   //   document.forms.vacancies_filter.dispatchEvent(new CustomEvent("undoingChangesToAdditionalFilters"));
//   // }
// }

// function clearFilter() {
//   let $searchInput = $('[data-search-input]');
//   // let $filterSelects = $('.filter select.filter-select, .additional-filters select.filter-select');
//   let $allCheckboxes = $('.additional-filters .checkbox__input');
//   let $allNonCheckedRadio = $(`.additional-filters .radiobtn__input[value=""]`);
//   let calendars = document.querySelectorAll('.additional-filters .js-calendar');
//   let clearFilterBtns = document.querySelectorAll(`[data-clear-filter]`);
//   let $filtersBtn = $('.btn-white--filter .btn-white__count');

//   $searchInput.val('').trigger('input').removeAttr('value');

//   // $filterSelects.next('.select2-container').find('.select2-selection').removeClass('select2-selection--selected');

//   // $filterSelects.each(function (index, el) {
//   //   $(el).val('');
//   //   $(el).find('option[selected]').removeAttr('selected');
//   // });

//   document.querySelectorAll(`.range-slider`).forEach(resetRangeSlider);

//   clearFilterBtns.forEach(btn => btn.style.display = 'none');
//   $('.additional-filters__filter-tags').hide();

//   $allCheckboxes.prop('checked', false);
//   $allNonCheckedRadio.prop('checked', true);

//   calendars.forEach(el => {
//     const calendar = Calendar.getInstance(el);
//     calendar.clearCalendar();
//   });

//   document.querySelectorAll('.filter-tags__item').forEach(el => el.remove());

//   setVisibilitySelectedMoreItem(0);

//   $filtersBtn.addClass('hidden').text(0);
//   $filtersBtn.closest('.btn-white--filter').addClass('btn-white--filter-dark-icon');

//   // clearCitiesCheckboxes();
// }

// function findFilterTagByValue(name, value) {
//   let $container = $('.filter-tags__list');
//   let $filterTag = $container.find(`.filter-tags__item[data-name="${name}"][data-value="${value}"]`);

//   return $filterTag;
// }

// function createOrUpdateTag(type, name, value, labelText) {
//   let $container = $('.filter-tags__list');
//   let $filterTag = findFilterTagByValue(name, value);

//   if ($filterTag.length) return;

//   let htmlStr = `
//               <li class="filter-tags__item" data-type="${type}" data-name="${name}" data-value="${value}">
//                 <div class="filter-tag">
//                   <div class="filter-tag__value">${labelText}</div>
//                   <a href="#" class="filter-tag__remove-btn"></a>
//                 </div>
//               </li>`;

//   if (['range', 'date-range', 'textfield', 'select'].includes(type)) {
//     $filterTag = $(`.filter-tags__item[data-name="${name}"]`);

//     if ($filterTag.length) {
//       $filterTag.attr('data-type', type);
//       $filterTag.attr('data-name', name);
//       $filterTag.attr('data-value', value);
//       $filterTag.find('.filter-tag__value').html(labelText);

//       return;
//     }
//   }

//   $container.find('.filter-tags__more-item').before(htmlStr);
// }

// function changeCaseOfAgeLabel(age) {
//   if (isNaN(age)) return false;

//   let result = 'років';

//   if ([2, 3, 4].includes(age % 10)) {
//     result = 'роки';
//   } else if (age % 10 === 1) {
//     result = 'рік';
//   }

//   return result;
// }

// function changeCaseOfDaysLabel(days) {
//   if (isNaN(days)) return false;

//   let result = 'днів';

//   if ([2, 3, 4].includes(days % 10)) {
//     result = 'дні';
//   } else if (days % 10 === 1) {
//     result = 'день';
//   }

//   return result;
// }


// $(() => {
document.addEventListener('DOMContentLoaded', function () {
  // select2($);

  // Calendar.initAll();

  const filterController = initVacanciesFilter();

  let fancyboxOpts = {
    dragToClose: false,
    mainClass: 'fancybox--additional-filters-popup',

    tpl: {
      closeButton: '<button data-fancybox-close class="fancybox-close-button hidden-xxs" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path stroke="#A1A7B3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M1 17 17 1M1 1l16 16"></path></svg></button>'
    },

    on: {
      ready: () => {
        filterController?.resetUiPlugins?.();
        FancyboxIOSScrollLock.lock();
      },

      // reveal: (fancybox, slide) => {
      //   if (slide.src === '#cities-popup') {
      //     $(slide.contentEl).find('.cities-filter__search-input').focus();
      //   }
      // },

      // close: (fancybox, event) => {
      //   filterController?.resetUiPlugins?.();

      //   // undoChangesToAdditionalFilters();
      // },

      destroy: () => {
        filterController?.resetUiPlugins?.();
        FancyboxIOSScrollLock.unlock();
      }
    }
  };

  Fancybox.bind(".additional-filters-popup-link", fancyboxOpts);

  Fancybox.bind(".rating-popup-link", {
    dragToClose: false,
    mainClass: 'fancybox--rating-popup',

    tpl: {
      closeButton: '<button data-fancybox-close class="fancybox-close-button hidden-xxs" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path stroke="#A1A7B3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M1 17 17 1M1 1l16 16"></path></svg></button>'
    }
  });


  let psInstances = new Map(); // хранит {element -> psInstance}
  const media = window.matchMedia('(min-width: 1024px)');
  const containers = Array.from(document.querySelectorAll('.rating-popup__reviews'));

  function enableScroll(el) {
    if (!psInstances.has(el)) {
      psInstances.set(el, new PerfectScrollbar(el));
    }
  }

  function disableScroll(el) {
    const instance = psInstances.get(el);
    if (instance) {
      instance.destroy();
      psInstances.delete(el);
    }
  }

  function handleMedia(e) {
    if (e.matches) {
      // >= 1024px → включаем все scrollbars
      containers.forEach(enableScroll);
    } else {
      // < 1024px → выключаем все
      containers.forEach(disableScroll);
    }
  }

  media.addEventListener('change', handleMedia);
  handleMedia(media);


  if (window.location.href.includes('open-popup')) {
    Fancybox.show(
      [
        {
          src: "#additional-filters-popup"
        }
      ],
      fancyboxOpts
    );
  }

  // let $filterSelects = $();

  // console.log($('.filter-select:not(.reviews__select)'));

  // $('.filter-select:not(.reviews__select)').each(function (index, el) {
  //   if ($(window).width() > 575 || ($(window).width() < 576 && !$(el).hasClass('hidden-xs'))) {
  //     let $item = $(el).select2({
  //       dropdownCssClass: ':all:',
  //       selectionCssClass: ':all:',
  //       theme: 'filter-select',
  //       dropdownAutoWidth: true,
  //       minimumResultsForSearch: -1
  //     });

  //     $filterSelects = $filterSelects.add($item);
  //   }
  // });

  // $filterSelects.each(function (index, el) {
  //   let $select2Selection = $(el).next('.select2-container').find('.select2-selection');
  //   let name = $(el).attr('name');
  //   let value = $(el).select2('val');
  //   let $label = $select2Selection.find('.select2-selection__rendered');

  //   if (name === 'kategoriia-pracivnika') {
  //     if (!value) {
  //       $label.text('Спеціалізація');
  //     } else {
  //       $select2Selection.addClass('select2-selection--selected');
  //     }
  //   }

  //   $(el).on('change', function (e, call) {
  //     let value = $(this).select2('val');

  //     if (name === 'kategoriia-pracivnika') {
  //       if (value !== '') {
  //         $select2Selection.addClass('select2-selection--selected');
  //       } else {
  //         $select2Selection.removeClass('select2-selection--selected');
  //         let $filterTag = $(`.filter-tags__item[data-type="select"][data-name="${name}"]`);

  //         $filterTag.remove();

  //         $label.text('Спеціалізація');
  //       }
  //     }

  //     if (name === 'countries') {
  //       let $countriesSelects = $('select[name="countries"]');
  //       $countriesSelects.val(value);
  //     }

  //     if (!['currency'].includes(name)) {
  //       toggleClearFilterButtons();
  //     }

  //     if (['kategoriia-pracivnika', 'distance'].includes(name)) {
  //       if (call !== 'fromCode') {
  //         setTimeout(() => {
  //           updateFilterUrl();
  //         });
  //       }
  //     }
  //   });
  // });


  // $(document).on('click', '.select-toggle', function (e) {
  //   let $targetElem = $($(this).attr('href'));

  //   setTimeout(() => {
  //     $targetElem.find('.ms-selectable__search-input').focus();
  //   });
  // });

  // $('[data-clear-filter]').click(() => {
  //   clearFilter();
  // });

  // $('[data-clear-filter]').click(() => {
  //   // clearCitiesSelect();
  //   clearCitiesCheckboxes();
  //   // clearSexSelect();
  // });

  // document.addEventListener('click', function (e) {
  //   if (!e.target.closest('[data-clear-filter]')) return;

  //   clearFilter();
  // });


  if ($(window).width() < 768) {
    document.querySelectorAll('.promo-blocks-swiper:not(.swiper-initialized)').forEach(item => {
      let slidesCount = $(item).find('.swiper-slide').length;

      const promoBlocksSwiper = new Swiper(item, {
        modules: [Pagination],
        slidesPerView: 'auto',
        centeredSlides: slidesCount < 2,
        spaceBetween: 15,
        slideActiveClass: 'promo-blocks-swiper__slide--active',

        pagination: {
          el: '.promo-blocks-swiper__pagination',
          bulletActiveClass: 'swiper-pagination-bullet--active',
        },

        on: {
          slideChange: function () {
            // Снимаем checked со всех радио кнопок в данном слайдере
            const allCheckboxes = this.el.querySelectorAll('.checkbox__input');
            allCheckboxes.forEach(checkbox => {
              checkbox.checked = false;
            });

            // Устанавливаем checked для радио кнопки в активном слайде
            const activeSlide = this.slides[this.activeIndex];
            const activeCheckbox = activeSlide.querySelector('.checkbox__input');

            if (activeCheckbox) {
              activeCheckbox.checked = true;
              // Триггерим событие change для обновления связанной логики
              activeCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }
        }
      });

      if (promoBlocksSwiper.slides.length === 1) {
        $(promoBlocksSwiper.pagination.el).hide();
      }
    });
  }

  // Removing selected items
  // $(document).on('click', '.filter-tag__remove-btn', function (event) {
  //   let $filterTagParent = $(this).closest('.filter-tags__item');
  //   clearTagRelatedFields($filterTagParent);

  //   event.preventDefault();
  // });

  // $('.filter .form-text:not([type="search"])').on('input', function (e) {
  //   setTimeout(() => {
  //     toggleClearFilterButtons();
  //   });
  // });

  // document.addEventListener('click', function (e) {
  //   const highlightedAnimationTag = e.target.closest('.additional-filters .checkbox--highlighted-animation');

  //   if (!highlightedAnimationTag) return;

  //   highlightedAnimationTag.classList.remove('checkbox--highlighted-animation');
  // });

  // Adding selected checkboxes/radio buttons
  // $('.additional-filters').find('.checkbox__input, .radiobtn__input').change(function (event) {
  //   let name = $(this).attr('name');
  //   let value = $(this).val();
  //   let labelText = $(this).parent().find('label').text();
  //   let $filterTag = $(`.filter-tags__item[data-name="${name}"][data-value="${value}"]`);

  //   if ($(this).is(':checkbox')) {
  //     if ($(this).is(':checked')) {
  //       createOrUpdateTag("checkbox", name, value, labelText);
  //     } else {
  //       $filterTag.remove();
  //     }
  //   } else if ($(this).is(':radio')) {
  //     let groupTitle = $(this).closest('.radiobtns-group').find('.radiobtns-group__title').text();
  //     let $otherSelectedItems = $(`.filter-tags__item[data-name="${name}"]`).not(`[data-value="${value}"]`);

  //     $otherSelectedItems.remove();

  //     if (value !== '') {
  //       let type = (name === 'kategoriia-pracivnika') ? 'select' : 'radio';

  //       if (!(name === 'zitlo[]' && value === 'all')) {
  //         createOrUpdateTag(type, name, value, `<strong>${groupTitle}:</strong> ${labelText}`);
  //       }
  //     }

  //     if (name === 'kategoriia-pracivnika') {
  //       let $employeeCategorySelect = $('select[name="kategoriia-pracivnika"]');

  //       $employeeCategorySelect.val(value);
  //       $employeeCategorySelect.find('option[selected]').removeAttr('selected');
  //       $employeeCategorySelect.trigger('change', ['fromCode']);
  //     }
  //   }

  //   let selectedItemsLength = $('.additional-filters .filter-tags__item').length;

  //   toggleClearFilterButtons();
  //   setVisibilitySelectedMoreItem(selectedItemsLength);
  //   checkDependentFilters();

  //   setTimeout(() => {
  //     setVacanciesCount();
  //   });
  // });

  // function initCalendarTag(calendarEl) {
  //   const calendarField = calendarEl.querySelector('.calendar-field');
  //   const calendarInput = calendarEl.querySelector('.calendar__input');

  //   if (!calendarInput.value) return;

  //   createOrUpdateTag('date-range', calendarInput.name, calendarInput.value, calendarField.textContent);
  // }

  // document.querySelectorAll('.additional-filters .js-calendar').forEach(el => {
  //   initCalendarTag(el);
  // });

  // document.addEventListener('calendar:apply', (e) => {
  //   initCalendarTag(e.detail.root);
  // });

  // document.querySelectorAll('.additional-filters__filter-element--date-range').forEach(dateRange => {
  //   // setCalendarVacanciesCount(dateRange);
  //   // setVacanciesCount();

  //   dateRange.addEventListener('calendar:open', (e) => {
  //     // setCalendarVacanciesCount(e.detail.root);
  //     setVacanciesCount();
  //   });

  //   dateRange.addEventListener('calendar:change', (e) => {
  //     // setCalendarVacanciesCount(e.detail.root);
  //     setVacanciesCount();
  //   });

  //   dateRange.addEventListener('calendar:cancel', (e) => {
  //     setVacanciesCount();
  //   });
  // });

  // $('.filter-tags__more-btn').click(function (event) {
  //   let isMobile = $(window).width() < 576;
  //   let visibleClass = isMobile ? 'filter-tags--expanded-mob' : 'filter-tags--expanded';
  //   let $filterTags = $(this).closest('.filter-tags');

  //   $(this).toggleClass('more-btn--active');

  //   if ($(this).hasClass('more-btn--active')) {
  //     $(this).find('.more-btn__text').text('Приховати');
  //     $filterTags.addClass(visibleClass);
  //   } else {
  //     $(this).find('.more-btn__text').text('Ще');
  //     $filterTags.removeClass(visibleClass);
  //   }

  // });

  // function setVacanciesCount() {
  //   let additionalFiltersSubmitBtn = document.querySelector('.additional-filters__submit-btn');
  //   additionalFiltersSubmitBtn.classList.add('btn-default--filter-loading');

  //   $.ajax({
  //     url: `/api/v1/vacancies-count${getFilterUrl()}`,

  //     success: function (data) {
  //       const translations = {
  //         'show': {
  //           'en': 'Show',
  //           'ru': 'Показать',
  //           'uk': 'Показати'
  //         },

  //         'no_vacancies': {
  //           'en': 'No vacancies',
  //           'ru': 'Нет вакансий',
  //           'uk': 'Немає вакансій'
  //         }
  //       };

  //       const lang = document.documentElement.lang;
  //       const btnText = data.total ? translations.show[lang] + ' ' + data.label : translations.no_vacancies[lang];

  //       additionalFiltersSubmitBtn.classList.remove('btn-default--filter-loading');
  //       additionalFiltersSubmitBtn.querySelector('.btn-default__text').textContent = btnText;
  //     },

  //     error: function (data) {
  //       console.error(data);
  //     }
  //   });
  // }

  // function setCalendarVacanciesCount(root) {
  //   const applyBtn = root.querySelector('.calendar-modal__apply-btn');

  //   $.ajax({
  //     url: `/api/v1/vacancies-count${getFilterUrl()}`,

  //     success: function (data) {
  //       const translations = {
  //         'apply': {
  //           'en': 'Apply',
  //           'ru': 'Применить',
  //           'uk': 'Застосувати'
  //         },

  //         'no_vacancies': {
  //           'en': 'No vacancies',
  //           'ru': 'Нет вакансий',
  //           'uk': 'Немає вакансій'
  //         }
  //       };

  //       const lang = document.documentElement.lang;
  //       const btnText = data.total ? translations.apply[lang] + ' · ' + data.label : translations.apply[lang];

  //       applyBtn.textContent = btnText;
  //     },

  //     error: function (data) {
  //       console.error(data);
  //     }
  //   });
  // }

  // Creating filter URL
  // document.addEventListener('submit', (event) => {
  //   const form = event.target.closest('form[name="vacancies_filter"]');

  //   if (!form) return;

  //   event.preventDefault();
  //   updateFilterUrl();
  // });

  // async function loadCities(params = {}) {
  //   try {
  //     const url = new URL('/api/v1/cities', window.location.origin);

  //     buildQuery(url.searchParams, params || {});

  //     const response = await fetch(url.toString());

  //     if (!response.ok) {
  //       throw new Error(`HTTP error: ${response.status}`);
  //     }

  //     const data = await response.json();

  //     document.dispatchEvent(new CustomEvent('citiesLoaded', {
  //       detail: { data, query: url.search }
  //     }));

  //   } catch (error) {
  //     console.error('Failed to load cities:', error);
  //   }
  // }

  // function buildQuery(searchParams, params) {
  //   if (!params || typeof params !== 'object') return;
    
  //   Object.entries(params).forEach(([key, value]) => {
  //     if (value === null || value === undefined) return;

  //     if (Array.isArray(value)) {
  //       value.forEach(item => {
  //         if (item !== null && item !== undefined) {
  //           searchParams.append(`${key}[]`, item);
  //         }
  //       });
  //       return;
  //     }

  //     if (typeof value === 'string') {
  //       const trimmed = value.trim();
  //       if (trimmed) {
  //         searchParams.set(key, trimmed);
  //       }
  //       return;
  //     }

  //     if (typeof value === 'number' || typeof value === 'boolean') {
  //       searchParams.set(key, value);
  //       return;
  //     }

  //     console.warn(`Unsupported param type for key "${key}"`, value);
  //   });
  // }

  // loadCities();

  // Loading cities via AJAX
  // document.addEventListener('change', function (e) {
  //   if (!e.target.closest('input[name="country[]"]')) return;

  //   let selectedCountryIds = [...document.querySelectorAll('input[name="country[]"]:checked')].map(item => item.dataset.entityId);
  //   loadCities({ country_ids: selectedCountryIds });

  //   // setTimeout(updateFilterUrl);
  // });

  // Dependent filters
  // checkDependentFilters();

  // $('.additional-filters').find('.checkbox__input, .radiobtn__input').on('change', function (event) {
  //   let $parentElem = $(this).parent();

  //   if ($parentElem.hasClass('checkbox--expandable')) {
  //     let $checkboxes = $parentElem.next('.additional-filters__checkboxes-group').find('.checkbox__input');

  //     if ($(this).is(':checked')) {
  //       $checkboxes.prop('checked', true);
  //     } else {
  //       $checkboxes.prop('checked', false);
  //     }
  //   }
  // });

  // Synchronized selects
  // $('select[data-sync-field]').on('change', function (event) {
  //   $(this).find('option').each((index, option) => {
  //     let syncFieldIDs = $(option).data('sync-field-ids');

  //     syncFieldIDs.split(',').forEach(id => {
  //       let $syncField = $(`#${id.trim()}`);
  //       let type = $syncField.attr('type');

  //       if (type === 'checkbox') {
  //         let name = $syncField.attr('name');
  //         let value = $syncField.attr('value');
  //         let $filterTag = findFilterTagByValue(name, value);
  //         let labelText = $syncField.next('label').text();

  //         if ($(option).is(':selected')) {
  //           $syncField.prop('checked', true);
  //           createOrUpdateTag("checkbox", name, value, labelText);
  //         } else {
  //           $syncField.prop('checked', false);
  //           $filterTag.remove();
  //         }
  //       }

  //     });
  //   });
  // });


  // const sliders = document.querySelectorAll('.range-slider--single');
  // sliders.forEach(slider => {
  //   let min = parseInt(slider.dataset.min);
  //   let max = parseInt(slider.dataset.max);
  //   let startValue = parseInt(slider.dataset.startValue);

  //   noUiSlider.create(slider, {
  //     start: [startValue],
  //     connect: [true, false],
  //     range: {
  //       'min': min,
  //       'max': max
  //     },

  //     format: {
  //       to: function (value) {
  //         return parseInt(value);
  //       },

  //       from: function (value) {
  //         return parseInt(value);
  //       },
  //     },
  //   });

  //   let syncFieldIds = slider.dataset.syncFieldIds;
  //   let fields = [];
  //   let fieldsSuffixes = [];

  //   syncFieldIds.split(',').forEach(id => {
  //     let field = document.getElementById(id.trim());

  //     if (field) {
  //       fields.push(field);

  //       let fieldSuffix = field.parentNode.querySelector('.range-slider-element__input-suffix');

  //       if (fieldSuffix) {
  //         fieldsSuffixes.push(fieldSuffix);
  //       }
  //     }
  //   });

  //   slider.noUiSlider.on('slide', function (values, handle) {
  //     fields.forEach(field => {
  //       field.value = values[0];
  //     });

  //     let name = slider.dataset.name;
  //     let value = values[0];

  //     fieldsSuffixes.forEach(fieldSuffix => {
  //       if (name === 'vik') {
  //         fieldSuffix.textContent = changeCaseOfAgeLabel(values[0]);
  //       }
  //     });

  //     if (slider.dataset.min != values[0]) {
  //       let label = slider.closest('.filter-element').querySelector('.filter-element__title');
  //       let labelText = name === 'vik' ? value + ' ' + changeCaseOfAgeLabel(value) : value;

  //       createOrUpdateTag("range", name, value, labelText);
  //     } else {
  //       let $filterTag = $(`.filter-tags__item[data-name="${name}"]`);
  //       $filterTag.remove();
  //     }

  //     toggleClearFilterButtons();
  //   });

  //   ['input'].forEach(eventName => {
  //     fields.forEach((field, idx) => {
  //       field.addEventListener(eventName, function (e) {
  //         if (!this.value) return;

  //         slider.noUiSlider.set(this.value);

  //         let name = slider.dataset.name;
  //         let value = this.value;

  //         if (slider.dataset.min != this.value) {
  //           let labelText = name === 'vik' ? value + ' ' + changeCaseOfAgeLabel(value) : '';

  //           createOrUpdateTag("range", name, value, labelText);
  //         } else {
  //           let $filterTag = $(`.filter-tags__item[data-name="${name}"]`);
  //           $filterTag.remove();
  //         }

  //         fieldsSuffixes.forEach(fieldSuffix => {
  //           if (name === 'vik') {
  //             fieldSuffix.textContent = changeCaseOfAgeLabel(value);
  //           }
  //         });

  //         setTimeout(() => {
  //           toggleClearFilterButtons();
  //         });
  //       });
  //     });
  //   });

  //   fields.forEach((field, idx) => {
  //     field.addEventListener('change', function (e) {
  //       let name = slider.dataset.name;
  //       let value = this.value;

  //       if (this.value == '') {
  //         value = slider.noUiSlider.get()[0];
  //       } else if (this.value < min) {
  //         value = min;
  //       } else if (this.value > max) {
  //         value = max;
  //       }

  //       this.value = value;
  //       slider.noUiSlider.set(value);
  //       createOrUpdateTag("range", name, value, name === 'vik' ? value + ' ' + changeCaseOfAgeLabel(value) : value);
  //     });
  //   });
  // });

  // const rangeSliders = document.querySelectorAll('.range-slider--range');
  // rangeSliders.forEach(slider => {
  //   let min = parseInt(slider.dataset.min);
  //   let max = parseInt(slider.dataset.max);
  //   let minValue = parseInt(slider.dataset.minValue);
  //   let maxValue = parseInt(slider.dataset.maxValue);

  //   noUiSlider.create(slider, {
  //     start: [minValue, maxValue],
  //     connect: true,
  //     range: {
  //       'min': min,
  //       'max': max
  //     },

  //     format: {
  //       to: function (value) {
  //         return parseInt(value);
  //       },

  //       from: function (value) {
  //         return parseInt(value);
  //       },
  //     },
  //   });

  //   let syncFromFieldIds = slider.dataset.syncFromFieldIds;
  //   let syncToFieldIds = slider.dataset.syncToFieldIds;
  //   let fieldsFrom = [];
  //   let fieldsTo = [];
  //   let fieldsFromSuffixes = [];
  //   let fieldsToSuffixes = [];

  //   syncFromFieldIds.split(',').forEach(id => {
  //     let field = document.getElementById(id.trim());

  //     if (field) {
  //       fieldsFrom.push(field);

  //       let fieldSuffix = field.parentNode.querySelector('.range-slider-element__input-suffix');

  //       if (fieldSuffix) {
  //         fieldsFromSuffixes.push(fieldSuffix);
  //       }
  //     }
  //   });

  //   syncToFieldIds.split(',').forEach(id => {
  //     let field = document.getElementById(id.trim());

  //     if (field) {
  //       fieldsTo.push(field);

  //       let fieldSuffix = field.parentNode.querySelector('.range-slider-element__input-suffix');

  //       if (fieldSuffix) {
  //         fieldsToSuffixes.push(fieldSuffix);
  //       }
  //     }
  //   });

  //   slider.noUiSlider.on('slide', function (values, handle) {
  //     fieldsFrom.forEach(field => {
  //       field.value = values[0];
  //     });

  //     fieldsTo.forEach(field => {
  //       field.value = values[1];
  //     });

  //     let name = slider.dataset.name;
  //     let value = `${values[0]}-${values[1]}`;

  //     fieldsFromSuffixes.forEach(fieldSuffix => {
  //       if (name === 'vik') {
  //         fieldSuffix.textContent = changeCaseOfAgeLabel(values[0]);
  //       } else if (name === 'fiksovanii-termin') {
  //         fieldSuffix.textContent = changeCaseOfDaysLabel(values[0]);
  //       }
  //     });

  //     fieldsToSuffixes.forEach(fieldSuffix => {
  //       if (name === 'vik') {
  //         fieldSuffix.textContent = changeCaseOfAgeLabel(values[1]);
  //       } else if (name === 'fiksovanii-termin') {
  //         fieldSuffix.textContent = changeCaseOfDaysLabel(values[1]);
  //       }
  //     });

  //     if (slider.dataset.min != values[0] || slider.dataset.max != values[1]) {
  //       let labelText = name === 'vik' ? value + ' ' + changeCaseOfAgeLabel(values[1]) : value;

  //       createOrUpdateTag("range", name, value, labelText);
  //     } else {
  //       let $filterTag = $(`.filter-tags__item[data-name="${name}"]`);
  //       $filterTag.remove();
  //     }

  //     toggleClearFilterButtons();
  //   });

  //   ['input'].forEach(eventName => {
  //     fieldsFrom.forEach((field, idx) => {
  //       field.addEventListener(eventName, function (e) {
  //         if (!this.value) return;

  //         slider.noUiSlider.set([this.value, null]);

  //         let name = slider.dataset.name;
  //         let value = `${this.value}-${fieldsTo[idx].value}`;

  //         if (slider.dataset.min != this.value || slider.dataset.max != fieldsTo[idx].value) {
  //           let labelText = name === 'vik_from' ? value + ' ' + changeCaseOfAgeLabel(this.value) : value;

  //           createOrUpdateTag("range", name, value, labelText);
  //         } else {
  //           let $filterTag = $(`.filter-tags__item[data-name="${name}"]`);
  //           $filterTag.remove();
  //         }

  //         fieldsFromSuffixes.forEach(fieldSuffix => {
  //           if (name === 'vik') {
  //             fieldSuffix.textContent = changeCaseOfAgeLabel(this.value);
  //           }
  //         });

  //         setTimeout(() => {
  //           toggleClearFilterButtons();
  //         });
  //       });
  //     });

  //     fieldsTo.forEach((field, idx) => {
  //       field.addEventListener(eventName, function (e) {
  //         if (!this.value) return;

  //         slider.noUiSlider.set([null, this.value]);

  //         let name = slider.dataset.name;
  //         let value = `${fieldsFrom[idx].value}-${this.value}`;

  //         if (slider.dataset.min != fieldsFrom[idx].value || slider.dataset.max != this.value) {
  //           let labelText = name === 'vik_to' ? value + ' ' + changeCaseOfAgeLabel(this.value) : value;

  //           createOrUpdateTag("range", name, value, labelText);
  //         } else {
  //           let $filterTag = $(`.filter-tags__item[data-name="${name}"]`);
  //           $filterTag.remove();
  //         }

  //         fieldsToSuffixes.forEach(fieldSuffix => {
  //           if (name === 'vik') {
  //             fieldSuffix.textContent = changeCaseOfAgeLabel(this.value);
  //           }
  //         });

  //         setTimeout(() => {
  //           toggleClearFilterButtons();
  //         });
  //       });
  //     });
  //   });

  //   fieldsFrom.forEach((field, idx) => {
  //     field.addEventListener('change', function (e) {
  //       let name = slider.dataset.name;
  //       let fromValue = this.value;
  //       let toValue = fieldsTo[idx].value;

  //       if (this.value == '') {
  //         fromValue = slider.noUiSlider.get()[0];
  //       } else if (this.value < min) {
  //         fromValue = min;
  //       } else if (this.value > max) {
  //         fromValue = max;
  //       }

  //       let value = `${fromValue}-${toValue}`;
  //       this.value = fromValue;
  //       slider.noUiSlider.set([fromValue, null]);
  //       createOrUpdateTag("range", name, value, name === 'vik_from' ? value + ' років' : value);
  //     });
  //   });

  //   fieldsTo.forEach((field, idx) => {
  //     field.addEventListener('change', function (e) {
  //       let name = slider.dataset.name;
  //       let fromValue = fieldsFrom[idx].value;
  //       let toValue = this.value;

  //       if (this.value == '') {
  //         toValue = slider.noUiSlider.get()[1];
  //       } else if (this.value < min) {
  //         toValue = min;
  //       } else if (this.value > max) {
  //         toValue = max;
  //       }

  //       let value = `${fromValue}-${toValue}`;
  //       this.value = toValue;
  //       slider.noUiSlider.set([null, toValue]);
  //       createOrUpdateTag("range", name, value, name === 'vik_to' ? value + ' років' : value);
  //     });
  //   });
  // });

  // toggleClearFilterButtons();

  // if (document.forms.vacancies_filter) {
  //   document.forms.vacancies_filter.addEventListener('updateVacanciesFilter', function (e) {
  //     updateFilterUrl();
  //   });
  // }

  // let additionalFiltersSelectedItemsLength = $('.additional-filters .filter-tags__item').length;
  // setVisibilitySelectedMoreItem(additionalFiltersSelectedItemsLength);

  // Age switch
  // function handleAgeSwitchChange(ageSwitch) {
  //   const filterElement = ageSwitch.closest('.filter-element');
  //   if (!filterElement) return;

  //   const singleSliderElement = filterElement.querySelector('.range-slider-element--single');
  //   const rangeSliderElement = filterElement.querySelector('.range-slider-element--range');

  //   const isChecked = ageSwitch.checked;

  //   if (singleSliderElement) {
  //     singleSliderElement.hidden = isChecked;
  //   }

  //   if (rangeSliderElement) {
  //     rangeSliderElement.hidden = !isChecked;
  //   }

  //   removeAgeSelectedItems();
  // }

  // function removeAgeSelectedItems(scope = document) {
  //   scope
  //     .querySelectorAll('.filter-tags__item[data-name="vik"][data-type="range"]')
  //     .forEach((item) => item.remove());
  // }

  // document.addEventListener('change', (event) => {
  //   const ageSwitch = event.target.closest('input[name="age_switch"]');
  //   if (!ageSwitch) return;

  //   handleAgeSwitchChange(ageSwitch);
  // });

  // $ageSwitch.change(function (event) {
  //   let $filterElement = $(this).closest('.filter-element');
  //   let $singleSliderElement = $filterElement.find('.range-slider-element--single');
  //   let $rangeSliderElement = $filterElement.find('.range-slider-element--range');

  //   if ($(this).is(':checked')) {
  //     $singleSliderElement.hide();
  //     $rangeSliderElement.show();
  //   } else {
  //     $singleSliderElement.show();
  //     $rangeSliderElement.hide();
  //   }

  //   let $ageSelectedItem = $('.filter-tags__item[data-name="vik"][data-type="range"]');
  //   $ageSelectedItem.remove();
  // });

  // Cities filter
  // document.addEventListener('input', function (e) {
  //   const searchInput = e.target.closest('.cities-filter__search-input');

  //   if (!searchInput) return;

  //   const citiesFilter = searchInput.closest('.cities-filter');
  //   const clearSearchBtn = citiesFilter.querySelector('.cities-filter__clear-search-btn');

  //   let searchValue = searchInput.value.trim();

  //   let selectedCountryIds = [...document.querySelectorAll('input[name="country[]"]:checked')].map(item => item.dataset.entityId);
  //   loadCities({
  //     country_ids: selectedCountryIds,
  //     term: searchValue
  //   });

  //   searchValue ? clearSearchBtn.classList.remove('hidden') : clearSearchBtn.classList.add('hidden');

  //   // searchCitiesTimeoutID = setTimeout(() => {
  //   //   $.ajax({
  //   //     url: url,

  //   //     success: function (data) {
  //   //       let $allCitiesCheckboxes = $('.checkboxes-group--cities .checkbox__input');
  //   //       let cities = data.results;
  //   //       let allSelectedCitiesIds = [];

  //   //       // Clear checkboxes (mobile filter)
  //   //       $allCitiesCheckboxes.each(function (index, checkbox) {
  //   //         if (!$(checkbox).is(':checked')) {
  //   //           $(checkbox).closest('.checkboxes-group__item').remove();
  //   //         } else {
  //   //           allSelectedCitiesIds.push($(checkbox).val());
  //   //         }
  //   //       });

  //   //       // Filling checkboxes from data
  //   //       cities.forEach((item, index) => {
  //   //         if (!allSelectedCitiesIds.includes(item.id.toString())) {
  //   //           addCityCheckbox(item, allSelectedCitiesIds);
  //   //         }
  //   //       });
  //   //     },

  //   //     error: function (data) {
  //   //       console.log(data);
  //   //     }
  //   //   });

  //   //   // psArr[0].update();

  //   // }, 500);
  // });

  // document.addEventListener('click', function (e) {
  //   const clearSearchBtn = e.target.closest('.cities-filter__clear-search-btn');

  //   if (!clearSearchBtn) return;

  //   clearSearchBtn.classList.add('hidden');

  //   $('.cities-filter__search-input').val('').trigger('input').focus();
  // });

  // $(document).on('change', '.checkboxes-group--cities .checkbox__input', function (event) {
  //   let value = $(this).val();

  //   if ($(this).is(':checkbox')) {
  //     if ($(this).is(':checked')) {
  //       if (!currentSelectedCitiesIds.includes(value)) {
  //         currentSelectedCitiesIds.push(value);
  //       }
  //     } else {
  //       currentSelectedCitiesIds = removeItemFromArray(currentSelectedCitiesIds, value);
  //     }
  //   }

  //   toggleClearCitiesButtons();
  // });

  // $(document).on('click', '.filter-tag--city .filter-tag__remove-btn', function (event) {
  //   let $filterTagParent = $(this).closest('.filter-tags__item');
  //   let $filterTags = $filterTagParent.closest('.filter-tags');

  //   let name = $filterTagParent.data('name');
  //   let value = $filterTagParent.data('value');

  //   let $selectedCheckbox = $(`.checkboxes-group--cities .checkbox__input[name="${name}"][value="${value}"]`);
  //   $selectedCheckbox.prop("checked", false);

  //   $filterTagParent.remove();
  //   currentSelectedCitiesIds = removeItemFromArray(currentSelectedCitiesIds, value);

  //   let selectedItemsLength = $filterTags.find('.filter-tags__item').length;

  //   if (selectedItemsLength) {
  //     $filterTags.show();
  //   } else {
  //     $filterTags.hide();
  //   }

  //   event.preventDefault();
  // });

  // $('.filter-tags--cities .filter-tags__clear-btn').click(function (event) {
  //   $(this).closest('.filter-tags').find('.filter-tag__remove-btn').click();
  // });

  // Closing cities popup without saving
  // $('.cities-filter__btn-back').click(function (event) {
  //   currentSelectedCitiesIds = [...selectedCitiesIds];

  //   let $citiesCheckboxes = $('.checkboxes-group--cities .checkbox__input');
  //   let $searchInput = $('.cities-filter__search-input');
  //   let $citiesClearBtn = $('.cities-filter__clear-btn');

  //   $searchInput.val('').trigger('input');

  //   $citiesCheckboxes.each(function (index, checkbox) {
  //     if (selectedCitiesIds.includes($(checkbox).val())) {
  //       $(checkbox).prop('checked', true);
  //     } else {
  //       $(checkbox).prop('checked', false);
  //     }
  //   });

  //   if (currentSelectedCitiesIds.length) {
  //     $citiesClearBtn.show();
  //   } else {
  //     $citiesClearBtn.hide();
  //   }
  // });

  // $('.cities-filter__clear-btn').on('click', clearCitiesCheckboxes);
  
  // document.addEventListener('click', function (e) {
  //   if (!e.target.closest('.cities-filter__clear-btn')) return;

  //   clearCitiesCheckboxes();
  // });

  // $('.cities-filter__apply-btn').click(function (event) {
  //   selectedCitiesIds = [...currentSelectedCitiesIds];

  //   let $searchInput = $('.cities-filter__search-input');
  //   $searchInput.val('').trigger('input');

  //   setCheckedCityCheckboxesTitle();
  //   toggleClearCitiesButtons();

  //   setTimeout(() => {
  //     if (document.forms.vacancies_filter) {
  //       getFilterUrl();
  //       // updateFilterUrl();
  //       // document.forms.vacancies_filter.dispatchEvent(new CustomEvent("updateVacanciesFilter"));
  //     }
  //   });
  // });

  // Loading cities via AJAX
  // document.addEventListener('citiesLoaded', function (e) {
  //   console.log('citiesLoaded');

  //   let cities = e.detail.data.results;
  //   // console.log(e.detail);

  //   // filterController.setOptions('cities', cities);

  //   // citiesComponent.setCities(cities);
  //   // console.log(citiesComponent);

  //   // let $citiesCheckboxesList = $('.checkboxes-group--cities .checkboxes-group__list');
  //   // let selectedCities = $citiesCheckboxesList.attr('data-selected-cities');
  //   // let selectedCitiesArr = selectedCities ? selectedCities.split(", ") : [];

  //   // $citiesCheckboxesList.empty();
  //   // setCheckedCityCheckboxesTitle();
  //   // toggleClearCitiesButtons();

  //   // let allSelectedCitiesIds = selectedCitiesArr.filter(cityId => !cities.includes(cityId));
  //   // addAllSelectedCities(allSelectedCitiesIds);

  //   // setTimeout(() => {
  //   //   cities.forEach((item, index) => {
  //   //     if (!allSelectedCitiesIds.includes(item.id.toString())) {
  //   //       addCityCheckbox(item, allSelectedCitiesIds);
  //   //     }
  //   //   });

  //   //   $citiesCheckboxesList.removeAttr('data-selected-cities');
  //   // }, 300);
  // });

  // Synchronized input fields
  // $('input[data-sync-field-ids]').on('input', function (event) {
  //   syncInputFields($(this));
  //   toggleClearFilterButtons();
  // });

  // Synchronizing fields when remove tag
  // $(document).on('click', '.filter-tag__remove-btn', function (event) {
  //   let $filterTagParent = $(this).closest('.filter-tags__item');
  //   clearTagRelatedFields($filterTagParent);

  //   event.preventDefault();
  // });


  let $wrapper = $('.wrapper');
  let $btnFilter = $('.btn-filter');
  let $scrollTopBtn = $('.btn-scroll-top');

  $wrapper.on('scroll', function (event) {
    let scrolled = $wrapper.scrollTop();

    if (scrolled > 170) {
      $btnFilter.removeClass('btn-filter--invisible');
    } else {
      $btnFilter.addClass('btn-filter--invisible');
    }
  });

  $wrapper.on('scroll', function (event) {
    let scrolled = $wrapper.scrollTop();

    if (scrolled > 170) {
      $scrollTopBtn.removeClass('btn-scroll-top--invisible');
    } else {
      $scrollTopBtn.addClass('btn-scroll-top--invisible');
    }
  });

  $(window).on('scroll', function () {
    let scrolled = $(window).scrollTop();

    if (scrolled > 170) {
      $scrollTopBtn.removeClass('btn-scroll-top--invisible');
    } else {
      $scrollTopBtn.addClass('btn-scroll-top--invisible');
    }
  });

  $('.btn-filter--scroll-top, .btn-scroll-top').on('click', function (event) {
    $wrapper.animate({
      scrollTop: 0
    }, 0);

    $('html, body').animate({
      scrollTop: 0
    }, 0);
  });



  $(document).on('click', '.vacancy-card__copy-btn', function (event) {
    copyVacancyText(this.hasAttribute('data-multi-vacancy'));

    let defaultText = $(this).text();

    $(this).addClass('btn-white--copied');
    $(this).text('Текст скопійовано!');

    setTimeout(() => {
      $(this).removeClass('btn-white--copied');
      $(this).text(defaultText);
    }, 2000);

    event.preventDefault();
  });

  // $(document).on('click', '.vacancy-card__copy-btn-mobile', function (event) {
  //   copyVacancyText(this.hasAttribute('data-multi-vacancy'));

  //   let $tooltip = $(this).find('.btn-grey__tooltip');

  //   $tooltip.addClass('tooltip--visible');
  //   $(this).addClass('btn-grey--copied');

  //   setTimeout(() => {
  //     $tooltip.removeClass('tooltip--visible');
  //     $(this).removeClass('btn-grey--copied');
  //   }, 2000);

  //   event.preventDefault();
  // });

  document.addEventListener('click', function (e) {
    const moreLink = e.target.closest('.vacancy-card__more-link');

    if (!moreLink) return;

    const vacancyCardTeaser = moreLink.closest('.vacancy-card--teaser');
    // const wrapper = document.querySelector('.wrapper');
    // const mobileHeaderHeight = document.querySelector('.mobile-header').offsetHeight;
    // const iconMenuHeight = document.querySelector('.icon-menu').offsetHeight;

    vacancyCardTeaser.classList.toggle('vacancy-card--teaser-expanded');
    moreLink.classList.toggle('link--vacancy-card-more-expanded');

    if (moreLink.classList.contains('link--vacancy-card-more-expanded')) {
      moreLink.textContent = 'Приховати';
      // wrapper.scrollTo({ top: vacancyCardTeaser.offsetTop + iconMenuHeight, behavior: "smooth" });
    } else {
      moreLink.textContent = 'Детальніше';
      // wrapper.scrollTo({ top: vacancyCardTeaser.offsetTop - mobileHeaderHeight, behavior: "smooth" });
    }

  });

  $('.banner__more-link').click(function (event) {
    $(this).closest('.banner__title').next('.banner__text').toggleClass('hidden-xs');
    $(this).hide();

    event.preventDefault();
  });

  function changePromoBtns(vacancyCard, promoBlock) {
    if (!vacancyCard || !promoBlock) return;

    let rewardRange = promoBlock.dataset.rewardRange;
    let promoBlockLink = promoBlock.querySelector('.promo-block__link').href;
    let bookBtns = vacancyCard.querySelectorAll('.promo-blocks__btn--book');
    let consultBtns = vacancyCard.querySelectorAll('.promo-blocks__btn--consult');
    let shareBtns = vacancyCard.querySelectorAll('.promo-blocks__btn--share-and-get');

    if (!bookBtns.length && !consultBtns.length && !shareBtns.length) return;

    bookBtns.forEach(btn => {
      const bookText = btn.dataset.bookText;
      btn.innerHTML = `${bookText} ${rewardRange}`;
    });

    shareBtns.forEach(btn => {
      btn.dataset.promoBlockLink = promoBlockLink;
      btn.dataset.rewardRange = rewardRange;
    });
  }

  document.addEventListener('change', function (e) {
    let checkboxInput = e.target.closest('.promo-block .checkbox__input');

    if (!checkboxInput) return;

    let promoBlock = checkboxInput.closest('.promo-block');

    if (!promoBlock) return;

    let vacancyCard = promoBlock.closest('.vacancy-card');

    if (!vacancyCard) return;

    changePromoBtns(vacancyCard, promoBlock);
  });

  document.addEventListener("change", function (e) {
    const radio = e.target;
    if (radio.type !== "radio") return;

    const syncGroup = radio.dataset.sync;
    if (!syncGroup) return;

    const value = radio.value;

    // Находим radio из других групп с тем же значением
    const synced = document.querySelectorAll(
      `input[type="radio"][data-sync="${syncGroup}"][value="${value}"]`
    );

    synced.forEach(r => r.checked = true);
  });

  
  // function toggleNotFoundBlock($additionalFilters) {
  //   let $notFound = $additionalFilters.find('.additional-filters__not-found');
  //   const zoomSearchPlayer = document.getElementById('zoom-search-player');
  //   const $visibleFiltersGroups = $additionalFilters.find('.checkboxes-group:not(.hidden):not(:hidden), .radiobtns-group:not(.hidden):not(:hidden), .filter-element--range:not(.hidden):not(:hidden), .filter-element--country:not(.hidden):not(:hidden), .filter-element--date-range:not(.hidden):not(:hidden)');

  //   if (!$visibleFiltersGroups.length) {
  //     $notFound.show();
  //     zoomSearchPlayer?.play();
  //   } else {
  //     $notFound.hide();
  //     zoomSearchPlayer?.stop();
  //   }
  // }

  // // Search in filter
  // $('input[name="search_filter"]').on('input', function (event) {
  //   let searchValue = $(this).val().toLowerCase().trim();
  //   let $additionalFilters = $(this).closest('.additional-filters');
  //   let $additionalFiltersGroups = $additionalFilters.find('.checkboxes-group, .radiobtns-group, .filter-element--range, .filter-element--country, .filter-element--date-range');
  //   let $clearSearchBtn = $(this).siblings('.additional-filters__clear-search-btn');

  //   if (searchValue) {
  //     $clearSearchBtn.removeClass('hidden');
  //   } else {
  //     $clearSearchBtn.addClass('hidden');
  //   }

  //   $additionalFiltersGroups.each((index, group) => {
  //     if ($(group).hasClass('checkboxes-group') || $(group).hasClass('radiobtns-group')) {
  //       let groupTitle = $(group).find('.checkboxes-group__title, .radiobtns-group__title').text().toLowerCase();
  //       let checkboxesLabels = Array.from($(group).find('.checkbox__label, .radiobtn__label'));
  //       checkboxesLabels.forEach(label => label.parentNode.classList.remove('checkbox--highlighted', 'checkbox--highlighted-animation'));

  //       let filteredCheckboxesLabels = checkboxesLabels.filter(label => label.textContent.toLowerCase().includes(searchValue));
  //       if (searchValue) {
  //         filteredCheckboxesLabels.forEach(label => label.parentNode.classList.add('checkbox--highlighted', 'checkbox--highlighted-animation'));
  //       }

  //       if (groupTitle.includes(searchValue) || filteredCheckboxesLabels.length) {
  //         $(group).removeClass('hidden');
  //       } else {
  //         $(group).addClass('hidden');
  //       }
  //     } else {
  //       let groupTitle = $(group).find('.filter-element__title').text().toLowerCase();

  //       if (groupTitle.includes(searchValue)) {
  //         $(group).removeClass('hidden');
  //       } else {
  //         $(group).addClass('hidden');
  //       }
  //     }

  //   });

  //   toggleNotFoundBlock($additionalFilters);
  // });

  // $('.additional-filters__clear-search-btn').click(function (event) {
  //   $(this).addClass('hidden');

  //   $(this).siblings('.form-text--filter-search').val('').trigger('input').focus();
  // });
  

  // const additionalFiltersBody = document.querySelector('.additional-filters__body');
  // const additionalFiltersHeader = document.querySelector('.additional-filters__header');
  // const searchInput = document.querySelector('input[name="search_filter"]');

  // let isTypingInSearch = false;

  // if (searchInput) {
  //   searchInput.addEventListener('input', function () {
  //     isTypingInSearch = true;
  //     clearTimeout(searchInput.typingTimeout);

  //     searchInput.typingTimeout = setTimeout(() => {
  //       isTypingInSearch = false;
  //     }, 500);
  //   });
  // }

  // if (additionalFiltersHeader && additionalFiltersBody) {
  //   additionalFiltersBody.addEventListener('scroll', function (e) {
  //     if (searchInput && document.activeElement === searchInput && isTypingInSearch) {
  //       return;
  //     }

  //     additionalFiltersHeader.classList.toggle('additional-filters__header--sticky', this.scrollTop > 0);
  //   });
  // }

  

  // document.addEventListener('click', function (e) {
  //   const searchFilterInput = e.target.closest('input[name="search_filter"]');

  //   if (!searchFilterInput) return;

  //   const additionalFiltersHeader = searchFilterInput.closest('.additional-filters__header');

  //   if (!additionalFiltersHeader) return;

  //   additionalFiltersHeader.classList.add('additional-filters__header--search-extended');
  // });

  // document.addEventListener('click', function (e) {
  //   const cancelSearchLink = e.target.closest('.additional-filters__cancel-search-link');

  //   if (!cancelSearchLink) return;

  //   const additionalFiltersHeader = cancelSearchLink.closest('.additional-filters__header');

  //   if (!additionalFiltersHeader) return;

  //   additionalFiltersHeader.classList.remove('additional-filters__header--search-extended');

  //   const searchInput = additionalFiltersHeader.querySelector('input[name="search_filter"]');
  //   const clearSearchBtn = additionalFiltersHeader.querySelector('.additional-filters__clear-search-btn');

  //   if (searchInput) {
  //     searchInput.value = '';
  //     searchInput.dispatchEvent(new Event("input", { bubbles: true }));
  //   }

  //   clearSearchBtn?.classList.add('hidden');

  //   e.preventDefault();
  // });





  const updateMobileHeaderState = (popup) => {
    if (!popup) return;

    const mobileHeader = popup.querySelector('.popup-mobile-header');
    if (!mobileHeader) return;

    const titleEl = mobileHeader.querySelector('.popup-mobile-header__title');
    const companyInfoEl = mobileHeader.querySelector('.company-info--popup-mobile-header');
    const ratingDropdownCriteriaHeader = mobileHeader.querySelector('.rating-popup__dropdown-criteria-header');

    if (!titleEl || !companyInfoEl) return;

    const scrolled = popup.scrollTop;

    if (scrolled >= 100) {
      // показываем компанию, прячем заголовок
      titleEl.classList.add('hidden');
      companyInfoEl.classList.remove('hidden');
    } else {
      // показываем заголовок, прячем компанию
      titleEl.classList.remove('hidden');
      companyInfoEl.classList.add('hidden');

      if (ratingDropdownCriteriaHeader) {
        ratingDropdownCriteriaHeader.classList.remove('dropdown-block--visible');
      }
    }
  };

  // Делегирование: один обработчик на документ, ловим скроллы всех .rating-popup
  document.addEventListener('scroll', function (e) {
      const target = e.target;

      // Нас интересуют только элементы с классом rating-popup
      if (!target.classList || !target.classList.contains('rating-popup')) return;

      updateMobileHeaderState(target);
    },
    true // захват, чтобы событие точно словилось
  );

  // Инициализация состояния при загрузке
  document.querySelectorAll('.rating-popup').forEach(updateMobileHeaderState);

  $(document).on('click', '.agency-gallery__more-item-link', function (event) {
    event.preventDefault();

    let $agencyGalleryTab = $(this).closest('.agency-gallery__tabs-content');
    $agencyGalleryTab.addClass('agency-gallery--full');
    $agencyGalleryTab.find('.agency-gallery__hide-link-wrapper').show();
    $(this).hide();
  });

  $(document).on('click', '.agency-gallery__hide-link', function (event) {
    event.preventDefault();

    let $agencyGalleryTab = $(this).closest('.agency-gallery__tabs-content');
    $agencyGalleryTab.removeClass('agency-gallery--full');
    $agencyGalleryTab.find('.agency-gallery__more-item-link').show();
    $(this).parent().hide();
  });

  document.addEventListener('click', function (e) {
    const agencyGalleryToggleLink = e.target.closest('.agency-gallery__toggle-link');

    if (!agencyGalleryToggleLink) return;

    const agencyGallery = agencyGalleryToggleLink.closest('.agency-gallery');

    if (!agencyGallery) return;

    agencyGalleryToggleLink.classList.toggle('arrow-link--opened');

    if (!agencyGallery.classList.contains('agency-gallery--full')) {
      agencyGallery.classList.add('agency-gallery--full');
      agencyGalleryToggleLink.textContent = window.translations.show_less;

    } else {
      agencyGallery.classList.remove('agency-gallery--full');
      agencyGalleryToggleLink.textContent = window.translations.show_more + ' (' + agencyGalleryToggleLink.dataset.moreCount + ')';
    }

    e.preventDefault();
  });

  function getLineCount(element) {
    const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
    const elementHeight = element.clientHeight;

    return Math.round(elementHeight / lineHeight);
  }

  document.addEventListener('ratingPopupLoaded', function (event) {
    const ratingPopup = document.querySelector(event.detail.popupId);

    ratingPopup.querySelectorAll('.review__positive > p, .review__negative > p').forEach(p => {
      if (getLineCount(p) <= 7) return;

      p.parentNode.classList.add('truncated-text');
    });
  });

  document.addEventListener('click', function (e) {
    const reviewToggleLink = e.target.closest('.review__toggle-link');

    if (!reviewToggleLink) return;

    const reviewText = reviewToggleLink.parentNode.parentNode;

    if (!reviewText) return;

    reviewToggleLink.classList.toggle('arrow-link--opened');

    if (!reviewText.classList.contains('full-text')) {
      reviewText.classList.add('full-text');
      reviewToggleLink.textContent = window.translations.show_less;

    } else {
      reviewText.classList.remove('full-text');
      reviewToggleLink.textContent = window.translations.read_more;
    }

    e.preventDefault();
  });

});