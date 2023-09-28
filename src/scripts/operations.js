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

  $('.bank__input').change(function(event) {
    let $bank = $(this).closest('.bank');

    $('.payment-systems-popup-link__name').text($bank.find('.bank__name').text());
    $('.payment-systems-popup-link__currency').text($bank.find('.bank__currency').text());
    $('.payment-systems-popup-link__icon').attr('src', $bank.find('.bank__icon').attr('src'));

    Fancybox.close();
  });
});