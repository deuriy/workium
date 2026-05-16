export class FancyboxIOSScrollLock {
  static lockCount = 0;
  static locked = false;
  static scrollY = 0;
  static lastTouchY = 0;
  static savedBodyStyles = {};

  static scrollableSelector = [
    '[data-fancybox-scrollable]',
    '.filter-element-popup__body',
    '.cities-filter__list',
    '.cities-filter__items',
    '.checkboxes-group__items',
    '.checkboxes-groups-field__items',
  ].join(',');

  static bodyStyleProps = [
    'position',
    'top',
    'left',
    'right',
    'width',
    'overflow',
    'paddingRight',
  ];

  static isIOS() {
    const ua = window.navigator.userAgent;

    const isIOSDevice = /iPad|iPhone|iPod/.test(ua);
    const isIPadOS =
      navigator.platform === 'MacIntel' &&
      navigator.maxTouchPoints > 1;

    return isIOSDevice || isIPadOS;
  }

  static lock() {
    if (!this.isIOS()) {
      return;
    }

    this.lockCount += 1;

    if (this.locked) {
      return;
    }

    this.locked = true;
    this.scrollY = window.scrollY || document.documentElement.scrollTop || 0;

    this.syncViewportSize();
    this.saveBodyStyles();

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.documentElement.classList.add('is-fancybox-ios-locked');

    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    window.addEventListener('resize', this.syncViewportSize, { passive: true });

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', this.syncViewportSize, { passive: true });
      window.visualViewport.addEventListener('scroll', this.syncViewportSize, { passive: true });
    }

    document.addEventListener('touchstart', this.handleTouchStart, {
      passive: true,
      capture: true,
    });

    document.addEventListener('touchmove', this.handleTouchMove, {
      passive: false,
      capture: true,
    });
  }

  static unlock() {
    if (!this.locked) {
      return;
    }

    this.lockCount = Math.max(this.lockCount - 1, 0);

    if (this.lockCount > 0) {
      return;
    }

    this.locked = false;

    if (
      document.activeElement &&
      document.activeElement.matches('input, textarea, select')
    ) {
      document.activeElement.blur();
    }

    document.documentElement.classList.remove('is-fancybox-ios-locked');

    this.restoreBodyStyles();

    window.removeEventListener('resize', this.syncViewportSize);

    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', this.syncViewportSize);
      window.visualViewport.removeEventListener('scroll', this.syncViewportSize);
    }

    document.removeEventListener('touchstart', this.handleTouchStart, true);
    document.removeEventListener('touchmove', this.handleTouchMove, true);

    document.documentElement.style.removeProperty('--fancybox-vvh');
    document.documentElement.style.removeProperty('--fancybox-vvw');
    document.documentElement.style.removeProperty('--fancybox-vv-top');
    document.documentElement.style.removeProperty('--fancybox-vv-left');

    window.scrollTo(0, this.scrollY);
  }

  static saveBodyStyles() {
    this.savedBodyStyles = {};

    this.bodyStyleProps.forEach((prop) => {
      this.savedBodyStyles[prop] = document.body.style[prop];
    });
  }

  static restoreBodyStyles() {
    this.bodyStyleProps.forEach((prop) => {
      document.body.style[prop] = this.savedBodyStyles[prop] || '';
    });
  }

  static syncViewportSize = () => {
    const viewport = window.visualViewport;

    const height = viewport ? viewport.height : window.innerHeight;
    const width = viewport ? viewport.width : window.innerWidth;
    const offsetTop = viewport ? viewport.offsetTop : 0;
    const offsetLeft = viewport ? viewport.offsetLeft : 0;

    document.documentElement.style.setProperty('--fancybox-vvh', `${height}px`);
    document.documentElement.style.setProperty('--fancybox-vvw', `${width}px`);
    document.documentElement.style.setProperty('--fancybox-vv-top', `${offsetTop}px`);
    document.documentElement.style.setProperty('--fancybox-vv-left', `${offsetLeft}px`);
  };

  static handleTouchStart = (event) => {
    if (!this.locked || !event.touches || !event.touches.length) {
      return;
    }

    this.lastTouchY = event.touches[0].clientY;
  };

  static handleTouchMove = (event) => {
    if (!this.locked || !event.touches || !event.touches.length) {
      return;
    }

    const target = event.target;

    if (!(target instanceof Element)) {
      event.preventDefault();
      return;
    }

    const scrollable = this.findScrollableParent(target);

    if (!scrollable) {
      event.preventDefault();
      return;
    }

    const currentY = event.touches[0].clientY;
    const deltaY = currentY - this.lastTouchY;

    this.lastTouchY = currentY;

    const isAtTop = scrollable.scrollTop <= 0;
    const isAtBottom =
      scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 1;

    const isScrollingPastTop = isAtTop && deltaY > 0;
    const isScrollingPastBottom = isAtBottom && deltaY < 0;

    if (isScrollingPastTop || isScrollingPastBottom) {
      event.preventDefault();
    }
  };

  static findScrollableParent(element) {
    let current = element;

    while (current && current !== document.body && current !== document.documentElement) {
      if (current.matches && current.matches(this.scrollableSelector)) {
        const style = window.getComputedStyle(current);
        const canScroll =
          ['auto', 'scroll'].includes(style.overflowY) &&
          current.scrollHeight > current.clientHeight + 1;

        if (canScroll) {
          return current;
        }
      }

      current = current.parentElement;
    }

    return null;
  }
}