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

function removeItemFromArray (array, value) {
  let index = array.indexOf(value);

  if (index > -1) {
    array.splice(index, 1);
  }

  return array;
}

// const compareArrays = (a, b) => {
//   return JSON.stringify(a) === JSON.stringify(b);
// };

$(() => {
  $(".cities-select").each((index, el) => {
    $(el).multiSelect({
      selectableHeader: '<div class="ms-selectable__header"><div class="ms-selectable__search-input-box"><input type="search" name="ms_search" class="ms-selectable__search-input" placeholder="Введіть назву міста…" title="Введіть назву міста…" /></div></div>',
      selectionHeader: '<div class="ms-selection__header"><div class="ms-selection__label">Обрані міста</div><a href="#" class="btn-beige btn-beige--filter ms-selection__clear-btn">Очистити</a></div>',
      keepOrder: true,
      cssClass: 'ms-container--default',

      afterInit: function (ms) {
        let that = this;

        this.$selectionContainer.append('<div class="ms-selection__no-results">У вас ще немає обраних міст...</div>');
        this.$container.append('<div class="ms-container__footer"><button type="button" class="btn-grey btn-grey--multi-select ms-container__apply-btn">Застосувати</button></div>');

        $([this.$selectableUl[0], this.$selectionUl[0]]).each(function(index, item) {
          new PerfectScrollbar(item, {
            wheelSpeed: 2,
            wheelPropagation: false,
            minScrollbarLength: 20,
            suppressScrollX: true
          });
        });

        this.$container.find('.ms-selectable__search-input').on('input', function(event) {
          let value = $(this).val().toLowerCase().trim();
          let $selectableItemsLabels = that.$selectableUl.children().toArray();

          $selectableItemsLabels.forEach(item => {
            if (!$(item).text().toLowerCase().trim().includes(value)) {
              $(item).hide();
            } else {
              $(item).show();
            }
          });
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

          console.log(selectedCitiesIds);

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

        console.log(currentSelectedCitiesIds);

        if (currentSelectedCitiesIds.length) {
          this.$container.removeClass('ms-container--default ms-container--empty');
        } else {
          this.$container.addClass('ms-container--empty');
        }
      }
    });
  });

  function clearCitiesSelect () {
    let $citiesSelectToggles = $('.filter__cities-select-toggle, .additional-filters__cities-select-toggle');
    $citiesSelectToggles.each(function(index, el) {
      let citiesSelectToggleText = $(el).data('default-placeholder');

      $('#cities-select').multiSelect('deselect_all');
      $('#additional-filter-cities-select').multiSelect('deselect_all');

      $(el).html(citiesSelectToggleText);
      $(el).removeClass('select-toggle--selected');
    });
  }

  $('.filter__clear-btn, .additional-filters__clear-btn, .additional-filters__clear-filter-btn').click(clearCitiesSelect);

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
});