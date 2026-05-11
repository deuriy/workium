import $ from "jquery";
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import PerfectScrollbar from 'perfect-scrollbar';

function getUrlWithoutParameter(param) {
  const url = new URL(window.location.href);
  url.searchParams.delete(param);

  return url.toString();
}

// function copyText(input) {
//   input.select();
//   input.setSelectionRange(0, 99999);

//   document.execCommand("copy");
// }

async function copyText(input) {
  try {
    await navigator.clipboard.writeText(input.value);
    console.log('Текст скопирован');
  } catch (error) {
    console.error('Ошибка копирования:', error);
  }
}

function copyVacancyText() {
  let $vacancyCard = $('.vacancy-card--full');

  if (!$vacancyCard.length) return;

  const lang = document.documentElement.lang;
  const labels = {
    'uk': {
      'bonus': '💰Винагорода від WORKIUM (додатково до вашої зарплати):',
      'has_media': '🖼️🎬 Ця вакансія містить фото або відео. Переглянути їх можна тут:',
      'vacancy': '🌐 Ця вакансія на WORKIUM:'
    },
    'ru': {
      'bonus': '💰 Вознаграждение от WORKIUM (дополнительно к вашей зарплате):',
      'has_media': '🖼️🎬 Эта вакансия содержит фото или видео. Посмотреть их можно здесь:',
      'vacancy': '🌐 Эта вакансия на WORKIUM:'
    },
    'en': {
      'bonus': '💰 Bonus from WORKIUM (in addition to your salary):',
      'has_media': '🖼️🎬 This vacancy contains photos or videos. You can view them here:',
      'vacancy': '🌐 This vacancy on WORKIUM:'
    }
  };

  let vacancyTitle = $vacancyCard.find('.vacancy-card__title--main').text().trim();
  let vacancyCategory = $vacancyCard.find('.vacancy-card__category').text().trim();
  let companyTitle = $vacancyCard.find('.vacancy-card__company-title').text().trim();
  let vacancyText = $vacancyCard.find('.vacancy-card__text').text().trim();
  let vacancyCode = $vacancyCard.find('.vacancy-card__code').text().trim();
  let salaryTooltip = $vacancyCard.find('.salary-with-info__icon .tooltip__text p:first-child').text().trim();
  let $agencyGallery = $vacancyCard.find('.vacancy-card__agency-gallery');
  let hasMediaText = $agencyGallery.length ? labels[lang].has_media + ' ' + getUrlWithoutParameter('i') + '#agency-gallery' + '\r\n\r\n' : '';

  $vacancyCard.after(`<textarea class="vacancy-card__textarea">${vacancyTitle + ' (' + vacancyCategory + ' ' + companyTitle + ')\r\n\r\n' + vacancyText + '\r\n\r\n' + labels[lang].bonus + '\r\n\r\n' + salaryTooltip + '\r\n\r\n' + hasMediaText + vacancyCode + '\r\n\r\n' + labels[lang].vacancy + ' ' + getUrlWithoutParameter('i')}</textarea>`);

  let $vacancyCardTextarea = $('.vacancy-card__textarea');

  copyText($vacancyCardTextarea[0]);
  $vacancyCardTextarea.remove();
}

// function toggleMoreLink($link) {
//   let linkText = $link.text() === 'Приховати' ? 'Детальніше' : 'Приховати';
//   $link.text(linkText);

//   $link.toggleClass('toggle-link--expanded');
// }

