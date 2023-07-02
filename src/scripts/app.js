import $ from "jquery";
import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.esm.js";

var count = 200;
var defaults = {
  origin: { y: 0.7 },
  zIndex: 10000
};

function fire(particleRatio, opts) {
  confetti(Object.assign({}, defaults, opts, {
    particleCount: Math.floor(count * particleRatio)
  }));
}

function runConfetti() {
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

function copyText(input) {
  input.select();
  input.setSelectionRange(0, 99999);

  document.execCommand("copy");
}

$(function () {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  let currentFancybox = null;

	Fancybox.bind("[data-fancybox]");
	
	Fancybox.bind(".fancybox-popup-toggle", {
	  dragToClose: false,
	  mainClass: 'fancybox--popup',

    on: {
      reveal: (fancybox, slide) => {
        console.log(slide);

        if (slide.src === '#authorization-popup') {
          let activeTabNumber = slide.activeTabNumber !== undefined ? slide.activeTabNumber : 1;
          let $activeTabLink = $(slide.el).find(`.tabs-menu__item:nth-child(${activeTabNumber}) .tabs-menu__link`);

          $activeTabLink.trigger('click');
        }

        if (currentFancybox) {
          currentFancybox.close();
        }
      },
    },

    // tpl: {
    //   closeButton: '<button data-fancybox-close class="fancybox-close-button" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" id="Icons" viewBox="0 0 24 24"><path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0Zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10Z" fill="currentColor"/><path d="M16.707 7.293a1 1 0 0 0-1.414 0L12 10.586 8.707 7.293a1 1 0 1 0-1.414 1.414L10.586 12l-3.293 3.293a1 1 0 1 0 1.414 1.414L12 13.414l3.293 3.293a1 1 0 0 0 1.414-1.414L13.414 12l3.293-3.293a1 1 0 0 0 0-1.414Z" fill="currentColor"/></svg></button>'
    // }
	});
  
  Fancybox.bind(".fancybox-wide-popup-toggle", {
    dragToClose: false,
    mainClass: 'fancybox--wide-popup',

    on: {
      reveal: (fancybox, slide) => {
        if (currentFancybox) {
          currentFancybox.close();
        }

        currentFancybox = fancybox;
      },

      done: (fancybox, slide) => {
        if (slide.src.includes('award-popup') && slide.src != '#leader-award-popup') {
          runConfetti();
        }
      }
    }
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

  // Copy URL
  document.addEventListener('click', function (e) {
    let copyURL = e.target.closest('[data-action="copyURL"]');

    if (!copyURL) return;

    let newURL = new URL(window.location.href);

    if (newURL.searchParams.has('share')) {
      newURL.searchParams.delete('share');
    }

    let copyLinkInput = document.createElement('input');
    copyLinkInput.type = 'text';

    copyLinkInput.value = newURL;
    copyURL.after(copyLinkInput);
    copyText(copyLinkInput);
    copyLinkInput.remove();

    let copyURLText = copyURL.querySelector('.action-menu__link-text');
    copyURL.classList.add('action-menu__link--success');
    copyURLText.textContent = 'Скопійовано!';

    setTimeout(() => {
      copyURL.classList.remove('action-menu__link--success');
      copyURLText.textContent = 'Скопіювати посилання';

      Fancybox.close();
    }, 800);

    e.preventDefault();
  });

  // Share for Android/IOS
  document.addEventListener('click', function (e) {
    let shareLink = e.target.closest('[data-action="share"]');

    if (!shareLink) return;

    console.log('Share!');

    let text = document.querySelector('title').textContent;

    navigator.share({
      title: '',
      text,
      url: location.href
    });
  });

  $('.user-label--copy-partner-link').click(function(e) {
    let $copyLinkInput = $($(this).attr('href'));

    copyText($copyLinkInput[0]);

    console.log($copyLinkInput[0]);

    $(this).text('Посилання скопійовано!');

    setTimeout(() => {
      $(this).text('Скопіювати партнерське посилання');
    }, 2000);

    e.preventDefault();
  });

  $('.authorization-form__password-toggle').click(function(e) {    
    let $formText = $(this).parent().find('.form-text');
    $formText.get(0).type = $formText.get(0).type === 'password' ? 'text' : 'password';

    $(this).toggleClass('password-toggle--visible');
  });

	$('.tabs__list').each(function() {
    $(this).find('.tabs__item').each(function(i) {
      $(this).click(function(e) {
        e.preventDefault();

        $(this).find('.tabs-menu__link').addClass('tabs-menu__link--active');
        $(this).siblings().find('.tabs-menu__link').removeClass('tabs-menu__link--active');

        const parent = $(this).parents('.tabs');
        parent.find('.tabs__content').hide();
        parent.find('.tabs__content:eq(' + i + ')').show();
      });
    });
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

  $('.contact-phones--support .contact-phones__item').click(function(e) {
    let $phone = $(this).find('.phone');
    $phone.after(`<input type="text" class="contact-phones__phone-form-text" value="${$phone.text().replaceAll(' ', '')}" />`);

    let $tooltip = $(this).find('.contact-phones__tooltip');
    let $contactPhoneFormText = $phone.next('.contact-phones__phone-form-text');

    copyText($contactPhoneFormText[0]);
    $contactPhoneFormText.remove();

    $tooltip.addClass('tooltip--visible');
    setTimeout(() => {
      $tooltip.removeClass('tooltip--visible');
    }, 1500);

    e.preventDefault();
  });
});