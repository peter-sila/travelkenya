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
let debounceTimer;
let currentpage = 1;

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  fetchFilteredTours();
});

searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fetchFilteredTours, 300);
});

priceFilter.addEventListener("input", () => {
  priceValue.textContent = priceFilter.value;
  fetchFilteredTours();
});

document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
  cb.addEventListener("change", fetchFilteredTours);
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

  fetch("backend_php/filter_tours.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(tours => {
      spinner.style.display = "none";
      resultsDiv.innerHTML = "";

      if (tours.length === 0) {
        resultsDiv.innerHTML = "<p>No tours found.</p>";
      } else {
        tours.forEach(tour => {
          const div = document.createElement("div");
          div.className = "card highlight-card fade-in";
          const favIcon = isFavorite(tour.id) ? "❤️" : "♡";
          div.innerHTML = `
            <img src="assets/tours/${tour.image}" alt="${tour.title}">
            <div class="favorite" onclick="toggleFavorite(this, '${tour.id}')">${favIcon}</div>
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
    })
    .catch(err => {
      console.error("Error:", err);
      spinner.style.display = "none";
      resultsDiv.innerHTML = "<p>Failed to load tours.</p>";
    });
}

function toggleFavorite(el, id) {
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
