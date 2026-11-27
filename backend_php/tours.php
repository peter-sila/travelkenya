<?php

<<<<<<< HEAD
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

require_once __DIR__ . '/../db/dbconnect.php';

header('Content-Type: application/json');

$tour_sql = "SELECT * FROM tours";
$tours = [];
try {
    $tour_result = $conn->query($tour_sql);
    if ($tour_result && $tour_result->num_rows > 0) {
        while ($row = $tour_result->fetch_assoc()) {
            $tours[] = $row;
        }
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error', 'detail' => $e->getMessage()]);
    exit();
}

=======
require_once '../db/dbconnect.php';

$tour_sql = "SELECT * FROM tours";
$tour_result = $conn->query($tour_sql);

$tours = [];
if ($tour_result->num_rows > 0) {
    while ($row = $tour_result->fetch_assoc()) {
        $tours[] = $row;
    }
} else {
    echo "No tours found.";
}

// tours as a JSON response
header('Content-Type: application/json');
>>>>>>> d7a3c8a4337a60f362ea27b57881dc92f3a17f39
echo json_encode($tours, JSON_PRETTY_PRINT);
$conn = null;

?>