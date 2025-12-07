import $ from "jquery";
import select2 from 'select2';

$(() => {
	select2($);

  $('[data-additional-toggle]').click(function(e) {
    let $clientCard = $(this).closest('.client-card');
    let $toggleBtn = $clientCard.find('.toggle-btn');
    let $clientCardAdditional = $clientCard.find('.client-card__additional');

  	$toggleBtn.toggleClass('toggle-btn--opened');
    $clientCardAdditional.slideToggle();

  	if ($toggleBtn.hasClass('toggle-btn--opened')) {
  		$toggleBtn.text('Приховати');
  	} else {
  		$toggleBtn.text('Додатково');
  	}

  	e.preventDefault();
  });

	$('.user-display-name-select').each(function (index, el) {
    if ($(window).width() > 575 || ($(window).width() < 576 && !$(el).hasClass('hidden-xs'))) {
      $(el).select2({
        dropdownCssClass: ':all:',
        selectionCssClass: ':all:',
        theme: 'user-display-name-select',
        dropdownAutoWidth: true,
        minimumResultsForSearch: -1
      });
    }
  });
});