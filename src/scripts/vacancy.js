import $ from "jquery";
import Swiper, { Navigation, Pagination } from 'swiper';

$(function () {
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

});