/* ─────────────────────────────────────────────────────────────
   Navigator Gas – Energy Saving Solutions
   app.js  –  all interactive logic
   ───────────────────────────────────────────────────────────── */

const FEATURES = [
  { id:"vfd",  title:"Frequency Converters",
    body:"Frequency converters in the engine room optimize the use of electrical motors to deliver exactly what they need to, not more. Applied on seawater pumps and engine room fans.",
    top:68, left:12, img:"VFD.png", video:null },
  { id:"led",  title:"LED Lights",
    body:"All traditional lights are replaced with LED lights, lowering the energy consumption onboard for all lights on deck and inside the vessel.",
    top:52, left:40, img:"LED.png", video:null },
  { id:"duct", title:"Propeller Duct",
    body:"The duct creates a more uniform flow into the propeller making sure it can work optimally.",
    top:80, left:8,  img:"Duct.jpg", video:null },
  { id:"pbcf", title:"Propeller Boss Cap Fin",
    body:"The PBCF recovers energy that is lost in the propeller's wake, optimizing the functioning of the propeller.",
    top:84, left:6,  img:"PBCF.jpg", video:"https://www.youtube.com/embed/XDRugRYzgxY" },
  { id:"af",   title:"High Performance Anti-Fouling",
    body:"Reducing the friction of the hull reduces the resistance when sailing.",
    top:82, left:48, img:"AF.jpg", video:null },
  { id:"trim", title:"Trim Optimization",
    body:"Having the optimized vessel trim for each load condition improved the wave patterns around the vessel.",
    top:82, left:76, img:"Trim.jpg", video:null }
];

/* ── DOM ── */
const wrap     = document.getElementById('imgWrap');
const zoomWrap = document.getElementById('zoomWrap');
const svgEl    = document.getElementById('svgLayer');
const overlay  = document.getElementById('overlay');

let active = null;

/* ════════════════════════════════════════════════════════════
   ZOOM STATE
   panX/panY are in img-wrap local px (relative to its top-left)
   ════════════════════════════════════════════════════════════ */
const MIN_SCALE = 1, MAX_SCALE = 5;
const zoom = { scale:1, panX:0, panY:0 };

function applyZoom() {
  zoomWrap.style.transform =
    `translate(${zoom.panX}px,${zoom.panY}px) scale(${zoom.scale})`;

  /* Counter-scale every dot so it stays the same visual size */
  const inv = 1 / zoom.scale;
  zoomWrap.querySelectorAll('.dot').forEach(dot => {
    const isActive = dot.classList.contains('active');
    /* active dot gets a slight enlargement so it stands out */
    dot.style.transform = `translate(-50%,-50%) scale(${isActive ? inv * 1.3 : inv})`;
  });
}

function clampPan() {
  const rect = wrap.getBoundingClientRect();
  const vW = window.innerWidth, vH = window.innerHeight;
  const margin = 40; /* minimum px of vessel that must remain visible */

  /* panX: allow image to slide anywhere across the full viewport width */
  const minX = margin - rect.left - rect.width  * zoom.scale;
  const maxX = vW - margin - rect.left;
  zoom.panX = Math.max(minX, Math.min(maxX, zoom.panX));

  /* panY: allow image to slide anywhere across the full viewport height */
  const minY = margin - rect.top  - rect.height * zoom.scale;
  const maxY = vH - margin - rect.top;
  zoom.panY = Math.max(minY, Math.min(maxY, zoom.panY));
}

function resetZoom() {
  zoom.scale = 1; zoom.panX = 0; zoom.panY = 0;
  zoomWrap.style.transition = 'transform .3s ease';
  applyZoom();
  zoomWrap.addEventListener('transitionend', () => {
    zoomWrap.style.transition = '';
  }, { once: true });
}

/* ── Dot screen position in viewport px (accounts for zoom) ── */
function dotScreenPos(f) {
  const r = wrap.getBoundingClientRect();
  return {
    x: r.left + (f.left / 100 * r.width)  * zoom.scale + zoom.panX,
    y: r.top  + (f.top  / 100 * r.height) * zoom.scale + zoom.panY
  };
}

/* ════════════════════════════════════════════════════════════
   BUILD HOTSPOTS, LINES AND POPUPS
   Popups go into <body> as position:fixed — they are never
   inside zoomWrap and are never scaled.
   ════════════════════════════════════════════════════════════ */
