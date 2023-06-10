import $ from "jquery";
import Swiper from 'swiper';
import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.esm.js";

document.addEventListener('DOMContentLoaded', function () {
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

  $('.bank__input').change(function(event) {
    // let id = $(this).val();
    let $bank = $(this).closest('.bank');

    $('.payment-systems-popup-link__name').text($bank.find('.bank__name').text());
    $('.payment-systems-popup-link__currency').text($bank.find('.bank__currency').text());
    $('.payment-systems-popup-link__icon').attr('src', $bank.find('.bank__icon').attr('src'));

    // console.log($(this).val());
    Fancybox.close();
  });
});