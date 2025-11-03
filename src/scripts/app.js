import $ from "jquery";
import "../../node_modules/jquery-circle-progress/dist/circle-progress.min.js";
import IMask from 'imask';

var count = 200;
var defaults = {
  origin: { y: 0.7 },
  zIndex: 10000
};

function fire(particleRatio, opts) {
  confetti(Object.assign({}, defaults, opts, {
    particleCount: Math.floor(count * particleRatio)
  }));
}

function runConfetti() {
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

function copyText(input) {
  input.select();
  input.setSelectionRange(0, 99999);

  document.execCommand("copy");
}

function getCoords(elem) {
  let box = elem.getBoundingClientRect();

  return {
    top: box.top + window.pageYOffset,
    right: box.right + window.pageXOffset,
    bottom: box.bottom + window.pageYOffset,
    left: box.left + window.pageXOffset
  };
}

// function getCookie(name) {
//   let matches = document.cookie.match(new RegExp(
//     "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
//   ));
//   return matches ? decodeURIComponent(matches[1]) : undefined;
// }

function setCookie(name, value, options = {}) {
  options = {
    path: '/',
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

function clearTextField($input) {
  $input.removeClass('form-text--filter-search-filled').val('').trigger('input');
  $input.parent().find('[data-clear-search-input]').hide();
}

$(() => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  let currentFancybox = null;

  Fancybox.bind("[data-fancybox]");

  Fancybox.bind(".fancybox-popup-toggle", {
    dragToClose: false,
    mainClass: 'fancybox--popup',
    placeFocusBack: false,

    on: {
      reveal: (fancybox, slide) => {
        if (slide.src === '#authorization-popup') {
          let activeTabNumber = slide.activeTabNumber !== undefined ? slide.activeTabNumber : 1;
          let $activeTabLink = $(slide.el).find(`.tabs-menu__item:nth-child(${activeTabNumber}) .tabs-menu__link`);

          $activeTabLink.trigger('click');
        } else if (slide.src.includes('cashback-tooltip-popup')) {
          let serviceName = slide.serviceName.charAt(0).toLowerCase() + slide.serviceName.slice(1);
          $(slide.contentEl).find('.fancybox-popup__service-name').text(serviceName);
          $(slide.contentEl).find('.fancybox-popup__cashback').text(slide.cashback);
          // $(slide.contentEl).find('.fancybox-popup__first-installment').text(slide.firstInstallment);
          // $(slide.contentEl).find('.fancybox-popup__last-installment').text(slide.lastInstallment);
        } else if (slide.src.includes('tooltip-popup')) {
          // console.log(slide.serviceName);

          if (slide.serviceName) {
            let serviceName = slide.serviceName.charAt(0).toLowerCase() + slide.serviceName.slice(1);
            $(slide.contentEl).find('.fancybox-popup__service-name').text(serviceName);
          }

          $(slide.contentEl).find('.fancybox-popup__first-installment').text(slide.firstInstallment);
          $(slide.contentEl).find('.fancybox-popup__last-installment').text(slide.lastInstallment);
        }

        if (currentFancybox) {
          currentFancybox.close();
        }

        currentFancybox = fancybox;

      },

      // done: (fancybox, slide) => {
      //   if (slide.src.includes('cashback-tooltip-popup')) {
      //     $(slide.contentEl).find('.fancybox-popup__service-name').text(slide.serviceName);
      //     $(slide.contentEl).find('.fancybox-popup__cashback').text(slide.cashback);
      //     $(slide.contentEl).find('.fancybox-popup__first-installment').text(slide.firstInstallment);
      //     $(slide.contentEl).find('.fancybox-popup__last-installment').text(slide.lastInstallment);
      //   }
      // }
    },

    // tpl: {
    //   closeButton: '<button data-fancybox-close class="fancybox-close-button" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" id="Icons" viewBox="0 0 24 24"><path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0Zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10Z" fill="currentColor"/><path d="M16.707 7.293a1 1 0 0 0-1.414 0L12 10.586 8.707 7.293a1 1 0 1 0-1.414 1.414L10.586 12l-3.293 3.293a1 1 0 1 0 1.414 1.414L12 13.414l3.293 3.293a1 1 0 0 0 1.414-1.414L13.414 12l3.293-3.293a1 1 0 0 0 0-1.414Z" fill="currentColor"/></svg></button>'
    // }
  });

  let showContactsTimer = null,
    timeLeftTimer = null,
    timeLeft = 7;

  Fancybox.bind(".fancybox-wide-popup-toggle", {
    dragToClose: false,
    mainClass: 'fancybox--wide-popup',

    on: {
      reveal: (fancybox, slide) => {
        if (currentFancybox) {
          currentFancybox.close();
        }

        currentFancybox = fancybox;

        if (slide.src.includes('share-vacancy-with-friend')) {
          const fancyboxBonusLink = slide.contentEl.querySelector('[data-bonus-link]');
          const fancyBoxRewardRange = slide.contentEl.querySelector('[data-reward-range]');
          const promoBlockLink = slide.triggerEl.dataset.promoBlockLink;
          const promoBlockRewardRange = slide.triggerEl.dataset.rewardRange;

          if (fancyboxBonusLink && promoBlockLink) {
              fancyboxBonusLink.value = promoBlockLink;
          }

          if (fancyBoxRewardRange && promoBlockRewardRange) {
            fancyBoxRewardRange.textContent = promoBlockRewardRange;
          }
        }

        if (slide.src.includes('order-service-popup') || slide.src.includes('consult-service-popup')) {
          $(slide.contentEl).find('.fancybox-popup__service-name').text(slide.serviceName);
          // $(slide.contentEl).find('.fancybox-popup__cashback').text(slide.cashback);
        }

        if (!slide.src.includes("#book-vacancy-list-popup") && !slide.src.includes("#consult-vacancies-list-popup")) return;

        const promoBlocks = slide.triggerEl.closest('.promo-blocks');

        if (!promoBlocks) return;

        const checkedVariantInput = promoBlocks.querySelector('input[name^="working_conditions"]:checked');

        if (!checkedVariantInput) return;

        const promoBlock = checkedVariantInput.closest('.promo-block');

        if (!promoBlock) return;

        const vacancyTitle = promoBlock.dataset.vacancyTitle;
        const variantLabel = promoBlock.dataset.variantLabel;
        const workingPeriod = promoBlock.dataset.workingPeriod;
        const rewardRange = promoBlock.dataset.rewardRange;
        // const companyName = promoBlock.dataset.companyName;
        // const agencyName = promoBlock.dataset.agencyName;
        const agencyId = promoBlock.dataset.agencyId;
        const bonusType = promoBlock.dataset.bonusType;
        const rewardTerms = promoBlock.dataset.rewardTerms;
        // const bookVacancyConditions = promoBlock.dataset.bookVacancyConditions;

        const fancyBoxVacancyTitle = slide.contentEl.querySelector('.fancybox-popup__vacancy-title');
        const fancyBoxVariant = slide.contentEl.querySelector('.fancybox-popup__variant');
        const fancyBoxWorkingPeriod = slide.contentEl.querySelector('.fancybox-popup__working-period');
        const fancyBoxRewardRange = slide.contentEl.querySelector('.fancybox-popup__reward-range');
        const fancyBoxBookVacancyConditions = slide.contentEl.querySelector('.fancybox-popup__book-vacancy-conditions');
        const viberBtn = slide.contentEl.querySelector('[data-viber-url]');
        const lang = document.documentElement.lang;

        if (fancyBoxVacancyTitle) {
          fancyBoxVacancyTitle.textContent = vacancyTitle;
        }

        if (fancyBoxVariant) {
          fancyBoxVariant.textContent = variantLabel;
        }

        if (fancyBoxWorkingPeriod) {
          fancyBoxWorkingPeriod.textContent = workingPeriod;
        }

        if (fancyBoxRewardRange) {
          fancyBoxRewardRange.textContent = rewardRange;
        }

        if (viberBtn) {
          let hrefText = '';

          switch (slide.src) {
            case '#book-vacancy-list-popup':
              if (lang === 'uk') {
                hrefText = `Вітаю! Забронюйте мені, будь ласка, вакансію "${vacancyTitle}" ${variantLabel}. ID вакансії: ${agencyId}`;
              } else if (lang === 'ru') {
                hrefText = `Здравствуйте! Забронируйте мне, пожалуйста, вакансию "${vacancyTitle}" ${variantLabel}. ID вакансии: ${agencyId}`;
              } else {
                hrefText = `Hello! Please reserve the vacancy "${vacancyTitle}" ${variantLabel} for me. Vacancy ID: ${agencyId}`;
              }
              break;
            case '#consult-vacancies-list-popup':
              if (lang === 'uk') {
                hrefText = `Вітаю! Хочу дізнатись більше деталей про вакансію "${vacancyTitle}" ${variantLabel}. ID вакансії: ${agencyId}`;
              } else if (lang === 'ru') {
                hrefText = `Здравствуйте! Хочу узнать больше деталей о вакансии "${vacancyTitle}" ${variantLabel}. ID вакансии: ${agencyId}`;
              } else {
                hrefText = `Hello! I would like to know more details about the vacancy "${vacancyTitle}" ${variantLabel}. Vacancy ID: ${agencyId}`;
              }
              
              break;
          }

          viberBtn.href = `${viberBtn.dataset.viberUrl}&text=${hrefText}`;
        }

        if (fancyBoxBookVacancyConditions) {
          let vacancyConditionsText = '';

          switch (slide.src) {
            case '#book-vacancy-list-popup':
              if (bonusType === 'fixed_payment_days') {
                if (lang === 'uk') {
                  vacancyConditionsText = `А ще після того як ви ${workingPeriod} попрацюєте на цій вакансії (рахуються тільки робочі дні), ви отримаєте <strong>${rewardRange}</strong> від WORKIUM — як подяку за те, що обрали нас.`;
                } else if (lang === 'ru') {
                  vacancyConditionsText = `А ещё после того, как вы ${workingPeriod} проработаете на этой вакансии (считаются только рабочие дни), вы получите <strong>${rewardRange}</strong> от WORKIUM — в знак благодарности за то, что выбрали нас.`;
                } else {
                  vacancyConditionsText = `And after you work for ${workingPeriod} in this position (only working days are counted), you will receive <strong>${rewardRange}</strong> from WORKIUM — as a thank you for choosing us.`;
                }
              } else {
                if (lang === 'uk') {
                  vacancyConditionsText = `А ще — протягом перших ${rewardTerms ? rewardTerms : parseInt(workingPeriod) + ' робочих днів'} ви отримуватимете по <strong>${rewardRange}</strong> за кожну годину від WORKIUM. Це наша щира подяка за те, що ви обрали нас!`;
                } else if (lang === 'ru') {
                  vacancyConditionsText = `А ещё — в течение первых ${rewardTerms ? rewardTerms : parseInt(workingPeriod) + ' рабочих дней'} вы будете получать по <strong>${rewardRange}</strong> за каждый час от WORKIUM. Это наша искренняя благодарность за то, что вы выбрали нас!`;
                } else {
                  vacancyConditionsText = `And during the first ${rewardTerms ? rewardTerms : parseInt(workingPeriod) + ' working days'} you will receive <strong>${rewardRange}</strong> for each hour from WORKIUM. This is our sincere gratitude for choosing us!`;
                }
              }

              break;
            case '#consult-vacancies-list-popup':
              if (bonusType === 'fixed_payment_days') {
                if (lang === 'uk') {
                  vacancyConditionsText = `А ще, звісно, як подяку за те, що ви обрали цю вакансію через WORKIUM, ми додатково виплатимо вам <strong>${rewardRange}</strong> після того, як ви попрацюєте ${workingPeriod}.`;
                } else if (lang === 'ru') {
                  vacancyConditionsText = `А ещё, конечно, в качестве благодарности за то, что вы выбрали эту вакансию через WORKIUM, мы дополнительно выплатим вам <strong>${rewardRange}</strong> после того, как вы проработаете ${workingPeriod}.`;
                } else {
                  vacancyConditionsText = `And of course, as a thank you for choosing this job through WORKIUM, we will additionally pay you <strong>${rewardRange}</strong> after you work for ${workingPeriod}.`;
                }
              } else {
                if (lang === 'uk') {
                  vacancyConditionsText = `А ще — щоб подякувати вам за те, що ви обрали цю вакансію через WORKIUM, ми будемо нараховувати вам по <strong>${rewardRange}</strong> за кожну годину, яку ви відпрацюєте протягом перших ${rewardTerms ? rewardTerms : parseInt(workingPeriod) + ' робочих днів'}.`;
                } else if (lang === 'ru') {
                  vacancyConditionsText = `А ещё — чтобы поблагодарить вас за то, что вы выбрали эту вакансию через WORKIUM, мы будем начислять вам по <strong>${rewardRange}</strong> за каждый час, который вы отработаете в течение первых ${rewardTerms ? rewardTerms : parseInt(workingPeriod) + ' рабочих дней'}.`;
                } else {
                  vacancyConditionsText = `And also — to thank you for choosing this job through WORKIUM, we will credit you <strong>${rewardRange}</strong> for every hour you work during the first ${rewardTerms ? rewardTerms : parseInt(workingPeriod) + ' working days'}.`;
                }
              }

              break;
          }

          fancyBoxBookVacancyConditions.innerHTML = vacancyConditionsText;
        }

        const telegramBtn = slide.contentEl.querySelector('[data-telegram-url]');
        if (telegramBtn) {
          const tgURL = slide.src === '#book-vacancy-list-popup' ? promoBlock.dataset.tgUrlJobReservation : promoBlock.dataset.tgUrlJobInquiry;
          telegramBtn.href = tgURL;
        }
      },

      done: (fancybox, slide) => {
        if (slide.src.includes('award-') && !slide.contentEl.classList.contains('fancybox-popup--award-dark-bg')) {
          runConfetti();
        } else if (slide.src.includes('employment-smart-work-popup')) {
          showContactsTimer = setTimeout(() => {
            let $showContactsBtn = $('#employment-smart-work-popup .fancybox-popup__show-contacts-btn');
            $showContactsBtn.removeClass('btn-grey btn-grey--employment-popup').addClass('btn-default btn-default--employment-popup');

            $showContactsBtn.text('Показати контакти');

            $showContactsBtn.click(function (e) {
              $(this).parent().hide();
              $('#employment-smart-work-popup').find('.fancybox-popup__contact-box').show();

              let destination = $('#employment-contact-box').offset().top;

              $('#employment-smart-work-popup').animate({
                scrollTop: destination
              }, 500);

              // Adding plus to phone number
              let $viberBtn = $('#employment-smart-work-popup .btn-purple--viber-order-service');
              let equalIndex = $viberBtn.attr('href').indexOf('=');
              let viberBtnValue = $viberBtn.attr('href').substring(equalIndex + 1);

              if (/^\d+$/.test(viberBtnValue) && $(window).width() >= 365) {
                let viberBtnBefore = $viberBtn.attr('href').substring(0, equalIndex + 1);
                viberBtnValue = viberBtnBefore + '+' + viberBtnValue;

                $viberBtn.attr('href', viberBtnValue);
              }
            });
          }, 7000);

          timeLeftTimer = setInterval(() => {
            timeLeft--;

            if (!timeLeft) clearInterval(timeLeftTimer);

            $('#employment-smart-work-popup .fancybox-popup__show-contacts-btn .btn-grey__time-left').text(timeLeft);
          }, 1000);
        }
      },

      // close: (fancybox, slide) => {

        // if (!slide.srcElement.includes("#book-vacancy-list-popup") && !slide.srcElement.includes("#consult-vacancies-list-popup")) return;

        // // let promoBlocks = slide.triggerEl.closest('.promo-blocks');

        // // if (!promoBlocks) return;

        // // let checkedVariantInput = promoBlocks.querySelector('input[name^="working_conditions"]:checked');

        // // if (!checkedVariantInput) return;

        // // let promoBlock = checkedVariantInput.closest('.promo-block');

        // // if (!promoBlock) return;

        // // let vacancyTitle = promoBlock.closest('.vacancy-card').querySelector('.vacancy-info__company-name').textContent;
        // // let variantLabel = promoBlock.dataset.variantLabel;
        // // const workingPeriod = promoBlock.querySelector('.footnote__value').textContent.toLowerCase();
        // // const rewardRange = promoBlock.querySelector('.promo-block__salary-value').textContent;

        // const fancyBoxVacancyTitle = slide.contentEl.querySelector('.fancybox-popup__vacancy-title');
        // const fancyBoxVariant = slide.contentEl.querySelector('.fancybox-popup__variant');
        // const fancyBoxWorkingPeriod = slide.contentEl.querySelector('.fancybox-popup__working-period');
        // const fancyBoxRewardRange = slide.contentEl.querySelector('.fancybox-popup__reward-range');

        // if (fancyBoxVacancyTitle) {
        //   // fancyBoxVacancyTitle.textContent = vacancyTitle;
        // }

        // if (fancyBoxVariant) {
        //   fancyBoxVariant.textContent = variantLabel;
        // }

        // if (fancyBoxWorkingPeriod) {
        //   fancyBoxWorkingPeriod.textContent = workingPeriod;
        // }

        // if (fancyBoxRewardRange) {
        //   fancyBoxRewardRange.textContent = rewardRange;
        // }
      // }
    }
  });

  Fancybox.bind(".user-profile-popup-link", {
    dragToClose: false,
    mainClass: 'fancybox--user-profile-popup',

    on: {
      reveal: (fancybox, slide) => {
        if (currentFancybox) {
          currentFancybox.close();
        }

        currentFancybox = fancybox;
      }
    }
  });

  // Fancybox.bind(".additional-filters-popup-link", {
  //   dragToClose: false,
  //   mainClass: 'fancybox--additional-filters-popup',

  //   tpl: {
  //     closeButton: '<button data-fancybox-close class="fancybox-close-button hidden-xxs" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path stroke="#A1A7B3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M1 17 17 1M1 1l16 16"></path></svg></button>'
  //   },

  //   on: {
  //     reveal: (fancybox, slide) => {
  //       if (slide.src === '#cities-popup') {
  //         $(slide.contentEl).find('.cities-filter__search-input').focus();
  //       }
  //     },

  //     // close: (fancybox, event) => {
  //     //   if (event.target.classList.contains('cities-filter__btn-back')) {
  //     //     // $('.selected-items--cities .selected-items__clear-btn').click();
  //     //   }
  //     //   // if (slide.src === '#cities-popup') {
  //     //   //   // $(slide.contentEl).find('.cities-filter__search-input').focus();
  //     //   // }
  //     // },
  //   }
  // });

  // Select menu
  $('.select-menu').click(function (e) {
    $(this).toggleClass('select-menu--opened');
  });

  $(document).click(function (e) {
    let $selectMenuSelected = e.target.closest('.select-menu__selected');
    let $selectMenuDropdown = e.target.closest('.select-menu__dropdown');

    if (!$selectMenuSelected && !$selectMenuDropdown) {
      $('.select-menu--opened').removeClass('select-menu--opened');
    }
  });

  let $articleContent = $('.affiliate-page__content');
  let $articleHeadings = $articleContent.children('h2');

  // // Article menu
  $(window).on('scroll', function (e) {
    $articleHeadings.each(function (index, el) {
      let rect = el.getBoundingClientRect();
      let rect2 = $articleContent[0].getBoundingClientRect();

      // if ($(window).height() + $(window).scrollTop() == $(document).height()) {
      //   console.log('bottom');
      // }

      if (rect.top <= 5) {
        // let headingID = el.id;
        let $targetLink = $(`.article-menu__link[href^="#${el.id}"]`);

        if ($(window).height() + $(window).scrollTop() >= $(document).height() - 2) {
          $targetLink = $(`.article-menu__item:last-child .article-menu__link`);
        }

        $targetLink.addClass('article-menu__link--active').parent().siblings('.article-menu__item').find('.article-menu__link--active').removeClass('article-menu__link--active');

        // let $targetLink = $(`.article-menu__link[href^="#${el.id}"]`);

        // $targetLink.addClass('article-menu__link--active').parent().siblings('.article-menu__item').find('.article-menu__link--active').removeClass('article-menu__link--active');
      }
    });
    /* Act on the event */
  });

  // $('.article-menu__link').click(function(e) {
  //   let $articleMenu = $(this).closest('.article-menu');
  //   let $activeLink = $articleMenu.find('.article-menu__link--active');

  //   if ($activeLink != $(this)) {
  //     $activeLink.removeClass('article-menu__link--active');
  //     $(this).addClass('article-menu__link--active');
  //   }

  //   // e.preventDefault();
  // });

  // let options = {
  //   // rootMargin: '0px',
  //   threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
  // };

  // const handleIntersection = function(entries, observer) {
  //   /* Content excerpted, show below */
  //   // console.log(entries);

  //   entries.map((entry) => {
  //     // console.log(entry.target, entry.intersectionRatio);
  //     console.log(entry);
  //     // console.log(entry.target.id, entry.intersectionRatio);
  //     // console.log();

  //     if (entry.boundingClientRect.top <= 0.1) {
  //      // console.log('Yes');
  //      // console.log(entry);
  //      // console.log(entry.target.id);

  //      let headingID = entry.target.id;

  //      if (headingID !== '') {
  //        let $targetLink = $(`.article-menu__link[href^="#${headingID}"]`);

  //        // $targetLink[0].scrollIntoView();

  //        $targetLink.addClass('article-menu__link--active').parent().siblings('.article-menu__item').find('.article-menu__link--active').removeClass('article-menu__link--active');
  //      }

  //      // $(`.table-contents__link[href^="${}"]`)
  //     }
  //   });
  // };

  // const headingObserver = new IntersectionObserver(handleIntersection, options);

  // let articleHeadings = document.querySelectorAll('.affiliate-page__content > h2');
  // articleHeadings.forEach(block => headingObserver.observe(block));


  $('.user-profile-popup-link').click(function (e) {
    let fancyboxSlide = Fancybox.getSlide();

    if (fancyboxSlide) {
      if ($(this).attr('href') === fancyboxSlide.src) {
        setTimeout(() => {
          Fancybox.close();
        }, 0);
      }
    }
  });

  // Copy URL
  document.addEventListener('click', function (e) {
    let copyURL = e.target.closest('[data-action="copyURL"]');

    if (!copyURL) return;

    let newURL = new URL(window.location.href);

    if (newURL.searchParams.has('share')) {
      newURL.searchParams.delete('share');
    }

    let copyLinkInput = document.createElement('input');
    copyLinkInput.type = 'text';

    copyLinkInput.value = newURL;
    copyURL.after(copyLinkInput);
    copyText(copyLinkInput);
    copyLinkInput.remove();

    let copyURLText = copyURL.querySelector('.share-btns__item-text');
    let copyURLIcon = copyURL.querySelector('.share-btns__icon');
    // copyURL.classList.add('action-menu__link--success');
    copyURLText.textContent = 'Скопійовано!';
    copyURLIcon.setAttribute('src', '/img/context_menu/checked_ok_white.svg');

    setTimeout(() => {
      // copyURL.classList.remove('action-menu__link--success');
      copyURLText.textContent = 'Скопіювати посилання';
      copyURLIcon.setAttribute('src', '/img/link.svg');

      // Fancybox.close();
    }, 800);

    e.preventDefault();
  });

  // Share for Android/IOS
  document.addEventListener('click', function (e) {
    let shareLink = e.target.closest('[data-action="share"]');

    if (!shareLink) return;

    let text = document.querySelector('title').textContent;

    navigator.share({
      title: '',
      text,
      url: location.href
    });
  });

  $('.user-label--copy-partner-link').click(function (e) {
    let $copyLinkInput = $($(this).attr('href'));
    let linkDefaultText = $(this).data('link-default-text');
		let linkCopiedText = $(this).data('link-copied-text');

    copyText($copyLinkInput[0]);
    $(this).text(linkCopiedText);

    setTimeout(() => {
      $(this).text(linkDefaultText);
    }, 2000);

    e.preventDefault();
  });

  $('.authorization-form__password-toggle').click(function (e) {
    let $formText = $(this).parent().find('.form-text');
    $formText.get(0).type = $formText.get(0).type === 'password' ? 'text' : 'password';

    $(this).toggleClass('password-toggle--visible');
  });

  $(document).on('click', '.tabs__list:not(.tabs__list--no-tabs) .tabs__item', function (event) {
    event.preventDefault();

    let index = $(this).index();

    $(this).find('.tabs-menu__link').addClass('tabs-menu__link--active');
    $(this).siblings().find('.tabs-menu__link').removeClass('tabs-menu__link--active');

    const parent = $(this).parents('.tabs');
    parent.find('.tabs__content').hide();
    parent.find('.tabs__content:eq(' + index + ')').show();
  });

  // $('.tabs__list').each(function() {
  //   $(this).find('.tabs__item').each(function(i) {
  //     $(this).click(function(e) {
  //       e.preventDefault();

  //       $(this).find('.tabs-menu__link').addClass('tabs-menu__link--active');
  //       $(this).siblings().find('.tabs-menu__link').removeClass('tabs-menu__link--active');

  //       const parent = $(this).parents('.tabs');
  //       parent.find('.tabs__content').hide();
  //       parent.find('.tabs__content:eq(' + i + ')').show();
  //     });
  //   });
  // });

  // Show/hide dropdown block
  $(document).on('click', '[data-dropdown-block-trigger]', function (e) {
    let blockID = $(this).attr('href').substring(1);
    let $currentVisibleDropdownBlock = $(`.dropdown-block--visible:not([id="${blockID}"])`);
    let $dropdownBlock = $($(this).attr('href'));

    if ($currentVisibleDropdownBlock.length) {
      $currentVisibleDropdownBlock.removeClass('dropdown-block--visible');
    }

    if ($dropdownBlock.hasClass('dropdown-block--submenu-right-bottom')) {
      let coords = $(this)[0].getBoundingClientRect();

      $dropdownBlock.css({
        right: `-${coords.right + 20}px`,
        top: `${coords.top - $dropdownBlock.outerHeight() + coords.height}px`
      });
    } else if ($dropdownBlock.hasClass('dropdown-block--bottom')) {
      // let coords = getCoords($(this)[0]);
      // let coords = $(this)[0].getBoundingClientRect();
      let coords = $dropdownBlock.hasClass('dropdown-block--bottom-fixed') ? $(this)[0].getBoundingClientRect() : getCoords($(this)[0]);

      $dropdownBlock.css({
        left: `${coords.left}px`,
        top: `${coords.top + $(this).outerHeight(true) + 6}px`
      });
    } else if ($dropdownBlock.hasClass('dropdown-block--top')) {
      let coords = getCoords($(this)[0]);

      $dropdownBlock.css({
        left: `${coords.left}px`,
        top: `${coords.top - $dropdownBlock.outerHeight(true) - 6}px`
      });
    }

    $dropdownBlock.toggleClass('dropdown-block--visible');

    e.preventDefault();
  });

  $(document).on('click', '[data-dropdown-block-close]', function (event) {
    $(this).closest('.dropdown-block').removeClass('dropdown-block--visible');

    event.preventDefault();
  });

  $(document).click(function (e) {
    let $isDropdownBlock = $(e.target).closest('.dropdown-block--visible');
    // let $visibleDropdownBlock = $('.dropdown-block--visible');
    let $dropdownBlockTrigger = $(e.target).closest('[data-dropdown-block-trigger]');

    if (!$isDropdownBlock.length && !$dropdownBlockTrigger.length) {
      $('.dropdown-block--visible').removeClass('dropdown-block--visible');
    }
  });

  $(document).on('click', '.contact-phones--support .contact-phones__item, .contact-phones--mobile-support .contact-phones__item, .contact-phones--order-service .contact-phones__item, .contact-phones--affiliate-support .contact-phones__item', function (e) {
    // if ($(window).width() < 768 && $(this).closest('.contact-phones--order-service')) return;

    if (($(window).width() >= 768 && e.target.closest('.phone')) || e.target.closest('.contact-phones__copy-btn')) {
      let $phone = $(this).find('.phone');
      $phone.after(`<input class="contact-phones__phone-form-text" value="${$phone.text().trim().replaceAll(/ |\t/g, '')}">`);

      let $tooltip = $(this).find('.contact-phones__tooltip');
      let $contactPhoneFormText = $phone.next('.contact-phones__phone-form-text');

      copyText($contactPhoneFormText[0]);
      $contactPhoneFormText.remove();

      $tooltip.addClass('tooltip--visible');
      setTimeout(() => {
        $tooltip.removeClass('tooltip--visible');
      }, 1500);

      e.preventDefault();
    }
  });

  $('.fb-group__copy-btn').click(function (e) {
    let $groupLink = $(this).prev('.fb-group__link');

    $groupLink.after(`<input type="text" class="fb-group__url" value="${$groupLink.attr('href')}" />`);

    let $tooltip = $(this).next('.fb-group__tooltip');
    let $groupLinkURL = $groupLink.next('.fb-group__url');

    copyText($groupLinkURL[0]);
    $groupLinkURL.remove();

    $tooltip.addClass('tooltip--visible');
    setTimeout(() => {
      $tooltip.removeClass('tooltip--visible');
    }, 1500);
  });

  // $('.selected-item__remove-link').click(function(e) {
  //   e.preventDefault();

  //   $(this).closest('.selected-item').remove();
  // });

  // $('.vacancy-card__address').click(function(e) {
  //   $(this).toggleClass('vacancy-card__address--truncated');

  //   e.preventDefault();
  // });

  $('.vacancy-info__specialization').click(function (e) {
    $(this).toggleClass('vacancy-info__specialization--truncated');

    e.preventDefault();
  });

  $('.circle-progressbar').circleProgress({
    startAngle: -1.55,
    value: 0.06,
    thickness: 2,
    size: $(window).width() < 426 ? 90 : 110,
    fill: {
      gradient: ["#ffc10d", "#ef881d"]
    },
    emptyFill: "#333742"
  });

  $('.quote__close-btn').click(function (e) {
    let $quote = $(this).closest('.quote');
    $quote.slideUp();

    if ($quote.hasClass('user-sidebar__quote')) {
      let $userSidebar = $('.user-sidebar');
      let $userAvatarLink = $('.user-sidebar__user-avatar-link');

      $userSidebar.removeClass('user-sidebar--quote-shown');
      $userAvatarLink.removeClass('user-sidebar__user-avatar-link--quote-shown');

      setCookie('hideProfileQuote', 'yes', { 'max-age': 3153600000 });
    }
  });

  // $('.tooltip__close-btn').click(function(e) {
  //   e.preventDefault();

  //   let $tooltip = $(this).closest('.tooltip');

  //   $tooltip.removeClass('tooltip--visible');

  //   setTimeout(() => {
  //     $tooltip.closest('.hint').removeClass('hint--tooltip-visible');
  //     $tooltip.closest('.cashback').removeClass('cashback--tooltip-visible');
  //   }, 300);
  // });

  $(document).on('mouseover', '[data-tooltip]', function (event) {
    let $tooltip = $(this).find('.tooltip');
    $tooltip.addClass('tooltip--visible');

    // let windowHeight = document.documentElement.clientHeight;
    // let tooltipTriggerCoords = this.getBoundingClientRect();
    // let tooltipHeight = $tooltip.outerHeight();

    // if (windowHeight < tooltipTriggerCoords.bottom + tooltipHeight + 10) {
    //   $tooltip.addClass('tooltip--extended-top').removeClass('tooltip--extended-bottom');
    // } else {
    //   $tooltip.removeClass('tooltip--extended-top').addClass('tooltip--extended-bottom');
    // }
  });

  $(document).on('mouseout', '[data-tooltip]', function (event) {
    let $tooltip = $(this).find('.tooltip');
    $tooltip.removeClass('tooltip--visible');
  });

  // Article chapters
  $('.article-chapters__title').click(function (e) {
    let $articleChapters = $(this).closest('.article-chapters');

    $articleChapters.toggleClass('article-chapters--collapsed');
    $articleChapters.find('.article-chapters__list').slideToggle();
  });

  $('.article-chapters__link[href*="#"]').click(function (e) {
    let elementClick = $(this).attr("href");
    let $heading = elementClick.substr(elementClick.indexOf("#"));
    let destination = $($heading).offset().top;
    let scrollTop = destination - $('.mobile-header').outerHeight();
    let $container = $(window).width() < 768 ? $('.wrapper') : $('html, body');

    $container.animate({
      scrollTop: scrollTop
    }, 500);

    return false;
  });

  function getLineCount(element) {
    const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
    const elementHeight = element.clientHeight;

    return Math.round(elementHeight / lineHeight);
  }


  document.querySelectorAll('.vacancy-card__address--truncated').forEach(item => {
    if (getLineCount(item) <= 2) {
      item.classList.add('vacancy-card__address--no-arrow');
    }
  });

  document.querySelectorAll('.vacancy-info__specialization--truncated').forEach(item => {
    let height = item.closest('.vacancy-card--full') ? 69 : 52;

    if (item.scrollHeight <= height) {
      item.classList.add('vacancy-info__specialization--no-arrow');
    }
  });

  document.addEventListener("employerAdded", function (event) {
    Fancybox.close();
    Fancybox.show([{ src: "#add-employer-success-popup", type: "inline" }]);
  });

  $('.authorization-form__socbtns-item .social-btn').click(function (event) {
    let $socBtnsList = $(this).closest('.authorization-form__socbtns-list');
    let $preloaderWrapper = $socBtnsList.next('.authorization-form__preloader-wrapper');

    $socBtnsList.hide();
    $preloaderWrapper.show();
  });

  document.addEventListener('click', function (e) {
    const like = e.target.closest('.like');

    if (!like) return;

    like.classList.toggle('like--filled');
    e.preventDefault();
  });

  function toggleMoreLink(link) {
    const targetElem = document.getElementById(link.dataset.targetId);

    if (!targetElem) return;

    if (targetElem.style.display === 'none') {
      targetElem.style.display = '';
      link.textContent = 'Менше';
    } else {
      targetElem.style.display = 'none';
      link.textContent = 'Більше';
    }
  }

  document.querySelectorAll('[data-more-link]').forEach(link => {
    toggleMoreLink(link);
  });

  document.addEventListener('click', function (e) {
    const moreLink = e.target.closest('[data-more-link]');

    if (!moreLink) return;

    toggleMoreLink(moreLink);
    e.preventDefault();
  });

  document.addEventListener('click', function (e) {
    const fancyboxShareMoreLink = e.target.closest('.fancybox-popup--share .fancybox-popup__more-link');

    if (!fancyboxShareMoreLink) return;

    const fancyboxSharePopup = fancyboxShareMoreLink.closest('.fancybox-popup--share');

    if (!fancyboxSharePopup) return;

    fancyboxShareMoreLink.style.display = 'none';

    fancyboxSharePopup.querySelector('.fancybox-popup__more-text').style.display = '';
    fancyboxSharePopup.querySelector('.fancybox-popup__auth-btns').style.display = '';
  });

  $('.accordion-panel__title').click(function (event) {
    $(this).parent().toggleClass('accordion-panel--opened');
    $(this).next('.accordion-panel__body').slideToggle('fast');

    event.preventDefault();
  });

  document.addEventListener('click', function (e) {
    const langSwitcherToggleBtn = e.target.closest('.lang-switcher__toggle-btn');

    if (!langSwitcherToggleBtn) return;

    langSwitcherToggleBtn.closest('.lang-switcher').classList.toggle('lang-switcher--opened');
  });

  document.addEventListener('click', function (e) {
    const isLangSwitcher = e.target.closest('.lang-switcher');

    if (isLangSwitcher) return;

    const openedLangSwitcher = document.querySelector('.lang-switcher--opened');

    if (!openedLangSwitcher) return;

    openedLangSwitcher.classList.remove('lang-switcher--opened');
  });

  document.querySelectorAll('.form-text--phone').forEach(phoneInput => {
    const mask = IMask(
      phoneInput,
      {
        mask: '+000 00 000 00 00'
      }
    );
    mask.value = '+';
  });

  document.addEventListener('input', (e) => {
    const input = e.target.closest('.sms-code-field__input');

    if (!input) return;

    input.value = input.value.replace(/\D/, '');
    const smsInputs = [...input.parentNode.children];

    const i = smsInputs.indexOf(input);

    if (input.value.length === 1 && i < smsInputs.length - 1) {
      smsInputs[i + 1].focus();
    }
  });

  document.addEventListener('keydown', (e) => {
    const input = e.target.closest('.sms-code-field__input');

    if (!input) return;

    const smsInputs = [...input.parentNode.children];
    const i = smsInputs.indexOf(input);

    if (e.key === 'Backspace' && !input.value && i > 0) {
      smsInputs[i - 1].focus();
    }
  });

  document.addEventListener('paste', (e) => {
    const input = e.target.closest('.sms-code-field__input');

    if (!input) return;
    
    const pasteData = (e.clipboardData || window.clipboardData).getData('text');
    const digits = pasteData.replace(/\D/g, '').split('');
    const smsInputs = input.parentNode.querySelectorAll('.sms-code-field__input');

    for (let j = 0; j < smsInputs.length; j++) {
      smsInputs[j].value = digits[j] || '';
    }

    const firstEmpty = [...smsInputs].findIndex(input => !input.value);
    const nextIndex = firstEmpty === -1 ? smsInputs.length - 1 : firstEmpty;
    smsInputs[nextIndex].focus();

    e.preventDefault();
  });

  document.addEventListener('click', function (e) {
    const closeLangBlockBtn = e.target.closest('[data-close-lang-block]');

    if (!closeLangBlockBtn) return;

    const langBlock = closeLangBlockBtn.closest('.lang-sticky-block');

    if (!langBlock) return;

    langBlock.classList.add('lang-sticky-block--invisible');
    const cookieName = langBlock.dataset.cookieName;

    if (cookieName) {
      setCookie(cookieName, 'yes', { 'max-age': 3153600000 });
    }

    e.preventDefault();
  });

  // Search input with close button
  $('[data-search-input]').on('input', function (event) {
    let name = $(this).attr('name');
    let value = $(this).val();
    let $clearBtn = $(this).next('.filter__clear-search-btn');
    let $searchBtnMobile = $('.filter__search-btn-mobile');
    let type = ['text', 'search'].includes($(this).attr('type')) ? 'textfield' : $(this).attr('type');

    if (value) {
      $clearBtn.show();
      $searchBtnMobile.show();
      $(this).addClass('form-text--filter-search-filled');
      // createOrUpdateTag('textfield', name, value, value);
    } else {
      $clearBtn.hide();
      $searchBtnMobile.hide();
      $(this).removeClass('form-text--filter-search-filled');
      // removeFilterTag(type, name, value);
    }
  });

  $('[data-clear-search-input]').on('click', function (event) {
    let $input = $(this).prev();
    let name = $input.attr('name');
    let value = $input.val();
    let type = ['text', 'search'].includes($input.attr('type')) ? 'textfield' : $input.attr('type');

    clearTextField($input);
    // removeFilterTag(type, name, value);

    $input.focus();

    let isMobile = $(window).width() < 576;
    let $noResults = $('.vacancies__no-results');
    if (isMobile && $noResults.length) {
      updateFilterUrl();
    }

    // updateFilterUrl();
  });
});