async function loadFragment(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.text();
  } catch (e) {
    return null;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const headerEl = document.getElementById('header');
  const footerEl = document.getElementById('footer');

  const headerHtml = await loadFragment('static/header.html');
  const footerHtml = await loadFragment('static/footer.html');

  if (headerEl && headerHtml) headerEl.innerHTML = headerHtml;
  if (footerEl && footerHtml) footerEl.innerHTML = footerHtml;

  // Attach nav tab active behavior after header is injected
  const tab_s = document.querySelectorAll('.nav-tabs');
  tab_s.forEach(tab => {
    tab.addEventListener('click', () => {
      tab_s.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      tab_s.forEach(t => t.removeAttribute('aria-current'));
      tab.setAttribute('aria-current', 'page');
    });
    // Initialize reveal-on-scroll animations for elements with .fade-in
    function initReveal() {
      const els = document.querySelectorAll('.fade-in');
      if (!els || els.length === 0) return;
      if (!('IntersectionObserver' in window)) {
        els.forEach(e => e.classList.add('show'));
        return;
      }
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay || 0, 10);
            setTimeout(() => entry.target.classList.add('show'), delay);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      els.forEach((el, idx) => {
        el.dataset.delay = el.dataset.delay || (idx * 80);
        io.observe(el);
      });
    }

    // run initial reveal init
    initReveal();
  });
  // Highlight the active nav tab based on current URL
  try {
    const currentFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    tab_s.forEach(tab => {
      const href = tab.getAttribute('href') || '';
      let targetFile = '';
      try {
        targetFile = new URL(href, location.href).pathname.split('/').pop().toLowerCase();
      } catch (e) {
        targetFile = (href.split('/').pop() || '').toLowerCase();
      }
      if (targetFile === currentFile || (currentFile === '' && targetFile === 'index.html')) {
        tab.classList.add('active');
        tab.setAttribute('aria-current', 'page');
      }
    });
  } catch (e) {
    // ignore
  }
});