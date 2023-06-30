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

	document.addEventListener('click', function (e) {
		let partnersTableWrapperMoreLink = e.target.closest('.partners-table-wrapper__more-link');

		if (!partnersTableWrapperMoreLink) return;

		let partnersTableWrapperDesc = partnersTableWrapperMoreLink.closest('.partners-table-wrapper').querySelector('.partners-table-wrapper__description');
		partnersTableWrapperDesc.classList.toggle('partners-table-wrapper__description--full');

		if (partnersTableWrapperMoreLink.textContent === 'Приховати') {
			partnersTableWrapperMoreLink.textContent = 'Читати далі';
		} else {
			partnersTableWrapperMoreLink.textContent = 'Приховати';
		}
		
		e.preventDefault();
	});
});