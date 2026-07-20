// Prime Bear — shared behavior

document.addEventListener('DOMContentLoaded', () => {
  // sticky nav shadow on scroll
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll);

  // mobile menu toggle
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.querySelector('.icon-menu')?.classList.toggle('hidden', open);
      toggle.querySelector('.icon-close')?.classList.toggle('hidden', !open);
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.querySelector('.icon-menu')?.classList.remove('hidden');
      toggle.querySelector('.icon-close')?.classList.add('hidden');
    }));
  }

  // scroll reveal
  const els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(el => el.classList.add('visible'));
  }

  // animated stat counters
  const counters = document.querySelectorAll('.counter');
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.target, 10);
        const start = performance.now();
        const dur = 1300;
        function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          el.textContent = Math.floor(p * target);
          if (p < 1) requestAnimationFrame(tick); else el.textContent = target;
        }
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cio.observe(el));
  }

  // contact form — submits to a Google Apps Script Web App, which logs
  // the booking into a Google Sheet and emails you a notification.
  // Replace this with the "/exec" URL you get after deploying the
  // Apps Script (see SETUP-GOOGLE-SHEETS.md for the exact steps).
  const SHEETS_ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const successMsg = document.getElementById('formSuccess');
      const errorMsg = document.getElementById('formError');
      const btn = form.querySelector('button[type="submit"]');
      const btnLabel = btn?.querySelector('.btn-label');

      errorMsg?.classList.add('hidden');
      successMsg?.classList.add('hidden');

      if (!SHEETS_ENDPOINT || SHEETS_ENDPOINT.startsWith("PASTE_")) {
        console.warn("Contact form: SHEETS_ENDPOINT is not configured yet.");
        errorMsg?.classList.remove('hidden');
        return;
      }

      const original = btnLabel ? btnLabel.textContent : null;
      if (btnLabel) btnLabel.textContent = "Sending...";
      if (btn) btn.disabled = true;

      const formData = new FormData(form);

      fetch(SHEETS_ENDPOINT, { method: 'POST', mode: 'no-cors', body: formData })
        .then(() => {
          successMsg?.classList.remove('hidden');
          form.reset();
        })
        .catch(() => {
          errorMsg?.classList.remove('hidden');
        })
        .finally(() => {
          if (btnLabel && original) btnLabel.textContent = original;
          if (btn) btn.disabled = false;
        });
    });
  }
});
