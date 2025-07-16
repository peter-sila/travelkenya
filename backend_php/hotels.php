<?php

require_once '../db/dbconnect.php';

$hotel_sql = "SELECT * FROM hotels";
$hotel_result = $conn->query($hotel_sql);

$hotels = [];
if ($hotel_result->rowCount() > 0) {
    while ($row = $hotel_result->fetch(PDO::FETCH_ASSOC)) {
        $hotels[] = $row;
    }
} else {
    echo "No hotels found.";
}

// hotels as a JSON response
header('Content-Type: application/json');
echo json_encode($hotels, JSON_PRETTY_PRINT);

$conn = null;

?>
