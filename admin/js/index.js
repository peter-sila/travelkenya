fetch('statics/sidebar.html')
  .then(response => response.text())
  .then(data => {
    document.body.insertAdjacentHTML('afterbegin', data);
  });

fetch('statics/topnav.html')
  .then(response => response.text())
  .then(data => {
    document.body.insertAdjacentHTML('afterbegin', data);
  });

fetch('statics/footer.html')
  .then(response => response.text())  
  .then(data => {
    document.body.insertAdjacentHTML('beforeend', data);
  });

