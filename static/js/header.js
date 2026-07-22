const tab_s = document.querySelectorAll('.nav-tabs');

tab_s.forEach(tab => {
  tab.addEventListener('click', () => {
    tab_s.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});