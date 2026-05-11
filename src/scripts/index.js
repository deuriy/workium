import $ from "jquery";
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import PerfectScrollbar from 'perfect-scrollbar';

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

$(() => {
  new Swiper('.people-swiper', {
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
        loop: true,
        slidesPerView: 3,
        spaceBetween: 16,
        centeredSlides: false
      },
      1024: {
        loop: true,
        slidesPerView: 4,
        spaceBetween: 32,
        centeredSlides: false,
      }
    },

    on: {
      init: function (swiper) {
        swiper.slideToLoop(0, 0, false);
      },
      resize(swiper) {
        swiper.slideToLoop(0, 0, false);
      }
    },
  });

  new Swiper('.testimonials-swiper', {
    modules: [Navigation],
    loop: true,
    slidesPerView: 'auto',
    // centeredSlides: true,
    spaceBetween: 8,

    navigation: {
      nextEl: '.testimonials-swiper-container__next',
      prevEl: '.testimonials-swiper-container__prev',
      disabledClass: 'swiper-btn--disabled'
    },

    breakpoints: {
      768: {
        slidesPerView: 3,
        spaceBetween: 16,
        centeredSlides: false,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 32,
        centeredSlides: false,
      }
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


  $('.sms-confirmation__code, .sms-confirmation__number').click(function (e) {
    let $copyValueInput = $($(this).attr('href'));

    if (!$copyValueInput[0]) return;

    copyText($copyValueInput[0]);

    let $copySMSCode = $(this).parent();
    let $tooltip = $copySMSCode.find('.tooltip');

    $tooltip.addClass('tooltip--visible');

    setTimeout(() => {
      $tooltip.removeClass('tooltip--visible');
    }, 2000);

    e.preventDefault();
  });

});