import $ from "jquery";

$(() => {
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
});