/*
  NIPS neon microsite animation layer.
  Uses GSAP + ScrollTrigger from CDN, so no npm/build step is required.
*/

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const body = document.body;
const progressBar = document.querySelector('.scroll-progress span');
const cursorGlow = document.querySelector('.cursor-glow');
const motionToggle = document.getElementById('motionToggle');
let paused = false;

// Smooth scroll progress + ambient pointer light.
window.addEventListener('scroll', () => {
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  const pct = scrollable > 0 ? (scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${pct}%`;
}, { passive: true });

window.addEventListener('pointermove', (e) => {
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
}, { passive: true });

motionToggle.addEventListener('click', () => {
  paused = !paused;
  body.classList.toggle('motion-paused', paused);
  gsap.globalTimeline.paused(paused);
  motionToggle.textContent = paused ? 'Resume motion' : 'Pause motion';
});

if (!reduceMotion) {
  // Hero entrance.
  gsap.to('.hero .reveal', {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 1,
    stagger: .1,
    ease: 'power3.out',
    delay: .2
  });

  gsap.fromTo('.hero-card',
    { y: 48, rotateY: -18, rotateX: 8, scale: .92, opacity: 0 },
    { y: 0, rotateY: 0, rotateX: 0, scale: 1, opacity: 1, duration: 1.35, ease: 'expo.out', delay: .25 }
  );

  // Generic float-in reveals.
  gsap.utils.toArray('.reveal:not(.hero .reveal)').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: .9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%', once: true }
    });
  });

  // Strong scroll-driven rotation for key objects.
  gsap.to('.hero-card', {
    rotateY: 18,
    rotateZ: 4,
    y: -60,
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 }
  });

  gsap.to('.orbit-a', {
    rotate: '+=210',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });

  gsap.to('.orbit-b', {
    rotate: '-=180',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });

  gsap.utils.toArray('.feature-card').forEach((card, i) => {
    const target = Number(card.dataset.rotate || 0);
    gsap.fromTo(card,
      { rotateY: i % 2 ? 14 : -14, rotateX: 8, y: 70 },
      {
        rotateY: target,
        rotateX: 0,
        y: 0,
        ease: 'none',
        scrollTrigger: { trigger: card, start: 'top 95%', end: 'center 55%', scrub: .8 }
      }
    );
  });

  // Studio sticky preview rotates and changes labels as cards pass the viewport.
  const stationCards = gsap.utils.toArray('.station-card');
  const dots = document.querySelectorAll('.station-dot');
  const previewLabel = document.getElementById('previewLabel');
  const preview = document.getElementById('studioPreview');

  stationCards.forEach((card, index) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 52%',
      end: 'bottom 52%',
      onEnter: () => activateStation(index),
      onEnterBack: () => activateStation(index)
    });
  });

  function activateStation(index) {
  dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  previewLabel.textContent = stationCards[index].dataset.label;
  gsap.to(preview, { rotateY: (index - 1.5) * 7, rotateZ: index % 2 ? 2.4 : -2.4, duration: .65, ease: 'power3.out' });
  gsap.fromTo('.avatar', { y: 14, scale: .97 }, { y: 0, scale: 1, duration: .55, ease: 'back.out(1.8)' });
  document.querySelector('.preview-caption b').textContent = `0${index + 1} / 04`;

  document.querySelectorAll('.bg-media').forEach((el) => {
    const isActive = Number(el.dataset.station) === index;
    el.classList.toggle('active', isActive);

    if (el.tagName === 'VIDEO') {
      if (isActive) {
        el.currentTime = 0;
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    }
  });
}

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stationCards[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  gsap.to('.phone-mock', {
    rotate: -7,
    y: -35,
    scrollTrigger: { trigger: '.share-card', start: 'top bottom', end: 'bottom top', scrub: 1.1 }
  });

  // Soft perpetual floating.
  gsap.to('.floating-card', { y: -12, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('.tag-a', { y: -12, duration: 2.1, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('.tag-b', { y: 14, duration: 2.7, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('.tag-c', { y: -9, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
}

// Mouse / touch 3D tilt for cards. Disabled on coarse pointers.
if (window.matchMedia('(pointer:fine)').matches && !reduceMotion) {
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5;
      const py = (e.clientY - r.top) / r.height - .5;
      gsap.to(card, { rotateY: px * 8, rotateX: py * -8, duration: .35, ease: 'power2.out', transformPerspective: 1000 });
    });
    card.addEventListener('pointerleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: .65, ease: 'power3.out' });
    });
  });
}

// Ensure everything is visible if animation CDN fails.
setTimeout(() => {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
  }
}, 1200);

(function initOrganizerMap() {
  const mapEl = document.getElementById('organizerMap');
  if (!mapEl) return;

  const worldView = { center: [18, 25], zoom: 2 };
  const locations = [
    { country: 'au', count: 8, name: 'Australia', place: 'Melbourne', lat: -37.8136, lng: 144.9631, align: '' },
    { country: 'kr', count: 7, name: 'Korea', place: 'Seoul', lat: 37.5665, lng: 126.9780, align: '' },
    { country: 'it', count: 2, name: 'Italy', place: 'Rome', lat: 41.9028, lng: 12.4964, align: 'is-label-right' },
    { country: 'us', count: 1, name: 'United States', place: 'Pittsburgh', lat: 40.4406, lng: -79.9959, align: '' },
    { country: 'cn', count: 1, name: 'China', place: 'Beijing', lat: 39.9042, lng: 116.4074, align: 'is-label-left' },
    { country: 'uk', count: 2, name: 'United Kingdom', place: 'Glasgow', lat: 55.8642, lng: -4.2518, align: '' },
    { country: 'jp', count: 1, name: 'Japan', place: 'Kyoto', lat: 35.0116, lng: 135.7681, align: 'is-label-right' },
    { country: 'rw', count: 1, name: 'Rwanda', place: 'Kigali', lat: -1.9441, lng: 30.0619, align: '' }
  ];

  const maxCount = Math.max(...locations.map((loc) => loc.count));
  const minPinSize = 16;
  const maxPinSize = 40;

  function pinSize(count) {
    if (maxCount <= 1) return maxPinSize;
    return Math.round(minPinSize + ((count - 1) / (maxCount - 1)) * (maxPinSize - minPinSize));
  }

  if (typeof L === 'undefined') {
    mapEl.textContent = 'Map library failed to load.';
    return;
  }

  const map = L.map(mapEl, {
    center: worldView.center,
    zoom: worldView.zoom,
    minZoom: worldView.zoom,
    maxZoom: worldView.zoom,
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: false,
    boxZoom: false,
    keyboard: false,
    dragging: false,
    tap: false,
    worldCopyJump: true,
    attributionControl: true
  });

  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();
  if (map.tap) map.tap.disable();

  map.on('zoom zoomend move moveend', () => {
    if (map.getZoom() !== worldView.zoom) {
      map.setView(worldView.center, worldView.zoom, { animate: false });
    }
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: worldView.zoom,
    minZoom: worldView.zoom
  }).addTo(map);

  locations.forEach((loc) => {
    const size = pinSize(loc.count);
    const coreInset = Math.round(size * 0.27);
    const label = `${loc.name} · ${loc.count}`;

    const icon = L.divIcon({
      className: 'leaflet-pin-wrap',
      html: `<div class="leaflet-pin ${loc.align}" style="width:${size}px;height:${size}px" data-country="${loc.country}"><span class="leaflet-pin-pulse"></span><span class="leaflet-pin-core" style="inset:${coreInset}px"></span><span class="leaflet-pin-label">${label}</span></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
    L.marker([loc.lat, loc.lng], {
      icon,
      title: `${label} · ${loc.place}`,
      keyboard: false,
      interactive: false
    }).addTo(map);
  });

  const refreshMap = () => map.invalidateSize();
  window.addEventListener('resize', refreshMap);
  setTimeout(refreshMap, 400);
  setTimeout(refreshMap, 1400);
})();

/**
 * git add .
git commit -m "Update website"
git push
 * 
 */
