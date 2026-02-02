import $ from "jquery";
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';
import PerfectScrollbar from 'perfect-scrollbar';

function changePromoBlockButtons(promoBlock, vacancyCard) {
  if (!promoBlock || !vacancyCard) return;

  let rewardRange = promoBlock.dataset.rewardRange;
  let vacancyStatus = promoBlock.dataset.vacancyStatus;
  let bookBtns = vacancyCard.querySelectorAll('.promo-blocks__btn--book');
  let consultBtns = vacancyCard.querySelectorAll('.promo-blocks__btn--consult');

  if (!bookBtns.length) return;

  if (vacancyStatus !== 'closed') {
    bookBtns.forEach(btn => {
      const bookText = btn.dataset.bookText;
      btn.innerHTML = `${bookText} ${rewardRange}`;
    });
    consultBtns.forEach(btn => {
      btn.classList.remove('hidden');
    });
  } else {
    bookBtns.forEach(btn => {
      btn.href = `#find-best-vacancy-popup`;
      btn.innerHTML = btn.dataset.similarVacancyText;
    });
    consultBtns.forEach(btn => {
      btn.classList.add('hidden');
    });
  }
}

document.addEventListener('bookmarksLoaded', function (event) {
  function getLineCount(element) {
    const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
    const elementHeight = element.clientHeight;

    return Math.round(elementHeight / lineHeight);
  }

  document.querySelectorAll('.vacancy-card__address--truncated').forEach(item => {
    if (getLineCount(item) <= 2) {
      item.classList.add('vacancy-card__address--no-arrow');
    }
  });

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

  const promoBlocksTooltips = document.querySelectorAll('.promo-block__additional-info .tooltip');
  for (const tooltip of promoBlocksTooltips) {
    tooltip.classList.remove('tooltip--extended-bottom');
  }

  if ($(window).width() < 768) {
    document.querySelectorAll('.promo-blocks-swiper:not(.swiper-initialized)').forEach(item => {
      let slidesCount = $(item).find('.swiper-slide').length;

      const promoBlocksSwiper = new Swiper(item, {
        modules: [Pagination],
        // loop: true,
        slidesPerView: 'auto',
        centeredSlides: slidesCount < 2,
        spaceBetween: 15,

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

      if (promoBlocksSwiper.slides.length === 1) {
        $(promoBlocksSwiper.pagination.el).hide();
      }
    });
  }

  document.addEventListener('change', function (e) {
    let checkboxInput = e.target.closest('.promo-block .checkbox__input');

    if (!checkboxInput) return;

    let promoBlock = checkboxInput.closest('.promo-block');

    if (!promoBlock) return;

    let vacancyCard = promoBlock.closest('.vacancy-card');

    if (!vacancyCard) return;

    changePromoBlockButtons(promoBlock, vacancyCard);
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
})