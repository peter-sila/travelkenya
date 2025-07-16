<?php

require_once '../db/dbconnect.php';

$news_sql = "SELECT * FROM news";
$news_result = $conn->query($news_sql);

$news = [];
if ($news_result->rowCount() > 0) {
    while ($row = $news_result->fetch(PDO::FETCH_ASSOC)) {
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