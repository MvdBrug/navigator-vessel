/* ─────────────────────────────────────────────────────────────
   Navigator Gas – Energy Saving Solutions
   app.js  –  all interactive logic

   Feature content lives in features.json (human-readable reference).
   The FEATURES array below mirrors that file — edit either one
   to update content; keep both in sync.
   ───────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    id:    "vfd",
    title: "Frequency Converters",
    body:  "Frequency converters in the engine room optimize the use of electrical motors to deliver exactly what they need to, not more. Applied on seawater pumps and engine room fans.",
    top:   68, left: 12,
    img:   "VFD.png",
    video: null
  },
  {
    id:    "led",
    title: "LED Lights",
    body:  "All traditional lights are replaced with LED lights, lowering the energy consumption onboard for all lights on deck and inside the vessel.",
    top:   52, left: 40,
    img:   "LED.png",
    video: null
  },
  {
    id:    "duct",
    title: "Propeller Duct",
    body:  "The duct creates a more uniform flow into the propeller making sure it can work optimally.",
    top:   80, left: 8,
    img:   "Duct.jpg",
    video: null
  },
  {
    id:    "pbcf",
    title: "Propeller Boss Cap Fin",
    body:  "The PBCF recovers energy that is lost in the propeller's wake, optimizing the functioning of the propeller.",
    top:   84, left: 6,
    img:   "PBCF.jpg",
    video: "https://www.youtube.com/embed/XDRugRYzgxY"
  },
  {
    id:    "af",
    title: "High Performance Anti-Fouling",
    body:  "Reducing the friction of the hull reduces the resistance when sailing.",
    top:   82, left: 48,
    img:   "AF.jpg",
    video: null
  },
  {
    id:    "trim",
    title: "Trim Optimization",
    body:  "Having the optimized vessel trim for each load condition improved the wave patterns around the vessel.",
    top:   82, left: 76,
    img:   "Trim.jpg",
    video: null
  }
];

/* ── DOM references ── */
const wrap     = document.getElementById('imgWrap');
const zoomWrap = document.getElementById('zoomWrap');
const svgEl    = document.getElementById('svgLayer');
const overlay  = document.getElementById('overlay');

/* ── State ── */
let active = null;

/* ── Zoom state ── */
const MIN_SCALE = 1, MAX_SCALE = 4;
const zoom = { scale: 1, panX: 0, panY: 0 };

function applyZoom() {
  zoomWrap.style.transform =
    `translate(${zoom.panX}px,${zoom.panY}px) scale(${zoom.scale})`;
}

function clampPan() {
  const { width: W, height: H } = wrap.getBoundingClientRect();
  zoom.panX = Math.min(0, Math.max(W * (1 - zoom.scale), zoom.panX));
  zoom.panY = Math.min(0, Math.max(H * (1 - zoom.scale), zoom.panY));
}

function resetZoom() {
  zoom.scale = 1; zoom.panX = 0; zoom.panY = 0;
  zoomWrap.style.transition = 'transform .3s ease';
  applyZoom();
  zoomWrap.addEventListener('transitionend', () => {
    zoomWrap.style.transition = '';
  }, { once: true });
}

/* Convert a dot's local % position to screen px within img-wrap (accounting for zoom) */
function dotScreenPos(f) {
  const { width: W, height: H } = wrap.getBoundingClientRect();
  return {
    x: (f.left / 100 * W) * zoom.scale + zoom.panX,
    y: (f.top  / 100 * H) * zoom.scale + zoom.panY
  };
}

/* ── Build hotspots, lines and popups ── */
FEATURES.forEach((f, i) => {

  /* Dot — lives inside zoomWrap so it scales/pans with the vessel */
  const dot = document.createElement('div');
  dot.className = 'dot';
  dot.style.left = f.left + '%';
  dot.style.top  = f.top  + '%';
  dot.setAttribute('aria-label', f.title);
  dot.setAttribute('role', 'button');
  dot.setAttribute('tabindex', '0');
  zoomWrap.appendChild(dot);

  /* SVG connector line (also inside zoomWrap) */
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.classList.add('conn-line');
  line.id = 'ln' + i;
  svgEl.appendChild(line);

  /* Popup — lives directly in img-wrap (NOT zoomWrap) so it never scales */
  const popup = document.createElement('div');
  popup.className = 'popup' + (f.video ? ' has-video' : '');
  popup.id = 'pp' + i;

  let inner =
    '<div class="popup-img-row">' +
      '<img src="' + f.img + '" alt="' + f.title + '" loading="lazy">' +
      '<div class="popup-text">' +
        '<div class="popup-title">' + f.title + '</div>' +
        '<div class="popup-body">'  + f.body  + '</div>' +
      '</div>' +
    '</div>';

  if (f.video) {
    inner +=
      '<div class="popup-video-wrap">' +
        '<iframe src="' + f.video + '" frameborder="0" ' +
          'allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
          'allowfullscreen title="' + f.title + ' video">' +
        '</iframe>' +
      '</div>';
  }

  popup.innerHTML = inner;
  wrap.appendChild(popup);   /* ← wrap, not zoomWrap */

  /* Click / tap */
  dot.addEventListener('click', e => {
    e.stopPropagation();
    if (active === i) { closeAll(); return; }
    closeAll();
    openFeature(i);
  });

  /* Keyboard */
  dot.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dot.click(); }
    if (e.key === 'Escape') closeAll();
  });
});

