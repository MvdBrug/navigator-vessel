/* ─────────────────────────────────────────────────────────────
   Navigator Gas – Energy Saving Solutions
   app.js  –  all interactive logic

   Coordinate system for dot positions:
     left / top are CSS % relative to the img-wrap element.
     The grid origin (0,0) is bottom-left of the vessel image.
     Conversion: css_left = x, css_top = 100 - y
   ───────────────────────────────────────────────────────────── */

/* ── Dual-feature helper ──────────────────────────────────────
   For features that share a physical location on the vessel,
   pass a `pair` array instead of a single title/body/img.
   Each pair entry: { title, body }
   The popup renders both blocks separated by a blank line,
   with a single shared image.
   ────────────────────────────────────────────────────────────── */

/* ── Category colour map ─────────────────────────────────────
   Keys match the `category` field on each feature.
   ────────────────────────────────────────────────────────────── */
const CATEGORY_COLORS = {
  "energy":      "rgb(40, 34, 88)",
  "hull":        "rgb(0, 159, 227)",
  "operational": "rgb(0, 152, 121)"
};

const CATEGORY_LABELS = {
  "energy":      "Energy Consumers",
  "hull":        "Hull & Propulsion",
  "operational": "Operational"
};

const FEATURES = [

  /* ── Single-slot features ─────────────────────────────────── */
  {
    id: "vfd",
    title: "Frequency Converters",
    body: "Frequency converters allow pumps, fans, and other electrical equipment to run only at the speed needed for the job instead of always running at full power. This avoids unnecessary electricity use, reduces engine load, and helps save fuel while also reducing wear on the equipment. Applied on seawater pumps and engine room fans.",
    top: 63,   /* css top = 100 - y → 100 - 37 */
    left: 17,
    img: "FreqC.png",
    video: null,
    category: "energy"
  },

  {
    id: "led",
    title: "LED Lights",
    body: "All traditional lights are replaced with LED light. Because they need less power, they reduce the load on generators and help lower fuel consumption while also improving reliability and reducing maintenance.",
    top: 50,   /* 100 - 50 */
    left: 49,
    img: "LED.jpg",
    video: null,
    category: "energy"
  },

  {
    id: "af",
    title: "High Performance Anti-Fouling",
    body: "High performance anti fouling keeps the hull smooth by preventing marine growth such as algae and barnacles. A smooth hull creates less drag in the water, allowing the ship to maintain speed with lower power and reduced fuel consumption.",
    top: 79,   /* 100 - 21 */
    left: 47,
    img: "HP_anti_fouling.png",
    video: null,
    category: "hull"
  },

  {
    id: "trim",
    title: "Trim Optimization",
    body: "Having the optimized vessel trim for each load condition reduces the resistance in the water, improves propulsion efficiency, and lowers fuel usage.",
    top: 79,   /* 100 - 21 */
    left: 85,
    img: "Trim_Optimization.png",
    video: null,
    category: "operational"
  },

  {
    id: "hfd",
    title: "High Frequency Data",
    body: "High frequency data collection means recording vessel performance information more often (every 15 min), such as speed and fuel consumption. This makes it easier to spot inefficiencies early and adjust operations to improve fuel efficiency.",
    top: 62,   /* 100 - 38 */
    left: 41,
    img: "High_Frequency_Data.png",
    video: null,
    category: "operational"
  },

  {
    id: "weather",
    title: "Weather Route Optimization",
    body: "Weather route optimization through Marorka plans the safest and most efficient route by considering weather, waves, wind, and currents. By avoiding heavy seas and using favorable conditions, the ship burns less fuel, reduces stress on equipment, and improves voyage safety.",
    top: 33,   /* 100 - 67 */
    left: 20,
    img: "Weather_routing.png",
    video: null,
    category: "operational"
  },

  {
    id: "preheater",
    title: "Electrical Preheater",
    body: "Electrical preheaters use shore or onboard electrical power to heat systems instead of running engines or boilers on fuel. This reduces fuel consumption, lowers emissions, and decreases engine running hours, especially during port stays or standby periods.",
    top: 64,   /* 100 - 36 */
    left: 8,
    img: "Electrical_Preheater.JPG",
    video: null,
    category: "energy"
  },

  {
    id: "ultrasonic",
    title: "Propeller Ultrasonic System",
    body: "Ultrasonic cleaning systems prevent marine growth from attaching to the propeller by using high‑frequency vibrations. A clean propeller maintains its designed shape and efficiency, helping to reduce power demand and fuel consumption.\n\nIt's important that the ultrasonic system is constantly powered, as it can prevent marine growth, but can't remove it.",
    top: 80,   /* 100 - 20 */
    left: 11,
    img: "Propeller_Ultrasonic_System.png",
    video: null,
    category: "hull"
  },

  {
    id: "crew",
    title: "Crew Awareness",
    body: "Our crew is our main enabler of energy savings onboard. When the crew understands how everyday decisions influence the energy efficiency of the vessel, and optimize it, small actions combine into significant fuel savings.",
    top: 43,   /* 100 - 57 */
    left: 17,
    img: "Crew_Awareness.png",
    video: null,
    category: "operational"
  },

  /* ── Dual-slot features (shared position, shared image) ───── */
  {
    id: "duct_rudder",
    pair: [
      {
        title: "Propeller Duct",
        body: "These devices guide and smooth the water flow into the propeller, so it enters in a more controlled and even way. This helps the propeller work more efficiently, reduces wasted energy in the water, and results in lower fuel consumption."
      },
      {
        title: "Rudder Bulb",
        body: "A rudder bulb is a smooth, rounded bulb fitted to the front of the rudder behind the propeller. It improves the water flow coming off the propeller by reducing turbulence allowing more thrust to be used for moving the ship forward."
      }
    ],
    top: 76,   /* 100 - 24 */
    left: 6,
    img: "Propeller_Duct_Rudder_Bulb.png",
    video: null,
    category: "hull"
  },

  {
    id: "pbcf_prop",
    pair: [
      {
        title: "Propeller Boss Cap Fins",
        body: "Propeller boss cap fins are small fins fitted on the propeller hub that reduce the rotating swirl behind the propeller. By recovering this lost energy, the propeller produces more useful thrust, helping the ship move more efficiently with less fuel."
      },
      {
        title: "Propeller Optimization",
        body: "Propeller optimization ensures the propeller design and condition match the vessel's actual operating profile. An optimized propeller delivers the required thrust more efficiently, allowing the ship to sail at the same speed with lower fuel consumption."
      }
    ],
    top: 80,   /* 100 - 20 */
    left: 6,
    img: "Optimized_propeller.jpg",
    video: null,
    category: "hull"
  }
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
const zoom = { scale: 1, panX: 0, panY: 0 };

function applyZoom() {
  zoomWrap.style.transform =
    `translate(${zoom.panX}px,${zoom.panY}px) scale(${zoom.scale})`;

  const visualScale = 1 + (zoom.scale - 1) * 0.2;
  const dotT  = visualScale / zoom.scale;
  const dotTA = visualScale * 1.3 / zoom.scale;

  zoomWrap.querySelectorAll('.dot').forEach(dot => {
    const isActive = dot.classList.contains('active');
    dot.style.transform = `translate(-50%,-50%) scale(${isActive ? dotTA : dotT})`;
    /* Keep box-shadow colour in sync with category when active */
    if (isActive) {
      const c = dot.dataset.catColor || 'rgb(40,51,136)';
      dot.style.boxShadow = `0 0 0 5px ${c.replace('rgb(', 'rgba(').replace(')', ', 0.25)')}`;
    } else {
      dot.style.boxShadow = '';
    }
  });
}

function clampPan() {
  const rect = wrap.getBoundingClientRect();
  const vW = window.innerWidth, vH = window.innerHeight;
  const margin = 40;

  const minX = margin - rect.left - rect.width  * zoom.scale;
  const maxX = vW - margin - rect.left;
  zoom.panX = Math.max(minX, Math.min(maxX, zoom.panX));

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
   BUILD POPUP INNER HTML
   Handles both single features and dual-pair features.
   ════════════════════════════════════════════════════════════ */
function buildPopupInner(f) {
  let textBlock;

  if (f.pair) {
    /* Two titles + bodies, separated by a blank line */
    textBlock =
      '<div class="popup-text">' +
        '<div class="popup-title">' + f.pair[0].title + '</div>' +
        '<div class="popup-body">'  + f.pair[0].body  + '</div>' +
        '<div class="popup-pair-divider"></div>' +
        '<div class="popup-title">' + f.pair[1].title + '</div>' +
        '<div class="popup-body">'  + f.pair[1].body  + '</div>' +
      '</div>';
  } else {
    /* Standard single feature */
    const bodyHtml = f.body.replace(/\n/g, '<br><br>');
    textBlock =
      '<div class="popup-text">' +
        '<div class="popup-title">' + f.title    + '</div>' +
        '<div class="popup-body">'  + bodyHtml   + '</div>' +
      '</div>';
  }

  let inner =
    '<div class="popup-img-row">' +
      '<img src="' + f.img + '" alt="' + (f.pair ? f.pair[0].title : f.title) + '" loading="lazy">' +
      textBlock +
    '</div>';

  if (f.video) {
    inner +=
      '<div class="popup-video-wrap">' +
        '<iframe src="' + f.video + '" frameborder="0" ' +
          'allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
          'allowfullscreen title="' + (f.pair ? f.pair[0].title : f.title) + ' video"></iframe>' +
      '</div>';
  }

  return inner;
}

/* ════════════════════════════════════════════════════════════
   BUILD HOTSPOTS, LINES AND POPUPS
   ════════════════════════════════════════════════════════════ */
FEATURES.forEach((f, i) => {

  /* Dot */
  const dot = document.createElement('div');
  dot.className = 'dot';
  dot.style.left = f.left + '%';
  dot.style.top  = f.top  + '%';
  dot.style.transform = 'translate(-50%,-50%) scale(1)';
  /* Apply category colour to border */
  const catColor = CATEGORY_COLORS[f.category] || 'rgb(40,51,136)';
  dot.style.borderColor = catColor;
  dot.dataset.catColor  = catColor;   /* store for active-state restoration */
  const label = f.pair ? (f.pair[0].title + ' & ' + f.pair[1].title) : f.title;
  dot.setAttribute('aria-label', label);
  dot.setAttribute('role', 'button');
  dot.setAttribute('tabindex', '0');
  zoomWrap.appendChild(dot);

  /* SVG connector line */
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.classList.add('conn-line');
  line.id = 'ln' + i;
  svgEl.appendChild(line);

  /* Popup */
  const isPair  = !!f.pair;
  const hasVideo = !!f.video;
  const popup = document.createElement('div');
  popup.className = 'popup' +
    (hasVideo  ? ' has-video'  : '') +
    (isPair    ? ' is-pair'    : '');
  popup.id = 'pp' + i;
  popup.innerHTML = buildPopupInner(f);
  document.body.appendChild(popup);

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

  zoomWrap.querySelectorAll('.dot').forEach((d, idx) => {
    d.classList.toggle('active', idx === i);
    if (idx === i) {
      d.style.background = d.dataset.catColor || 'rgb(40,51,136)';
    } else {
      d.style.background = '';
    }
  });
  applyZoom();

  const { x: dotX, y: dotY } = dotScreenPos(f);

  if (window.matchMedia('(orientation: portrait)').matches) {
    popup.style.left = '';
    popup.style.top  = '';
    overlay.classList.add('active');
    popup.classList.add('show');

  } else {
    const pW = 340;
    const isPair  = !!f.pair;
    const hasVideo = !!f.video;
    const pH = hasVideo ? 310 : isPair ? 300 : 130;
    const vW = window.innerWidth, vH = window.innerHeight;

    let px = dotX + 22;
    let py = dotY - pH / 2;
    if (px + pW > vW - 4) px = dotX - pW - 22;
    if (py < 4)            py = 4;
    if (py + pH > vH - 4)  py = vH - pH - 4;
    if (px < 4)            px = 4;

    popup.style.left = px + 'px';
    popup.style.top  = py + 'px';

    /* Connector line */
    const rect  = wrap.getBoundingClientRect();
    const W = rect.width, H = rect.height;
    const lx_vp = (px < dotX) ? px + pW : px;
    const ly_vp = py + pH / 2;
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
  document.querySelectorAll('.popup').forEach(p => {
    p.classList.remove('show');
    p.style.left = '';
    p.style.top  = '';
  });
  document.querySelectorAll('.conn-line').forEach(l => l.classList.remove('show'));
  zoomWrap.querySelectorAll('.dot').forEach(d => {
    d.classList.remove('active');
    d.style.background = '';
  });
  applyZoom();
  overlay.classList.remove('active');
}

/* Click outside → close */
document.addEventListener('click', e => {
  if (active === null) return;
  const popup = document.getElementById('pp' + active);
  if (popup && !popup.contains(e.target)) closeAll();
});

/* Backdrop tap → close */
overlay.addEventListener('click', closeAll);

/* Orientation change */
let orientTimer = null;
function onOrientationChange() {
  clearTimeout(orientTimer);
  orientTimer = setTimeout(() => {
    if (zoom.scale > 1) resetZoom();
    if (active !== null) { const idx = active; closeAll(); openFeature(idx); }
  }, 300);
}
window.addEventListener('orientationchange', onOrientationChange);
window.addEventListener('resize', onOrientationChange);


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
      closeAll();
      pinching        = true;
      panning         = false;
      pinchStartDist  = dist(e.touches[0], e.touches[1]);
      pinchStartScale = zoom.scale;
      const m = mid(e.touches[0], e.touches[1]);
      pinchStartMidX = m.x; pinchStartMidY = m.y;
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

    if (touchMovedPx < 10 && e.changedTouches.length === 1) {
      const now = Date.now();
      const tx = e.changedTouches[0].clientX;
      const ty = e.changedTouches[0].clientY;

      if (now - lastTapTime < 320 && Math.hypot(tx - lastTapX, ty - lastTapY) < 40) {
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
    if (!window.matchMedia('(orientation: portrait)').matches) return;
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
