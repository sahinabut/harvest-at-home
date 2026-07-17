/* =========================================================
   Harvest at Home — Main JS
   ========================================================= */

/* ----- ZIP Logic (shared) ----- */
const ZIP_PATTERN = /^\d{5}$/;
const AUSTIN_PATTERN = /^787\d{2}$/;

const ZIP_STRINGS = {
  inArea: '<strong>You\'re in our service area.</strong> We\'ll reach out within 5 business days with your custom layout design.',
  waitlist: '<strong>Not in your area yet.</strong> You\'re on the waitlist — we\'ve logged your zip code, and it helps decide where we expand next.',
  invalid: 'Enter a 5-digit zip code to request your site visit.'
};

function validateZip(zip) {
  if (!ZIP_PATTERN.test(zip)) return 'invalid';
  if (AUSTIN_PATTERN.test(zip)) return 'in-area';
  return 'waitlist';
}

// Stub: log out-of-area ZIP (endpoint TBD)
function logOutOfAreaZip(zip) {
  // TODO: POST to endpoint/sheet when confirmed
  console.log('[Harvest] Out-of-area ZIP logged:', zip);
}

function applyZipResult(resultEl, zip) {
  const state = validateZip(zip);
  // Preserve the element's base class (hero-zip-result or form-zip-result)
  const base = resultEl.id === 'contact-zip-result' ? 'form-zip-result' : 'hero-zip-result';
  resultEl.className = `${base} visible ${state}`;
  resultEl.innerHTML = ZIP_STRINGS[state] || ZIP_STRINGS.invalid;

  if (state === 'waitlist') {
    logOutOfAreaZip(zip);
  }
}

/* ----- Hero ZIP Pill ----- */
function initHeroZip() {
  const form = document.getElementById('hero-zip-form');
  const input = document.getElementById('hero-zip-input');
  const result = document.getElementById('hero-zip-result');
  if (!form || !input || !result) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    applyZipResult(result, input.value.trim());
  });

  // Allow enter key
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyZipResult(result, input.value.trim());
    }
  });
}

/* ----- Contact Form Submit Handler ----- */
// Isolated so it can be swapped for Typeform/Tally redirect
function handleContactFormSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const zipInput = form.querySelector('#contact-zip');
  const result = document.getElementById('contact-zip-result');
  if (!zipInput || !result) return;

  applyZipResult(result, zipInput.value.trim());

  // TODO: swap for Typeform/Tally redirect or backend POST
  // Example: window.location.href = 'https://form.typeform.com/to/XXXXX?zip=' + encodeURIComponent(zipInput.value);
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', handleContactFormSubmit);
}

/* ----- Scroll Fade-Up ----- */
function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const els = document.querySelectorAll('.fade-up');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children if parent has data-stagger
        const delay = entry.target.dataset.staggerIndex
          ? parseInt(entry.target.dataset.staggerIndex) * 110
          : 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* Apply stagger indices to children of stagger containers */
function initStagger() {
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.dataset.staggerIndex = i;
    });
  });
}

/* ----- Marquee: duplicate track for seamless loop ----- */
function initMarquee() {
  const wrap = document.querySelector('.marquee-track-wrap');
  const track = document.querySelector('.marquee-track');
  if (!wrap || !track) return;

  const dupe = track.cloneNode(true);
  dupe.setAttribute('aria-hidden', 'true');
  dupe.classList.add('dupe');
  wrap.appendChild(dupe);
}

/* ----- Nav hamburger ----- */
function initNav() {
  const hamburger = document.querySelector('.nav-hamburger');
  const links = document.querySelector('.nav-links');
  if (!hamburger || !links) return;

  hamburger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      links.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.focus();
    }
  });
}

/* ----- Nav scroll glass ----- */
function initNavScroll() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  const toggle = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  toggle(); // run once on load
  window.addEventListener('scroll', toggle, { passive: true });
}


