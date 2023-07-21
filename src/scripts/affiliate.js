import $ from "jquery";

function toggleMoreLink ($link) {
	let linkText = $link.text() === 'Приховати' ? 'Читати далі' : 'Приховати';
	$link.text(linkText);
}

$(() => {
	$('.affiliate-info__more-link').click(function(e) {
		$(this).closest('.affiliate-info').find('.affiliate-info__text').toggleClass('affiliate-info__text--truncated');

		toggleMoreLink($(this));
		e.preventDefault();
	});

	$('.partners-table-wrapper__more-link').click(function(e) {
		$(this).closest('.partners-table-wrapper').find('.partners-table-wrapper__description').toggleClass('partners-table-wrapper__description--full');

		toggleMoreLink($(this));
		e.preventDefault();
	});
});