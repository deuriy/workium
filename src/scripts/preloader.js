let cSpeed = 3;
let cWidth = 72;
let cHeight = 72;
let cTotalFrames = 28;
let cFrameWidth = 72;
let cImageSrc = '../img/preloader_sprites.png';

let cImageTimeout = false;
let cIndex = 0;
let cXpos = 0;
let cPreloaderTimeout = false;
let SECONDS_BETWEEN_FRAMES = 0;

let preloader = document.getElementById('preloader');

function startAnimation() {

	preloader.style.backgroundImage = 'url(' + cImageSrc + ')';
	preloader.style.width = cWidth + 'px';
	preloader.style.height = cHeight + 'px';

	//FPS = Math.round(100/(maxSpeed+2-speed));
	let FPS = Math.round(100 / cSpeed);
	SECONDS_BETWEEN_FRAMES = 1 / FPS;

	cPreloaderTimeout = setTimeout(continueAnimation, SECONDS_BETWEEN_FRAMES/1000);

}

function continueAnimation() {
	cXpos += cFrameWidth;
	cIndex += 1;

	if (cIndex >= cTotalFrames) {
		cXpos = 0;
		cIndex = 0;
	}

	if(preloader) {
		preloader.style.backgroundPosition = (-cXpos) + 'px 0';
	}

	cPreloaderTimeout = setTimeout(continueAnimation, SECONDS_BETWEEN_FRAMES * 1000);
}

function stopAnimation() {
	clearTimeout(cPreloaderTimeout);
	cPreloaderTimeout = false;
}

function imageLoader(s, fun) {
	clearTimeout(cImageTimeout);
	cImageTimeout = 0;

	let genImage = new Image();
	genImage.onload = function () {
		cImageTimeout = setTimeout(fun, 0)
	};

	genImage.onerror = new Function('alert(\'Could not load the image\')');
	genImage.src = s;
}

new imageLoader(cImageSrc, startAnimation);