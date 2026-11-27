<<<<<<< HEAD
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

  if (headerEl) {
    try {
      const response = await fetch('/backend_php/session_info.php', {
        credentials: 'same-origin'
      });
      if (!response.ok) throw new Error(`Session check failed: ${response.status}`);

      const session = await response.json();
      if (session.user_id) {
        headerEl.querySelectorAll('.auth-links a[href="login.html"], .auth-links a[href="signup.html"]')
          .forEach(link => link.remove());

        const authLinks = headerEl.querySelector('.auth-links');
        if (authLinks) {
          const logoutButton = document.createElement('button');
          logoutButton.type = 'button';
          logoutButton.className = 'logout-button';
          logoutButton.textContent = 'Logout';
          logoutButton.addEventListener('click', async () => {
            logoutButton.disabled = true;
            try {
              const logoutResponse = await fetch('/backend_php/logout.php', {
                method: 'POST',
                credentials: 'same-origin'
              });
              if (!logoutResponse.ok) {
                throw new Error(`Logout failed: ${logoutResponse.status}`);
              }
              window.location.href = '/index.html';
            } catch (error) {
              console.error('Unable to log out:', error);
              logoutButton.disabled = false;
              alert('Unable to log out. Please try again.');
            }
          });
          authLinks.appendChild(logoutButton);
        }
      }
    } catch (error) {
      console.error('Unable to check login status:', error);
    }
  }

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
=======
const tabs = document.querySelectorAll('.nav-tabs');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
>>>>>>> d7a3c8a4337a60f362ea27b57881dc92f3a17f39
});