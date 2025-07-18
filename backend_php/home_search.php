<?php
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
