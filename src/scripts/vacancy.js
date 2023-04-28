import $ from "jquery";
import Swiper, { Navigation } from 'swiper';
// import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.esm.js";

$(function () {
  const vacancyImagesSwiper = new Swiper('.vacancy-images-swiper__swiper', {
    modules: [Navigation],
    // loop: true,
    slidesPerView: 5,
    // centeredSlides: true,
    spaceBetween: 8,

    navigation: {
      nextEl: '.vacancy-images-swiper__next',
      prevEl: '.vacancy-images-swiper__prev',
      disabledClass: 'swiper-btn--disabled'
    },

    // breakpoints: {
    //   768: {
    //     slidesPerView: 3,
    //     spaceBetween: 16,
    //     centeredSlides: false
    //   },
    //   1024: {
    //     slidesPerView: 4,
    //     spaceBetween: 32,
    //     centeredSlides: false,
    //   }
    // }
  });

});