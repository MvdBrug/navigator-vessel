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

/* ── Globals ── */
let active = null;
const wrap    = document.getElementById('imgWrap');
const svgEl   = document.getElementById('svgLayer');
const overlay = document.getElementById('overlay');

/* ── Build hotspots, lines and popups ── */
FEATURES.forEach((f, i) => {

  /* Dot */
  const dot = document.createElement('div');
  dot.className = 'dot';
  dot.style.left = f.left + '%';
  dot.style.top  = f.top  + '%';
  dot.setAttribute('aria-label', f.title);
  dot.setAttribute('role', 'button');
  dot.setAttribute('tabindex', '0');
  wrap.appendChild(dot);

  /* SVG connector line */
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.classList.add('conn-line');
  line.id = 'ln' + i;
  svgEl.appendChild(line);

  /* Popup */
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
  wrap.appendChild(popup);

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
  const f    = FEATURES[i];
  const rect = wrap.getBoundingClientRect();
  const W    = rect.width, H = rect.height;
  const dotX = f.left / 100 * W;
  const dotY = f.top  / 100 * H;

  const popup = document.getElementById('pp' + i);
  const line  = document.getElementById('ln' + i);

  wrap.querySelectorAll('.dot').forEach((d, idx) =>
    d.classList.toggle('active', idx === i));

  if (window.innerWidth <= 600) {
    /* Mobile: slide-up bottom sheet */
    overlay.classList.add('active');
    popup.classList.add('show');
  } else {
    /* Desktop: positioned near dot with connector line */
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

    const lx = (px < dotX) ? px + pW : px;
    const ly = py + pH / 2;
    line.setAttribute('x1', (dotX / W * 100) + '%');
    line.setAttribute('y1', (dotY / H * 100) + '%');
    line.setAttribute('x2', (lx   / W * 100) + '%');
    line.setAttribute('y2', (ly   / H * 100) + '%');
    requestAnimationFrame(() => line.classList.add('show'));

    popup.classList.add('show');
  }
}

/* ── Close all popups ── */
function closeAll() {
  active = null;
  document.querySelectorAll('.popup').forEach(p => p.classList.remove('show'));
  document.querySelectorAll('.conn-line').forEach(l => l.classList.remove('show'));
  document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
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
  if (active !== null) { const idx = active; closeAll(); openFeature(idx); }
});

/* ── Swipe-down to dismiss (portrait mobile bottom sheet) ── */
(function () {
  let startY    = 0;   // touch start Y position
  let currentY  = 0;   // current drag Y position
  let dragging  = false;
  const DISMISS_THRESHOLD = 80; // px downward to trigger dismiss

  function getActivePopup() {
    return active !== null ? document.getElementById('pp' + active) : null;
  }

  document.addEventListener('touchstart', e => {
    // Only activate in portrait on mobile
    if (window.innerWidth > 600 || window.matchMedia('(orientation: landscape)').matches) return;
    const popup = getActivePopup();
    if (!popup || !popup.classList.contains('show')) return;
    // Only start drag if touch begins on the popup itself
    if (!popup.contains(e.target)) return;

    startY   = e.touches[0].clientY;
    currentY = startY;
    dragging = true;
    // Disable the CSS transition so the popup follows the finger instantly
    popup.style.transition = 'none';
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    const popup = getActivePopup();
    if (!popup) return;

    currentY = e.touches[0].clientY;
    const dy = currentY - startY;

    // Only allow dragging downward
    if (dy > 0) {
      popup.style.transform = `translateY(${dy}px)`;
    }
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    const popup = getActivePopup();
    if (!popup) return;

    const dy = currentY - startY;

    if (dy >= DISMISS_THRESHOLD) {
      // Animate the rest of the way off-screen then close
      popup.style.transition = 'transform .25s ease';
      popup.style.transform  = 'translateY(100%)';
      popup.addEventListener('transitionend', () => {
        popup.style.transition = '';
        popup.style.transform  = '';
        closeAll();
      }, { once: true });
    } else {
      // Snap back up
      popup.style.transition = 'transform .2s ease';
      popup.style.transform  = 'translateY(0)';
      popup.addEventListener('transitionend', () => {
        popup.style.transition = '';
        popup.style.transform  = '';
      }, { once: true });
    }
  }, { passive: true });
}());
