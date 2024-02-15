import PerfectScrollbar from 'perfect-scrollbar';

let selectedCitiesIds = [];
let currentSelectedCitiesIds = [];

let selectedGendersIds = [];
let currentSelectedGendersIds = [];

let citySearchInputValue = '';
let searchCitiesTimeoutID = null;


function toggleClearFilterButtons () {
  let $clearBtns = $('[data-clear-filter]');
  let selectedItemsLength = $('.filter .selected-items__item').length;
  let $filtersBtn = $('.btn-white--filter');
  let $filtersBtnCount = $filtersBtn.find('.btn-white__count');
  let isMobile = $(window).width() < 576;

  if (isMobile) {
    let $checkedLabels = $('.checkboxes-group--cities .checkbox__input:checked + .checkbox__label');
    selectedItemsLength += $checkedLabels.length;
  }

  if (selectedItemsLength) {
    $clearBtns.show();
    $filtersBtn.removeClass('btn-white--filter-dark-icon');
    $filtersBtnCount.removeClass('hidden').text(selectedItemsLength);
  } else {
    $clearBtns.hide();
    $filtersBtn.addClass('btn-white--filter-dark-icon');
    $filtersBtnCount.addClass('hidden').text('');
  }
}

function applyChangesToSelectedCities ($select) {
  selectedCitiesIds = [...currentSelectedCitiesIds];

  let $dropdownBlock = $select.closest('.dropdown-block');
  let name = $select.attr('name');

  $select = $('.filter__cities-select--desktop');

  changeSelectToggleTitle($select);
  updateDropdownMultiSelectClass($dropdownBlock);

  $select.multiSelect('deselect_all');
  $select.find('option').each(function(index, el) {
    let $selectedItem = findFilterTagByValue(name, $(el).attr('value'));
    $selectedItem.remove();
  });

  setTimeout(() => {
    $select = $('.filter__cities-select--desktop');

    selectedCitiesIds.forEach(id => {
      $select.multiSelect('select', id);

      let labelText = $select.find(`option[value="${id}"]`).text();
      if (labelText) {
        createOrUpdateTag('multiselect', name, id, labelText);
      }
    });

    let $selectedItemsLength = $('.filter .selected-items__item').length;
    setVisibilitySelectedMoreItem($selectedItemsLength);

    toggleClearFilterButtons();
  });
}

function applyChangesToSelectedSex ($select) {
  selectedGendersIds = [...currentSelectedGendersIds];

  let $dropdownBlock = $select.closest('.dropdown-block');
  let name = $select.attr('name');

  changeSelectToggleTitle($select);
  // updateDropdownMultiSelectClass($dropdownBlock);

  $select.multiSelect('deselect_all');
  $select.find('option').each(function(index, el) {
    let $selectedItem = findFilterTagByValue(name, $(el).attr('value'));
    $selectedItem.remove();
  });

  selectedGendersIds.forEach(id => {
    $select.multiSelect('select', id);

    let $option = $select.find(`option[value="${id}"]`);
    let labelText = $option.text();

    if (labelText) {
      let value = $option.attr('data-seo-slug');
      // createOrUpdateTag('multiselect', name, id, labelText);
      createOrUpdateTag('checkbox', name, value, labelText);
    }
  });

  let $selectedItemsLength = $('.filter .selected-items__item').length;
  setVisibilitySelectedMoreItem($selectedItemsLength);

  toggleClearFilterButtons();

  // $select[0].dispatchEvent(new Event('change'));
}

function clearCitiesSelect () {
  let $dropdownBlock = $('.dropdown-block--cities-select');
  let $clearBtn = $dropdownBlock.find('.ms-selection__clear-btn');

  $dropdownBlock.find('.cities-select').multiSelect('deselect_all');
  $dropdownBlock.find('.cities-select').multiSelect('refresh');

  $dropdownBlock.find('.ms-container').addClass('ms-container--empty');

  currentSelectedCitiesIds = [];
  $clearBtn.hide();

  let $citiesSelect = $('.filter__cities-select-toggle');
  applyChangesToSelectedCities($citiesSelect);

  selectedCitiesIds = [...currentSelectedCitiesIds];
}

function clearCitiesCheckboxes () {
  currentSelectedCitiesIds = [];

  let $citiesCheckboxInput = $('.checkboxes-group--cities .checkbox__input');
  $citiesCheckboxInput.prop('checked', false);
  $(this).hide();
}

function clearSexSelect () {
  $('.sex-select').multiSelect('deselect_all');
  changeSelectToggleTitle($('.sex-select'));

  selectedGendersIds = [];
  currentSelectedGendersIds = [];
}

function clearExperinceSelect () {
  $('.filter__experience-select').val('');
}

function removeItemFromArray (array, value) {
  let index = array.indexOf(value);

  if (index > -1) {
    array.splice(index, 1);
  }

  return array;
}

