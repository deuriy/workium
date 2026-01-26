import $ from "jquery";

$(() => {
    $('[data-additional-toggle]').click(function (e) {
        let $clientCard = $(this).closest('.client-card');
        let $toggleBtn = $clientCard.find('.toggle-btn');
        let $clientCardAdditional = $clientCard.find('.client-card__additional');

        $toggleBtn.toggleClass('toggle-btn--opened');
        $clientCardAdditional.slideToggle();

        if ($toggleBtn.hasClass('toggle-btn--opened')) {
            $toggleBtn.text('Приховати');
        } else {
            $toggleBtn.text('Додатково');
        }

        e.preventDefault();
    });

    document.querySelectorAll('[data-rating]').forEach(group => {
        const checkboxes = Array.from(
            group.querySelectorAll('input[type="checkbox"]')
        );

        let prevMaxIndex = 0;

        checkboxes.forEach((checkbox, index) => {
            checkbox.addEventListener('mousedown', () => {
                prevMaxIndex = 0;

                for (let i = checkboxes.length - 1; i >= 0; i--) {
                    if (checkboxes[i].checked) {
                        prevMaxIndex = i + 1;
                        break;
                    }
                }
            });

            checkbox.addEventListener('click', () => {
                const clickedIndex = index + 1;

                if (clickedIndex === prevMaxIndex) {
                    checkboxes.forEach(cb => cb.checked = false);
                    return;
                }

                checkboxes.forEach((cb, i) => {
                    cb.checked = i < clickedIndex;
                });
            });
        });
    });

    document.addEventListener('change', event => {
        const target = event.target;

        if (!target.classList.contains('rating-star-input')) return;

        const criterion = target.closest('.review-rating-block__criterion');
        if (!criterion) return;

        const markEl = criterion.querySelector('.review-rating-block__mark');
        const starsWrap = criterion.querySelector('.rating-stars');
        const checkboxes = Array.from(
            starsWrap.querySelectorAll('.rating-star-input')
        );

        // Сохраняем текст по умолчанию один раз
        if (!markEl.dataset.defaultText) {
            markEl.dataset.defaultText = markEl.textContent.trim();
        }

        const checked = checkboxes
            .filter(cb => cb.checked)
            .sort((a, b) => Number(a.value) - Number(b.value));

        // Сбрасываем цветовые классы всегда
        markEl.classList.remove(
            'review-rating-block__mark--red',
            'review-rating-block__mark--yellow',
            'review-rating-block__mark--green'
        );

        // Нет оценки — возвращаем дефолт
        if (checked.length === 0) {
            markEl.textContent = markEl.dataset.defaultText;
            return;
        }

        const lastChecked = checked[checked.length - 1];
        const ratingValue = Number(lastChecked.value);

        markEl.textContent =
            lastChecked.dataset.markText || markEl.dataset.defaultText;

        // Назначаем цвет по оценке
        if (ratingValue <= 2) {
            markEl.classList.add('review-rating-block__mark--red');
        } else if (ratingValue === 3) {
            markEl.classList.add('review-rating-block__mark--yellow');
        } else if (ratingValue >= 4) {
            markEl.classList.add('review-rating-block__mark--green');
        }
    });

    // Инициализация для уже отмеченных чекбоксов
    document.querySelectorAll('.rating-star-input:checked').forEach(cb => {
    	cb.dispatchEvent(new Event('change', { bubbles: true }));
    });
});