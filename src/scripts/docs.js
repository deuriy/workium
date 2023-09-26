import $ from "jquery";

$(() => {
	$('.article-box__more-btn').click(function(event) {
		let $articleBoxContent = $(this).closest('.article-box').find('.article-box__content');

		if ($articleBoxContent.is(':visible')) {
			$(this).text('Читати статтю');
			$articleBoxContent.hide();
		} else {
			$(this).text('Згорнути статтю');
			$articleBoxContent.show();

			let destination = $articleBoxContent.offset().top;
	    let scrollTop = destination - $('.mobile-header').outerHeight();
	    // let scrollTop = destination;
	    let $container = $(window).width() < 768 ? $('.wrapper') : $('html, body');

	    console.log($articleBoxContent);

	    $container.animate( {
	      scrollTop: scrollTop
	    }, 500 );
		}		

		event.preventDefault();
	});
});