$(() => {
  new Swiper('.vacancy-images-swiper__swiper', {
    modules: [Navigation],
    // loop: true,
    slidesPerView: 2,
    // centeredSlides: true,
    spaceBetween: 8,

    navigation: {
      nextEl: '.vacancy-images-swiper__next',
      prevEl: '.vacancy-images-swiper__prev',
      disabledClass: 'swiper-btn--disabled'
    },

    breakpoints: {
      768: {
        slidesPerView: 3,
        spaceBetween: 16,
        centeredSlides: false
      },
    }
  });

  if ($(window).width() < 768) {
    let slidesCount = $('.promo-blocks-swiper .swiper-slide').length;

    const promoBlocksSwiper = new Swiper('.promo-blocks-swiper', {
      modules: [Pagination],
      // loop: true,
      slidesPerView: 'auto',
      centeredSlides: slidesCount < 2,
      spaceBetween: 8,

      pagination: {
        el: '.promo-blocks-swiper__pagination',
        bulletActiveClass: 'swiper-pagination-bullet--active',
        // clickable: true
      },

      on: {
        slideChange: function () {
          // Снимаем checked со всех радио кнопок в данном слайдере
          const allCheckboxes = this.el.querySelectorAll('.checkbox__input');
          allCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
          });

          // Устанавливаем checked для радио кнопки в активном слайде
          const activeSlide = this.slides[this.activeIndex];
          const activeCheckbox = activeSlide.querySelector('.checkbox__input');

          if (activeCheckbox) {
            activeCheckbox.checked = true;
            // Триггерим событие change для обновления связанной логики
            activeCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      }
    });

    if (promoBlocksSwiper.slides.length > 1) {
      let activePromoBlock = promoBlocksSwiper.el.querySelector('.promo-block--active');
      let promoBlockIndex = $(activePromoBlock).closest('.swiper-slide').index();

      promoBlocksSwiper.slideTo(promoBlockIndex, 0);
    }

    if (promoBlocksSwiper.slides.length === 1) {
      $(promoBlocksSwiper.pagination.el).hide();
    }
  }

  // $('.infoblock__more-link').click(function (e) {
  //   $(this).closest('.infoblock').find('.infoblock__text').toggleClass('infoblock__text--truncated');

  //   toggleMoreLink($(this));
  //   e.preventDefault();
  // });

  // $('.btn-grey--bookmark').click(function (e) {
  //   e.preventDefault();

  //   $(this).toggleClass('btn-grey--bookmark-fill');
  // });

  // $('.vacancy-info__bookmark-icon').click(function (event) {
  //   $('.vacancy-footer__bookmark-btn').toggleClass('btn-grey--bookmark-fill');
  // });

  // $('.vacancy-footer__bookmark-btn').click(function (event) {
  //   $('.vacancy-info__bookmark-icon').toggleClass('bookmark-icon--fill');
  // });

  // $(document).on('click', '.vacancy-card__copy-btn', function(event) {
  //   copyVacancyText(this.hasAttribute('data-multi-vacancy'));

  //   let defaultText = $(this).text();

  //   $(this).addClass('btn-white--copied');
  //   $(this).text('Текст скопійовано!');

  //   setTimeout(() => {
  //     $(this).removeClass('btn-white--copied');
  //     $(this).text(defaultText);
  //   }, 2000);

  //   event.preventDefault();
  // });

  $(document).on('click', '.vacancy-card__copy-btn, .vacancy-buttons__copy-btn', function (event) {
    copyVacancyText();

    let $tooltip = $(this).find('.btn-grey__tooltip');

    $tooltip.addClass('tooltip--visible');
    $(this).addClass('btn-grey--copied');

    setTimeout(() => {
      $tooltip.removeClass('tooltip--visible');
      $(this).removeClass('btn-grey--copied');
    }, 2000);

    event.preventDefault();
  });

  // $('.fancybox-popup__show-contacts-btn').click(function(e) {
  //   console.log('mowmefmw');

  //   let $fancyboxPopup = $(this).closest('.fancybox-popup');

  //   $(this).slideUp();
  //   $fancyboxPopup.find('.fancybox-popup__contact-box').slideDown();
  // });

  $(document).on('click', '.agency-gallery__more-item-link', function (event) {
    event.preventDefault();

    let $agencyGalleryRoot = $(this).closest('.agency-gallery__list-wrapper').parent();
    $agencyGalleryRoot.addClass('agency-gallery--full');
    $agencyGalleryRoot.find('.agency-gallery__hide-link-wrapper').show();
    $(this).hide();
  });

  $(document).on('click', '.agency-gallery__hide-link', function (event) {
    event.preventDefault();

    let $agencyGalleryRoot = $(this).closest('.agency-gallery__list-wrapper').parent();
    $agencyGalleryRoot.removeClass('agency-gallery--full');
    $agencyGalleryRoot.find('.agency-gallery__more-item-link').show();
    $(this).parent().hide();
  });

  document.addEventListener('click', function (e) {
    const agencyGalleryToggleLink = e.target.closest('.agency-gallery__toggle-link');

    if (!agencyGalleryToggleLink) return;

    const agencyGallery = agencyGalleryToggleLink.closest('.agency-gallery');

    if (!agencyGallery) return;

    agencyGalleryToggleLink.classList.toggle('arrow-link--opened');

    if (!agencyGallery.classList.contains('agency-gallery--full')) {
      agencyGallery.classList.add('agency-gallery--full');
      agencyGalleryToggleLink.textContent = window.translations.show_less;
    } else {
      agencyGallery.classList.remove('agency-gallery--full');
      agencyGalleryToggleLink.textContent = window.translations.show_more + ' (' + agencyGalleryToggleLink.dataset.moreCount + ')';
    }

    e.preventDefault();
  });

  function getLineCount(element) {
    const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
    const elementHeight = element.clientHeight;

    return Math.round(elementHeight / lineHeight);
  }

  document.addEventListener('ratingPopupLoaded', function (event) {
    const ratingPopup = document.querySelector(event.detail.popupId);
    
    ratingPopup.querySelectorAll('.review__positive > p, .review__negative > p').forEach(p => {
      if (getLineCount(p) <= 7) return;

      p.parentNode.classList.add('truncated-text');
    });
  });
  
  document.addEventListener('click', function (e) {
    const reviewToggleLink = e.target.closest('.review__toggle-link');

    if (!reviewToggleLink) return;

    const reviewText = reviewToggleLink.parentNode.parentNode;

    if (!reviewText) return;

    reviewToggleLink.classList.toggle('arrow-link--opened');

    if (!reviewText.classList.contains('full-text')) {
      reviewText.classList.add('full-text');
      reviewToggleLink.textContent = window.translations.show_less;

    } else {
      reviewText.classList.remove('full-text');
      reviewToggleLink.textContent = window.translations.read_more;
    }

    e.preventDefault();
  });

  if ($(window).width() < 768) {
    document.querySelectorAll('.employment-variants-swiper:not(.swiper-initialized)').forEach(item => {
      let slidesCount = $(item).find('.swiper-slide').length;

      const promoBlocksSwiper = new Swiper(item, {
        modules: [Pagination],
        // loop: true,
        slidesPerView: 'auto',
        centeredSlides: slidesCount < 2,
        spaceBetween: 15,
        slideActiveClass: 'employment-variants-swiper__slide--active',

        pagination: {
          el: '.employment-variants-swiper__pagination',
          bulletActiveClass: 'swiper-pagination-bullet--active',
          // clickable: true
        },
      });

      if (promoBlocksSwiper.slides.length === 1) {
        $(promoBlocksSwiper.pagination.el).hide();
      }
    });
  }

  const vacancyButtonsPanel = document.querySelectorAll('.vacancy-buttons-panel');
  for (const panel of vacancyButtonsPanel) {
    if (panel.offsetHeight <= 80) continue;

    const bookmark = panel.querySelector('[data-bookmark]');

    if (!bookmark) continue;

    bookmark.classList.remove('bookmark-icon--with-label');
    bookmark.textContent = '';
  }

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-back-btn]');
    if (!btn) return;

    const hasReferrerFromSameOrigin =
      document.referrer &&
      new URL(document.referrer).origin === window.location.origin;

    if (hasReferrerFromSameOrigin) {
      e.preventDefault();
      window.history.back();
    }
  });

  let psInstances = new Map(); // хранит {element -> psInstance}
  const media = window.matchMedia('(min-width: 1024px)');
  const containers = Array.from(document.querySelectorAll('.rating-popup__reviews'));

  function enableScroll(el) {
    if (!psInstances.has(el)) {
      psInstances.set(el, new PerfectScrollbar(el));
    }
  }

  function disableScroll(el) {
    const instance = psInstances.get(el);
    if (instance) {
      instance.destroy();
      psInstances.delete(el);
    }
  }

  function handleMedia(e) {
    if (e.matches) {
      // >= 1024px → включаем все scrollbars
      containers.forEach(enableScroll);
    } else {
      // < 1024px → выключаем все
      containers.forEach(disableScroll);
    }
  }

  media.addEventListener('change', handleMedia);
  handleMedia(media);


  const updateMobileHeaderState = (popup) => {
    if (!popup) return;

    const mobileHeader   = popup.querySelector('.popup-mobile-header');
    if (!mobileHeader) return;

    const titleEl        = mobileHeader.querySelector('.popup-mobile-header__title');
    const companyInfoEl  = mobileHeader.querySelector('.company-info--popup-mobile-header');
    const ratingDropdownCriteriaHeader  = mobileHeader.querySelector('.rating-popup__dropdown-criteria-header');

    if (!titleEl || !companyInfoEl) return;

    const scrolled = popup.scrollTop;

    if (scrolled >= 100) {
      // показываем компанию, прячем заголовок
      titleEl.classList.add('hidden');
      companyInfoEl.classList.remove('hidden');
    } else {
      // показываем заголовок, прячем компанию
      titleEl.classList.remove('hidden');
      companyInfoEl.classList.add('hidden');

      if (ratingDropdownCriteriaHeader) {
        ratingDropdownCriteriaHeader.classList.remove('dropdown-block--visible');
      }
    }
  };

  // Делегирование: один обработчик на документ, ловим скроллы всех .rating-popup
  document.addEventListener(
    'scroll',
    function (e) {
      const target = e.target;

      // Нас интересуют только элементы с классом rating-popup
      if (!target.classList || !target.classList.contains('rating-popup')) return;

      updateMobileHeaderState(target);
    },
    true // захват, чтобы событие точно словилось
  );

  // Инициализация состояния при загрузке
  document.querySelectorAll('.rating-popup').forEach(updateMobileHeaderState);

});