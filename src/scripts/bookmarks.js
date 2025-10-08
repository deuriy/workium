import $ from "jquery";
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';

function changePromoBlockButtons(promoBlock, vacancyCard) {
  if (!promoBlock || !vacancyCard) return;

  let rewardRange = promoBlock.dataset.rewardRange;
  let vacancyStatus = promoBlock.dataset.vacancyStatus;
  let bookBtns = vacancyCard.querySelectorAll('.promo-blocks__btn--book');
  let consultBtns = vacancyCard.querySelectorAll('.promo-blocks__btn--consult');

  if (!bookBtns.length) return;

  if (vacancyStatus !== 'closed') {
    bookBtns.forEach(btn => {
      btn.innerHTML = `Забронювати <br class="hidden-smPlus">та отримати ${rewardRange}`;
    });
    consultBtns.forEach(btn => {
      btn.classList.remove('hidden');
    });
  } else {
    bookBtns.forEach(btn => {
      btn.href = `#find-best-vacancy-popup`;
      btn.innerHTML = `Підібрати схожу вакансію`;
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
    const wrapper = document.querySelector('.wrapper');
    const mobileHeaderHeight = document.querySelector('.mobile-header').offsetHeight;
    const iconMenuHeight = document.querySelector('.icon-menu').offsetHeight;

    vacancyCardTeaser.classList.toggle('vacancy-card--teaser-expanded');
    moreLink.classList.toggle('link--vacancy-card-more-expanded');

    if (moreLink.classList.contains('link--vacancy-card-more-expanded')) {
      moreLink.textContent = 'Приховати';
      wrapper.scrollTo({ top: vacancyCardTeaser.offsetTop + iconMenuHeight, behavior: "smooth" });
    } else {
      moreLink.textContent = 'Детальніше';
      wrapper.scrollTo({ top: vacancyCardTeaser.offsetTop - mobileHeaderHeight, behavior: "smooth" });
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
})