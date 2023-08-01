import $ from "jquery";
import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.esm.js";
import "../../node_modules/jquery-circle-progress/dist/circle-progress.min.js";

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

function getCoords(elem) {
  let box = elem.getBoundingClientRect();

  return {
    top: box.top + window.pageYOffset,
    right: box.right + window.pageXOffset,
    bottom: box.bottom + window.pageYOffset,
    left: box.left + window.pageXOffset
  };
}

$(() => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  let currentFancybox = null;

	Fancybox.bind("[data-fancybox]");
	
	Fancybox.bind(".fancybox-popup-toggle", {
	  dragToClose: false,
	  mainClass: 'fancybox--popup',

    on: {
      reveal: (fancybox, slide) => {
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

  Fancybox.bind(".additional-filters-popup-link", {
    dragToClose: false,
    mainClass: 'fancybox--additional-filters-popup',

    tpl: {
      closeButton: '<button data-fancybox-close class="fancybox-close-button hidden-xxs" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path stroke="#A1A7B3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M1 17 17 1M1 1l16 16"></path></svg></button>'
    }
  });

  // Select menu
  $('.select-menu').click(function(e) {
    $(this).toggleClass('select-menu--opened');
  });

  $(document).click(function(e) {
    let $selectMenuSelected = e.target.closest('.select-menu__selected');
    let $selectMenuDropdown = e.target.closest('.select-menu__dropdown');

    if (!$selectMenuSelected && !$selectMenuDropdown) {
      $('.select-menu--opened').removeClass('select-menu--opened');
    }
  });

  // Article menu
  // $('.article-menu__link').click(function(e) {
  //   let $articleMenu = $(this).closest('.article-menu');
  //   let $activeLink = $articleMenu.find('.article-menu__link--active');

  //   if ($activeLink != $(this)) {
  //     $activeLink.removeClass('article-menu__link--active');
  //     $(this).addClass('article-menu__link--active');
  //   }

  //   // e.preventDefault();
  // });

  let options = {
    // rootMargin: '0px',
    threshold: 0.25
  };

  const handleIntersection = function(entries, observer) {
    /* Content excerpted, show below */
    // console.log(entries);

    entries.map((entry) => {
      console.log(entry.target.id, entry.intersectionRatio);
      // console.log();

      if (entry.isIntersecting) {
       // console.log('Yes');
       // console.log(entry);
       // console.log(entry.target.id);

       let headingID = entry.target.id;

       if (headingID !== '') {
         let $targetLink = $(`.article-menu__link[href^="#${headingID}"]`);

         // $targetLink[0].scrollIntoView();

         $targetLink.addClass('article-menu__link--active').parent().siblings('.article-menu__item').find('.article-menu__link--active').removeClass('article-menu__link--active');
       }

       // $(`.table-contents__link[href^="${}"]`)
      }
    });
  };

  const headingObserver = new IntersectionObserver(handleIntersection, options);

  let articleHeadings = document.querySelectorAll('.affiliate-page__content > h2');
  articleHeadings.forEach(block => headingObserver.observe(block));


  $('.user-profile-popup-link').click(function(e) {
    let fancyboxSlide = Fancybox.getSlide();

    if (fancyboxSlide) {
      if ($(this).attr('href') === fancyboxSlide.src) {
        setTimeout(() => {
          Fancybox.close();
        }, 0);
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
  $(document).on('click', '[data-dropdown-block-trigger]', function(e) {
    let blockID = $(this).attr('href').substring(1);
    let $currentVisibleDropdownBlock = $(`.dropdown-block--visible:not([id="${blockID}"])`);    
    let $dropdownBlock = $($(this).attr('href'));

    if ($currentVisibleDropdownBlock.length) {
      $currentVisibleDropdownBlock.removeClass('dropdown-block--visible');
    }

    if ($dropdownBlock.hasClass('dropdown-block--submenu-right-bottom')) {
      let coords = $(this)[0].getBoundingClientRect();

      $dropdownBlock.css({
        right: `-${coords.right + 20}px`,
        top: `${coords.top - $dropdownBlock.outerHeight() + coords.height}px`
      });
    } else if ($dropdownBlock.hasClass('dropdown-block--bottom')) {
      // let coords = getCoords($(this)[0]);
      // let coords = $(this)[0].getBoundingClientRect();
      let coords = $dropdownBlock.hasClass('dropdown-block--bottom-fixed') ? $(this)[0].getBoundingClientRect() : getCoords($(this)[0]);
      // console.log(coords);

      $dropdownBlock.css({
        left: `${coords.left}px`,
        top: `${coords.top + $(this).outerHeight(true) + 6}px`
      });
    } else if ($dropdownBlock.hasClass('dropdown-block--top')) {
      let coords = getCoords($(this)[0]);
      // console.log(coords);

      $dropdownBlock.css({
        left: `${coords.left}px`,
        top: `${coords.top - $dropdownBlock.outerHeight(true) - 6}px`
      });
    }
    
    $dropdownBlock.toggleClass('dropdown-block--visible');

    e.preventDefault();
  });

  $(document).click(function(e) {
    let $isDropdownBlock = $(e.target).closest('.dropdown-block--visible');
    // let $visibleDropdownBlock = $('.dropdown-block--visible');
    let $dropdownBlockTrigger = $(e.target).closest('[data-dropdown-block-trigger]');

    if (!$isDropdownBlock.length && !$dropdownBlockTrigger.length) {
      $('.dropdown-block--visible').removeClass('dropdown-block--visible');
    }
  });

  $('.contact-phones--support .contact-phones__item, .contact-phones--mobile-support .contact-phones__item').click(function(e) {
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

  $('.fb-group__copy-btn').click(function(e) {
    let $groupLink = $(this).prev('.fb-group__link');
    console.log($groupLink);
    $groupLink.after(`<input type="text" class="fb-group__url" value="${$groupLink.attr('href')}" />`);

    let $tooltip = $(this).next('.fb-group__tooltip');
    let $groupLinkURL = $groupLink.next('.fb-group__url');

    copyText($groupLinkURL[0]);
    $groupLinkURL.remove();

    $tooltip.addClass('tooltip--visible');
    setTimeout(() => {
      $tooltip.removeClass('tooltip--visible');
    }, 1500);
  });

  $('.selected-item__remove-link').click(function(e) {
    e.preventDefault();

    $(this).closest('.selected-item').remove();
  });

  $('.vacancy-card__address').click(function(e) {
    $(this).toggleClass('vacancy-card__address--truncated');

    e.preventDefault();
  });

  $('.circle-progressbar').circleProgress({
    startAngle: -1.55,
    value: 0.06,
    thickness: 2,
    size: 110,
    fill: {
      gradient: ["#ffc10d", "#ef881d"]
    },
    emptyFill: "#333742"
  });
});