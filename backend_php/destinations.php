<?php

require_once '../db/dbconnect.php';

$destination_sql = "SELECT * FROM destinations";
$destination_result = $conn->query($destination_sql);

$destinations = [];
if ($destination_result->num_rows > 0) {
    while ($row = $destination_result->fetch_assoc()) {
        $destinations[] = $row;
    }
} else {
    echo "No destinations found.";
}

// destinations as a JSON response
header('Content-Type: application/json');
echo json_encode($destinations, JSON_PRETTY_PRINT);
$conn = null;

?>