import $ from "jquery";
import Swiper from 'swiper';
import select2 from 'select2';
import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.esm.js";
import PerfectScrollbar from 'perfect-scrollbar';

$(() => {
  select2($);

	const walletsSwiper = new Swiper('.wallets-swiper', {
    slidesPerView: 'auto',
    spaceBetween: 23,
  });

  if (walletsSwiper.slides.length > 1) {
    let activeWallet = walletsSwiper.el.querySelector('.wallet--active');
    let walletSlideIndex = $(activeWallet).closest('.swiper-slide').index();

    walletsSwiper.slideTo(walletSlideIndex, 0);
  }

  Fancybox.bind(".payment-systems-popup-link", {
    dragToClose: false,
    mainClass: 'fancybox--payment-systems-popup',
  });

  $('.dropdown-select').select2({
    dropdownCssClass: ':all:',
    selectionCssClass: ':all:',
    theme: 'dropdown-select',
    dropdownAutoWidth: true,
    minimumResultsForSearch: -1
  });

  let banksListPopup = document.querySelector('.banks-list--popup');
  if (banksListPopup) {
    const banksListPS = new PerfectScrollbar(banksListPopup, {
      wheelSpeed: 2,
      wheelPropagation: true,
      minScrollbarLength: 20
    });
  }

  document.addEventListener('click', function (e) {
    let bank = e.target.closest('.bank');

    if (!bank) return;

    let bankName = bank.querySelector('.bank__name');
    let bankCurrency = bank.querySelector('.bank__currency');
    let bankIconSvg = bank.querySelector('.bank__icon svg').cloneNode(true);
    bankIconSvg.classList.add('payment-systems-popup-link__icon');

    let activeWithdrawalTab = document.querySelector('.withdrawal-funds__content .tabs__content[style="display: block;"]');

    if (!activeWithdrawalTab) return;
    
    let paymentSystemsPopupLinkName = activeWithdrawalTab.querySelector('.payment-systems-popup-link__name');
    let paymentSystemsPopupLinkCurrency = activeWithdrawalTab.querySelector('.payment-systems-popup-link__currency');
    let paymentSystemsPopupLinkIcon = activeWithdrawalTab.querySelector('.payment-systems-popup-link__icon-wrapper svg');

    paymentSystemsPopupLinkName.textContent = bankName.textContent;
    paymentSystemsPopupLinkCurrency.textContent = bankCurrency.textContent;
    paymentSystemsPopupLinkIcon.replaceWith(bankIconSvg);

    Fancybox.close();
  });
});

$(window).on('load', function () {
  $('.operations-page__withdrawal-funds').show();
  $('.operations-page__preloader-wrapper').hide();
});