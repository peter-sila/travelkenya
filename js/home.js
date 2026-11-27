const tabs = document.querySelectorAll(".tab");
const inputTxt = document.getElementById("inputTxt");
const tabsForm = document.getElementById("tabs-form");

let selectedTab = "hotel";

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(item => item.classList.remove("active"));
    tab.classList.add("active");
    selectedTab = tab.id.replace("-tab", "");
  });
});

if (tabsForm) {
  tabsForm.addEventListener("submit", event => {
    event.preventDefault();
    const keyword = inputTxt ? inputTxt.value.trim() : "";
    if (!keyword) return;

    fetch("/backend_php/home_search.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword, type: selectedTab })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`home_search failed: ${response.status}`);
        }
        return response.json();
      })
      .then(displayResults)
      .catch(error => console.error("Search error:", error));
  });
}

function displayResults(results) {
  const resultsDiv = document.getElementById("content");
  if (!resultsDiv) return;
  resultsDiv.innerHTML = "";

  if (!Array.isArray(results) || results.length === 0) {
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

fetch("static/header.html")
  .then(response => response.text())
  .then(html => {
    const header = document.getElementById("header");
    if (header) header.innerHTML = html;
  })
  .catch(error => console.error("Header fetch error:", error));

fetch("static/footer.html")
  .then(response => response.text())
  .then(html => {
    const footer = document.getElementById("footer");
    if (footer) footer.innerHTML = html;
  })
  .catch(error => console.error("Footer fetch error:", error));

window.currentUserId = window.currentUserId || null;
fetch("/backend_php/session_info.php")
  .then(response => response.json())
  .then(session => {
    if (session.user_id) window.currentUserId = session.user_id;
  })
  .catch(() => {});

function toggleFavorite(element, id) {
  if (window.currentUserId && id) {
    const adding = element.textContent !== "❤️";
    fetch("/backend_php/favorites.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: adding ? "add" : "remove",
        tour_id: parseInt(id, 10)
      })
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) element.textContent = adding ? "❤️" : "♡";
      })
      .catch(error => console.error("Favorite update failed:", error));
    return;
  }

  element.classList.toggle("active");
  element.textContent = element.classList.contains("active") ? "❤️" : "♡";
}

function fetchCards(endpoint, containerId, createCard, errorLabel) {
  fetch(endpoint)
    .then(response => {
      if (!response.ok) throw new Error(`${errorLabel} request failed: ${response.status}`);
      return response.json();
    })
    .then(items => {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = "";

      if (!Array.isArray(items)) {
        throw new Error(`${errorLabel} response must be an array`);
      }

      items.forEach(item => {
        const card = createCard(item);
        container.appendChild(card);
        setTimeout(() => card.classList.add("show"), 30);
      });
    })
    .catch(error => console.error(`${errorLabel} fetch error:`, error));
}

fetchCards("/backend_php/hotels.php", "hotels-container", hotel => {
  const card = document.createElement("div");
  card.className = "card fade-in";
  card.innerHTML = `
    <img src="assets/hotels/${hotel.image}" alt="${hotel.name}" loading="lazy" decoding="async">
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
  return card;
}, "Hotels");

fetchCards("/backend_php/tours.php", "tours-container", tour => {
  const card = document.createElement("div");
  card.className = "card fade-in";
  card.innerHTML = `
    <img src="assets/tours/${tour.image}" alt="${tour.name}" loading="lazy" decoding="async">
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
  return card;
}, "Tours");

fetchCards("/backend_php/destinations.php", "destinations-container", destination => {
  const card = document.createElement("div");
  card.className = "card highlight-card fade-in";
  card.innerHTML = `
    <img src="assets/destinations/${destination.image}" alt="${destination.title}" loading="lazy" decoding="async">
    <div class="favorite" onclick="toggleFavorite(this)">♡</div>
    <div class="card-body">
      <div class="title">${destination.title}</div>
      <div class="location">${destination.location}</div>
      <div class="stars"><span>${destination.rating}/5 Excellent</span></div>
    </div>
  `;
  return card;
}, "Destinations");
