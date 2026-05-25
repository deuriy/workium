import $ from "jquery";
import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.esm.js";
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';
import PerfectScrollbar from 'perfect-scrollbar';

import { initVacanciesFilter } from "./vacancies-filter";
import { FancyboxIOSScrollLock } from "./fancybox-ios-scrolllock";

async function copyText(input) {
  try {
    await navigator.clipboard.writeText(input.value);
    console.log('Текст скопирован');
  } catch (error) {
    console.error('Ошибка копирования:', error);
  }
}

function copyVacancyText(isMultiVacancy = true) {
  let $vacancyTextWrapper = $('.vacancy-card__text-wrapper');
  let vacancyTitle = $vacancyTextWrapper.find('.vacancy-card__title').text().trim();
  let vacancyText = $vacancyTextWrapper.find('.vacancy-card__text').text().trim();
  let vacancyBefore = "";

  if (!$vacancyTextWrapper.length) return;

  if (!isMultiVacancy) {
    let vacancyCategory = $('.vacancy-card__category').text().trim();
    let companyName = $('.vacancy-card__company-name').text().trim();

    vacancyBefore = vacancyCategory + ' ' + companyName + '\r\n';
  }

  $vacancyTextWrapper.after(`<textarea class="vacancy-card__textarea">${vacancyBefore + vacancyTitle + '\r\n' + vacancyText}</textarea>`);

  let $vacancyCardTextarea = $('.vacancy-card__textarea');

  copyText($vacancyCardTextarea[0]);
  $vacancyCardTextarea.remove();
}

