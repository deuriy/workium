import $ from "jquery";
import PerfectScrollbar from 'perfect-scrollbar';

function copyText(input) {
	input.select();
  input.setSelectionRange(0, 99999);

  document.execCommand("copy");
}

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {
  options = {
    path: '/',
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

function copyInputText (targetElem) {
  targetElem.select();
  targetElem.setSelectionRange(0, 99999);

  document.execCommand("copy");
}

$(function () {
	let hideProfileCookie = getCookie('hideProfile');

	let $userSidebar = $('.user-sidebar');
	let $userAvatarLink = $('.user-sidebar__user-avatar-link');
  let $userInfoWrapper = $('.user-sidebar__user-info-wrapper');
  let $menuLinkHideProfile = $('.dropdown-menu__link--hide-profile');

	if (hideProfileCookie === 'yes') {
		$userSidebar.addClass('user-sidebar')
		$userSidebar.removeClass('user-sidebar--profile-shown');
		$userAvatarLink.removeClass('user-sidebar__user-avatar-link--profile-shown');

		$menuLinkHideProfile.find('.dropdown-menu__link-title').text('Показати профіль');
  	$menuLinkHideProfile.find('.dropdown-menu__icon').attr('src', '/img/context_menu/show_profile.svg');

  	$userInfoWrapper.hide();
	}

	const userSidebarMenuPS = new PerfectScrollbar('.user-sidebar__user-menu', {
		wheelSpeed: 2,
		wheelPropagation: true,
		minScrollbarLength: 20
	});

	$('.user-menu__link').each(function(index, link) {
		let linkHref = $(link).attr('href');

		if (window.location.pathname == linkHref) {
			$(link).addClass('user-menu__link--active');
		}
	});

	$('.mobile-header__menu-hamburger').click(function(e) {
		$(this).toggleClass('menu-hamburger--opened');
		$('.user-sidebar').toggleClass('user-sidebar--opened');
		$('body').toggleClass('no-scroll');
	});
	

	$('.copy-link__btn').click(function(e) {
		let $copyLinkInput = $(this).closest('.copy-link').find('.copy-link__input');

		if (!$copyLinkInput.length) return;

		copyText($copyLinkInput[0]);

		let $copyLink = $copyLinkInput.closest('.copy-link');
		let $tooltip = $copyLink.find('.tooltip');

		$tooltip.addClass('tooltip--visible');

    setTimeout(() => {
    	$tooltip.removeClass('tooltip--visible');
    }, 2000);
	});

	$('.contact-phones--support .contact-phones__item').click(function(e) {
		let $phone = $(this).find('.phone');
    $phone.after(`<input type="text" class="contact-phones__phone-form-text" value="${$phone.text().replaceAll(' ', '')}" />`);

  	let $tooltip = $(this).find('.contact-phones__tooltip');
  	let $contactPhoneFormText = $phone.next('.contact-phones__phone-form-text');

  	copyInputText($contactPhoneFormText[0]);
  	$contactPhoneFormText.remove();

		$tooltip.addClass('tooltip--visible');
    setTimeout(() => {
    	$tooltip.removeClass('tooltip--visible');
    }, 1500);

    e.preventDefault();
	});

	$('[data-additional-item-copy]').click(function(e) {
    let $clientAdditionalText = $(this).closest('.client-card__additional').find('.client-card__additional-text');

    if (!$clientAdditionalText.length) return;

    $clientAdditionalText.after(`<textarea class="client-card__additional-textarea">${$clientAdditionalText.text()}</textarea`);

  	let $tooltip = $(this).find('.client-card__additional-item-tooltip');
  	let $clientAdditionalTextarea = $clientAdditionalText.next('.client-card__additional-textarea');

  	copyInputText($clientAdditionalTextarea[0]);
  	$clientAdditionalTextarea.remove();

		$tooltip.addClass('tooltip--visible');
    setTimeout(() => {
    	$tooltip.removeClass('tooltip--visible');
    }, 2000);

    e.preventDefault();
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


	// Show/hide dropdown block
	$('[data-dropdown-block-trigger]').click(function(e) {
    let $dropdownBlock = $($(this).attr('href'));
    $dropdownBlock.toggleClass('dropdown-block--visible');

    e.preventDefault();
  });

  $(document).click(function(e) {
    if (!$(e.target).closest('.dropdown-block').length && !$(e.target).closest('[data-dropdown-block-trigger]').length) {
      $('.dropdown-block--visible').removeClass('dropdown-block--visible');
    }
  });

  $('.dropdown-toggle').click(function(e) {
  	e.preventDefault();
  });

  $('.dropdown-menu__link--copy-link').click(function(e) {
  	let $copyLinkInput = $($(this).attr('href'));

  	copyText($copyLinkInput[0]);

  	$(this).find('.dropdown-menu__link-title').text('Посилання скопійовано!');
  	$(this).find('.dropdown-menu__icon').attr('src', '/img/context_menu/checked_ok.svg');

  	setTimeout(() => {
  		$(this).closest('.dropdown-block').removeClass('dropdown-block--visible');

  		$(this).find('.dropdown-menu__link-title').text('Партнерське посилання');
  		$(this).find('.dropdown-menu__icon').attr('src', '/img/context_menu/link.svg');
  	}, 1500);

    e.preventDefault();
  });

  $('.dropdown-menu__link--hide-profile').click(function(e) {
  	$userSidebar.toggleClass('user-sidebar--profile-shown');
  	$userAvatarLink.toggleClass('user-sidebar__user-avatar-link--profile-shown');

  	if (!$userAvatarLink.hasClass('user-sidebar__user-avatar-link--profile-shown')) {
	  	$(this).find('.dropdown-menu__link-title').text('Показати профіль');
	  	$(this).find('.dropdown-menu__icon').attr('src', '/img/context_menu/show_profile.svg');
	  	
	  	$userInfoWrapper.hide();

	  	setCookie('hideProfile', 'yes', {'max-age': 3153600000});
  	} else {
  		$(this).find('.dropdown-menu__link-title').text('Приховати профіль');
	  	$(this).find('.dropdown-menu__icon').attr('src', '/img/context_menu/hide_profile.svg');

	  	$userInfoWrapper.show();

	  	setCookie('hideProfile', 'no', {'max-age': 3153600000});
  	}

  	$(this).closest('.dropdown-block').removeClass('dropdown-block--visible');

  	e.preventDefault();
  });

  $('.form-search-box__input').on('input', function(event) {
  	// console.log($(this).val().length);
  	let $clearBtn = $(this).next('.form-search-box__clear-btn');
  	
  	if ($(this).val().length) {
  		$clearBtn.addClass('form-search-box__clear-btn--visible');
  	} else {
  		$clearBtn.removeClass('form-search-box__clear-btn--visible');
  	}
  });

  $('.form-search-box__clear-btn').click(function(e) {
  	$(this).removeClass('form-search-box__clear-btn--visible');
  	$(this).prev('.form-search-box__input').val('');
  });
});