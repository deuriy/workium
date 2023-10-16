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

function checkFilterFill() {
  let $clearBtn = $('.filter__clear-btn');
  let $additionalClearBtn = $('.additional-filters__clear-btn');

  isFilterChanged() ? $clearBtn.show() : $clearBtn.hide();
  isFilterChanged() ? $additionalClearBtn.show() : $additionalClearBtn.hide();
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

        // console.log($selectionItems);

        $selectionItems.forEach(el => {
          // console.log();
          let $title = $(el).find('span');
          let description = $(el).data('description');

          $title.wrapAll('<div class="ms-elem-selectable__text-wrapper"></div>');

          if (description !== undefined) {
            $title.after(`<div class="ms-elem-selectable__description">${description}</div>`);
          }
        });

        $selectableItems.forEach(el => {
          // console.log();
          let $title = $(el).find('span');
          let description = $(el).data('description');
          
          $title.wrapAll('<div class="ms-elem-selectable__text-wrapper"></div>');

          if (description !== undefined) {
            $title.after(`<div class="ms-elem-selectable__description">${description}</div>`);
          }
        });

        // console.log(this.$selectableUl);
        // console.log(psArr);

        $searchInput.on('input', function(event) {
          let value = $(this).val().toLowerCase().trim();
          let $items = $(this).closest('.ms-container').find('.ms-list .ms-elem-selectable');

          $items.each((index, item) => {
            if (!$(item).text().toLowerCase().trim().includes(value)) {
              $(item).hide();
            } else {
              $(item).show();
            }
          });

          if (value) {
            $clearSearchBtn.show();
            $searchInput.addClass('ms-selectable__search-input--not-empty');
          } else {
            $clearSearchBtn.hide();
            $searchInput.removeClass('ms-selectable__search-input--not-empty');
          }

          psArr[0].update();
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

        $selectionItems.forEach(el => {
          let $title = $(el).find('span');
          let description = $(el).data('description');

          $title.wrapAll('<div class="ms-elem-selectable__text-wrapper"></div>');

          if (description !== undefined) {
            $title.after(`<div class="ms-elem-selectable__description">${description}</div>`);
          }
        });

        that.$container.find('.ms-container__apply-btn').click(function(event) {
          selectedGendersIds = [...currentSelectedGendersIds];

          let $dropdownBlock = $(this).closest('.dropdown-block');
          let $selectedGenders = $dropdownBlock.find('.ms-selection .ms-selected span');
          let $gendersSelectToggles = $(`.filter__sex-select-toggle`);

          $(this).closest('.dropdown-block').removeClass('dropdown-block--visible');

          $gendersSelectToggles.each(function(index, el) {
            let gendersSelectToggleText = $(el).data('default-placeholder');

            if ($selectedGenders.length) {
              gendersSelectToggleText = $selectedGenders.length === 1 ? `<span class="select-toggle__label">${$selectedGenders[0].textContent}</span>` : `<span class="select-toggle__label">${$selectedGenders[0].textContent}</span>` + `<span class="count count--info-bg count--multiselect select-toggle__count">+${$selectedGenders.length - 1}</span>`;
              $(el).addClass('select-toggle--selected');
            } else {
              $(el).removeClass('select-toggle--selected');
            }

            $('.sex-select').multiSelect('deselect_all');
            selectedGendersIds.forEach(id => {
              $('.sex-select').multiSelect('select', id);
            });

            $(el).html(gendersSelectToggleText);
          });

          let sexValues = ['men', 'women', 'couples'];

          // console.log('selectedGendersIds');
          // console.log(selectedGendersIds);

          if (selectedGendersIds) {
            sexValues.forEach(value => {
              let $checkbox = $(`.additional-filters .checkbox__input[value="${value}"]`);

              if (!$checkbox.is(':checked') && selectedGendersIds.includes(value)) {
                $checkbox.click();
              }

              if ($checkbox.is(':checked') && !selectedGendersIds.includes(value)) {
                $checkbox.click();
              }
            });
          }

          checkFilterFill();
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

  $('.filter__clear-btn, .additional-filters__clear-btn, .additional-filters__clear-filter-btn, .additional-filters__clear-link').click(() => {
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

  $('.cities-filter__search-input').on('input', function(event) {
    let $citiesFilter = $(this).closest('.cities-filter');
    let $clearSearchBtn = $citiesFilter.find('.cities-filter__clear-search-btn');
    let $checkboxesGroupItems = $citiesFilter.find('.checkboxes-group__item')
    let value = $(this).val().toLowerCase().trim();

    // console.log('input!!');

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

    // changeFiltersBodyMaxHeight(selectedItemsLength);
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

    // console.log($checkedLabels);
  });

  // Synchronize genders select with checkboxes
  $('.additional-filters .checkbox__input').click(function(event) {
    let name = $(this).attr('name');
    let value = $(this).val();

    let sexValues = ['men', 'women', 'couples'];
    let selectedValues = [];
    let $gendersSelectToggles = $(`.filter__sex-select-toggle`);

    sexValues.forEach(sexValue => {
      let $checkbox = $(`.additional-filters .checkbox__input[value="${sexValue}"]`);

      if ($checkbox.is(':checked')) {
        selectedValues.push(sexValue);
      }
    });

    if ($(this).is(':checkbox') && ['filters[men]', 'filters[women]', 'filters[couples]'].includes(name)) {
      if (!$(this).is(':checked')) {
        $('.filter__sex-select').multiSelect('deselect_all');
      }

      $('.filter__sex-select').multiSelect('select', selectedValues);

      let $dropdownBlock = $('#additional-sex-dropdown-block');
      let $selectedGenders = $dropdownBlock.find('.ms-selection .ms-selected span');

      $gendersSelectToggles.each(function(index, el) {
        let gendersSelectToggleText = $(el).data('default-placeholder');

        if ($selectedGenders.length) {
          gendersSelectToggleText = $selectedGenders.length === 1 ? `<span class="select-toggle__label">${$selectedGenders[0].textContent}</span>` : `<span class="select-toggle__label">${$selectedGenders[0].textContent}</span>` + `<span class="count count--info-bg count--multiselect select-toggle__count">+${$selectedGenders.length - 1}</span>`;
          $(el).addClass('select-toggle--selected');
        } else {
          $(el).removeClass('select-toggle--selected');
        }

        $(el).html(gendersSelectToggleText);
      });

      // $('.dropdown-block--sex-select .ms-container__apply-btn').click();
    }
  });

  
  document.addEventListener('citiesLoaded', function (e) {
    // console.log(e.detail.data.results);

    let $citiesSelects = $('select[name="cities"]');
    let cities = e.detail.data.results;

    // $citiesSelects.multiSelect('deselect_all');

    clearCitiesSelect();

    $citiesSelects.empty();
    $citiesSelects.next('.ms-container').find('.ms-list').empty();

    cities.forEach((item, index) => {
      // console.log(item);
      $citiesSelects.multiSelect('addOption', { value: item.seo_slug, text: item.text, index: index });
    });

    // console.log($citiesSelects);

    // $citiesSelects.find('option').remove();

    // $('select[name="cities"]').multiSelect('addOption', e.detail.data.results);
    // $('select[name="cities"]').multiSelect('addOption', { value: 42, text: 'test 42', index: 0 });
  });

  // Removing selected items
  // $(document).on('click', '.additional-filters .selected-item__remove-link', function(event) {
  //   let $selectedItemParent = $(this).closest('.selected-items__item');
  //   let $selectedItems = $selectedItemParent.closest('.selected-items');
  //   let $additionalFilters = $selectedItemParent.closest('.additional-filters');
  //   let $clearBtn = $('.filter__clear-btn');
  //   let $additionalFiltersClearBtn = $additionalFilters.find('.additional-filters__clear-btn');
  //   let $additionalFiltersClearLink = $additionalFilters.find('.additional-filters__clear-link');

  //   let name = $selectedItemParent.data('name');
  //   let value = $selectedItemParent.data('value');
  //   let inputType = $selectedItemParent.data('type');

  //   if (name !== undefined && value !== undefined) {
  //     switch (inputType) {
  //       case 'checkbox':
  //         let $selectedCheckbox = $additionalFilters.find(`.checkbox__input[name="${name}"][value="${value}"]`);

  //         if (['filters[men]', 'filters[women]', 'filters[couples]'].includes(name)) {
  //           // $('.filter__sex-select').val('').trigger({
  //           //   type: 'change',
  //           //   params: {
  //           //     calledFromCode: true
  //           //   }
  //           // });
  //         }

  //         break;
  //     }      
  //   }

  //   $selectedItemParent.remove();

  //   let selectedItemsLength = $additionalFilters.find('.selected-items__item').length;

  //   if (selectedItemsLength) {
  //     $selectedItems.show();
  //     $clearBtn.show();
  //     $additionalFiltersClearBtn.show();
  //     $additionalFiltersClearLink.show();
  //   } else {
  //     $selectedItems.hide();
  //     $clearBtn.hide();
  //     $additionalFiltersClearBtn.hide();
  //     $additionalFiltersClearLink.hide();
  //   }

  //   setVisibilitySelectedMoreItem(selectedItemsLength);
  //   event.preventDefault();
  // });

});