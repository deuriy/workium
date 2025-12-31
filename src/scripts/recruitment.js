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

	// document.addEventListener('click', (e) => {
	// 	const input = e.target;

	// 	if (input.type !== 'radio' || !input.classList.contains('rating-stars__item')) return;

	// 	// если радиокнопка уже была выбрана
	// 	if (input.dataset.wasChecked === 'true') {
	// 		console.log(input.checked);
	// 		input.checked = false;
	// 		input.dataset.wasChecked = 'false';
	// 		console.log(input.checked);
	// 		e.preventDefault();
	// 	} else {
	// 		// сбрасываем флаг у всех radio этой группы
	// 		document
	// 			.querySelectorAll(`input[type="radio"][name="${input.name}"]`)
	// 			.forEach(radio => radio.dataset.wasChecked = 'false');

	// 		input.dataset.wasChecked = 'true';
	// 	}
	// });

});