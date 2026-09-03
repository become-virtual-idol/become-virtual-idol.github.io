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

/**
 * git add .
git commit -m "Update website"
git push
 * 
 */
