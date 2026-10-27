// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Mycelium Contributors
//
// A recorded clip on a slide: <figure class="media clip" data-media="x.mp4">.
// It waits on its first frame. Click it or press K to play and pause, J and L
// jump 5 seconds back and forward (with Shift, one frame), the bar under it
// scrubs, and Z, + and − zoom in where the pointer is (0 fits it again). D draws
// over it like any slide. Leaving the slide pauses it where it is.
(() => {
  const FRAME = 1 / 30, STEP = 5, MAX = 4;
  const clips = new Map();

  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  function setup(fig) {
    if (clips.has(fig)) return clips.get(fig);
    const video = fig.querySelector('video');
    if (!video) return null;
    Object.assign(video, { autoplay: false, loop: false, preload: 'auto' });
    video.pause();
    const stage = document.createElement('div');
    stage.className = 'clip-stage';
    video.replaceWith(stage);
    stage.append(video);
    const bar = document.createElement('div');
    bar.className = 'clip-bar';
    bar.innerHTML = '<button type="button" class="clip-play" aria-label="Play">▶</button>'
      + '<input class="clip-scrub" type="range" min="0" max="1000" value="0" aria-label="Position">'
      + '<span class="clip-time">0:00</span>';
    fig.append(bar);
    const play = bar.querySelector('.clip-play'), scrub = bar.querySelector('.clip-scrub'), time = bar.querySelector('.clip-time');
    const st = { fig, video, stage, zoom: 1, px: 50, py: 50 };

    const sync = () => {
      const d = video.duration || 0;
      if (!st.dragging) scrub.value = d ? (video.currentTime / d) * 1000 : 0;
      time.textContent = `${fmt(video.currentTime)} / ${fmt(d)}`;
      play.textContent = video.paused ? '▶' : '❚❚';
      play.setAttribute('aria-label', video.paused ? 'Play' : 'Pause');
      fig.classList.toggle('playing', !video.paused);
    };
    ['timeupdate', 'play', 'pause', 'loadedmetadata', 'seeked', 'ended'].forEach(ev => video.addEventListener(ev, sync));
    scrub.addEventListener('pointerdown', () => { st.dragging = true; });
    scrub.addEventListener('pointerup', () => { st.dragging = false; });
    scrub.addEventListener('input', () => { if (video.duration) video.currentTime = (scrub.value / 1000) * video.duration; });
    // Keys go to the deck, not the slider: arrows still move between slides.
    scrub.addEventListener('keydown', e => e.preventDefault());
    scrub.addEventListener('focus', () => scrub.blur());
    play.addEventListener('click', e => { e.stopPropagation(); toggle(st); });
    stage.addEventListener('click', e => { if (!window.DeckInk?.on) { e.stopPropagation(); toggle(st); } });
    stage.addEventListener('pointermove', e => {
      if (st.zoom > 1) return;   // hold the zoomed spot still while pointing at it
      const r = stage.getBoundingClientRect();
      st.px = ((e.clientX - r.left) / r.width) * 100;
      st.py = ((e.clientY - r.top) / r.height) * 100;
    });
    clips.set(fig, st);
    sync();
    return st;
  }

  function toggle(st) {
    if (st.video.paused) {
      if (st.video.ended) st.video.currentTime = 0;
      st.video.play();
    } else st.video.pause();
  }

  function seek(st, by, frame) {
    if (frame) st.video.pause();
    const d = st.video.duration || 0;
    st.video.currentTime = Math.max(0, Math.min(d, st.video.currentTime + by));
  }

  function zoomTo(st, z) {
    st.zoom = Math.max(1, Math.min(MAX, z));
    st.video.style.transformOrigin = `${st.px}% ${st.py}%`;
    st.video.style.transform = st.zoom > 1 ? `scale(${st.zoom})` : '';
    st.fig.classList.toggle('zoomed', st.zoom > 1);
  }

  function current(slide) {
    const fig = slide?.querySelector('figure.media.clip');
    return fig ? setup(fig) : null;
  }

  window.DeckClip = {
    // The deck calls this on every slide change.
    activate(slide) {
      clips.forEach(st => { if (!slide.contains(st.fig)) st.video.pause(); });
      current(slide);
    },
    // True when the key was the clip's, so the deck leaves it alone.
    key(slide, e) {
      const st = current(slide);
      if (!st) return false;
      switch (e.key) {
        case 'k': case 'K': toggle(st); return true;
        case 'j': case 'J': seek(st, e.shiftKey ? -FRAME : -STEP, e.shiftKey); return true;
        case 'l': case 'L': seek(st, e.shiftKey ? FRAME : STEP, e.shiftKey); return true;
        case 'z': case 'Z': zoomTo(st, st.zoom > 1 ? 1 : 2.2); return true;
        default: return false;
      }
    },
    // + and − step the zoom, 0 fits.
    zoomKey(slide, dir) {
      const st = current(slide);
      if (!st) return false;
      zoomTo(st, dir === 0 ? 1 : st.zoom * (dir > 0 ? 1.25 : 0.8));
      return true;
    },
  };
})();

// A presenter's copy button: <button class="copy" data-copy="text">. Copies the
// text, says so for a moment, and keeps the click from changing slides.
document.addEventListener('click', e => {
  const b = e.target.closest?.('button.copy[data-copy]');
  if (!b) return;
  e.stopPropagation();
  const label = b.textContent;
  navigator.clipboard.writeText(b.dataset.copy).then(
    () => { b.textContent = 'Copied'; b.classList.add('done'); },
    () => { b.textContent = 'Copy failed'; },
  ).finally(() => setTimeout(() => { b.textContent = label; b.classList.remove('done'); }, 1500));
}, true);
