import $ from "jquery";
import PerfectScrollbar from 'perfect-scrollbar';

// console.log(PerfectScrollbar);

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
  let $menuLinkHideProfile = $('.context-menu__link--hide-profile');

	if (hideProfileCookie === 'yes') {
		$userSidebar.addClass('user-sidebar')
		$userSidebar.removeClass('user-sidebar--profile-shown');
		$userAvatarLink.removeClass('user-sidebar__user-avatar-link--profile-shown');

		$menuLinkHideProfile.find('.context-menu__link-title').text('Показати профіль');
  	$menuLinkHideProfile.find('.context-menu__icon').attr('src', '/img/context_menu/show_profile.svg');

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

	// $('[data-copy-text]').click(function(e) {
	// 	document.execCommand("copy");
	// 	// console.log('fmfwmewf');

	// 	e.preventDefault();
	// });

	

	// document.querySelector('[data-copy-text]').copy = function(event) {
	// 	console.log('mekmdmewmlmwl');

	//   event.preventDefault();
	//   if (event.clipboardData) {
	//     event.clipboardData.setData("text/plain", this.textContent);
	//     console.log(event.clipboardData.getData("text"))
	//   }
	// };

	// $('[data-copy-text]').on('copy', function(e) {
	// 	e.preventDefault();

	//   if (e.clipboardData) {
	//   	console.log('rgme');
	//     e.clipboardData.setData("text/plain", this.textContent);
	//     console.log(e.clipboardData.getData("text"))
	//   }
	// });

	// span.onclick = function() {
	//   document.execCommand("copy");
	// }

	// span.addEventListener("copy", function(event) {
	//   event.preventDefault();
	//   if (event.clipboardData) {
	//     event.clipboardData.setData("text/plain", span.textContent);
	//     console.log(event.clipboardData.getData("text"))
	//   }
	// });

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

	$('.contact-phones--support .phone').click(function(e) {
		let $contactPhonesSupport = $(this).closest('.contact-phones--support');

    if (!$contactPhonesSupport.length) return;

    $(this).after(`<input type="text" class="contact-phones__phone-form-text" value="${$(this).text()}" />`);

  	let $tooltip = $contactPhonesSupport.find('.contact-phones__tooltip');
  	let $contactPhoneFormText = $(this).next('.contact-phones__phone-form-text');

  	copyInputText($contactPhoneFormText[0]);
  	$contactPhoneFormText.remove();

		$tooltip.addClass('tooltip--visible');
    setTimeout(() => {
    	$tooltip.removeClass('tooltip--visible');
    }, 1500);

    e.preventDefault();
	});

	$('.client-card__additional-item--copy').click(function(e) {
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


	// Show/hide context block
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
  	$userSidebar.toggleClass('user-sidebar--profile-shown');
  	$userAvatarLink.toggleClass('user-sidebar__user-avatar-link--profile-shown');

  	if (!$userAvatarLink.hasClass('user-sidebar__user-avatar-link--profile-shown')) {
	  	$(this).find('.context-menu__link-title').text('Показати профіль');
	  	$(this).find('.context-menu__icon').attr('src', '/img/context_menu/show_profile.svg');
	  	
	  	$userInfoWrapper.hide();

	  	setCookie('hideProfile', 'yes', {'max-age': 3153600000});
  	} else {
  		$(this).find('.context-menu__link-title').text('Приховати профіль');
	  	$(this).find('.context-menu__icon').attr('src', '/img/context_menu/hide_profile.svg');

	  	$userInfoWrapper.show();

	  	setCookie('hideProfile', 'no', {'max-age': 3153600000});
  	}

  	$(this).closest('.context-block').removeClass('context-block--opened');

  	e.preventDefault();
  });
});