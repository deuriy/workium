import $ from "jquery";
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

function getUrlWithoutParameter(param) {
  const url = new URL(window.location.href);
  url.searchParams.delete(param);

  return url.toString();
}

function copyText(input) {
  input.select();
  input.setSelectionRange(0, 99999);

  document.execCommand("copy");
}

function copyVacancyText () {
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

function toggleMoreLink ($link) {
  let linkText = $link.text() === 'Приховати' ? 'Детальніше' : 'Приховати';
  $link.text(linkText);

  $link.toggleClass('toggle-link--expanded');
}

$(() => {
  const vacancyImagesSwiper = new Swiper('.vacancy-images-swiper__swiper', {
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

  $('.infoblock__more-link').click(function(e) {
    $(this).closest('.infoblock').find('.infoblock__text').toggleClass('infoblock__text--truncated');

    toggleMoreLink($(this));
    e.preventDefault();
  });

  $('.btn-grey--bookmark').click(function(e) {
    e.preventDefault();

    $(this).toggleClass('btn-grey--bookmark-fill');
  });

  $('.vacancy-info__bookmark-icon').click(function(event) {
    $('.vacancy-footer__bookmark-btn').toggleClass('btn-grey--bookmark-fill');
  });

  $('.vacancy-footer__bookmark-btn').click(function(event) {
    $('.vacancy-info__bookmark-icon').toggleClass('bookmark-icon--fill');
  });

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

  $(document).on('click', '.vacancy-card__copy-btn, .vacancy-buttons__copy-btn', function(event) {
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

  $(document).on('click', '.agency-gallery__more-item-link', function(event) {
    event.preventDefault();

    let $agencyGalleryTab = $(this).closest('.agency-gallery__tabs-content');
    $agencyGalleryTab.addClass('agency-gallery--full');
    $agencyGalleryTab.find('.agency-gallery__hide-link-wrapper').show();
    $(this).hide();
  });

  $(document).on('click', '.agency-gallery__hide-link', function(event) {
    event.preventDefault();

    let $agencyGalleryTab = $(this).closest('.agency-gallery__tabs-content');
    $agencyGalleryTab.removeClass('agency-gallery--full');
    $agencyGalleryTab.find('.agency-gallery__more-item-link').show();
    $(this).parent().hide();
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

});