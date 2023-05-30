document.addEventListener('DOMContentLoaded', function () {
	document.addEventListener('click', function (e) {
		let articleMoreBtn = e.target.closest('.article-box__more-btn');

		if (!articleMoreBtn) return;

		let articleBoxContent = articleMoreBtn.closest('.article-box').querySelector('.article-box__content');
		// articleBoxContent.classList.toggle('article-box__text--truncated');

		if (articleBoxContent.style.display !== 'none') {
			articleMoreBtn.textContent = 'Читати статтю';
			articleBoxContent.style.display = 'none';
		} else {
			articleMoreBtn.textContent = 'Згорнути статтю';
			articleBoxContent.style.display = '';
		}
		
		e.preventDefault();
	});
});