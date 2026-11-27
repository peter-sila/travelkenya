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

=======
>>>>>>> d7a3c8a4337a60f362ea27b57881dc92f3a17f39
header("Content-Type: application/json");
include '../db/dbconnect.php';

$keyword = isset($_GET['keyword']) ? $conn->real_escape_string($_GET['keyword']) : "";

$sql = "SELECT * FROM destinations WHERE title LIKE '%$keyword%' OR location LIKE '%$keyword%' LIMIT 10";
$result = $conn->query($sql);

$destinations = [];

if ($result) {
  while ($row = $result->fetch_assoc()) {
    $destinations[] = $row;
  }
}

echo json_encode($destinations);
?>
