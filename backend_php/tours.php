<?php

require_once '../db/dbconnect.php';

$tour_sql = "SELECT * FROM tours";
$tour_result = $conn->query($tour_sql);

$tours = [];
if ($tour_result->rowCount() > 0) {
    while ($row = $tour_result->fetch(PDO::FETCH_ASSOC)) {
        $tours[] = $row;
    }
} else {
    echo "No tours found.";
}

// tours as a JSON response
header('Content-Type: application/json');
echo json_encode($tours, JSON_PRETTY_PRINT);
$conn = null;

?>