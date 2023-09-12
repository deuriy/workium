import PerfectScrollbar from 'perfect-scrollbar';

let selectedCitiesIds = [];
let currentSelectedCitiesIds = [];

function isFilterChanged() {
  let $textFields = $('.filter .form-text');
  let $select2Selections = $('.filter .select2-selection.filter-select');
  let $citiesSelectToggle = $('.filter__cities-select-toggle');

  // console.log($textFields);
  // console.log($select2Selections);

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
    // console.log('Yes!');
  }

  // console.log(array);

  return array;
}

const compareArrays = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

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
          $(this).closest('.dropdown-block').find('.cities-select').multiSelect('deselect_all');
          currentSelectedCitiesIds = [];

          event.preventDefault();
        });

        $('.ms-container__apply-btn').click(function(event) {
          selectedCitiesIds = [...currentSelectedCitiesIds];
          // currentSelectedCitiesIds = [];

          let $dropdownBlock = $(this).closest('.dropdown-block');
          let $selectedCities = $dropdownBlock.find('.ms-selection .ms-selected');
          let $dropdownBlockID = $dropdownBlock.attr('id');
          let $selectToggle = $(`.select-toggle[href="#${$dropdownBlockID}"]`);
          let selectToggleText = $selectToggle.data('default-placeholder');

          $(this).closest('.dropdown-block').removeClass('dropdown-block--visible');

          if ($selectedCities.length) {
            selectToggleText = $selectedCities.length === 1 ? $selectedCities[0].textContent : $selectedCities[0].textContent + `<span class="count count--info-bg count--selected-cities select-toggle__count">+${$selectedCities.length - 1}</span>`;
            $selectToggle.addClass('select-toggle--selected');
          } else {
            // $dropdownBlock.find('.multi-wrapper--empty').removeClass('multi-wrapper--empty').addClass('multi-wrapper--default');
            $selectToggle.removeClass('select-toggle--selected');
          }

          // console.log($dropdownBlock);

          $selectToggle.html(selectToggleText);

          // console.log(selectedCitiesIds);
          // console.log(currentSelectedCitiesIds);
        });
      },

      afterSelect: function(values) {
        // console.log("Select value: " + values);
        // console.log(this);

        currentSelectedCitiesIds.push(values[0]);
        // console.log(currentSelectedCitiesIds);

        if (currentSelectedCitiesIds.length) {
          this.$container.removeClass('ms-container--default ms-container--empty');

          // this.options.cssClass = '';
          // $(el).multiSelect('refresh');
        } else {
          this.$container.addClass('ms-container--empty');
        }
      },

      afterDeselect: function(values) {
        // console.log(values);

        // currentSelectedCitiesIds = selectedCitiesIds;
        currentSelectedCitiesIds = removeItemFromArray(currentSelectedCitiesIds, values[0]);
        // console.log(currentSelectedCitiesIds);

        if (currentSelectedCitiesIds.length) {
          this.$container.removeClass('ms-container--default ms-container--empty');

          // this.options.cssClass = '';
          // $(el).multiSelect('refresh');
        } else {
          this.$container.addClass('ms-container--empty');
        }
      }
    });
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
  });

  // $('.ms-selectable__search-input').on('input', function(event) {
    
  //   /* Act on the event */
  // });
});