document.addEventListener('DOMContentLoaded', function () {
  const filterController = initVacanciesFilter();

  let fancyboxOpts = {
    dragToClose: false,
    mainClass: 'fancybox--additional-filters-popup',

    tpl: {
      closeButton: '<button data-fancybox-close class="fancybox-close-button hidden-xxs" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path stroke="#A1A7B3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M1 17 17 1M1 1l16 16"></path></svg></button>'
    },

    on: {
      ready: () => {
        filterController?.resetUiPlugins?.();
        FancyboxIOSScrollLock.lock();
      },

      // reveal: (fancybox, slide) => {
      //   if (slide.src === '#cities-popup') {
      //     $(slide.contentEl).find('.cities-filter__search-input').focus();
      //   }
      // },

      // close: (fancybox, event) => {
      //   filterController?.resetUiPlugins?.();

      //   // undoChangesToAdditionalFilters();
      // },

      destroy: () => {
        filterController?.resetUiPlugins?.();
        FancyboxIOSScrollLock.unlock();
      }
    }
  };

  Fancybox.bind(".additional-filters-popup-link", fancyboxOpts);

  Fancybox.bind(".rating-popup-link", {
    dragToClose: false,
    mainClass: 'fancybox--rating-popup',

    tpl: {
      closeButton: '<button data-fancybox-close class="fancybox-close-button hidden-xxs" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path stroke="#A1A7B3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M1 17 17 1M1 1l16 16"></path></svg></button>'
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


  if (window.location.href.includes('open-popup')) {
    Fancybox.show(
      [
        {
          src: "#additional-filters-popup"
        }
      ],
      fancyboxOpts
    );
  }

  if ($(window).width() < 768) {
    document.querySelectorAll('.promo-blocks-swiper:not(.swiper-initialized)').forEach(item => {
      let slidesCount = $(item).find('.swiper-slide').length;

      const promoBlocksSwiper = new Swiper(item, {
        modules: [Pagination],
        slidesPerView: 'auto',
        centeredSlides: slidesCount < 2,
        spaceBetween: 15,
        slideActiveClass: 'promo-blocks-swiper__slide--active',

        pagination: {
          el: '.promo-blocks-swiper__pagination',
          bulletActiveClass: 'swiper-pagination-bullet--active',
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

      if (promoBlocksSwiper.slides.length === 1) {
        $(promoBlocksSwiper.pagination.el).hide();
      }
    });
  }

  let $wrapper = $('.wrapper');
  let $btnFilter = $('.btn-filter');
  let $scrollTopBtn = $('.btn-scroll-top');

  $wrapper.on('scroll', function (event) {
    let scrolled = $wrapper.scrollTop();

    if (scrolled > 170) {
      $btnFilter.removeClass('btn-filter--invisible');
    } else {
      $btnFilter.addClass('btn-filter--invisible');
    }
  });

  $wrapper.on('scroll', function (event) {
    let scrolled = $wrapper.scrollTop();

    if (scrolled > 170) {
      $scrollTopBtn.removeClass('btn-scroll-top--invisible');
    } else {
      $scrollTopBtn.addClass('btn-scroll-top--invisible');
    }
  });

  $(window).on('scroll', function () {
    let scrolled = $(window).scrollTop();

    if (scrolled > 170) {
      $scrollTopBtn.removeClass('btn-scroll-top--invisible');
    } else {
      $scrollTopBtn.addClass('btn-scroll-top--invisible');
    }
  });

  document.addEventListener('click', function(event) {
    if (event.target.closest('[data-scroll-top]')) {
      const wrapper = document.querySelector('.wrapper');
      
      wrapper.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  });

  // $('[data-scroll-top]').on('click', function (event) {
  //   $wrapper.animate({
  //     scrollTop: 0
  //   }, 0);

  //   $('html, body').animate({
  //     scrollTop: 0
  //   }, 0);
  // });


  $(document).on('click', '.vacancy-card__copy-btn', function (event) {
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

  // $(document).on('click', '.vacancy-card__copy-btn-mobile', function (event) {
  //   copyVacancyText(this.hasAttribute('data-multi-vacancy'));

  //   let $tooltip = $(this).find('.btn-grey__tooltip');

  //   $tooltip.addClass('tooltip--visible');
  //   $(this).addClass('btn-grey--copied');

  //   setTimeout(() => {
  //     $tooltip.removeClass('tooltip--visible');
  //     $(this).removeClass('btn-grey--copied');
  //   }, 2000);

  //   event.preventDefault();
  // });

  document.addEventListener('click', function (e) {
    const moreLink = e.target.closest('.vacancy-card__more-link');

    if (!moreLink) return;

    const vacancyCardTeaser = moreLink.closest('.vacancy-card--teaser');
    // const wrapper = document.querySelector('.wrapper');
    // const mobileHeaderHeight = document.querySelector('.mobile-header').offsetHeight;
    // const iconMenuHeight = document.querySelector('.icon-menu').offsetHeight;

    vacancyCardTeaser.classList.toggle('vacancy-card--teaser-expanded');
    moreLink.classList.toggle('link--vacancy-card-more-expanded');

    if (moreLink.classList.contains('link--vacancy-card-more-expanded')) {
      moreLink.textContent = 'Приховати';
      // wrapper.scrollTo({ top: vacancyCardTeaser.offsetTop + iconMenuHeight, behavior: "smooth" });
    } else {
      moreLink.textContent = 'Детальніше';
      // wrapper.scrollTo({ top: vacancyCardTeaser.offsetTop - mobileHeaderHeight, behavior: "smooth" });
    }

  });

  $('.banner__more-link').click(function (event) {
    $(this).closest('.banner__title').next('.banner__text').toggleClass('hidden-xs');
    $(this).hide();

    event.preventDefault();
  });

  function changePromoBtns(vacancyCard, promoBlock) {
    if (!vacancyCard || !promoBlock) return;

    let rewardRange = promoBlock.dataset.rewardRange;
    let promoBlockLink = promoBlock.querySelector('.promo-block__link').href;
    let bookBtns = vacancyCard.querySelectorAll('.promo-blocks__btn--book');
    let consultBtns = vacancyCard.querySelectorAll('.promo-blocks__btn--consult');
    let shareBtns = vacancyCard.querySelectorAll('.promo-blocks__btn--share-and-get');

    if (!bookBtns.length && !consultBtns.length && !shareBtns.length) return;

    bookBtns.forEach(btn => {
      const bookText = btn.dataset.bookText;
      btn.innerHTML = `${bookText} ${rewardRange}`;
    });

    shareBtns.forEach(btn => {
      btn.dataset.promoBlockLink = promoBlockLink;
      btn.dataset.rewardRange = rewardRange;
    });
  }

  document.addEventListener('change', function (e) {
    let checkboxInput = e.target.closest('.promo-block .checkbox__input');

    if (!checkboxInput) return;

    let promoBlock = checkboxInput.closest('.promo-block');

    if (!promoBlock) return;

    let vacancyCard = promoBlock.closest('.vacancy-card');

    if (!vacancyCard) return;

    changePromoBtns(vacancyCard, promoBlock);
  });

  document.addEventListener("change", function (e) {
    const radio = e.target;
    if (radio.type !== "radio") return;

    const syncGroup = radio.dataset.sync;
    if (!syncGroup) return;

    const value = radio.value;

    // Находим radio из других групп с тем же значением
    const synced = document.querySelectorAll(
      `input[type="radio"][data-sync="${syncGroup}"][value="${value}"]`
    );

    synced.forEach(r => r.checked = true);
  });


  const updateMobileHeaderState = (popup) => {
    if (!popup) return;

    const mobileHeader = popup.querySelector('.popup-mobile-header');
    if (!mobileHeader) return;

    const titleEl = mobileHeader.querySelector('.popup-mobile-header__title');
    const companyInfoEl = mobileHeader.querySelector('.company-info--popup-mobile-header');
    const ratingDropdownCriteriaHeader = mobileHeader.querySelector('.rating-popup__dropdown-criteria-header');

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
  document.addEventListener('scroll', function (e) {
      const target = e.target;

      // Нас интересуют только элементы с классом rating-popup
      if (!target.classList || !target.classList.contains('rating-popup')) return;

      updateMobileHeaderState(target);
    },
    true // захват, чтобы событие точно словилось
  );

  // Инициализация состояния при загрузке
  document.querySelectorAll('.rating-popup').forEach(updateMobileHeaderState);

  $(document).on('click', '.agency-gallery__more-item-link', function (event) {
    event.preventDefault();

    let $agencyGalleryTab = $(this).closest('.agency-gallery__tabs-content');
    $agencyGalleryTab.addClass('agency-gallery--full');
    $agencyGalleryTab.find('.agency-gallery__hide-link-wrapper').show();
    $(this).hide();
  });

  $(document).on('click', '.agency-gallery__hide-link', function (event) {
    event.preventDefault();

    let $agencyGalleryTab = $(this).closest('.agency-gallery__tabs-content');
    $agencyGalleryTab.removeClass('agency-gallery--full');
    $agencyGalleryTab.find('.agency-gallery__more-item-link').show();
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

});