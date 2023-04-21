import $ from "jquery";
import Swiper, { Navigation } from 'swiper';
import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.esm.js";

$(function () {
  const peopleSwiper = new Swiper('.people-swiper', {
    modules: [Navigation],
    loop: true,
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 8,

    navigation: {
      nextEl: '.people-swiper-container__next',
      prevEl: '.people-swiper-container__prev',
    },

    breakpoints: {
      768: {
        slidesPerView: 3,
        spaceBetween: 16,
        centeredSlides: false
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 32,
        centeredSlides: false,
      }
    }
  });

  const testimonialsSwiper = new Swiper('.testimonials-swiper', {
    loop: true,
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 8,

    breakpoints: {
      768: {
        loop: false
      },
    }
  });

});