/* ── Open a feature popup ── */
function openFeature(i) {
  active = i;
  const f = FEATURES[i];

  const popup = document.getElementById('pp' + i);
  const line  = document.getElementById('ln' + i);
  const { width: W, height: H } = wrap.getBoundingClientRect();

  /* Dot position on screen, accounting for current zoom/pan */
  const { x: dotX, y: dotY } = dotScreenPos(f);

  zoomWrap.querySelectorAll('.dot').forEach((d, idx) =>
    d.classList.toggle('active', idx === i));

  if (window.innerWidth <= 600) {
    /* Mobile: slide-up bottom sheet */
    overlay.classList.add('active');
    popup.classList.add('show');
  } else {
    /* Desktop: position popup near dot */
    const pW = 340;
    const pH = f.video ? 310 : 130;

    let px = dotX + 22;
    let py = dotY - pH / 2;
    if (px + pW > W - 4) px = dotX - pW - 22;
    if (py < 4)          py = 4;
    if (py + pH > H - 4) py = H - pH - 4;
    if (px < 4)          px = 4;

    popup.style.left = px + 'px';
    popup.style.top  = py + 'px';

    /* Connector line — draw in zoomWrap local % space so it stays with the dot */
    const lx = (px < dotX) ? px + pW : px;
    const ly = py + pH / 2;
    /* convert popup anchor back to zoomWrap local space */
    const lineX2 = ((lx - zoom.panX) / zoom.scale) / W * 100;
    const lineY2 = ((ly - zoom.panY) / zoom.scale) / H * 100;
    line.setAttribute('x1', f.left  + '%');
    line.setAttribute('y1', f.top   + '%');
    line.setAttribute('x2', lineX2  + '%');
    line.setAttribute('y2', lineY2  + '%');
    requestAnimationFrame(() => line.classList.add('show'));

    popup.classList.add('show');
  }
}

/* ── Close all popups ── */
function closeAll() {
  active = null;
  document.querySelectorAll('.popup').forEach(p => p.classList.remove('show'));
  document.querySelectorAll('.conn-line').forEach(l => l.classList.remove('show'));
  zoomWrap.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
  overlay.classList.remove('active');
}

/* Close on click outside popup (desktop) */
document.addEventListener('click', e => {
  if (active === null) return;
  const popup = document.getElementById('pp' + active);
  if (popup && !popup.contains(e.target)) closeAll();
});

/* Close on backdrop tap (mobile) */
overlay.addEventListener('click', closeAll);

/* Reposition on resize / orientation change */
window.addEventListener('resize', () => {
  if (zoom.scale > 1) resetZoom();
  if (active !== null) { const idx = active; closeAll(); openFeature(idx); }
});


/* ════════════════════════════════════════════════════════════
   PINCH-TO-ZOOM  +  PAN  +  DOUBLE-TAP RESET
   All touch handling on the wrap element (not document) so it
   doesn't interfere with the swipe-dismiss handler below.
   ════════════════════════════════════════════════════════════ */
