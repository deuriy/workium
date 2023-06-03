import $ from "jquery";

function copyLink(input) {
	input.select();
  input.setSelectionRange(0, 99999);

  document.execCommand("copy");
}

$(function () {
	$('.user-menu__link').each(function(index, link) {
		let linkHref = $(link).attr('href');

		if (window.location.pathname == linkHref) {
			$(link).addClass('user-menu__link--active');
		}
	});

	// $('.user-sidebar__user-avatar').click(function(e) {
	// 	e.preventDefault();
	// 	$('.user-sidebar__user-info-wrapper').slideToggle(200);
	// });

	$('.mobile-header__menu-hamburger').click(function(e) {
		$(this).toggleClass('menu-hamburger--opened');
		$('.user-sidebar').toggleClass('user-sidebar--opened');
		$('body').toggleClass('no-scroll');
	});

	$('.copy-link__btn').click(function(e) {
		let $copyLinkInput = $(this).closest('.copy-link').find('.copy-link__input');

		if (!$copyLinkInput.length) return;

		copyLink($copyLinkInput[0]);
	});

	$('[data-bookmark]').click(function(e) {
		e.preventDefault();

		$(this).toggleClass('bookmark-icon--fill');
	});

	$('.promo-block').hover(function() {
		$(this).find('.more-link').addClass('more-link--hover more-link--full-width-hover');
	}, function() {
		$(this).find('.more-link').removeClass('more-link--hover more-link--full-width-hover');
	});


	$('[data-context-block-trigger]').click(function(e) {
    let $contextBlock = $($(this).attr('href'));
    $contextBlock.toggleClass('context-block--opened');

    e.preventDefault();
  });

  $(document).click(function(e) {
    if (!$(e.target).closest('.context-block').length && !$(e.target).closest('[data-context-block-trigger]').length) {
      $('.context-block--opened').removeClass('context-block--opened');
    }
  });

  $('.context-menu__link--copy-link').click(function(e) {
  	let $copyLinkInput = $($(this).attr('href'));

  	copyLink($copyLinkInput[0]);

  	$(this).find('.context-menu__link-title').text('Посилання скопійовано!');
  	$(this).find('.context-menu__icon').attr('src', '/img/context_menu/checked_ok.svg');

  	setTimeout(() => {
  		$(this).closest('.context-block').removeClass('context-block--opened');

  		$(this).find('.context-menu__link-title').text('Партнерське посилання');
  		$(this).find('.context-menu__icon').attr('src', '/img/context_menu/link.svg');
  	}, 1500);

    e.preventDefault();
  });

  $('.context-menu__link--hide-profile').click(function(e) {
  	let $userAvatarLink = $('.user-sidebar__user-avatar-link');
  	let $userInfoWrapper = $('.user-sidebar__user-info-wrapper');

  	$userAvatarLink.toggleClass('user-sidebar__user-avatar-link--profile-shown');

  	if (!$userAvatarLink.hasClass('user-sidebar__user-avatar-link--profile-shown')) {
	  	$(this).find('.context-menu__link-title').text('Показати профіль');
	  	$(this).find('.context-menu__icon').attr('src', '/img/context_menu/show_profile.svg');
	  	// $userInfoWrapper.slideUp();
	  	$userInfoWrapper.hide();
  	} else {
  		$(this).find('.context-menu__link-title').text('Приховати профіль');
	  	$(this).find('.context-menu__icon').attr('src', '/img/context_menu/hide_profile.svg');
	  	// $userInfoWrapper.slideDown();
	  	$userInfoWrapper.show();
  	}

  	$(this).closest('.context-block').removeClass('context-block--opened');

  	e.preventDefault();
  });
});