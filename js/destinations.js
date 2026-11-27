const filterButton = document.getElementById("filter-toggle");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const priceFilter = document.getElementById("priceFilter");
const priceValue = document.getElementById("priceValue");
const spinner = document.getElementById("loadingSpinner");
const resultsDiv = document.getElementById("destinations-container");
const paginationEl = document.getElementById("pagination");

let currentPage = 1;
const perPage = 10;

window.currentUserId = window.currentUserId || null;
fetch("/backend_php/session_info.php")
  .then(response => {
    if (!response.ok) throw new Error(`Session lookup failed: ${response.status}`);
    return response.json();
  })
  .then(session => {
    if (session.user_id) window.currentUserId = session.user_id;
  })
  .catch(error => console.error("Session lookup failed:", error));

if (filterButton) {
  filterButton.addEventListener("click", () => {
    const filters = document.querySelector(".filters");
    if (filters) {
      filters.style.display = filters.style.display === "block" ? "none" : "block";
    }
  });
}

if (searchForm) {
  searchForm.addEventListener("submit", event => {
    event.preventDefault();
    currentPage = 1;
    fetchFilteredTours();
  });
}

let debounceTimer;
if (searchInput) {
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    currentPage = 1;
    debounceTimer = setTimeout(fetchFilteredTours, 300);
  });
}

if (priceFilter) {
  priceFilter.addEventListener("input", () => {
    if (priceValue) priceValue.textContent = priceFilter.value;
    currentPage = 1;
    fetchFilteredTours();
  });
}

document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener("change", () => {
    currentPage = 1;
    fetchFilteredTours();
  });
});

function fetchFilteredTours() {
  if (!spinner || !resultsDiv || !searchInput || !priceFilter) return;

  spinner.style.display = "block";
  resultsDiv.innerHTML = "";

  const data = {
    keyword: searchInput.value.trim(),
    price: priceFilter.value,
    ratings: Array.from(document.querySelectorAll('input[name="rating"]:checked'))
      .map(checkbox => checkbox.value),
    types: Array.from(document.querySelectorAll('input[name="tourType"]:checked'))
      .map(checkbox => checkbox.value),
    page: currentPage,
    per_page: perPage
  };

  fetch("/backend_php/filter_tours.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw new Error(`Tour search failed: ${response.status}`);
      return response.json();
    })
    .then(data => {
      spinner.style.display = "none";
      const tours = Array.isArray(data.tours) ? data.tours : [];
      const total = Number(data.total) || 0;

      if (tours.length === 0) {
        resultsDiv.innerHTML = "<p>No tours found.</p>";
      } else {
        tours.forEach(tour => {
          const card = document.createElement("div");
          card.className = "card highlight-card fade-in";
          const favoriteIcon = isFavorite(tour.id) ? "❤️" : "♡";
          card.innerHTML = `
            <img src="assets/tours/${tour.image}" alt="${tour.title}" loading="lazy" decoding="async">
            <div class="favorite" onclick="toggleFavorite(this, '${tour.id}')">${favoriteIcon}</div>
            <button class="book-btn" onclick="bookTour(${tour.id})">Book</button>
            <div class="card-body">
              <div class="title">${tour.title}</div>
              <div class="location">${tour.location}</div>
              <div class="rating"><span>${tour.rating}/5 Excellent</span></div>
              <div class="info">
                <span class="price">from KSh ${parseInt(tour.price).toLocaleString()} /night</span>
              </div>
            </div>
          `;
          resultsDiv.appendChild(card);
          setTimeout(() => card.classList.add("show"), 50);
        });
      }

      renderPagination(total);
    })
    .catch(error => {
      console.error("Error fetching tours:", error);
      spinner.style.display = "none";
      resultsDiv.innerHTML = "<p>Failed to load tours.</p>";
    });
}

function bookTour(tourId) {
  if (!window.currentUserId) {
    alert("Please login to make a booking.");
    return;
  }

  const dateFrom = prompt("Enter start date (YYYY-MM-DD)");
  if (!dateFrom) return;
  const dateTo = prompt("Enter end date (YYYY-MM-DD) (optional)") || dateFrom;

  fetch("/backend_php/book.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tour_id: tourId,
      date_from: dateFrom,
      date_to: dateTo,
      seats: 1
    })
  })
    .then(response => response.json())
    .then(result => {
      if (result.success) alert("Booking successful");
      else alert(result.error || "Booking failed");
    })
    .catch(error => {
      console.error("Booking failed:", error);
      alert("Booking failed");
    });
}

function toggleFavorite(element, id) {
  if (window.currentUserId) {
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

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const favoriteId = String(id);
  const index = favorites.indexOf(favoriteId);
  if (index >= 0) {
    favorites.splice(index, 1);
    element.textContent = "♡";
  } else {
    favorites.push(favoriteId);
    element.textContent = "❤️";
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function isFavorite(id) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  return favorites.includes(String(id));
}

function renderPagination(total) {
  if (!paginationEl) return;
  paginationEl.innerHTML = "";
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return;

  const previous = document.createElement("button");
  previous.textContent = "Prev";
  previous.disabled = currentPage <= 1;
  previous.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage -= 1;
      fetchFilteredTours();
    }
  });
  paginationEl.appendChild(previous);

  for (let page = 1; page <= totalPages && page <= 10; page++) {
    const button = document.createElement("button");
    button.textContent = page;
    if (page === currentPage) button.classList.add("active");
    button.addEventListener("click", () => {
      currentPage = page;
      fetchFilteredTours();
    });
    paginationEl.appendChild(button);
  }

  const next = document.createElement("button");
  next.textContent = "Next";
  next.disabled = currentPage >= totalPages;
  next.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage += 1;
      fetchFilteredTours();
    }
  });
  paginationEl.appendChild(next);
}

document.addEventListener("DOMContentLoaded", () => {
  if (!resultsDiv) return;
  if (priceFilter) {
    priceFilter.value = priceFilter.max || priceFilter.value;
    if (priceValue) priceValue.textContent = priceFilter.value;
  }
  fetchFilteredTours();
});
