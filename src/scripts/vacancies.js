import Swiper, { Pagination } from 'swiper';

document.addEventListener('DOMContentLoaded', function () {
	const promoBlocksSwiper = new Swiper('.promo-blocks-swiper', {
    modules: [Pagination],
    loop: true,
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 8,

    pagination: {
	    el: '.promo-blocks-swiper__pagination',
	    bulletActiveClass: 'swiper-pagination-bullet--active',
	    // clickable: true
	  },
  });
});