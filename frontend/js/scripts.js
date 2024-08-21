// scripts.js

document.addEventListener('DOMContentLoaded', function () {
    // Load Navbar
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
        });

    // Load Hero Section
    fetch('hero.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('hero').innerHTML = data;
        });

    // Load Footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });
});