/* ----- Mid CTA scroll reveal ----- */
function initMidCta() {
  const section = document.querySelector('.midcta-section');
  const panel  = document.querySelector('.midcta-sticky');
  const cta    = document.querySelector('.midcta-cta');
  const h3     = document.querySelector('.midcta-h3');
  if (!section || !panel || !cta || !h3) return;

  function update() {
    const rect     = section.getBoundingClientRect();
    const scrolled = -rect.top;                      // px scrolled past section top
    const range    = section.offsetHeight - window.innerHeight; // 100vh

    // Pin / unpin
    if (scrolled <= 0) {
      // Above section — panel sits at top of section
      panel.classList.remove('is-pinned', 'is-past');
    } else if (scrolled >= range) {
      // Below section — panel sits at bottom of section
      panel.classList.remove('is-pinned');
      panel.classList.add('is-past');
    } else {
      // Inside section — pin to viewport
      panel.classList.add('is-pinned');
      panel.classList.remove('is-past');
    }

    // Animation: 0→1 over the 100vh scroll range
    const progress = scrolled / range;
    if (progress >= 0.5) {
      h3.classList.add('hidden');
      cta.classList.add('revealed');
    } else {
      h3.classList.remove('hidden');
      cta.classList.remove('revealed');
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ----- Survey Modal ----- */
function initSurvey() {
  const modal     = document.getElementById('survey-modal');
  const closeBtn  = document.getElementById('survey-close-btn');
  const backBtn   = document.getElementById('survey-back');
  const nextBtn   = document.getElementById('survey-next');
  const progressBar = document.getElementById('survey-progress-bar');
  const stepCount = document.getElementById('survey-step-count');
  const navBar    = document.getElementById('survey-nav');
  if (!modal) return;

  const TOTAL_STEPS = 9; // step 10 is success screen
  let current = 1;

  function getStep(n) {
    return modal.querySelector(`.survey-step[data-step="${n}"]`);
  }

  function showStep(n) {
    const prev = modal.querySelector('.survey-step.active');
    if (prev) {
      prev.classList.remove('active');
      prev.classList.add('exiting');
      prev.addEventListener('transitionend', () => {
        prev.classList.remove('exiting');
      }, { once: true });
    }
    const next = getStep(n);
    if (!next) return;
    next.classList.add('active', 'loading');
    setTimeout(() => next.classList.remove('loading'), 400);
    current = n;

    // Progress bar (steps 1-9 only)
    const pct = Math.min(((n - 1) / TOTAL_STEPS) * 100, 100);
    if (progressBar) progressBar.style.width = pct + '%';

    // Step counter
    if (stepCount) {
      if (n <= TOTAL_STEPS) {
        stepCount.textContent = `Step ${n} of ${TOTAL_STEPS}`;
        stepCount.hidden = false;
      } else {
        stepCount.hidden = true;
      }
    }

    // Nav visibility
    if (navBar) {
      navBar.hidden = (n > TOTAL_STEPS);
    }

    // Back button visibility
    if (backBtn) backBtn.style.visibility = n > 1 ? 'visible' : 'hidden';

    // Next button label
    if (nextBtn) {
      if (n === TOTAL_STEPS) nextBtn.textContent = 'Submit →';
      else if (n > TOTAL_STEPS) nextBtn.textContent = 'Back to Home';
      else nextBtn.textContent = 'Continue →';
    }
  }

  function openModal() {
    modal.removeAttribute('hidden');
    requestAnimationFrame(() => modal.classList.add('open'));
    document.body.style.overflow = 'hidden';
    resetSurvey();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.addEventListener('transitionend', () => {
      modal.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }, { once: true });
  }

  function resetSurvey() {
    // Hide all steps
    modal.querySelectorAll('.survey-step').forEach(s => {
      s.classList.remove('active', 'exiting-back', 'exiting-fwd');
    });
    // Clear inputs
    modal.querySelectorAll('input[type=text], input[type=email], input[type=tel], textarea').forEach(el => {
      el.value = '';
    });
    // Clear radio selections
    modal.querySelectorAll('.survey-option').forEach(el => {
      el.classList.remove('selected');
    });
    modal.querySelectorAll('input[type=radio]').forEach(el => {
      el.checked = false;
    });
    // Progress bar reset
    if (progressBar) progressBar.style.width = '0%';
    showStep(1);
  }

  function advanceStep() {
    if (current < TOTAL_STEPS) {
      showStep(current + 1);
    } else if (current === TOTAL_STEPS) {
      // Submit: show success screen (step 10)
      showStep(10);
    } else {
      // Success screen: close modal
      closeModal();
    }
  }

  // Radio option click — select + auto-advance after brief delay
  modal.addEventListener('click', (e) => {
    const option = e.target.closest('.survey-option');
    if (!option) return;

    const step = option.closest('.survey-step');
    if (!step) return;

    // Deselect siblings
    step.querySelectorAll('.survey-option').forEach(o => {
      o.classList.remove('selected');
      const radio = o.querySelector('input[type=radio]');
      if (radio) radio.checked = false;
    });

    option.classList.add('selected');
    const radio = option.querySelector('input[type=radio]');
    if (radio) radio.checked = true;

    // Auto-advance after 320ms
    setTimeout(() => {
      if (current === parseInt(step.dataset.step)) advanceStep();
    }, 320);
  });

  // Next button
  nextBtn && nextBtn.addEventListener('click', () => {
    advanceStep();
  });

  // Back button
  backBtn && backBtn.addEventListener('click', () => {
    if (current > 1) showStep(current - 1);
  });

  // Open triggers
  document.querySelectorAll('[data-open-survey]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Close button
  closeBtn && closeBtn.addEventListener('click', closeModal);

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // Click backdrop to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* ----- Init ----- */
document.addEventListener('DOMContentLoaded', () => {
  initMarquee();
  initStagger();
  initScrollAnimations();
  initHeroZip();
  initContactForm();
  initNav();
  initNavScroll();
  initMidCta();
  initSurvey();
});
