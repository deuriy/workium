document.addEventListener('DOMContentLoaded', function () {
	document.addEventListener('click', function (e) {
		let affiliateMoreLink = e.target.closest('.affiliate-info__more-link');

		if (!affiliateMoreLink) return;

		let affiliateInfoText = affiliateMoreLink.closest('.affiliate-info').querySelector('.affiliate-info__text');
		affiliateInfoText.classList.toggle('affiliate-info__text--truncated');

		if (affiliateMoreLink.textContent === 'Приховати') {
			affiliateMoreLink.textContent = 'Читати далі';
		} else {
			affiliateMoreLink.textContent = 'Приховати';
		}
		
		e.preventDefault();
	});
});