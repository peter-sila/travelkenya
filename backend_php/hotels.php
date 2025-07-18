<?php

require_once '../db/dbconnect.php';

$hotel_sql = "SELECT * FROM hotels";
$hotel_result = $conn->query($hotel_sql);

$hotels = [];
if ($hotel_result->num_rows > 0) {
    while ($row = $hotel_result->fetch_assoc()) {
        $hotels[] = $row;
    }
} else {
    echo json_encode(['error' => 'No hotels found.']);
    exit();
}


// hotels as a JSON response
header('Content-Type: application/json');
echo json_encode($hotels, JSON_PRETTY_PRINT);

$conn = null;

?>