function changeSelectToggleTitle ($select) {
  // $gendersSelectToggles.each(function(index, el) {
  $select.each(function(index, el) {
    let $dropdown = $(el).closest('.dropdown-block');
    let dropdownId = $dropdown.attr('id');
    let $selectToggle = $(`.select-toggle[href="#${dropdownId}"]`);
    let selectToggleText = $selectToggle.data('default-placeholder');
    let $selectedValues = $(el).find('option:selected').map((index, el) => $(el).text());

    if ($selectedValues.length) {
      selectToggleText = $selectedValues.length === 1 ? `<span class="select-toggle__label">${$selectedValues[0]}</span>` : `<span class="select-toggle__label">${$selectedValues[0]}</span>` + `<span class="count count--info-bg count--multiselect select-toggle__count">+${$selectedValues.length - 1}</span>`;
      $selectToggle.addClass('select-toggle--selected');
    } else {
      $selectToggle.removeClass('select-toggle--selected');
    }

    // $('.sex-select').multiSelect('deselect_all');
    // selectedGendersIds.forEach(id => {
    //   $('.sex-select').multiSelect('select', id);
    // });

    $selectToggle.html(selectToggleText);
  });
  // });
}

function clearTextField ($input) {
  $input.removeClass('form-text--filter-search-filled').val('');
  $input.parent().find('[data-clear-search-input]').hide();
}

function updateMSItemsDescription ($items) {
  $items.forEach(el => {
    let $title = $(el).find('span');
    let description = $(el).data('description');

    $title.wrapAll('<div class="ms-elem-selectable__text-wrapper"></div>');

    if (description !== undefined) {
      $title.after(`<div class="ms-elem-selectable__description">${description}</div>`);
    }
  });
}

function findFilterTagByValue (name, value) {
  let $container = $('.selected-items__list');
  let $selectedItem = $container.find(`.selected-items__item[data-name="${name}"][data-value="${value}"]`);

  return $selectedItem;
}

function createOrUpdateTag (type, name, value, labelText) {
  let $container = $('.selected-items__list');
  let $selectedItem = findFilterTagByValue(name, value);

  if ($selectedItem.length) return;

  let htmlStr = '';

  if ('multiselect' === type) {
    let seoSlug = $(`select[name="${name}"] option[value="${value}"]`).attr('data-seo-slug');
    htmlStr = `
            <li class="selected-items__item" data-type="${type}" data-name="${name}" data-value="${value}" data-seo-slug="${seoSlug}">
              <div class="selected-item">
                <div class="selected-item__value">${labelText}</div>
                <a href="#" class="selected-item__remove-link"></a>
              </div>
            </li>`;
  } else if (['range', 'textfield', 'select'].includes(type)) {
    htmlStr = `
            <li class="selected-items__item" data-type="${type}" data-name="${name}" data-value="${value}">
              <div class="selected-item">
                <div class="selected-item__value">${labelText}</div>
                <a href="#" class="selected-item__remove-link"></a>
              </div>
            </li>`;
    $selectedItem = $(`.selected-items__item[data-name="${name}"]`);

    if ($selectedItem.length) {
      $selectedItem.attr('data-type', type);
      $selectedItem.attr('data-name', name);
      $selectedItem.attr('data-value', value);
      $selectedItem.find('.selected-item__value').text(labelText);

      return;
    }
  }

  if (name === 'cities') {
    $container.find('.selected-items__item[data-name="countries"]').after(htmlStr);
  } else {
    $container.find('.selected-items__more-item').before(htmlStr);
  }
}

function updateDropdownMultiSelectClass ($dropdown) {
  let $selectedItems = $dropdown.find('.ms-selection .ms-selected span');

  if (!$selectedItems.length) {
    let $multiSelectContainer = $dropdown.find('.ms-container--empty');
    $multiSelectContainer.removeClass('ms-container--empty').addClass('ms-container--default');
  }
}

function checkFillingMSSearchInput ($input) {
  let $clearBtn = $input.siblings('[data-ms-clear-search-input]');

  if ($input.val()) {
    $clearBtn.show();
    $input.addClass('ms-selectable__search-input--not-empty');
  } else {
    $clearBtn.hide();
    $input.removeClass('ms-selectable__search-input--not-empty');
  }
}

function setVisibilitySelectedMoreItem (selectedItemsLength) {
  let isMobile = $(window).width() < 576;
  let visibleCount = isMobile ? 7 : 11;

  $('.selected-items').each(function(index, selectedItemsWrapper) {
    let $moreItem = $(selectedItemsWrapper).find('.selected-items__more-item');
    let moreItemsCount = selectedItemsLength - visibleCount;

    if (selectedItemsLength > visibleCount) {
      $moreItem.removeClass('hidden');
    } else {
      $moreItem.addClass('hidden');
    }

    $moreItem.find('.more-btn__count').text(`+${moreItemsCount}`);
  });
}

