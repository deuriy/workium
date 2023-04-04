import $ from "jquery";
import Swiper, { Navigation } from 'swiper';
import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.esm.js";

$(function () {
  Fancybox.bind("[data-fancybox]");

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