FEATURES.forEach((f, i) => {

  /* Dot (inside zoomWrap — scales with vessel, counter-scaled by JS) */
  const dot = document.createElement('div');
  dot.className = 'dot';
  dot.style.left = f.left + '%';
  dot.style.top  = f.top  + '%';
  dot.style.transform = 'translate(-50%,-50%) scale(1)'; /* JS owns this */
  dot.setAttribute('aria-label', f.title);
  dot.setAttribute('role', 'button');
  dot.setAttribute('tabindex', '0');
  zoomWrap.appendChild(dot);

  /* SVG connector line (inside zoomWrap — scales with vessel) */
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.classList.add('conn-line');
  line.id = 'ln' + i;
  svgEl.appendChild(line);

  /* Popup (in <body>, position:fixed — never scales) */
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
          'allowfullscreen title="' + f.title + ' video"></iframe>' +
      '</div>';
  }

  popup.innerHTML = inner;
  document.body.appendChild(popup);   /* ← body, not wrap or zoomWrap */

  dot.addEventListener('click', e => {
    e.stopPropagation();
    if (active === i) { closeAll(); return; }
    closeAll();
    openFeature(i);
  });

  dot.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dot.click(); }
    if (e.key === 'Escape') closeAll();
  });
});

/* ── Open popup ── */
function openFeature(i) {
  active = i;
  const f = FEATURES[i];
  const popup = document.getElementById('pp' + i);
  const line  = document.getElementById('ln' + i);

  /* Mark active dot and re-apply counter-scale so it picks up 1.3× size */
  zoomWrap.querySelectorAll('.dot').forEach((d, idx) => {
    d.classList.toggle('active', idx === i);
  });
  applyZoom(); /* refresh dot transforms */

  const { x: dotX, y: dotY } = dotScreenPos(f);

  if (window.innerWidth <= 600) {
    /* Mobile: slide-up bottom sheet */
    overlay.classList.add('active');
    popup.classList.add('show');

  } else {
    /* Desktop: position popup near dot (viewport coordinates) */
    const pW = 340;
    const pH = f.video ? 310 : 130;
    const vW = window.innerWidth, vH = window.innerHeight;

    let px = dotX + 22;
    let py = dotY - pH / 2;
    if (px + pW > vW - 4) px = dotX - pW - 22;
    if (py < 4)           py = 4;
    if (py + pH > vH - 4) py = vH - pH - 4;
    if (px < 4)           px = 4;

    popup.style.left = px + 'px';
    popup.style.top  = py + 'px';

    /* Connector line — coordinates in zoomWrap local % space */
    const rect  = wrap.getBoundingClientRect();
    const W = rect.width, H = rect.height;
    const lx_vp = (px < dotX) ? px + pW : px;         /* popup anchor viewport x */
    const ly_vp = py + pH / 2;                          /* popup anchor viewport y */
    /* Convert viewport coords → zoomWrap local % */
    const lx_local = ((lx_vp - rect.left - zoom.panX) / zoom.scale) / W * 100;
    const ly_local = ((ly_vp - rect.top  - zoom.panY) / zoom.scale) / H * 100;
    line.setAttribute('x1', f.left  + '%');
    line.setAttribute('y1', f.top   + '%');
    line.setAttribute('x2', lx_local + '%');
    line.setAttribute('y2', ly_local + '%');
    requestAnimationFrame(() => line.classList.add('show'));

    popup.classList.add('show');
  }
}

/* ── Close all ── */
function closeAll() {
  active = null;
  document.querySelectorAll('.popup').forEach(p => p.classList.remove('show'));
  document.querySelectorAll('.conn-line').forEach(l => l.classList.remove('show'));
  zoomWrap.querySelectorAll('.dot').forEach(d => {
    d.classList.remove('active');
  });
  applyZoom(); /* reset dot transforms back to non-active counter-scale */
  overlay.classList.remove('active');
}

/* Click outside → close (desktop) */
document.addEventListener('click', e => {
  if (active === null) return;
  const popup = document.getElementById('pp' + active);
  if (popup && !popup.contains(e.target)) closeAll();
});

/* Backdrop tap → close (mobile) */
overlay.addEventListener('click', closeAll);

/* Resize / orientation → reset zoom, reposition popup */
window.addEventListener('resize', () => {
  if (zoom.scale > 1) resetZoom();
  if (active !== null) { const idx = active; closeAll(); openFeature(idx); }
});


/* ════════════════════════════════════════════════════════════
   PINCH-TO-ZOOM  +  PAN  +  DOUBLE-TAP RESET
   ════════════════════════════════════════════════════════════ */
