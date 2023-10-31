import $ from "jquery";
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

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

	$('.article-box__more-btn').click(function(event) {
		let $articleBoxContent = $(this).closest('.article-box').find('.article-box__content');

		if ($articleBoxContent.is(':visible')) {
			$(this).text('Читати статтю');
			$articleBoxContent.hide();
		} else {
			$(this).text('Згорнути статтю');
			$articleBoxContent.show();

			let $wrapper = $('.wrapper');
			$wrapper.addClass('wrapper--non-fixed');

	    let $container = $(window).width() < 768 ? $wrapper : $('html, body');
			let destination = $articleBoxContent.offset().top;
	    let scrollTop = destination - $('.mobile-header').outerHeight();

	    $wrapper.removeClass('wrapper--non-fixed');

	    $container.animate( {
	      scrollTop: scrollTop
	    }, 0 );


	    // setTimeout(() => {
	    // 	$wrapper.removeClass('wrapper--non-fixed');
	    // }, 5000);
		}		

		event.preventDefault();
	});
});