import PerfectScrollbar from 'perfect-scrollbar';

let selectedCitiesIds = [];
let currentSelectedCitiesIds = [];

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

function clearCitiesSelect () {
  $('.dropdown-block--cities-select .ms-selection__clear-btn').click();
  $('.dropdown-block--cities-select .ms-container__apply-btn').click();

  $('.selected-items--cities .selected-items__clear-btn').click();
  $('.cities-filter__apply-btn').click();
}

function removeItemFromArray (array, value) {
  let index = array.indexOf(value);

  if (index > -1) {
    array.splice(index, 1);
  }

  return array;
}

$(() => {
  $(".cities-select").each((index, el) => {
    $(el).multiSelect({
      selectableHeader: '<div class="ms-selectable__header"><div class="ms-selectable__search-input-box"><input type="search" name="ms_search" class="ms-selectable__search-input" placeholder="Введіть назву міста…" title="Введіть назву міста…" /><button type="button" class="ms-selectable__clear-search-btn" style="display: none;"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18"><path stroke="#A1A7B3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M1 17 17 1M1 1l16 16"></path></svg></button></div></div>',
      selectionHeader: '<div class="ms-selection__header"><div class="ms-selection__label">Обрані міста</div><a href="#" class="btn-beige btn-beige--filter ms-selection__clear-btn">Очистити</a></div>',
      keepOrder: true,
      cssClass: 'ms-container--default',

      afterInit: function (ms) {
        let that = this;
        let $searchInput = that.$container.find('.ms-selectable__search-input');
        let $clearSearchBtn = that.$container.find('.ms-selectable__clear-search-btn');
        let $selectableItems = that.$selectableUl.children().toArray();
        let psArr = [];

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

        // console.log(this.$selectableUl);
        // console.log(psArr);

        $searchInput.on('input', function(event) {
          let value = $(this).val().toLowerCase().trim();

          $selectableItems.forEach(item => {
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

        $('.ms-selection__clear-btn').click(function(event) {
          let $dropdownBlock = $(this).closest('.dropdown-block');
          $dropdownBlock.find('.cities-select').multiSelect('deselect_all');
          $dropdownBlock.find('.ms-container').addClass('ms-container--empty');

          currentSelectedCitiesIds = [];

          event.preventDefault();
        });

        $('.ms-container__apply-btn').click(function(event) {
          selectedCitiesIds = [...currentSelectedCitiesIds];

          let $dropdownBlock = $(this).closest('.dropdown-block');
          let $selectedCities = $dropdownBlock.find('.ms-selection .ms-selected');
          let $citiesSelectToggles = $(`.filter__cities-select-toggle, .additional-filters__cities-select-toggle`);

          $(this).closest('.dropdown-block').removeClass('dropdown-block--visible');

          // console.log(selectedCitiesIds);

          $citiesSelectToggles.each(function(index, el) {
            let citiesSelectToggleText = $(el).data('default-placeholder');

            if ($selectedCities.length) {
              citiesSelectToggleText = $selectedCities.length === 1 ? $selectedCities[0].textContent : $selectedCities[0].textContent + `<span class="count count--info-bg count--selected-cities select-toggle__count">+${$selectedCities.length - 1}</span>`;
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
        if (!currentSelectedCitiesIds.includes(values[0])) {
          currentSelectedCitiesIds.push(values[0]);
        }

        if (currentSelectedCitiesIds.length) {
          this.$container.removeClass('ms-container--default ms-container--empty');
        } else {
          this.$container.addClass('ms-container--empty');
        }
      },

      afterDeselect: function(values) {
        currentSelectedCitiesIds = removeItemFromArray(currentSelectedCitiesIds, values[0]);

        // console.log(currentSelectedCitiesIds);

        if (currentSelectedCitiesIds.length) {
          this.$container.removeClass('ms-container--default ms-container--empty');
        } else {
          this.$container.addClass('ms-container--empty');
        }
      }
    });
  });

  $('.filter__clear-btn, .additional-filters__clear-btn, .additional-filters__clear-filter-btn, .additional-filters__clear-link').click(clearCitiesSelect);

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

    console.log('input!!');

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
    let labelText = $(this).parent().find('label').text();
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
      $citiesBtnText.text($($checkedLabels[0]).text());
      $citiesBtnCount.hide();
    } else {
      $citiesBtnText.text($($checkedLabels[0]).text());
      $citiesBtnCount.text(`+${$checkedLabels.length - 1}`);
      $citiesBtnCount.show();
    }

    console.log($checkedLabels);
  });
});