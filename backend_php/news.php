<?php

$allowed_origins = [
    'http://127.0.0.1:5501',
    'http://127.0.0.1:5500',
    'http://localhost:8000'
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../db/dbconnect.php';

$news_sql = "SELECT * FROM news";
$news_result = $conn->query($news_sql);

$news = [];
if ($news_result->num_rows > 0) {
    while ($row = $news_result->fetch_assoc()) {
        $news[] = $row;
    }
} else {
    echo "No news found.";
}


// news as a JSON response
header('Content-Type: application/json');
echo json_encode($news, JSON_PRETTY_PRINT);
$conn = null;

?>