function addCityCheckbox (item, selectedCitiesArr) {
  let $citiesCheckboxesList = $('.checkboxes-group--cities .checkboxes-group__list');
  $citiesCheckboxesList.append(`<li class="checkboxes-group__item">
                                      <div class="checkbox">
                                        <input class="checkbox__input" name="cities" value="${item.id}" type="checkbox" id="city_${item.id}" data-seo-slug="${item.seo_slug}"${selectedCitiesArr.includes(item.id.toString()) ? ' checked' : ''}>
                                        <label class="checkbox__label checkbox__label--align-start" for="city_${item.id}">
                                          <div class="checkbox__label-wrapper">
                                            <div class="checkbox__title">${item.origin}</div>
                                            <div class="checkbox__description">${item.province}</div>
                                          </div>
                                        </label>
                                      </div>
                                    </li>`);
}

function setCheckedCityCheckboxesTitle () {
  let $citiesBtn = $('.additional-filters__cities-btn');
  let $citiesBtnText = $citiesBtn.find('.btn-white__text');
  let $citiesBtnCount = $citiesBtn.find('.count');
  let $checkedLabels = $('.checkboxes-group--cities .checkbox__input:checked + .checkbox__label');

  if (!$checkedLabels.length) {
    $citiesBtnText.text($citiesBtn.data('placeholder'));
    $citiesBtnCount.hide();
  } else if ($checkedLabels.length == 1) {
    $citiesBtnText.text($($checkedLabels[0]).find('.checkbox__title').text());
    $citiesBtnCount.hide();
  } else {
    $citiesBtnText.text($($checkedLabels[0]).find('.checkbox__title').text());
    $citiesBtnCount.text(`+${$checkedLabels.length - 1}`);
    $citiesBtnCount.show();
  }

  toggleClearFilterButtons();
}

function toggleClearCitiesButtons () {
  let $checkedInputs = $('.checkboxes-group--cities .checkbox__input:checked');
  let $clearBtn = $('.cities-filter__clear-btn');

  if (!$checkedInputs.length) {
    $clearBtn.hide();
  } else {
    $clearBtn.show();
  }
}

function syncInputFields ($input) {
  let syncFieldIDs = $input.data('sync-field-ids');

  if (!syncFieldIDs) return;

  syncFieldIDs.split(',').forEach(id => {
    let $syncField = $(`#${id.trim()}`);

    if (!$syncField.length) return;

    let nodeName = $syncField.prop('tagName').toLowerCase();

    switch (nodeName) {
      case 'input':
        let type = $syncField.attr('type');

        if (['text', 'number'].includes(type)) {
          let value = $input.val();
          $syncField.val(value);
          $syncField[0].dispatchEvent(new Event('change'));
        }

        break;
      case 'select':
        let filterItemId = $input.data('filter-item-id').toString();

        setTimeout(() => {
          if ($input.is(":checked")) {
            $syncField.multiSelect('select', filterItemId);

            if (!currentSelectedGendersIds.includes(filterItemId)) {
              currentSelectedGendersIds.push(filterItemId);
            }
          } else {
            $syncField.multiSelect('deselect', filterItemId);
            currentSelectedGendersIds = removeItemFromArray(currentSelectedGendersIds, filterItemId);
          }

          selectedGendersIds = [...currentSelectedGendersIds];
          changeSelectToggleTitle($syncField);
        });

        break;
    }
    
  });
}

function clearTagRelatedFields ($selectedItem) {
  let isMainFilter = !!$selectedItem.closest('.selected-items--main-filter').length;
  let name = $selectedItem.data('name');
  let value = $selectedItem.data('value');
  let type = $selectedItem.data('type');

  if (![name, value].includes(undefined)) {
    switch (type) {
      case 'checkbox':
        let $selectedCheckbox = $(`.checkbox__input[name="${name}"][value="${value}"]`);
        syncInputFields($selectedCheckbox);

        break;
      case 'radio':
        let $nonCheckedRadio = $(`.radiobtn__input[name="${name}"][value=""]`);
        syncInputFields($nonCheckedRadio);

        break;
      case 'textfield':
        let $input = $(`input[name="${name}"]`).val('');
        clearTextField($input);

        break;

      case 'multiselect':
        let $multiSelect = $(`select[name="${name}"]`);
        let $dropdownBlock = $multiSelect.closest('.dropdown-block');

        $multiSelect.multiSelect('deselect', value.toString());
        changeSelectToggleTitle($multiSelect);
        updateDropdownMultiSelectClass($dropdownBlock);

        currentSelectedCitiesIds = removeItemFromArray(currentSelectedCitiesIds, value);
        selectedCitiesIds = [...currentSelectedCitiesIds];

        // if (!selectedCitiesIds.length) {
        //   $('.filter__distance-select').next().find('.select2-selection').removeClass('filter-select--selected');
        // }

        // $multiSelect.multiSelect('refresh');

        break;
    }
  }

  setTimeout(() => {
    toggleClearFilterButtons();

    if (isMainFilter) {
      document.forms.vacancies_filter.dispatchEvent(new CustomEvent("updateVacanciesFilter"));
    }
  });
}