(function () {

  /* ── State ── */
  let lastTapTime = 0;
  let lastTapX    = 0;
  let lastTapY    = 0;

  /* Pinch tracking */
  let pinching    = false;
  let pinchStartDist = 0;
  let pinchStartScale = 1;
  let pinchStartMidX  = 0;
  let pinchStartMidY  = 0;
  let pinchStartPanX  = 0;
  let pinchStartPanY  = 0;

  /* Pan tracking (single finger, zoom > 1) */
  let panning     = false;
  let panStartX   = 0;
  let panStartY   = 0;
  let panStartPanX = 0;
  let panStartPanY = 0;

  /* Track movement to distinguish tap from drag */
  let touchMovedPx = 0;
  let touchStartX  = 0;
  let touchStartY  = 0;

  function dist(t1, t2) {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function midpoint(t1, t2) {
    const rect = wrap.getBoundingClientRect();
    return {
      x: (t1.clientX + t2.clientX) / 2 - rect.left,
      y: (t1.clientY + t2.clientY) / 2 - rect.top
    };
  }

  wrap.addEventListener('touchstart', e => {
    /* Don't intercept touches on popups */
    if (e.target.closest('.popup')) return;

    if (e.touches.length === 2) {
      /* ── Start pinch ── */
      e.preventDefault();
      pinching = true;
      panning  = false;
      pinchStartDist  = dist(e.touches[0], e.touches[1]);
      pinchStartScale = zoom.scale;
      const mid = midpoint(e.touches[0], e.touches[1]);
      pinchStartMidX  = mid.x;
      pinchStartMidY  = mid.y;
      pinchStartPanX  = zoom.panX;
      pinchStartPanY  = zoom.panY;

    } else if (e.touches.length === 1) {
      /* ── Start potential pan or tap ── */
      touchStartX  = e.touches[0].clientX;
      touchStartY  = e.touches[0].clientY;
      touchMovedPx = 0;
      pinching = false;

      if (zoom.scale > 1) {
        panning     = true;
        panStartX   = e.touches[0].clientX;
        panStartY   = e.touches[0].clientY;
        panStartPanX = zoom.panX;
        panStartPanY = zoom.panY;
      }
    }
  }, { passive: false });

  wrap.addEventListener('touchmove', e => {
    if (e.target.closest('.popup')) return;

    if (pinching && e.touches.length === 2) {
      e.preventDefault();
      const d   = dist(e.touches[0], e.touches[1]);
      const mid = midpoint(e.touches[0], e.touches[1]);
      const scaleRatio = d / pinchStartDist;
      const newScale   = Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinchStartScale * scaleRatio));

      /* Zoom around the initial pinch midpoint */
      const lx = (pinchStartMidX - pinchStartPanX) / pinchStartScale;
      const ly = (pinchStartMidY - pinchStartPanY) / pinchStartScale;
      zoom.scale = newScale;
      zoom.panX  = mid.x - lx * newScale;
      zoom.panY  = mid.y - ly * newScale;

      clampPan();
      applyZoom();

    } else if (panning && !pinching && e.touches.length === 1) {
      e.preventDefault();
      const dx = e.touches[0].clientX - panStartX;
      const dy = e.touches[0].clientY - panStartY;
      touchMovedPx = Math.sqrt(dx * dx + dy * dy);
      zoom.panX = panStartPanX + dx;
      zoom.panY = panStartPanY + dy;
      clampPan();
      applyZoom();
    } else {
      /* Track movement for tap detection */
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;
      touchMovedPx = Math.sqrt(dx * dx + dy * dy);
    }
  }, { passive: false });

  wrap.addEventListener('touchend', e => {
    if (e.target.closest('.popup')) return;

    if (pinching) {
      pinching = false;
      /* If zoomed back to ~1, fully reset */
      if (zoom.scale <= 1.05) resetZoom();
      return;
    }

    panning = false;

    /* Treat as tap only if finger barely moved */
    if (touchMovedPx < 10 && e.changedTouches.length === 1) {
      const now = Date.now();
      const tx  = e.changedTouches[0].clientX;
      const ty  = e.changedTouches[0].clientY;
      const dtap = Math.sqrt((tx - lastTapX) ** 2 + (ty - lastTapY) ** 2);

      if (now - lastTapTime < 300 && dtap < 40) {
        /* ── Double-tap: reset zoom ── */
        resetZoom();
        closeAll();
      }

      lastTapTime = now;
      lastTapX    = tx;
      lastTapY    = ty;
    }
  }, { passive: true });

}());


/* ════════════════════════════════════════════════════════════
   SWIPE-DOWN TO DISMISS  (portrait mobile bottom sheet)
   ════════════════════════════════════════════════════════════ */
(function () {
  let startY    = 0;
  let currentY  = 0;
  let dragging  = false;
  const DISMISS_THRESHOLD = 80;

  function getActivePopup() {
    return active !== null ? document.getElementById('pp' + active) : null;
  }

  document.addEventListener('touchstart', e => {
    if (window.innerWidth > 600 || window.matchMedia('(orientation: landscape)').matches) return;
    const popup = getActivePopup();
    if (!popup || !popup.classList.contains('show')) return;
    if (!popup.contains(e.target)) return;

    startY   = e.touches[0].clientY;
    currentY = startY;
    dragging = true;
    popup.style.transition = 'none';
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    const popup = getActivePopup();
    if (!popup) return;
    currentY = e.touches[0].clientY;
    const dy = currentY - startY;
    if (dy > 0) popup.style.transform = `translateY(${dy}px)`;
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    const popup = getActivePopup();
    if (!popup) return;

    const dy = currentY - startY;

    if (dy >= DISMISS_THRESHOLD) {
      popup.style.transition = 'transform .25s ease';
      popup.style.transform  = 'translateY(100%)';
      popup.addEventListener('transitionend', () => {
        popup.style.transition = '';
        popup.style.transform  = '';
        closeAll();
      }, { once: true });
    } else {
      popup.style.transition = 'transform .2s ease';
      popup.style.transform  = 'translateY(0)';
      popup.addEventListener('transitionend', () => {
        popup.style.transition = '';
        popup.style.transform  = '';
      }, { once: true });
    }
  }, { passive: true });

}());
