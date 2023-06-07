import $ from "jquery";

$(function () {
  $('.client-card__additional-toggle-btn').click(function(e) {
  	$(this).toggleClass('toggle-btn--opened').closest('.client-card').find('.client-card__additional').slideToggle();

  	if ($(this).hasClass('toggle-btn--opened')) {
  		$(this).text('Приховати');
  	} else {
  		$(this).text('Додатково');
  	}

  	e.preventDefault();
  });
});