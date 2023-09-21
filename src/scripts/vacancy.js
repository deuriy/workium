import $ from "jquery";
import Swiper, { Navigation, Pagination } from 'swiper';

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
      // 768: {
      //   slidesPerView: 3,
      //   spaceBetween: 16,
      //   centeredSlides: false
      // },
      // 1024: {
      //   slidesPerView: 4,
      //   spaceBetween: 32,
      //   centeredSlides: false,
      // }
    }
  });

  const promoBlocksSwiper = new Swiper('.promo-blocks-swiper', {
    modules: [Pagination],
    loop: true,
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 8,

    pagination: {
      el: '.promo-blocks-swiper__pagination',
      bulletActiveClass: 'swiper-pagination-bullet--active',
      // clickable: true
    },
  });

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

  // $('.fancybox-popup__show-contacts-btn').click(function(e) {
  //   console.log('mowmefmw');

  //   let $fancyboxPopup = $(this).closest('.fancybox-popup');

  //   $(this).slideUp();
  //   $fancyboxPopup.find('.fancybox-popup__contact-box').slideDown();
  // });

});