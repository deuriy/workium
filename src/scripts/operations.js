import $ from "jquery";
import Swiper from 'swiper';
import select2 from 'select2';
import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.esm.js";
import PerfectScrollbar from 'perfect-scrollbar';

$(() => {
  select2($);

	const walletsSwiper = new Swiper('.wallets-swiper', {
    // loop: true,
    slidesPerView: 'auto',
    // centeredSlides: true,
    spaceBetween: 23,
  });

  Fancybox.bind(".payment-systems-popup-link", {
    dragToClose: false,
    mainClass: 'fancybox--payment-systems-popup',

    // on: {
    //   "*": (fancybox, eventName) => {
    //     console.log(`Fancybox eventName: ${eventName}`);
    //   },
    // },
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

  $(document).on('click', '.bank__input', function(event) {
    console.log('Change!!');
  });

  // $('.bank__input').change(function(event) {
  //   let $bank = $(this).closest('.bank');

  //   console.log('yes!');

  //   $('.payment-systems-popup-link__name').text($bank.find('.bank__name').text());
  //   $('.payment-systems-popup-link__currency').text($bank.find('.bank__currency').text());
  //   $('.payment-systems-popup-link__icon').attr('src', $bank.find('.bank__icon').attr('src'));

  //   Fancybox.close();
  // });

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
    let paymentSystemsPopupLinkIcon = activeWithdrawalTab.querySelector('.payment-systems-popup-link__icon');

    paymentSystemsPopupLinkName.textContent = bankName.textContent;
    paymentSystemsPopupLinkCurrency.textContent = bankCurrency.textContent;
    paymentSystemsPopupLinkIcon.replaceWith(bankIconSvg);

    Fancybox.close();
  });
});

$(window).on('load', function () {

  setTimeout(() => {
    $('.operations-page__withdrawal-funds').show();
    $('.operations-page__preloader-wrapper').hide();
  }, 0);
});