import $ from "jquery";

$(function () {
	$('.user-menu__link').each(function(index, link) {
		let linkHref = $(link).attr('href');

		if (window.location.pathname == linkHref) {
			$(link).addClass('user-menu__link--active');
		}
	});

	$('.user-sidebar__user-avatar').click(function(e) {
		e.preventDefault();
		$('.user-sidebar__user-info').slideToggle(200);
	});

	$('.mobile-header__menu-hamburger').click(function(e) {
		$(this).toggleClass('menu-hamburger--opened');
		$('.user-sidebar').toggleClass('user-sidebar--opened');
		$('body').toggleClass('no-scroll');
	});

	$('.copy-link__btn').click(function(e) {
		let $copyLinkInput = $(this).closest('.copy-link').find('.copy-link__input');

		if (!$copyLinkInput.length) return;

		$copyLinkInput[0].select();
	  $copyLinkInput[0].setSelectionRange(0, 99999);

	  document.execCommand("copy");
	});

	$('[data-bookmark]').click(function(e) {
		e.preventDefault();

		$(this).toggleClass('bookmark-icon--fill');
	});
});