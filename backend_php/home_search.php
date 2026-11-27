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
include_once '../db/dbconnect.php';

$data = json_decode(file_get_contents("php://input"), true);

$keyword = isset($data['keyword']) ? '%' . $conn->real_escape_string($data['keyword']) . '%' : '%';
$type = isset($data['type']) ? $conn->real_escape_string($data['type']) : 'hotel';

$tableMap = [
    "hotel" => "hotels",
    "tour" => "tours",
    "destnation" => "destinations"
];

if (!array_key_exists($type, $tableMap)) {
    echo json_encode([]);
    exit;
}

$table = $tableMap[$type];

$sql = "SELECT * FROM $table WHERE name LIKE ? LIMIT 20";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $keyword);
$stmt->execute();
$result = $stmt->get_result();

$items = [];
while ($row = $result->fetch_assoc()) {
    $items[] = $row;
}

echo json_encode($items);
?>
