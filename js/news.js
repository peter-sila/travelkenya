// HERE I HANDLE THE NEWS DISPLAY FOR CARDS
fetch("backend_php/news.php")
  .then(res => res.json())
  .then(data => {
    console.log("News:", data);
    const container = document.getElementById("news-container");
    container.innerHTML = ""; 

    if (!data || data.length === 0) {
      container.innerHTML = "<p>No news available at the moment.</p>";
      return;
    }

    data.forEach(news => {
      const card = document.createElement("div");
      const titlebreadcrumb = document.getElementById("news-title-breadcrumb");
      titlebreadcrumb.innerText = news.title;
      card.className = "news-card";
      card.innerHTML = `
        <img src="assets/news/${news.image}" alt="${news.title}">
        <div class="card-content">
          <h2><a href="news_details.html?id=${news.id}">${news.title}</a></h2>
          <p>${news.content}</p>
          <p class="news-author">By ${news.author}</p>
          <p class="news-date">Published: ${new Date(news.created_at).toLocaleDateString()}</p>
          <button class="favorite-button" onclick="toggleFavorite(this)">♡</button>
          <a href="news_details.html?id=${news.id}">Read more</a>

        </div>
      `;
      container.appendChild(card);
    });

  })
  .catch(err => console.error(err));

// HERE I HANDLE THE TOGGLE FAVORITE FUNCTIONALITY
function toggleFavorite(element) {
  element.classList.toggle("active");
  if (element.classList.contains("active")) {
    element.innerHTML = "♥";
  } else {
    element.innerHTML = "♡";
  }
}


// Get ID from URL
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (id) {
  fetch(`backend_php/news_details.php?id=${id}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        document.getElementById("news-title").innerText = "Article not found!";
        document.getElementById("news-content").innerText = "";
      } else {
        document.getElementById("news-title").innerText = data.title;
        document.getElementById("news-author").innerText = "By " + data.author;
        document.getElementById("news-image").src = "assets/news/" + data.image;
        document.getElementById("news-content").innerHTML = data.content;
        document.getElementById("news-date").innerText = "Published: " + data.created_at;
      }
    })
    .catch(err => {
      console.error(err);
      document.getElementById("news-title").innerText = "Error loading article!";
    });
} else {
  document.getElementById("news-title").innerText = "No article ID provided!";
}