function undoChangesToAdditionalFilters () {
  let $checkboxesAndRadio = $('.additional-filters').find('.checkbox__input, .radiobtn__input');
  $checkboxesAndRadio.each(function(index, el) {
    let type = $(el).attr('type');
    let name = $(el).attr('name');
    let value = $(el).attr('value');
    let labelText = $(el).parent().find('label').text();
    let $selectedItem = findFilterTagByValue(name, value);

    if (el.dataset.defaultChecked !== undefined) {
      el.checked = true;
      createOrUpdateTag(type, name, value, labelText);
    } else {
      el.checked = false;
      clearTagRelatedFields($selectedItem);
    }
  });

  let defaultSelectedGenderIds = Array.from($('#sex-select option[data-default-selected]')).map(option => option.value);

  $('.sex-select').multiSelect('deselect_all');
  $('.sex-select').multiSelect('select', defaultSelectedGenderIds);
  $('.sex-select').val(defaultSelectedGenderIds);
  
  changeSelectToggleTitle($('.sex-select'));

  toggleClearFilterButtons();
}


$(() => {
  let psArr = [];

  $(".cities-select").each((index, el) => {
    $(el).multiSelect({
      selectableHeader: '<div class="ms-selectable__header"><div class="ms-selectable__search-input-box"><input type="search" name="ms_search" class="ms-selectable__search-input" placeholder="Введіть назву міста…" title="Введіть назву міста…" / data-ms-search-input><button type="button" class="ms-selectable__clear-search-btn" style="display: none;" data-ms-clear-search-input><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18"><path stroke="#A1A7B3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M1 17 17 1M1 1l16 16"></path></svg></button></div></div>',
      selectionHeader: '<div class="ms-selection__header"><div class="ms-selection__label">Обрані міста</div><a href="#" class="btn-beige btn-beige--filter ms-selection__clear-btn" style="display: none;">Очистити</a></div>',
      keepOrder: true,
      cssClass: 'ms-container--default',

      afterInit: function (container) {
        let that = this;
        let $searchInput = container.find('[data-ms-search-input]');
        let $clearSearchBtn = container.find('[data-ms-clear-search-input]');
        // let $clearBtn = that.$container.find('.ms-selection__clear-btn');
        let $selectableItems = that.$selectableUl.children().toArray();
        let $selectionItems = that.$selectionUl.children().toArray();

        $searchInput.val(citySearchInputValue);

        checkFillingMSSearchInput($searchInput);

        if (currentSelectedCitiesIds.length) {
          that.$container.removeClass('ms-container--default');

          that.$container.find('.ms-selection__clear-btn').show();
        }

        // let psArr = [];

        that.$selectionContainer.append('<div class="ms-selection__no-results">У вас ще немає обраних міст...</div>');
        that.$container.append('<div class="ms-container__footer"><button type="button" class="btn-grey btn-grey--multi-select ms-container__apply-btn">Застосувати</button></div>');

        $([that.$selectableUl[0], that.$selectionUl[0]]).each(function(index, item) {
          psArr.push(new PerfectScrollbar(item, {
            wheelSpeed: 2,
            wheelPropagation: false,
            minScrollbarLength: 20,
            suppressScrollX: true
          }));
        });

        updateMSItemsDescription($selectionItems);
        updateMSItemsDescription($selectableItems);

        $searchInput.on('input', function(event) {
          clearTimeout(searchCitiesTimeoutID);

          // $('select[name="cities"]').multiSelect('refresh');
          // $(this).focus();

          let searchValue = $(this).val().trim();
          citySearchInputValue = searchValue;

          let countryID = $('select[name="countries"]').find(':selected').data('entity-id');
          let url = `api/v1/cities?country_id=${countryID}`;

          if (searchValue) {
            url = `api/v1/cities?country_id=${countryID}&term=${searchValue}`;
          }

          searchCitiesTimeoutID = setTimeout(() => {
            $.ajax({
              url: url,

              success: function(data) {

                let $citiesSelect = that.$element;
                let $options = $citiesSelect.find('option');
                let cities = data.results;
                let missingCitiesIds = Array.from($citiesSelect.find('option')).map(item => item.value);

                // clearCitiesSelect();

                $options.each(function(index, option) {
                  if (!$(option).is(':selected')) {
                    $(option).remove();
                  }
                });

                // $citiesSelect.multiSelect('refresh');

                // Filling selects from data
                cities.forEach((item, index) => {
                  if (!missingCitiesIds.includes(item.id)) {
                    $citiesSelect.multiSelect('addOption', { value: item.id || '', text: item.origin || '', index: index });

                    let $option = $citiesSelect.find(`option[value="${item.id}"]`);

                    if (item.province) {
                      $option.attr('data-description', item.province);
                    }

                    if (item.seo_slug) {
                      $option.attr('data-seo-slug', item.seo_slug);
                    }
                  }
                });

                $citiesSelect.multiSelect('refresh');

                setTimeout(() => {
                  let $searchInput = $('.dropdown-block--cities-select.dropdown-block--visible .ms-selectable__search-input');
                  $searchInput.focus();
                }, 0);
              },

              error: function(data) {
                console.log(data);
              }
            });

            psArr[0].update();

          }, 500);

          checkFillingMSSearchInput($searchInput);
        });

        $clearSearchBtn.click(function(event) {
          $(this).hide();

          $searchInput.val('').trigger('input').focus();
        });

        that.$container.find('.ms-selection__clear-btn').click(function(event) {
          let $dropdownBlock = $(this).closest('.dropdown-block');
          $dropdownBlock.find('.cities-select').multiSelect('deselect_all');
          $dropdownBlock.find('.ms-container').addClass('ms-container--empty');

          currentSelectedCitiesIds = [];
          $(this).hide();

          event.preventDefault();
        });

        that.$container.find('.ms-container__apply-btn').click(function(event) {
          let $dropdownBlock = $(this).closest('.dropdown-block');
          $dropdownBlock.removeClass('dropdown-block--visible');

          applyChangesToSelectedCities(that.$element);

          setTimeout(() => {
            // createFilterUrl();
            document.forms.vacancies_filter.dispatchEvent(new CustomEvent("updateVacanciesFilter"));
          });
        });
      },

      afterSelect: function(values) {
        let $clearBtn = this.$container.find('.ms-selection__clear-btn');

        if (!currentSelectedCitiesIds.includes(values[0])) {
          currentSelectedCitiesIds.push(values[0]);
        }

        if (currentSelectedCitiesIds.length) {
          $clearBtn.show();
          this.$container.removeClass('ms-container--default ms-container--empty');
        } else {
          $clearBtn.hide();
          this.$container.addClass('ms-container--empty');
        }

        psArr.forEach(ps => {
          ps.update();
        });
      },

      afterDeselect: function(values) {
        let $clearBtn = this.$container.find('.ms-selection__clear-btn');
        let name = this.$element.attr('name');

        currentSelectedCitiesIds = removeItemFromArray(currentSelectedCitiesIds, values[0]);

        if (currentSelectedCitiesIds.length) {
          $clearBtn.show();
          this.$container.removeClass('ms-container--default ms-container--empty');
        } else {
          $clearBtn.hide();
          this.$container.addClass('ms-container--empty');
        }

        psArr.forEach(ps => {
          ps.update();
        });
      }
    });
  });

  $(".sex-select").each((index, el) => {
    $(el).multiSelect({
      keepOrder: true,
      cssClass: 'ms-container--default ms-container--short',

      afterInit: function (container) {
        let that = this;
        let $selectableItems = that.$selectableUl.children().toArray();
        let $selectionItems = that.$selectionUl.children().toArray();

        that.$container.append('<div class="ms-container__footer"><button type="button" class="btn-grey btn-grey--multi-select ms-container__apply-btn">Застосувати</button></div>');

        updateMSItemsDescription($selectionItems);

        that.$container.find('.ms-container__apply-btn').click(function(event) {
          let $dropdownBlock = $(this).closest('.dropdown-block');
          $dropdownBlock.removeClass('dropdown-block--visible');

          applyChangesToSelectedSex(that.$element);

          setTimeout(() => {
            // createFilterUrl();
            document.forms.vacancies_filter.dispatchEvent(new CustomEvent("updateVacanciesFilter"));
          });

          // createOrUpdateTag()
        });

        $($selectableItems).each(function(index, el) {
          $(el).click(function(event) {
            if (($(el).hasClass('ms-selected'))) {
              setTimeout(() => {
                let lastIndexID = $(el).attr('id').indexOf("-");
                let selectedItemID = $(el).attr('id').substring(0, lastIndexID);
                let $selectionWrapper = $(el).closest('.ms-container').find('.ms-selection');

                $selectionWrapper.find(`li[id^="${selectedItemID}"]`).click();
              });
            }
          });
        });
      },

      afterSelect: function(values) {
        if (!currentSelectedGendersIds.includes(values[0])) {
          currentSelectedGendersIds.push(values[0]);
        }
      },

      afterDeselect: function(values) {
        currentSelectedGendersIds = removeItemFromArray(currentSelectedGendersIds, values[0]);
      }
    });
  });

  $('[data-clear-filter]').click(() => {
    clearCitiesSelect();
    clearCitiesCheckboxes();
    clearSexSelect();
    clearExperinceSelect();
  });

  $(document).on('click', function(e) {
    if ($('.dropdown-block--cities-select').hasClass('dropdown-block--visible')) {
      if (!$(e.target).closest('.dropdown-block').length && !$(e.target).closest('a.item').length) {
        $('.cities-select').multiSelect('deselect_all');
        selectedCitiesIds.forEach(id => {
          $('.cities-select').multiSelect('select', id);
        });

        currentSelectedCitiesIds = [...selectedCitiesIds];

        if (!selectedCitiesIds.length) {
          $('#ms-cities-select, #ms-additional-filter-cities-select').addClass('ms-container--default');
        }
      }
    }

    if ($('.dropdown-block--sex-select').hasClass('dropdown-block--visible')) {
      if (!$(e.target).closest('.dropdown-block').length && !$(e.target).closest('a.item').length) {
        $('.sex-select').multiSelect('deselect_all');
        selectedGendersIds.forEach(id => {
          $('.sex-select').multiSelect('select', id);
        });

        currentSelectedGendersIds = [...selectedGendersIds];

        if (!selectedGendersIds.length) {
          $('#ms-sex-select, #ms-additional-filter-sex-select').addClass('ms-container--default');
        }
      }
    }
  });

  let oldScrollY = 0;
  let $wrapper = $('.wrapper');
  let $btnFilter = $('.btn-filter');

  $wrapper.scroll(function(event) {
    let scrolled = $wrapper.scrollTop();
    let dY = scrolled - oldScrollY;

    if (scrolled > 170) {
      $btnFilter.removeClass('btn-filter--invisible');
    } else {
      $btnFilter.addClass('btn-filter--invisible');
    }
    
    oldScrollY = scrolled;
  });

  $('.btn-filter--scroll-top').on('click', function(event) {
    $wrapper.animate( {
      scrollTop: 0
    }, 0 );
  });

  // Mobile cities filter
  $('.cities-filter__search-input').on('input', function(event) {
    let $citiesFilter = $(this).closest('.cities-filter');
    let $clearSearchBtn = $citiesFilter.find('.cities-filter__clear-search-btn');
    let $checkboxesGroupItems = $citiesFilter.find('.checkboxes-group__item')
    let value = $(this).val().toLowerCase().trim();

    let searchValue = $(this).val().trim();
    citySearchInputValue = searchValue;

    let countryID = $('select[name="countries"]').find(':selected').data('entity-id');
    let url = `api/v1/cities?country_id=${countryID}`;

    if (searchValue) {
      url = `api/v1/cities?country_id=${countryID}&term=${searchValue}`;
      $clearSearchBtn.show();
    } else {
      $clearSearchBtn.hide();
    }

    searchCitiesTimeoutID = setTimeout(() => {
      $.ajax({
        url: url,

        success: function(data) {
          let $allCitiesCheckboxes = $('.checkboxes-group--cities .checkbox__input');
          let cities = data.results;
          let allSelectedCitiesIds = [];

          // Clear checkboxes (mobile filter)
          $allCitiesCheckboxes.each(function(index, checkbox) {
            if (!$(checkbox).is(':checked')) {
              $(checkbox).closest('.checkboxes-group__item').remove();
            } else {
              allSelectedCitiesIds.push($(checkbox).val());
            }
          });

          // Filling checkboxes from data
          cities.forEach((item, index) => {
            if (!allSelectedCitiesIds.includes(item.id.toString())) {
              addCityCheckbox(item, allSelectedCitiesIds);
            }
          });
        },

        error: function(data) {
          console.log(data);
        }
      });

      psArr[0].update();

    }, 500);
  });

  $('.cities-filter__clear-search-btn').click(function(event) {
    $(this).hide();

    $('.cities-filter__search-input').val('').trigger('input').focus();
  });

  $(document).on('change', '.checkboxes-group--cities .checkbox__input', function(event) {
    // let name = $(this).attr('name');
    let value = $(this).val();
    // let labelText = $(this).parent().find('.checkbox__title').text();
    // let $selectedItems = $('.selected-items--cities');
    // let $selectedItem = $selectedItems.find(`.selected-items__item[data-name="${name}"][data-value="${value}"]`);
    // let $clearBtn = $selectedItems.find('.selected-items__clear-btn');

    if ($(this).is(':checkbox')) {
      if ($(this).is(':checked')) {
        // $selectedItems.find('.selected-items__list').append(`
        //   <li class="selected-items__item" data-name="${name}" data-value="${value}">
        //     <div class="selected-item selected-item--city">
        //       <div class="selected-item__value">${labelText}</div>
        //       <a href="#" class="selected-item__remove-link"></a>
        //     </div>
        //   </li>`);

        if (!currentSelectedCitiesIds.includes(value)) {
          currentSelectedCitiesIds.push(value);
        }
      } else {
        // $selectedItem.remove();

        currentSelectedCitiesIds = removeItemFromArray(currentSelectedCitiesIds, value);
      }
    }

    toggleClearCitiesButtons();

    // let selectedItemsLength = $('.selected-items--cities .selected-items__item').length;

    // if (selectedItemsLength) {
    //   $selectedItems.show();
    //   $clearBtn.show();
    // } else {
    //   $selectedItems.hide();
    //   $clearBtn.hide();
    // }
  });

  // $('.checkboxes-group--cities .checkbox__input').change(function(event) {
  //   // let name = $(this).attr('name');
  //   let value = $(this).val();
  //   // let labelText = $(this).parent().find('.checkbox__title').text();
  //   // let $selectedItems = $('.selected-items--cities');
  //   // let $selectedItem = $selectedItems.find(`.selected-items__item[data-name="${name}"][data-value="${value}"]`);
  //   // let $clearBtn = $selectedItems.find('.selected-items__clear-btn');

  //   if ($(this).is(':checkbox')) {
  //     if ($(this).is(':checked')) {
  //       // $selectedItems.find('.selected-items__list').append(`
  //       //   <li class="selected-items__item" data-name="${name}" data-value="${value}">
  //       //     <div class="selected-item selected-item--city">
  //       //       <div class="selected-item__value">${labelText}</div>
  //       //       <a href="#" class="selected-item__remove-link"></a>
  //       //     </div>
  //       //   </li>`);

  //       if (!currentSelectedCitiesIds.includes(value)) {
  //         currentSelectedCitiesIds.push(value);
  //       }
  //     } else {
  //       // $selectedItem.remove();

  //       currentSelectedCitiesIds = removeItemFromArray(currentSelectedCitiesIds, value);
  //     }
  //   }

  //   toggleClearCitiesButtons();

  //   // let selectedItemsLength = $('.selected-items--cities .selected-items__item').length;

  //   // if (selectedItemsLength) {
  //   //   $selectedItems.show();
  //   //   $clearBtn.show();
  //   // } else {
  //   //   $selectedItems.hide();
  //   //   $clearBtn.hide();
  //   // }
  // });

  $(document).on('click', '.selected-item--city .selected-item__remove-link', function(event) {
    let $selectedItemParent = $(this).closest('.selected-items__item');
    let $selectedItems = $selectedItemParent.closest('.selected-items');

    let name = $selectedItemParent.data('name');
    let value = $selectedItemParent.data('value');

    let $selectedCheckbox = $(`.checkboxes-group--cities .checkbox__input[name="${name}"][value="${value}"]`);
    $selectedCheckbox.prop("checked", false);

    $selectedItemParent.remove();
    currentSelectedCitiesIds = removeItemFromArray(currentSelectedCitiesIds, value);

    let selectedItemsLength = $selectedItems.find('.selected-items__item').length;

    if (selectedItemsLength) {
      $selectedItems.show();
    } else {
      $selectedItems.hide();
    }

    event.preventDefault();
  });

  $('.selected-items--cities .selected-items__clear-btn').click(function(event) {
    let $citiesFilter = $(this).closest('.cities-filter');

    $(this).closest('.selected-items').find('.selected-item__remove-link').click();
  });

  // Closing cities popup without saving
  $('.cities-filter__btn-back').click(function(event) {
    currentSelectedCitiesIds = [...selectedCitiesIds];

    // $('.selected-items--cities .selected-items__clear-btn').click();
    let $citiesCheckboxes = $('.checkboxes-group--cities .checkbox__input');
    let $searchInput = $('.cities-filter__search-input');
    let $citiesClearBtn = $('.cities-filter__clear-btn');

    $searchInput.val('').trigger('input');

    $citiesCheckboxes.each(function(index, checkbox) {
      if (selectedCitiesIds.includes($(checkbox).val())) {
        $(checkbox).prop('checked', true);
      } else {
        $(checkbox).prop('checked', false);
      }
    });

    if (currentSelectedCitiesIds.length) {
      $citiesClearBtn.show();
    } else {
      $citiesClearBtn.hide();
    }
  });

  $('.cities-filter__clear-btn').on('click', clearCitiesCheckboxes);

  $('.cities-filter__apply-btn').click(function(event) {
    selectedCitiesIds = [...currentSelectedCitiesIds];

    let $searchInput = $('.cities-filter__search-input');
    $searchInput.val('').trigger('input');

    setCheckedCityCheckboxesTitle();
    toggleClearCitiesButtons();

    setTimeout(() => {
      // createFilterUrl();
      document.forms.vacancies_filter.dispatchEvent(new CustomEvent("updateVacanciesFilter"));
      // $('form[name="vacancies_filter"]').trigger('updateVacanciesFilter');
    });
  });

  function addAllSelectedCities (allSelectedCitiesIds) {
    if (!allSelectedCitiesIds.length) return;

    let isMobile = $(window).width() < 576;
    let cities = [];
    let urlParams = allSelectedCitiesIds.map(cityId => `city_ids[]=${cityId}`).join('&');

    let url = `api/v1/cities?${urlParams}`;

    $.ajax({
      url: url,

      success: function(data) {
        cities = data.results;

        if (isMobile) {
          cities.forEach((item, index) => {
            addCityCheckbox(item, allSelectedCitiesIds);
          });

          selectedCitiesIds = [...allSelectedCitiesIds];
          currentSelectedCitiesIds = [...allSelectedCitiesIds];

          setCheckedCityCheckboxesTitle();
          toggleClearCitiesButtons();
        } else {
          let $citiesSelect = $('.filter__cities-select--desktop');

          cities.forEach((city, index) => {
            $citiesSelect.multiSelect('addOption', { value: city.id || '', text: city.origin || '', index: index });

            let $option = $citiesSelect.find(`option[value="${city.id}"]`);

            if (city.province) {
              $option.attr('data-description', city.province);
            }

            if (city.seo_slug) {
              $option.attr('data-seo-slug', city.seo_slug);
            }
          });

          $citiesSelect.multiSelect('refresh');
          $citiesSelect.multiSelect('select', allSelectedCitiesIds);

          selectedCitiesIds = [...allSelectedCitiesIds];
          currentSelectedCitiesIds = [...allSelectedCitiesIds];

          applyChangesToSelectedCities($citiesSelect);
        }
      },

      error: function(data) {
        console.log(data);
      }
    });
  }

  // Loading cities via AJAX
  document.addEventListener('citiesLoaded', function (e) {
    // toggleClearFilterButtons();

    $('.filter__cities-select--desktop option[selected]').removeAttr('selected');
    
    let isMobile = $(window).width() < 576;
    let cities = e.detail.data.results;

    if (isMobile) {
      let $citiesCheckboxesList = $('.checkboxes-group--cities .checkboxes-group__list');
      let selectedCities = $citiesCheckboxesList.attr('data-selected-cities');
      let selectedCitiesArr = selectedCities ? selectedCities.split(", ") : [];

      $citiesCheckboxesList.empty();
      setCheckedCityCheckboxesTitle();
      toggleClearCitiesButtons();

      let allSelectedCitiesIds = selectedCitiesArr.filter(cityId => !cities.includes(cityId));
      addAllSelectedCities(allSelectedCitiesIds);

      setTimeout(() => {
        cities.forEach((item, index) => {
          if (!allSelectedCitiesIds.includes(item.id.toString())) {
            addCityCheckbox(item, allSelectedCitiesIds);
          }
        });

        $citiesCheckboxesList.removeAttr('data-selected-cities');
      }, 300);
    } else {
      let $citiesSelect = $('.filter__cities-select--desktop');
      let selectedCities = $citiesSelect.attr('data-selected-cities');
      let selectedCitiesArr = selectedCities ? selectedCities.split(", ") : [];

      clearCitiesSelect();
      $citiesSelect.empty();
      $citiesSelect.next('.ms-container').find('.ms-list').empty();

      let allSelectedCitiesIds = selectedCitiesArr.filter(cityId => !cities.includes(cityId));
      addAllSelectedCities(allSelectedCitiesIds);

      cities.forEach((city, index) => {
        $citiesSelect.multiSelect('addOption', { value: city.id || '', text: city.origin || '', index: index });

        let $option = $citiesSelect.find(`option[value="${city.id}"]`);

        if (city.province) {
          $option.attr('data-description', city.province);
        }

        if (city.seo_slug) {
          $option.attr('data-seo-slug', city.seo_slug);
        }
      });

      $citiesSelect.multiSelect('refresh');

      applyChangesToSelectedCities($citiesSelect);

      $citiesSelect.removeAttr('data-selected-cities');
    }
  });

  // Initialize sex select
  let isMobile = $(window).width() < 576;
  let $sexSelect = isMobile ? $('.filter__sex-select--mobile') : $('.filter__sex-select--desktop');

  let selectedSex = Array.from($sexSelect.find('option:selected')).map(item => $(item).attr('value'));

  selectedGendersIds = [...selectedSex];
  currentSelectedGendersIds = [...selectedSex];

  changeSelectToggleTitle($sexSelect);

  // applyChangesToSelectedSex($sexSelect);

  // Synchronized input fields
  $('input[data-sync-field-ids]').on('input', function(event) {
    syncInputFields($(this));
    toggleClearFilterButtons();
  });

  // Synchronizing fields when remove tag
  $(document).on('click', '.selected-item__remove-link', function(event) {
    let $selectedItemParent = $(this).closest('.selected-items__item');
    clearTagRelatedFields($selectedItemParent);

    event.preventDefault();
  });

  document.forms.vacancies_filter.addEventListener('undoingChangesToAdditionalFilters', undoChangesToAdditionalFilters);

  // $('[data-remove-last-filter]').click(function(event) {
  //   let lastSelectedTagObj = JSON.parse(localStorage.getItem('lastSelectedTag'));
  //   // let $selectedItem = $(`.selected-items__item[data-name="${name}"]`);

  //   switch (lastSelectedTagObj.type) {
  //     case 'multiselect':
  //       let $select = $(`select[name="${name}"]`);
  //       let $selectedItem = $(`.selected-items__item[data-name="${name}"][data-value="${value}"]`);

  //       $select.multiSelect('deselect', lastSelectedTagObj.value.toString());

  //       break;

  //     case 'textfield':
  //       let $input = $(`input[name="${name}"]`);
  //       let $selectedItem = $(`.selected-items__item[data-name="${name}"]`);

  //       $input.val('');
  //       $selectedItem.remove();

  //       break;
  //   }

  //   lastSelectedTagObj.removeItem('lastSelectedTag');
  // });

});