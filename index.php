<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="header">
        <div class="social-icons">
            <li><a href=""></a></li>
            <li><a href=""></a></li>
            <li><a href=""></a></li> |
            <li><a href="">info@explorekenya.com</a></li>
        </div>
        <div class="regist">
            <li><a href="login.php">Log In</a></li>
            <li><a href="signup.php">SIgn Up</a></li>
        </div>
    </div>
    <div class="nav-bar">
        <li><a href="index.php"><img src="assets/logo.png" alt="logo" ></a></li>
        <li><a href="index.php">HOME</a></li>
        <li><a href="destination.php">DESTINATIONS</a></li>
        <li><a href="news.php">NEWS</a></li>
        <li><a href="maps.php">MAPS</a></li>
        <li><a href="contact.php">CONTACT US</a></li>
    </div>
    <div class="hero">
        <div class="swap">
            <img src="hero1.png" alt="">
            <h2>Travel Kenya</h2>
            <p>Welcome To Explore Kenya - Uncover Nature's Pulse and the Pinnacle of Hospitality</p>
            <div class="search-pref">
                <div class="btn">
                    <button>Hotes</button>
                    <button>Destinations</button>
                </div>
                <div class="search-form">
                    <div class="form-group">
                        <label for="location">Location</label>
                        <select name="location" id="location">
                            <option value=""></option>
                        </select>
                    </div>

                    <button type="submit">SEARCH</button>
                </div>
            </div>
        </div>
    </div>

    <div class="feat-tours">
        <h2>Featured Tours</h2>
        <p>Discover Our Epic Adventures, Go Big or Go Home with Our Rad Tours!</p>
        <button><</button><button>></button>
        <div class="cards">
            <div class="card">
                <img src="" alt="">
                <p id="location"></p>
                <h3 id="activities"></h3>
                <p id="review"></p>
                <p id="price"></p>
            </div>
        </div>
    </div>

    <div class="feat-hotels">
        <h2>Featured Hotels</h2>
        <p>Discover Our Epic Hotels, Enjoy our best prices!</p>
        <button><</button><button>></button>
        <div class="cards">
            <div class="card">
                <img src="" alt="">
                <h3 id="name"></h3>
                <p id="location"></p>
                <p id="review"></p>
                <p id="price"></p>
            </div>
        </div>
    </div>

    <div class="top-places">
        <h2>Best Places To Explore In Kenya</h2>
        <p>Makueni, a gem in Kenya, boasts an array of captivating destinations that are perfect for any explorer.</p>
        <div class="top-gallery">
            <div class="t-card">
                <a href=""><img src="" alt=""></a>
            </div>
        </div>
    </div>

    <div class="blog">
        <h2>News Updates</h2>
        <p>Check out recent news</p>
        <div class="news">
            <div class="news-card">
                <img src="" alt="">
                <h3 id="categories"></h3>
                <h3 id="title"></h3>
                <p id="content"></p>
                <button>Read More</button>
            </div>
        </div>
    </div>
</body>
<footer>
    <p>Copyright &copy 2025 Explore Kenya by Young Tech Solutions LTD</p>
</footer>
</html>