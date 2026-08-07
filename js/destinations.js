// Toggle filter visibility
const btn = document.getElementById("filter-toggle");
btn.addEventListener("click", () => {
  const filters = document.querySelector(".filters");
  filters.style.display = filters.style.display === "block" ? "none" : "block";
});

// Search form submit
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const priceFilter = document.getElementById("priceFilter");
const priceValue = document.getElementById("priceValue");
const spinner = document.getElementById("loadingSpinner");
const resultsDiv = document.getElementById("destinations-container");
const paginationEl = document.getElementById("pagination");
let debounceTimer;
let currentpage = 1;
const perPage = 10;
let currentUserId = null;

// fetch session info
// shared current user id (use window to avoid redeclaration across scripts)
window.currentUserId = window.currentUserId || null;
// fetch session info
fetch('/backend_php/session_info.php').then(r=>r.json()).then(j=>{ if (j.user_id) window.currentUserId = j.user_id; }).catch(()=>{});

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  currentpage = 1;
  fetchFilteredTours();
});

searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => { currentpage = 1; fetchFilteredTours(); }, 300);
});

priceFilter.addEventListener("input", () => {
  priceValue.textContent = priceFilter.value;
  currentpage = 1;
  fetchFilteredTours();
});

document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
  cb.addEventListener("change", () => { currentpage = 1; fetchFilteredTours(); });
});

function fetchFilteredTours() {
  spinner.style.display = "block";
  resultsDiv.innerHTML = "";

  const keyword = searchInput.value.trim();
  const maxPrice = priceFilter.value;

  const selectedRatings = Array.from(document.querySelectorAll('input[name="rating"]:checked'))
    .map(cb => cb.value);

  const selectedTypes = Array.from(document.querySelectorAll('input[name="tourType"]:checked'))
    .map(cb => cb.value);

  const data = {
    keyword: keyword,
    price: maxPrice,
    ratings: selectedRatings,
    types: selectedTypes
  };
  // pagination params
  data.page = currentpage;
  data.per_page = perPage;

  fetch("http://localhost:8000/filter_tours.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      spinner.style.display = "none";
      resultsDiv.innerHTML = "";
      const tours = data.tours || [];
      const total = data.total || 0;

      if (tours.length === 0) {
        resultsDiv.innerHTML = "<p>No tours found.</p>";
      } else {
        tours.forEach(tour => {
          const div = document.createElement("div");
          div.className = "card highlight-card fade-in";
          const favIcon = isFavorite(tour.id) ? "❤️" : "♡";
          div.innerHTML = `
            <img src="assets/tours/${tour.image}" alt="${tour.title}" loading="lazy" decoding="async">
            <div class="favorite" onclick="toggleFavorite(this, '${tour.id}')">${favIcon}</div>
            <button class="book-btn" onclick="bookTour(${tour.id})">Book</button>
            <div class="card-body">
              <div class="title">${tour.title}</div>
              <div class="location">${tour.location}</div>
              <div class="rating">
                <span>${tour.rating}/5 Excellent</span>
              </div>
              <div class="info">
                <span class="price">from KSh ${parseInt(tour.price).toLocaleString()} /night</span>
              </div>
            </div>
          `;
          resultsDiv.appendChild(div);
          setTimeout(() => div.classList.add("show"), 50);
        });
      }

      // render pagination
      renderPagination(total);
    })
    .catch(err => {
      console.error("Error:", err);
      spinner.style.display = "none";
      resultsDiv.innerHTML = "<p>Failed to load tours.</p>";
    });
}

function bookTour(tourId) {
  if (!currentUserId) {
    alert('Please login to make a booking.');
    return;
  }
  const dateFrom = prompt('Enter start date (YYYY-MM-DD)');
  if (!dateFrom) return;
  const dateTo = prompt('Enter end date (YYYY-MM-DD) (optional)') || dateFrom;
  fetch('/backend_php/book.php', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ tour_id: tourId, date_from: dateFrom, date_to: dateTo, seats: 1 })
  }).then(r=>r.json()).then(j=>{
    if (j.success) alert('Booking successful'); else alert(j.error||'Booking failed');
  }).catch(err=>{console.error(err); alert('Booking failed');});
}

function toggleFavorite(el, id) {
  // If logged in, persist to server
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

  // fallback to localStorage for anonymous users
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
    el.textContent = "♡";
  } else {
    favorites.push(id);
    el.textContent = "❤️";
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function isFavorite(id) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  return favorites.includes(id);
}

function renderPagination(total) {
  if (!paginationEl) return;
  paginationEl.innerHTML = '';
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return;

  const prev = document.createElement('button');
  prev.textContent = 'Prev';
  prev.disabled = currentpage <= 1;
  prev.addEventListener('click', () => {
    if (currentpage > 1) { currentpage -= 1; fetchFilteredTours(); }
  });
  paginationEl.appendChild(prev);

  for (let p = 1; p <= totalPages; p++) {
    const btn = document.createElement('button');
    btn.textContent = p;
    if (p === currentpage) btn.classList.add('active');
    btn.addEventListener('click', () => { currentpage = p; fetchFilteredTours(); });
    paginationEl.appendChild(btn);
    if (p >= 10) break;
  }

  const next = document.createElement('button');
  next.textContent = 'Next';
  next.disabled = currentpage >= totalPages;
  next.addEventListener('click', () => {
    if (currentpage < totalPages) { currentpage += 1; fetchFilteredTours(); }
  });
  paginationEl.appendChild(next);
}

// Load all tours by default when the page is opened (before any filters applied)
document.addEventListener('DOMContentLoaded', () => {
  if (resultsDiv) {
    // Ensure filters are in their initial state then fetch
      renderPagination(0);
      // ensure price filter defaults to max so all tours show by default
      const priceFilterEl = document.getElementById('priceFilter');
      const priceValueEl = document.getElementById('priceValue');
      if (priceFilterEl) {
        priceFilterEl.value = priceFilterEl.max || priceFilterEl.getAttribute('max') || priceFilterEl.value;
        if (priceValueEl) priceValueEl.textContent = priceFilterEl.value;
      }
      fetchFilteredTours();
  }
});
