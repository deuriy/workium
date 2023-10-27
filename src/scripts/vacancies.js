import PerfectScrollbar from 'perfect-scrollbar';

let selectedCitiesIds = [];
let currentSelectedCitiesIds = [];

let selectedGendersIds = [];
let currentSelectedGendersIds = [];

function isFilterChanged() {
  let $textFields = $('.filter .form-text');
  let $select2Selections = $('.filter .select2-selection.filter-select');
  let $citiesSelectToggle = $('.filter__cities-select-toggle .select-toggle__label');
  let $sexSelectToggle = $('.filter__sex-select-toggle .select-toggle__label');
  let result = false;

  for (const input of $textFields) {
    if ($(input).val() !== '') {
      result = true;
    }
  }

  // console.log('!!!');

  for (const selection of $select2Selections) {
    if ($(selection).hasClass('select2-selection--selected')) {
      result = true;
    }
  }

  // console.log($citiesSelectToggle);

  $citiesSelectToggle.each(function(index, el) {
    // console.log($(el).text().trim());

    if ($(el).text().trim() !== 'Усі міста') {
      result = true;
    }
  });

  // if ($citiesSelectToggle.text().trim() !== 'Усі міста') {
  //   return true;
  // }

  // console.log($sexSelectToggle);

  $sexSelectToggle.each(function(index, el) {
    // console.log($(el).text().trim());

    if ($(el).text().trim() !== 'Стать') {
      result = true;
    }
  });

  // if ($sexSelectToggle.text().trim() !== 'Стать') {
  //   return true;
  // }

  return result;
}

function toggleClearButtons () {
  let $additionalFilters = $('.additional-filters');
  let $clearBtn = $('.filter__clear-btn');
  let $additionalFiltersClearBtn = $additionalFilters.find('.additional-filters__clear-btn');
  let $additionalFiltersClearLink = $additionalFilters.find('.additional-filters__clear-link');
  let selectedItemsLength = $additionalFilters.find('.selected-items__item').length;
  let $filtersBtn = $('.btn-white--filter .btn-white__count');

  if (selectedItemsLength) {
    // $selectedItems.show();
    $clearBtn.show();
    $additionalFiltersClearBtn.show();
    $additionalFiltersClearLink.show();
    $filtersBtn.removeClass('hidden').text(selectedItemsLength);
  } else {
    // $selectedItems.hide();
    $clearBtn.hide();
    $additionalFiltersClearBtn.hide();
    $additionalFiltersClearLink.hide();
    $filtersBtn.addClass('hidden').text(0);
  }
}

function checkFilterFill() {
  let $clearBtn = $('.filter__clear-btn');
  let $additionalClearBtn = $('.additional-filters__clear-btn');

  isFilterChanged() ? $clearBtn.show() : $clearBtn.hide();
  isFilterChanged() ? $additionalClearBtn.show() : $additionalClearBtn.hide();
}

function applyChangesToSelectedCountries (argument) {
  // body... 
}

function clearCitiesSelect () {
  $('.dropdown-block--cities-select .ms-selection__clear-btn').click();
  $('.dropdown-block--cities-select .ms-container__apply-btn').click();

  $('.selected-items--cities .selected-items__clear-btn').click();
  $('.cities-filter__apply-btn').click();
}

function clearSexSelect () {
  $('.sex-select').multiSelect('deselect_all');

  selectedGendersIds = [];
  currentSelectedGendersIds = [];

  $('.dropdown-block--sex-select').each(function(index, el) {
    $(el).find('.ms-container__apply-btn').click();
  });

  // $('.selected-items--cities .selected-items__clear-btn').click();

  // $('.cities-filter__apply-btn').click();
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
  let $dropdown = $select.closest('.dropdown-block');
  let dropdownId = $dropdown.attr('id');
  let $selectToggle = $(`.select-toggle[href="#${dropdownId}"]`);
  let selectToggleText = $selectToggle.data('default-placeholder');
  let $selectedValues = $select.find('option:selected').map((index, el) => $(el).text());

  // console.log($selectedValues);

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

  // console.log(selectToggleText);
  // console.log($selectToggle);
  $selectToggle.html(selectToggleText);
  // });
}

