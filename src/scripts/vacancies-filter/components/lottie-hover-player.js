export class LottieHoverPlayer {
  static requiresRoot = false;

  constructor({
    buttonSelector = '.btn-grey--lottie-trash',
    playerSelector = 'lottie-player, dotlottie-player'
  } = {}) {
    this.buttonSelector = buttonSelector;
    this.playerSelector = playerSelector;

    this.observer = null;
    this.initializedButtons = new WeakSet();

    this.handlePointerOver = this.handlePointerOver.bind(this);
    this.handlePointerOut = this.handlePointerOut.bind(this);
    this.handleMutations = this.handleMutations.bind(this);
  }

  init() {
    document.addEventListener('pointerover', this.handlePointerOver);
    document.addEventListener('pointerout', this.handlePointerOut);

    this.initVisibleButtons();

    this.observer = new MutationObserver(this.handleMutations);

    this.observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  }

  destroy() {
    document.removeEventListener('pointerover', this.handlePointerOver);
    document.removeEventListener('pointerout', this.handlePointerOut);

    this.observer?.disconnect();
    this.observer = null;
  }

  handleMutations() {
    this.initVisibleButtons();
  }

  initVisibleButtons() {
    document.querySelectorAll(this.buttonSelector).forEach((button) => {
      if (!this.isVisible(button)) {
        return;
      }

      if (this.initializedButtons.has(button)) {
        return;
      }

      this.initializedButtons.add(button);
      this.recreatePlayer(button);
    });
  }

  recreatePlayer(button) {
    const oldPlayer = button.querySelector(this.playerSelector);

    if (!oldPlayer) {
      return;
    }

    const newPlayer = oldPlayer.cloneNode(true);

    newPlayer.removeAttribute('autoplay');

    oldPlayer.replaceWith(newPlayer);

    newPlayer.addEventListener('ready', () => {
      this.resetPlayer(newPlayer);
    }, { once: true });

    newPlayer.addEventListener('load', () => {
      this.resetPlayer(newPlayer);
    }, { once: true });

    window.setTimeout(() => {
      this.resetPlayer(newPlayer);
    }, 100);
  }

  handlePointerOver(event) {
    const button = event.target.closest(this.buttonSelector);

    if (!button || !this.isVisible(button)) {
      return;
    }

    const player = button.querySelector(this.playerSelector);

    player?.play?.();
  }

  handlePointerOut(event) {
    const button = event.target.closest(this.buttonSelector);

    if (!button) {
      return;
    }

    if (event.relatedTarget instanceof Node && button.contains(event.relatedTarget)) {
      return;
    }

    const player = button.querySelector(this.playerSelector);

    this.resetPlayer(player);
  }

  resetPlayer(player) {
    if (!player) {
      return;
    }

    try {
      player.stop?.();
      player.seek?.(0);
    } catch (error) {
      // lottie-player і dotlottie-player мають різний API
    }
  }

  isVisible(element) {
    return !!(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
  }
}