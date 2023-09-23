import $ from "jquery";
import Swiper, { Navigation } from 'swiper';

function toggleMoreLink ($link) {
	let linkText = $link.text() === 'Приховати' ? 'Читати далі' : 'Приховати';
	$link.text(linkText);
}

$(() => {
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
        slidesPerView: 3,
        spaceBetween: 32,
        centeredSlides: false,
      }
    }
  });

	// $('.affiliate-info__more-link').click(function(e) {
	// 	$(this).closest('.affiliate-info').find('.affiliate-info__text').toggleClass('affiliate-info__text--truncated');

	// 	toggleMoreLink($(this));
	// 	e.preventDefault();
	// });

	$('.partners-table-wrapper__more-link').click(function(e) {
		$(this).closest('.partners-table-wrapper').find('.partners-table-wrapper__description').toggleClass('partners-table-wrapper__description--full');

		toggleMoreLink($(this));
		e.preventDefault();
	});

	// $('.')
});