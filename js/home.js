<<<<<<< HEAD
// Tab buttons and input (guarded)
=======
// Tab buttons and input
>>>>>>> d7a3c8a4337a60f362ea27b57881dc92f3a17f39
const tabs = document.querySelectorAll(".tab");
const inputTxt = document.getElementById("inputTxt");
const tabsForm = document.getElementById("tabs-form");

let selectedTab = "hotel";

<<<<<<< HEAD
if (tabs && tabs.length) {
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      selectedTab = tab.id.replace("-tab", "");
    });
  });
}

// Handling form submit (only if elements exist)
if (tabsForm) {
  tabsForm.addEventListener("submit", e => {
    e.preventDefault();

    const keyword = inputTxt ? inputTxt.value.trim() : '';

    if (!keyword) return;

    // Sending search request to PHP backend
    fetch("/backend_php/home_search.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        keyword: keyword,
        type: selectedTab
      })
    })
    .then(res => {
      if (!res.ok) return res.text().then(t => { throw new Error('home_search error: ' + res.status + ' - ' + t); });
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) return res.text().then(t => { throw new Error('home_search: expected JSON but got: ' + t); });
      return res.json();
    })
    .then(results => {
      displayResults(results);
    })
    .catch(err => {
      console.error("Search error:", err);
    });
  });
}
=======
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    selectedTab = tab.id.replace("-tab", "");
  });
});

// Handling form submit
tabsForm.addEventListener("submit", e => {
  e.preventDefault();

  const keyword = inputTxt.value.trim();

  if (!keyword) return;

  // Sending search request to PHP backend
  fetch("backend_php/home_search.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      keyword: keyword,
      type: selectedTab
    })
  })
  .then(res => res.json())
  .then(results => {
    displayResults(results);
  })
  .catch(err => {
    console.error("Search error:", err);
  });
});
>>>>>>> d7a3c8a4337a60f362ea27b57881dc92f3a17f39

// Displaying search results
function displayResults(results) {
  const resultsDiv = document.getElementById("content");
<<<<<<< HEAD
  if (!resultsDiv) return;
  resultsDiv.innerHTML = "";

  if (!Array.isArray(results) || results.length === 0) {
=======
  resultsDiv.innerHTML = "";

  if (results.length === 0) {
>>>>>>> d7a3c8a4337a60f362ea27b57881dc92f3a17f39
    resultsDiv.innerHTML = "<p>No results found.</p>";
    return;
  }

  results.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>Location: ${item.location || item.address || "N/A"}</p>
      <p>Price: KSh ${item.price ? parseInt(item.price).toLocaleString() : "N/A"}</p>
    `;
    resultsDiv.appendChild(card);
  });
}



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

<<<<<<< HEAD
// shared current user id (use window to avoid redeclaration across scripts)
window.currentUserId = window.currentUserId || null;
fetch('/backend_php/session_info.php').then(r=>r.json()).then(j=>{ if (j.user_id) window.currentUserId = j.user_id; }).catch(()=>{});

function toggleFavorite(el, id) {
  if (window.currentUserId) {
    const adding = el.textContent !== '❤️';
    fetch('/backend_php/favorites.php', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ action: adding ? 'add' : 'remove', tour_id: parseInt(id,10) })
    }).then(r=>r.json()).then(j=>{
      if (j.success) el.textContent = adding ? '❤️' : '♡';
    }).catch(err=>console.error(err));
    return;
  }
=======
function toggleFavorite(el) {
>>>>>>> d7a3c8a4337a60f362ea27b57881dc92f3a17f39
  el.classList.toggle("active");
  el.textContent = el.classList.contains("active") ? "❤️" : "♡";
}

// HERE I HANDLE THE HOTELS DISPLAY FOR CARDS
<<<<<<< HEAD
fetch("/backend_php/hotels.php")
  .then(res => {
    if (!res.ok) return res.text().then(t => { throw new Error('hotels fetch error: ' + res.status + ' - ' + t); });
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) return res.text().then(t => { throw new Error('hotels: expected JSON but got: ' + t); });
    return res.json();
  })
  .then(data => {
    const container = document.getElementById("hotels-container");
    if (!container) return;
    container.innerHTML = "";

    (Array.isArray(data) ? data : []).forEach(hotel => {
      // HERE I NOW Create card HTML
      const card = document.createElement("div");
      card.className = "card fade-in";

      card.innerHTML = `
        <img src="assets/hotels/${hotel.image}" alt="${hotel.name}" loading="lazy" decoding="async">
=======
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
>>>>>>> d7a3c8a4337a60f362ea27b57881dc92f3a17f39
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
<<<<<<< HEAD
      `; 

      container.appendChild(card);
      setTimeout(() => card.classList.add('show'), 30);
    });
  })
  .catch(err => console.error('Hotels fetch error:', err));


// HERE I HANDLE THE TOURS DISPLAY FOR CARDS
fetch("/backend_php/tours.php")
  .then(res => {
    if (!res.ok) return res.text().then(t => { throw new Error('tours fetch error: ' + res.status + ' - ' + t); });
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) return res.text().then(t => { throw new Error('tours: expected JSON but got: ' + t); });
    return res.json();
  })
  .then(data => {
    const container = document.getElementById("tours-container");
    if (!container) return;
    container.innerHTML = ""; 

    (Array.isArray(data) ? data : []).forEach(tour => {
      const card = document.createElement("div");
      card.className = "card fade-in";

      card.innerHTML = `
        <img src="assets/tours/${tour.image}" alt="${tour.name}" loading="lazy" decoding="async">
=======
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
>>>>>>> d7a3c8a4337a60f362ea27b57881dc92f3a17f39
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
<<<<<<< HEAD
      setTimeout(() => card.classList.add('show'), 30);
    });
  })
  .catch(err => console.error('Tours fetch error:', err));


// HERE I HANDLE THE DESTINATIONS DISPLAY FOR CARDS
fetch("/backend_php/destinations.php")
  .then(res => {
    if (!res.ok) return res.text().then(t => { throw new Error('destinations fetch error: ' + res.status + ' - ' + t); });
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) return res.text().then(t => { throw new Error('destinations: expected JSON but got: ' + t); });
    return res.json();
  })
  .then(data => {
    const container = document.getElementById("destinations-container");
    if (!container) return;
    container.innerHTML = ""; 

    (Array.isArray(data) ? data : []).forEach(destination => {
      const card = document.createElement("div");
      card.className = "card highlight-card fade-in";

      card.innerHTML = `
        <img src="assets/destinations/${destination.image}" alt="${destination.title}" loading="lazy" decoding="async">
=======
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
>>>>>>> d7a3c8a4337a60f362ea27b57881dc92f3a17f39
        <div class="favorite" onclick="toggleFavorite(this)">♡</div>
        <div class="card-body">
            <div class="title">${destination.title}</div>
            <div class="location">${destination.location}</div>
            <div class="stars"><span>${destination.rating}/5 Excellent</span></div>
<<<<<<< HEAD
=======
            <div class="info">
                <span></span>
                <span class="price">from KSh ${parseInt(destination.price).toLocaleString()} /person</span>
            </div>
>>>>>>> d7a3c8a4337a60f362ea27b57881dc92f3a17f39
        </div>
      `;

      container.appendChild(card);
<<<<<<< HEAD
      setTimeout(() => card.classList.add('show'), 30);
    });
  })
  .catch(err => console.error('Destinations fetch error:', err));
=======
    });
  })
  .catch(err => console.error(err));
>>>>>>> d7a3c8a4337a60f362ea27b57881dc92f3a17f39



  