function clearTextField ($input) {
  $input.removeClass('form-text--filter-search-filled').val('');
  $input.parent().find('[data-clear-search-input]').hide();
}

function updateDropdownItemsDescription ($items) {
  $items.forEach(el => {
    // console.log();
    let $title = $(el).find('span');
    let description = $(el).data('description');

    $title.wrapAll('<div class="ms-elem-selectable__text-wrapper"></div>');

    if (description !== undefined) {
      $title.after(`<div class="ms-elem-selectable__description">${description}</div>`);
    }
  });
}

$(() => {
  let psArr = [];

  $(".cities-select").each((index, el) => {
    $(el).multiSelect({
      selectableHeader: '<div class="ms-selectable__header"><div class="ms-selectable__search-input-box"><input type="search" name="ms_search" class="ms-selectable__search-input" placeholder="Введіть назву міста…" title="Введіть назву міста…" /><button type="button" class="ms-selectable__clear-search-btn" style="display: none;"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18"><path stroke="#A1A7B3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M1 17 17 1M1 1l16 16"></path></svg></button></div></div>',
      selectionHeader: '<div class="ms-selection__header"><div class="ms-selection__label">Обрані міста</div><a href="#" class="btn-beige btn-beige--filter ms-selection__clear-btn" style="display: none;">Очистити</a></div>',
      keepOrder: true,
      cssClass: 'ms-container--default',

      afterInit: function (container) {
        let that = this;
        let $searchInput = container.find('.ms-selectable__search-input');
        let $clearSearchBtn = container.find('.ms-selectable__clear-search-btn');
        // let $clearBtn = that.$container.find('.ms-selection__clear-btn');
        // console.log($clearBtn);
        let $selectableItems = that.$selectableUl.children().toArray();
        let $selectionItems = that.$selectionUl.children().toArray();
        let searchCitiesTimeoutID = null;

        // let psArr = [];

        // console.log('Init!');

        // console.log('$selectableItems');
        // console.log($selectableItems);

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

        console.log($selectionItems);

        updateDropdownItemsDescription($selectionItems);
        updateDropdownItemsDescription($selectableItems);

        $searchInput.on('input', function(event) {
          clearTimeout(searchCitiesTimeoutID);

          // $('select[name="cities"]').multiSelect('refresh');
          // console.log('Refresh!');
          // $(this).focus();

          let searchValue = $(this).val().trim();

          let countryID = $('select[name="countries"]').find(':selected').data('id');
          let url = `api/v1/cities?country_id=${countryID}`;

          if (searchValue) {
            url = `api/v1/cities?country_id=${countryID}&term=${searchValue}`;
          }

          console.log('Input222');

          searchCitiesTimeoutID = setTimeout(() => {
            console.log(countryID);

            // if (searchValue.length >= 3 || !searchValue.length) {
              $.ajax({
                url: url,

                success: function(data) {
                  // document.dispatchEvent(new CustomEvent("citiesLoaded", {
                  //   detail: { data }
                  // }));

                  console.log('Success!!');

                  let $citiesSelects = $('select[name="cities"]');
                  let $citiesCheckboxesList = $('.checkboxes-group--cities .checkboxes-group__list');
                  let cities = data.results;

                  $citiesSelects.empty();
                  $citiesCheckboxesList.empty();

                  console.log(cities);

                  $citiesSelects.next('.ms-container').find('.ms-selectable .ms-list').empty();

                  cities.forEach((item, index) => {
                    console.log(item);

                    // if (item.seo_slug && item.origin) {
                      $citiesSelects.multiSelect('addOption', { value: item.seo_slug || '', text: item.origin || '', index: index });

                      $citiesCheckboxesList.append(`<li class="checkboxes-group__item">
                                                      <div class="checkbox">
                                                        <input class="checkbox__input" name="cities" value="${item.seo_slug}" type="checkbox" id="${item.seo_slug}">
                                                        <label class="checkbox__label checkbox__label--align-start" for="${item.seo_slug}">
                                                          <div class="checkbox__label-wrapper">
                                                            <div class="checkbox__title">${item.origin}</div>
                                                            <div class="checkbox__description">${item.province}</div>
                                                          </div>
                                                        </label>
                                                      </div>
                                                    </li>`);
                    // }
                  });

                  cities.forEach((item, index) => {
                    let $option = $citiesSelects.find(`option[value="${item.seo_slug}"]`);

                    if (item.province) {
                      $option.prop('data-description', item.province);
                    }
                  });

                  // $citiesSelects.multiSelect('refresh');

                  // console.log('refresh!');

                  // console.log($selectionItems);

                  updateDropdownItemsDescription($selectionItems);
                  updateDropdownItemsDescription($selectableItems);

                  // console.log(cities);
                },

                error: function(data){
                  console.log(data);
                }
              });
            // }

            if (searchValue) {
              $clearSearchBtn.show();
              $searchInput.addClass('ms-selectable__search-input--not-empty');
            } else {
              $clearSearchBtn.hide();
              $searchInput.removeClass('ms-selectable__search-input--not-empty');
            }

            psArr[0].update();

          }, 500);
        });

        $clearSearchBtn.click(function(event) {
          $(this).hide();

          $searchInput.val('').trigger('input').focus();
        });

        // console.log(that);

        that.$container.find('.ms-selection__clear-btn').click(function(event) {
          let $dropdownBlock = $(this).closest('.dropdown-block');
          $dropdownBlock.find('.cities-select').multiSelect('deselect_all');
          $dropdownBlock.find('.ms-container').addClass('ms-container--empty');

          currentSelectedCitiesIds = [];
          $(this).hide();

          event.preventDefault();
        });

        that.$container.find('.ms-container__apply-btn').click(function(event) {
          selectedCitiesIds = [...currentSelectedCitiesIds];

          let $dropdownBlock = $(this).closest('.dropdown-block');
          let $selectedCities = $dropdownBlock.find('.ms-selection .ms-selected span');
          let $citiesSelectToggles = $(`.filter__cities-select-toggle, .additional-filters__cities-select-toggle`);

          $(this).closest('.dropdown-block').removeClass('dropdown-block--visible');

          // console.log(selectedCitiesIds);

          $citiesSelectToggles.each(function(index, el) {
            let citiesSelectToggleText = $(el).data('default-placeholder');

            if ($selectedCities.length) {
              citiesSelectToggleText = $selectedCities.length === 1 ? `<span class="select-toggle__label">${$selectedCities[0].textContent}</span>` : `<span class="select-toggle__label">${$selectedCities[0].textContent}</span>` + `<span class="count count--info-bg count--multiselect select-toggle__count">+${$selectedCities.length - 1}</span>`;
              $(el).addClass('select-toggle--selected');
            } else {
              $('.dropdown-block--cities-select .ms-container--empty').removeClass('ms-container--empty').addClass('ms-container--default');
              $(el).removeClass('select-toggle--selected');
            }

            $('.cities-select').multiSelect('deselect_all');
            selectedCitiesIds.forEach(id => {
              $('.cities-select').multiSelect('select', id);
            });

            $(el).html(citiesSelectToggleText);
          });

          checkFilterFill();
        });
      },

      afterSelect: function(values) {
        let $clearBtn = this.$container.find('.ms-selection__clear-btn');
        // console.log($clearBtn);
        // console.log(this);

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
        // console.log($clearBtn);

        currentSelectedCitiesIds = removeItemFromArray(currentSelectedCitiesIds, values[0]);

        // console.log(currentSelectedCitiesIds);

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

        // $selectionItems.forEach(el => {
        //   let $title = $(el).find('span');
        //   let description = $(el).data('description');

        //   $title.wrapAll('<div class="ms-elem-selectable__text-wrapper"></div>');

        //   if (description !== undefined) {
        //     $title.after(`<div class="ms-elem-selectable__description">${description}</div>`);
        //   }
        // });

        updateDropdownItemsDescription($selectionItems);

        that.$container.find('.ms-container__apply-btn').click(function(event) {
          selectedGendersIds = [...currentSelectedGendersIds];

          let $dropdownBlock = $(this).closest('.dropdown-block');
          $dropdownBlock.removeClass('dropdown-block--visible');

          changeSelectToggleTitle(that.$element);

          that.$element.multiSelect('deselect_all');
          selectedGendersIds.forEach(id => {
            that.$element.multiSelect('select', id);
          });

          checkFilterFill();

          that.$element[0].dispatchEvent(new Event('change'));

          toggleClearButtons();
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
    clearSexSelect();
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

  // Mobile cities filter
  $('.cities-filter__search-input').on('input', function(event) {
    let $citiesFilter = $(this).closest('.cities-filter');
    let $clearSearchBtn = $citiesFilter.find('.cities-filter__clear-search-btn');
    let $checkboxesGroupItems = $citiesFilter.find('.checkboxes-group__item')
    let value = $(this).val().toLowerCase().trim();

    $checkboxesGroupItems.each((index, item) => {
      if (!$(item).text().toLowerCase().trim().includes(value)) {
        $(item).hide();
      } else {
        $(item).show();
      }
    });

    value ? $clearSearchBtn.show() : $clearSearchBtn.hide();

    // psArr[0].update();
  });

  $('.cities-filter__clear-search-btn').click(function(event) {
    $(this).hide();

    $('.cities-filter__search-input').val('').trigger('input').focus();
  });

  $('.checkboxes-group--cities .checkbox__input').change(function(event) {
    let name = $(this).attr('name');
    let value = $(this).val();
    let labelText = $(this).parent().find('.checkbox__title').text();
    let $selectedItems = $('.selected-items--cities');
    let $selectedItem = $selectedItems.find(`.selected-items__item[data-name="${name}"][data-value="${value}"]`);
    let $clearBtn = $selectedItems.find('.selected-items__clear-btn');

    if ($(this).is(':checkbox')) {
      if ($(this).is(':checked')) {
        $selectedItems.find('.selected-items__list').append(`
          <li class="selected-items__item" data-name="${name}" data-value="${value}">
            <div class="selected-item selected-item--city">
              <div class="selected-item__value">${labelText}</div>
              <a href="#" class="selected-item__remove-link"></a>
            </div>
          </li>`);

        if (!currentSelectedCitiesIds.includes(value)) {
          currentSelectedCitiesIds.push(value);
        }
      } else {
        $selectedItem.remove();

        currentSelectedCitiesIds = removeItemFromArray(currentSelectedCitiesIds, value);
      }
    }

    let selectedItemsLength = $('.selected-items--cities .selected-items__item').length;

    if (selectedItemsLength) {
      $selectedItems.show();
      $clearBtn.show();
    } else {
      $selectedItems.hide();
      $clearBtn.hide();
    }
  });

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

  $('.cities-filter__btn-back').click(function(event) {
    $('.selected-items--cities .selected-items__clear-btn').click();

    selectedCitiesIds.forEach(id => {
      $(`.checkboxes-group--cities .checkbox__input[value="${id}"]`).click();
    });

    currentSelectedCitiesIds = [...selectedCitiesIds];
  });

  $('.cities-filter__apply-btn').click(function(event) {
    selectedCitiesIds = [...currentSelectedCitiesIds];

    let $citiesBtn = $('.additional-filters__cities-btn');
    let $citiesBtnText = $citiesBtn.find('.btn-white__text');
    let $citiesBtnCount = $citiesBtn.find('.count');
    let $checkedLabels = $('.checkboxes-group--cities .checkbox__input:checked + .checkbox__label');

    if (!$checkedLabels.length) {
      $citiesBtnText.text($citiesBtn.data('placeholder'));
      $citiesBtnCount.hide()
    } else if ($checkedLabels.length == 1) {
      $citiesBtnText.text($($checkedLabels[0]).find('.checkbox__title').text());
      $citiesBtnCount.hide();
    } else {
      $citiesBtnText.text($($checkedLabels[0]).find('.checkbox__title').text());
      $citiesBtnCount.text(`+${$checkedLabels.length - 1}`);
      $citiesBtnCount.show();
    }
  });

  // Loading cities via AJAX
  document.addEventListener('citiesLoaded', function (e) {
    let $citiesSelects = $('select[name="cities"]');
    let $citiesCheckboxesList = $('.checkboxes-group--cities .checkboxes-group__list');
    let cities = e.detail.data.results;

    let selectedCities = $citiesSelects.data('selected-cities');
    let selectedCitiesArr = selectedCities ? selectedCities.split(", ") : [];

    clearCitiesSelect();

    $citiesSelects.empty();
    $citiesCheckboxesList.empty();

    $citiesSelects.next('.ms-container').find('.ms-list').empty();

    cities.forEach((item, index) => {
      // if (item.seo_slug && item.origin) {
        $citiesSelects.multiSelect('addOption', { value: item.seo_slug || '', text: item.origin || '', index: index });

        $citiesCheckboxesList.append(`<li class="checkboxes-group__item">
                                        <div class="checkbox">
                                          <input class="checkbox__input" name="cities" value="${item.seo_slug}" type="checkbox" id="${item.seo_slug}">
                                          <label class="checkbox__label checkbox__label--align-start" for="${item.seo_slug}">
                                            <div class="checkbox__label-wrapper">
                                              <div class="checkbox__title">${item.origin}</div>
                                              <div class="checkbox__description">${item.province}</div>
                                            </div>
                                          </label>
                                        </div>
                                      </li>`);
      // }
    });

    cities.forEach((item, index) => {
      let $option = $citiesSelects.find(`option[value="${item.seo_slug}"]`);

      if (item.province) {
        $option.attr('data-description', item.province);
      }
    });

    $citiesSelects.multiSelect('refresh');

    $citiesSelects.multiSelect('select', selectedCitiesArr);

    selectedCitiesIds = [...selectedCitiesArr];
    currentSelectedCitiesIds = [...selectedCitiesArr];

    $('.dropdown-block--cities-select .ms-container__apply-btn').click();
    $('.cities-filter__apply-btn').click();
  });

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

          console.log($input);

          setTimeout(() => {
            if ($input.is(":checked")) {
              console.log('checked!');
              $syncField.multiSelect('select', filterItemId);

              if (!currentSelectedGendersIds.includes(filterItemId)) {
                currentSelectedGendersIds.push(filterItemId);
              }
            } else {
              console.log('unchecked!');
              $syncField.multiSelect('deselect', filterItemId);
              currentSelectedGendersIds = removeItemFromArray(currentSelectedGendersIds, filterItemId);
            }

            selectedGendersIds = [...currentSelectedGendersIds];
            changeSelectToggleTitle($syncField);

            console.log('select');
          });          

          break;
      }
      
    });
  }

  // Synchronized input fields
  $('input[data-sync-field-ids]').on('input', function(event) {
    syncInputFields($(this));
  });

  // Synchronizing fields when remove tag
  $(document).on('click', '.selected-item__remove-link', function(event) {
    let $selectedItemParent = $(this).closest('.selected-items__item');
    let name = $selectedItemParent.data('name');
    let value = $selectedItemParent.data('value');
    let type = $selectedItemParent.data('type');

    console.log(type);

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
      }
    }

    event.preventDefault();
  });

});