import $ from "jquery";

$(function () {
	$('.user-sidebar__user-avatar').click(function(e) {
		e.preventDefault();
		$('.user-sidebar__user-info').slideToggle(200);
	});

	$('.mobile-header__menu-hamburger').click(function(e) {
		$(this).toggleClass('menu-hamburger--opened');
		$('.user-sidebar').toggleClass('user-sidebar--opened');
		$('body').toggleClass('no-scroll');
	});
});