const tabs = document.querySelectorAll('.tab');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});



fetch('static/header.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;
  });


fetch('static/footer.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('footer').innerHTML = data;
  });

function toggleFavorite(el) {
  el.classList.toggle("active");
  el.textContent = el.classList.contains("active") ? "❤️" : "♡";
}

// HERE I HANDLE THE HOTELS DISPLAY FOR CARDS
fetch("backend_php/hotels.php")
  .then(res => res.json())
  .then(data => {
    console.log("Hotels:", data);
    const container = document.getElementById("hotels-container");
    container.innerHTML = "";

    data.forEach(hotel => {
      // HERE I NOW Create card HTML
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="assets/hotels/${hotel.image}" alt="${hotel.name}">
        <div class="favorite" onclick="toggleFavorite(this)">♡</div>
        <div class="card-body">
            <div class="title">${hotel.name}</div>
            <div class="location">${hotel.location}</div>
            <div class="stars"><span>${hotel.rating}/5 Excellent</span></div>
            <div class="info">
                <span></span>
                <span class="price">from KSh ${parseInt(hotel.price_per_night).toLocaleString()} /night</span>
            </div>
        </div>
      `;

      container.appendChild(card);
    });
  })
  .catch(err => console.error(err));


// HERE I HANDLE THE TOURS DISPLAY FOR CARDS
fetch("backend_php/tours.php")
  .then(res => res.json())
  .then(data => {
    console.log("Tours:", data);
    const container = document.getElementById("tours-container");
    container.innerHTML = ""; 

    data.forEach(tour => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="assets/tours/${tour.image}" alt="${tour.name}">
        <div class="favorite" onclick="toggleFavorite(this)">♡</div>
        <div class="card-body">
            <div class="title">${tour.name}</div>
            <div class="location">${tour.location}</div>
            <div class="info">
                <span></span>
                <span class="price">from KSh ${parseInt(tour.price).toLocaleString()} /person</span>
            </div>
        </div>
      `;

      container.appendChild(card);
    });
  })
  .catch(err => console.error(err));


// HERE I HANDLE THE DESTINATIONS DISPLAY FOR CARDS
fetch("backend_php/destinations.php")
  .then(res => res.json())
  .then(data => {
    console.log("Destinations:", data);
    const container = document.getElementById("destinations-container");
    container.innerHTML = ""; 

    data.forEach(destination => {
      const card = document.createElement("div");
      card.className = "card highlight-card";

      card.innerHTML = `
        <img src="assets/destinations/${destination.image}" alt="${destination.title}">
        <div class="favorite" onclick="toggleFavorite(this)">♡</div>
        <div class="card-body">
            <div class="title">${destination.title}</div>
            <div class="location">${destination.location}</div>
            <div class="stars"><span>${destination.rating}/5 Excellent</span></div>
            <div class="info">
                <span></span>
                <span class="price">from KSh ${parseInt(destination.price).toLocaleString()} /person</span>
            </div>
        </div>
      `;

      container.appendChild(card);
    });
  })
  .catch(err => console.error(err));