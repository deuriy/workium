import $ from "jquery";

$(() => {
	$('.article-box__more-btn').click(function(event) {
		let $articleBoxContent = $(this).closest('.article-box').find('.article-box__content');

		if ($articleBoxContent.is(':visible')) {
			$(this).text('Читати статтю');
			$articleBoxContent.hide();
		} else {
			$(this).text('Згорнути статтю');
			$articleBoxContent.show();
		}

		event.preventDefault();
	});
});