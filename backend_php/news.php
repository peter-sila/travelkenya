<?php

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