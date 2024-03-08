import $ from "jquery";
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

function copyText(input) {
  input.select();
  input.setSelectionRange(0, 99999);

  document.execCommand("copy");
}

function copyVacancyText (isMultiVacancy = true) {
  let $vacancyTextWrapper = $('.vacancy-card__text-wrapper');
  let vacancyTitle = $vacancyTextWrapper.find('.vacancy-card__title').text().trim();
  let vacancyText = $vacancyTextWrapper.find('.vacancy-card__text').text().trim();
  let vacancyBefore = "";

  if (!$vacancyTextWrapper.length) return;

  if (!isMultiVacancy) {
    let vacancyCategory = $('.vacancy-info__top .vacancy-info__category').text().trim();
    let companyName = $('.vacancy-info__top .vacancy-info__company-name').text().trim();

    vacancyBefore = vacancyCategory + ' ' + companyName + '\r\n';
  }

  $vacancyTextWrapper.after(`<textarea class="vacancy-card__textarea">${vacancyBefore + vacancyTitle + '\r\n' + vacancyText}</textarea>`);

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

  $(document).on('click', '.vacancy-card__copy-btn', function(event) {
    copyVacancyText(this.hasAttribute('data-multi-vacancy'));

    let defaultText = $(this).text();

    $(this).addClass('btn-white--copied');
    $(this).text('Текст скопійовано!');

    setTimeout(() => {
      $(this).removeClass('btn-white--copied');
      $(this).text(defaultText);
    }, 2000);

    event.preventDefault();
  });

  $(document).on('click', '.vacancy-footer__copy-btn', function(event) {
    copyVacancyText(this.hasAttribute('data-multi-vacancy'));

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
    $agencyGalleryTab.find('.agency-gallery__hide-link').show();
    $(this).hide();
  });

  $(document).on('click', '.agency-gallery__hide-link', function(event) {
    event.preventDefault();

    let $agencyGalleryTab = $(this).closest('.agency-gallery__tabs-content');
    $agencyGalleryTab.removeClass('agency-gallery--full');
    $agencyGalleryTab.find('.agency-gallery__more-item-link').show();
    $(this).hide();
  });

});