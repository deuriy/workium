import $ from "jquery";
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import select2 from 'select2';

$(() => {
  select2($);

	new Swiper('.people-swiper', {
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
			$(this).text($(this).data('more-text'));
			$articleBoxContent.hide();
		} else {
			$(this).text($(this).data('less-text'));
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

	$('.article-box--how-recommend .article-box__more-link').on('click', function (event) {
    $(this).closest('.article-box').find('.article-box__text').toggleClass('hidden-xs');
    $(this).hide();

    event.preventDefault();
  });

  $('.filter-select').each(function (index, el) {
    if ($(window).width() > 575 || ($(window).width() < 576 && !$(el).hasClass('hidden-xs'))) {
      $(el).select2({
        dropdownCssClass: ':all:',
        selectionCssClass: ':all:',
        theme: 'filter-select',
        width: '100%',
        dropdownAutoWidth: true,
        minimumResultsForSearch: -1
      });
    }
  });

  let $servicesFilter = $('form[name="services_filter"]');
  
  $servicesFilter.on('submit', function (event) {
    let $filterSearchBtn = $('.filter__search-btn');
    let $filterPreloaderWrapper = $('.filter__preloader-wrapper');

    $filterSearchBtn.hide();
    $filterPreloaderWrapper.show();
  });

  $('.filter-select').on('change', function (event, call) {
    $servicesFilter.trigger('submit');
  });
});