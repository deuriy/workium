import $ from "jquery";
import PerfectScrollbar from 'perfect-scrollbar';
import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.esm.js";

function copyText(input) {
  input.select();
  input.setSelectionRange(0, 99999);

  document.execCommand("copy");
}

// function getCookie(name) {
//   let matches = document.cookie.match(new RegExp(
//     "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
//   ));
//   return matches ? decodeURIComponent(matches[1]) : undefined;
// }

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

function toggleMoreLink ($link) {
	let linkText = $link.text() === 'Менше' ? 'Детальніше' : 'Менше';
	$link.text(linkText);
}

$(() => {
	// let hideProfileCookie = getCookie('hideProfile');
	// let hideProfileQuoteCookie = getCookie('hideProfileQuote');

	// console.log(hideProfileCookie);

	let $userSidebar = $('.user-sidebar');
	let $userAvatarLink = $('.user-sidebar__user-avatar-link');
  let $userInfoWrapper = $('.user-sidebar__user-info-wrapper');
  let $menuLinkHideProfile = $('.dropdown-menu__link--hide-profile');
  // let $userSidebarQuote = $('.user-sidebar__quote');

	// if (hideProfileCookie === 'yes') {
		// $userSidebar.addClass('user-sidebar')
		// $userSidebar.removeClass('user-sidebar--profile-shown');
		// $userAvatarLink.removeClass('user-sidebar__user-avatar-link--profile-shown');

		// $menuLinkHideProfile.find('.dropdown-menu__link-title').text('Показати профіль');
  	// $menuLinkHideProfile.find('.dropdown-menu__icon').attr('src', '/img/context_menu/show_profile.svg');

  	// $userInfoWrapper.hide();
	// }

	// if (hideProfileQuoteCookie === 'yes') {
	// 	$userSidebar.removeClass('user-sidebar--quote-shown');
	// 	$userAvatarLink.removeClass('user-sidebar__user-avatar-link--quote-shown');

	// 	$userSidebarQuote.hide();
	// }

	new PerfectScrollbar('.user-sidebar__user-menu', {
		wheelSpeed: 2,
		wheelPropagation: false,
		minScrollbarLength: 20
	});

	Fancybox.bind(".user-profile-popup-link", {
    dragToClose: false,
    mainClass: 'fancybox--user-profile-popup',

    on: {
      reveal: (fancybox, slide) => {
        if (currentFancybox) {
          currentFancybox.close();
        }

        currentFancybox = fancybox;
      }
    }
  });

	Fancybox.bind(".add-review-popup-link", {
    dragToClose: false,
    mainClass: 'fancybox--add-review-popup',

    tpl: {
      closeButton: '<button data-fancybox-close class="fancybox-close-button hidden-xxs" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path stroke="#A1A7B3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M1 17 17 1M1 1l16 16"></path></svg></button>'
    }
  });

	$('.user-menu__link').each(function(index, link) {
		let linkHref = $(link).attr('href');

		// console.log(window.location.pathname, linkHref);
		// console.log(linkHref.includes(window.location.pathname));

		// if (window.location.pathname == linkHref) {
		// 	$(link).addClass('user-menu__link--active');
		// }

		if (linkHref.includes(window.location.pathname)) {
			$(link).addClass('user-menu__link--active');
		}
	});

	$('.icon-menu__link').each(function(index, link) {
		let linkHref = $(link).attr('href');

		// if (window.location.pathname == linkHref) {
		// 	$(link).addClass('icon-menu__link--active');
		// }
		
		if (linkHref.includes(window.location.pathname)) {
			$(link).addClass('icon-menu__link--active');
		}
	});

	$('.mobile-header__menu-hamburger').click(function(e) {
		$(this).toggleClass('menu-hamburger--opened');
		$('.user-sidebar').toggleClass('user-sidebar--opened');
		$('body').toggleClass('no-scroll');
	});
	

	$('[data-copy-link-btn]').click(function(e) {
		let $copyLinkInput = $(this).closest('[data-copy-link]').find('[data-copy-link-input]');

		if (!$copyLinkInput.length) return;

		if ($copyLinkInput.hasClass('hidden')) {
			$copyLinkInput.removeClass('hidden');
			copyText($copyLinkInput[0]);
			$copyLinkInput.addClass('hidden');
		} else {
			copyText($copyLinkInput[0]);
		}

		let $copyLink = $copyLinkInput.closest('[data-copy-link]');
		let $tooltip = $copyLink.find('.tooltip');

		$tooltip.addClass('tooltip--visible');

    setTimeout(() => {
    	$tooltip.removeClass('tooltip--visible');
    }, 2000);
	});

	$('[data-additional-item-copy]').click(function(e) {
    let $clientAdditionalText = $(this).closest('.client-card__additional').find('.client-card__additional-text');

    if (!$clientAdditionalText.length) return;

    $clientAdditionalText.after(`<textarea class="client-card__additional-textarea">${$clientAdditionalText.text().trim()}</textarea>`);

  	let $tooltip = $(this).find('.client-card__additional-item-tooltip');
  	let $clientAdditionalTextarea = $clientAdditionalText.next('.client-card__additional-textarea');

  	copyText($clientAdditionalTextarea[0]);
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

		if (!$('.vacancy-card--full').length) return;

		const $bookmarkIcons = $('[data-bookmark]');
		let isFilled = $(this).hasClass('bookmark-icon--fill');

		isFilled ? $bookmarkIcons.addClass('bookmark-icon--fill') : $bookmarkIcons.removeClass('bookmark-icon--fill');

		$bookmarkIcons.filter('.bookmark-icon--with-label').each(function () {
      $(this).text(isFilled ? 'Збережено' : 'Зберегти');
    });
	});
	

	$('.promo-block').hover(function() {
		$(this).find('.more-link').addClass('more-link--hover more-link--full-width-hover');
	}, function() {
		$(this).find('.more-link').removeClass('more-link--hover more-link--full-width-hover');
	});


  $('.dropdown-menu__link--copy-user-id').click(function(e) {
  	let $copyLinkInput = $($(this).attr('href'));
  	let defaultText = $(this).text();

  	copyText($copyLinkInput[0]);

  	$(this).find('.dropdown-menu__link-title').text('ID скопійовано!');
  	$(this).addClass('dropdown-menu__link--copied-user-id');

  	setTimeout(() => {
  		$(this).closest('.dropdown-block').removeClass('dropdown-block--visible');
  		$(this).removeClass('dropdown-menu__link--copied-user-id');

  		$(this).find('.dropdown-menu__link-title').text(defaultText);
  	}, 2000);

    e.preventDefault();
  });

  $('.dropdown-menu__link--copy-link').click(function(e) {
  	let $copyLinkInput = $($(this).attr('href'));
		let linkDefaultText = $(this).find('.dropdown-menu__link-title').data('link-default-text');
		let linkCopiedText = $(this).find('.dropdown-menu__link-title').data('link-copied-text');

  	copyText($copyLinkInput[0]);

  	$(this).find('.dropdown-menu__link-title').text(linkCopiedText);
  	$(this).find('.dropdown-menu__icon').attr('src', '/img/context_menu/checked_ok.svg');

  	setTimeout(() => {
  		$(this).closest('.dropdown-block').removeClass('dropdown-block--visible');

  		$(this).find('.dropdown-menu__link-title').text(linkDefaultText);
  		$(this).find('.dropdown-menu__icon').attr('src', '/img/context_menu/link.svg');
  	}, 1500);

    e.preventDefault();
  });

  $menuLinkHideProfile.click(function(e) {
  	$userSidebar.toggleClass('user-sidebar--profile-shown');
  	$userAvatarLink.toggleClass('user-sidebar__user-avatar-link--profile-shown');

  	if (!$userAvatarLink.hasClass('user-sidebar__user-avatar-link--profile-shown')) {
	  	$(this).find('.dropdown-menu__link-title').text('Показати профіль');
	  	$(this).find('.dropdown-menu__icon').attr('src', '/img/context_menu/show_profile.svg');
	  	
	  	$userInfoWrapper.hide();

	  	setCookie('hideProfile', 'yes', {'max-age': 3153600000});

	  	// console.log('1111');
	  	// console.log(getCookie('hideProfile'));
  	} else {
  		$(this).find('.dropdown-menu__link-title').text('Приховати профіль');
	  	$(this).find('.dropdown-menu__icon').attr('src', '/img/context_menu/hide_profile.svg');

	  	$userInfoWrapper.show();

	  	setCookie('hideProfile', 'no', {'max-age': 3153600000});

	  	// console.log('2222');
	  	// console.log(getCookie('hideProfile'));
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

  $('[data-close-banner]').click(function(event) {
  	event.preventDefault();

  	let $banner = $(this).closest('[data-banner]');
  	$banner.slideUp();

  	let cookieName = $banner.data('cookie-name');

  	console.log(cookieName);

  	if (!cookieName) return;

  	setCookie(cookieName, 'yes', {'max-age': 3153600000});

  	if (!$banner.attr('id')) return;

  	$('[data-related-banner-id]').each(function(index, el) {
  		console.log(el);
  		if (el.style.display === 'none') {
  			el.style.display = '';
  		} else {
  			el.style.display = 'none';
  		}
  	});
  });

  // $('.banner__more-link').click(function(e) {
	// 	$(this).closest('.banner').find('.banner__text').toggleClass('banner__text--truncated-xs');
	// 	$(this).toggleClass('arrow-link--opened');

	// 	toggleMoreLink($(this));
	// 	e.preventDefault();
	// });

	// $('[data-close-find-vacancy-banner]').click(function(event) {
  // 	event.preventDefault();

  // 	let $findVacancyBanner = $(this).closest('.find-vacancy-banner');
  // 	$findVacancyBanner.slideUp();

  // 	let cookieName = $findVacancyBanner.data('cookie-name');

  // 	console.log(cookieName);

  // 	if (!cookieName) return;

  // 	setCookie(cookieName, 'yes', {'max-age': 3153600000});
  // });

	// $('[data-close-page-header]').click(function(event) {
  // 	event.preventDefault();

  // 	let $findVacancyBanner = $(this).closest('.page-header');
  // 	$findVacancyBanner.slideUp();

  // 	let cookieName = $findVacancyBanner.data('cookie-name');

  // 	console.log(cookieName);

  // 	if (!cookieName) return;

  // 	setCookie(cookieName, 'yes', {'max-age': 3153600000});
  // });
});