(function () {
  let pinching       = false;
  let pinchStartDist = 0, pinchStartScale = 1;
  let pinchStartMidX = 0, pinchStartMidY  = 0;
  let pinchStartPanX = 0, pinchStartPanY  = 0;

  let panning      = false;
  let panStartX    = 0, panStartY    = 0;
  let panStartPanX = 0, panStartPanY = 0;

  let touchStartX = 0, touchStartY = 0, touchMovedPx = 0;
  let lastTapTime = 0, lastTapX = 0, lastTapY = 0;

  function dist(a, b) {
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

  /* Midpoint relative to img-wrap top-left */
  function mid(a, b) {
    const r = wrap.getBoundingClientRect();
    return {
      x: (a.clientX + b.clientX) / 2 - r.left,
      y: (a.clientY + b.clientY) / 2 - r.top
    };
  }

  wrap.addEventListener('touchstart', e => {
    if (e.target.closest('.popup')) return;

    if (e.touches.length === 2) {
      e.preventDefault();
      closeAll();                          /* close popup while zooming */
      pinching        = true;
      panning         = false;
      pinchStartDist  = dist(e.touches[0], e.touches[1]);
      pinchStartScale = zoom.scale;
      const m = mid(e.touches[0], e.touches[1]);
      pinchStartMidX = m.x;  pinchStartMidY = m.y;
      pinchStartPanX = zoom.panX; pinchStartPanY = zoom.panY;

    } else if (e.touches.length === 1) {
      touchStartX  = e.touches[0].clientX;
      touchStartY  = e.touches[0].clientY;
      touchMovedPx = 0;
      pinching     = false;

      if (zoom.scale > 1) {
        panning      = true;
        panStartX    = e.touches[0].clientX;
        panStartY    = e.touches[0].clientY;
        panStartPanX = zoom.panX;
        panStartPanY = zoom.panY;
      }
    }
  }, { passive: false });

  wrap.addEventListener('touchmove', e => {
    if (e.target.closest('.popup')) return;

    if (pinching && e.touches.length === 2) {
      e.preventDefault();
      const d = dist(e.touches[0], e.touches[1]);
      const m = mid(e.touches[0], e.touches[1]);
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE,
                         pinchStartScale * d / pinchStartDist));

      /* Scale around the initial pinch midpoint, following finger movement */
      const localX = (pinchStartMidX - pinchStartPanX) / pinchStartScale;
      const localY = (pinchStartMidY - pinchStartPanY) / pinchStartScale;
      zoom.scale = newScale;
      zoom.panX  = m.x - localX * newScale;
      zoom.panY  = m.y - localY * newScale;
      clampPan();
      applyZoom();

    } else if (panning && !pinching && e.touches.length === 1) {
      e.preventDefault();
      const dx = e.touches[0].clientX - panStartX;
      const dy = e.touches[0].clientY - panStartY;
      touchMovedPx = Math.hypot(dx, dy);
      zoom.panX = panStartPanX + dx;
      zoom.panY = panStartPanY + dy;
      clampPan();
      applyZoom();

    } else {
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;
      touchMovedPx = Math.hypot(dx, dy);
    }
  }, { passive: false });

  wrap.addEventListener('touchend', e => {
    if (e.target.closest('.popup')) return;

    if (pinching) {
      pinching = false;
      if (zoom.scale <= 1.05) resetZoom();
      return;
    }

    panning = false;

    /* Tap detection (finger barely moved) */
    if (touchMovedPx < 10 && e.changedTouches.length === 1) {
      const now = Date.now();
      const tx = e.changedTouches[0].clientX;
      const ty = e.changedTouches[0].clientY;

      if (now - lastTapTime < 320 && Math.hypot(tx - lastTapX, ty - lastTapY) < 40) {
        /* Double-tap → reset zoom */
        resetZoom();
        closeAll();
      }
      lastTapTime = now;
      lastTapX = tx;
      lastTapY = ty;
    }
  }, { passive: true });
}());


/* ════════════════════════════════════════════════════════════
   SWIPE-DOWN TO DISMISS  (portrait mobile bottom sheet only)
   ════════════════════════════════════════════════════════════ */
(function () {
  let startY = 0, currentY = 0, dragging = false;
  const THRESHOLD = 80;

  function activePopup() {
    return active !== null ? document.getElementById('pp' + active) : null;
  }

  document.addEventListener('touchstart', e => {
    if (window.innerWidth > 600) return;
    if (window.matchMedia('(orientation: landscape)').matches) return;
    const p = activePopup();
    if (!p || !p.classList.contains('show') || !p.contains(e.target)) return;
    startY = currentY = e.touches[0].clientY;
    dragging = true;
    p.style.transition = 'none';
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    const p = activePopup();
    if (!p) return;
    currentY = e.touches[0].clientY;
    const dy = currentY - startY;
    if (dy > 0) p.style.transform = `translateY(${dy}px)`;
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    const p = activePopup();
    if (!p) return;
    const dy = currentY - startY;
    if (dy >= THRESHOLD) {
      p.style.transition = 'transform .25s ease';
      p.style.transform  = 'translateY(100%)';
      p.addEventListener('transitionend', () => {
        p.style.transition = p.style.transform = '';
        closeAll();
      }, { once: true });
    } else {
      p.style.transition = 'transform .2s ease';
      p.style.transform  = 'translateY(0)';
      p.addEventListener('transitionend', () => {
        p.style.transition = p.style.transform = '';
      }, { once: true });
    }
  }, { passive: true });
}());
