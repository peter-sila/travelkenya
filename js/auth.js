// displaying header and footer
document.addEventListener("DOMContentLoaded", function() {
    fetch("static/header.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector("header").innerHTML = data;
        });

    fetch("static/footer.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector("footer").innerHTML = data;
        });
});

// show auth links if user is not logged in
function showAuthLinks() {
    const authLinks = document.querySelector(".auth-links");
    if (authLinks) {
        authLinks.style.display = "block";
    }
}

// hide auth links if user is logged in
function hideAuthLinks() {
    const authLinks = document.querySelector(".auth-links");
    if (authLinks) {
        authLinks.style.display = "none";
    }
}