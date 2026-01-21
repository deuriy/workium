import WaveSurfer from 'wavesurfer.js';

const AudioPlayers = (() => {

  const instances = new WeakMap();
  let activeWs = null;

  function init(root = document) {
    root.querySelectorAll('.audio-player').forEach(initPlayer);

    document.addEventListener('click', handleClick);
    document.addEventListener('input', handleInput);
  }

  function initPlayer(player) {
    if (instances.has(player)) return;

    const audio = player.querySelector('audio');
    const src = player.dataset.audioSrc;
    const waveformEl = player.querySelector('.audio-waveform');
    const timeEl = player.querySelector('.audio-time');
    const btn = player.querySelector('.audio-play');

    if (!audio || !src || !waveformEl || !btn) return;

    audio.src = src;

    const ws = WaveSurfer.create({
      "container": waveformEl,
      "height": 32,
      "splitChannels": false,
      "normalize": false,
      "waveColor": "#d9dae7",
      "progressColor": "#594df5",
      "cursorColor": "#ddd5e9",
      "cursorWidth": 0,
      "barWidth": 2,
      "barGap": 2,
      "barRadius": 0,
      "barHeight": 1.2,
      "barAlign": "bottom",
      "minPxPerSec": 1,
      "fillParent": true,
      "media": audio,
      "autoplay": false,
      "interact": true,
      "hideScrollbar": false,
      "audioRate": 1,
      "autoScroll": true,
      "autoCenter": true,
      "sampleRate": 8000
    });

    ws.on('ready', () => {
      timeEl.textContent = `0:00 / ${formatTime(ws.getDuration())}`;
    });

    ws.on('audioprocess', () => {
      timeEl.textContent =
        `${formatTime(ws.getCurrentTime())} / ${formatTime(ws.getDuration())}`;
    });

    ws.on('play', () => {
      if (activeWs && activeWs !== ws) {
        activeWs.pause();
      }
      activeWs = ws;

      btn.classList.add('audio-play--paused');
    });

    ws.on('pause', () => {
      if (activeWs === ws) activeWs = null;
      btn.classList.remove('audio-play--paused');
    });

    ws.on('finish', () => {
      if (activeWs === ws) activeWs = null;
      btn.classList.remove('audio-play--paused');
    });

    instances.set(player, ws);
    updateVolumeState(player, audio.volume || 1);
  }

  /* ---------------- EVENTS ---------------- */

  function handleClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const player = btn.closest('.audio-player');
    if (!player) return;

    const ws = instances.get(player);
    if (!ws) return;

    const action = btn.dataset.action;

    const actions = {
      play: () => ws.playPause(),
      speed: () => toggleSpeed(btn, ws),
      mute: () => toggleMute(player, ws),
    };

    actions[action]?.();
  }

  function handleInput(e) {
    const range = e.target.closest('.audio-volume__range');
    if (!range) return;

    const player = range.closest('.audio-player');
    if (!player) return;

    const ws = instances.get(player);
    if (!ws) return;

    const volume = parseFloat(range.value);

    ws.setMuted(false);
    ws.setVolume(volume);

    updateRangeFill(range);
    updateVolumeState(player, volume);
  }

  /* ---------------- ACTIONS ---------------- */

  function toggleSpeed(btn, ws) {
    const rate = ws.getPlaybackRate();
    const next = rate === 1 ? 1.5 : rate === 1.5 ? 2 : 1;

    ws.setPlaybackRate(next);

    btn.classList.toggle('audio-speed--highlighted', rate !== 2)
    btn.textContent = `${next}x`;
  }

  function toggleMute(player, ws) {
    const muted = ws.getMuted();
    const range = player.querySelector('.audio-volume__range');

    ws.setMuted(!muted);

    let volume = 0;

    if (range) {
      volume = muted ? ws.getVolume() || 1 : 0;
      range.value = volume;
      updateRangeFill(range);
    }

    updateVolumeState(player, volume);
  }

  function updateVolumeState(player, volume) {
    const volumeEl = player.querySelector('.audio-volume');
    if (!volumeEl) return;

    volumeEl.classList.remove('audio-volume--lower', 'audio-volume--no-sound');

    if (volume === 0) {
      volumeEl.classList.add('audio-volume--no-sound');
    } else if (volume < 0.5) {
      volumeEl.classList.add('audio-volume--lower');
    }
  }

  function updateRangeFill(range) {
    const min = parseFloat(range.min) || 0;
    const max = parseFloat(range.max) || 1;
    const value = parseFloat(range.value);

    const percent = ((value - min) / (max - min)) * 100;
    range.style.setProperty('--fill-percent', `${percent}%`);
  }

  function formatTime(sec) {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  return { init };

})();

export { AudioPlayers }