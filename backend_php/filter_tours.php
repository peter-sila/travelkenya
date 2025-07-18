<?php
header("Content-Type: application/json");
include_once '../db/dbconnect.php';

$data = json_decode(file_get_contents("php://input"), true);

$keyword = isset($data['keyword']) ? "%" . $conn->real_escape_string($data['keyword']) . "%" : "%";
$price = isset($data['price']) ? (int)$data['price'] : 50000;
$ratings = isset($data['ratings']) ? $data['ratings'] : [];
$types = isset($data['types']) ? $data['types'] : [];

$sql = "SELECT * FROM tours WHERE name LIKE ? AND price <= ?";
$params = [$keyword, $price];
$bind_types = 'si';

// Handle tour types
if (!empty($types)) {
    $placeholders = implode(',', array_fill(0, count($types), '?'));
    $sql .= " AND type IN ($placeholders)";
    $params = array_merge($params, $types);
    $bind_types .= str_repeat('s', count($types));
}

// Handle ratings
if (!empty($ratings)) {
    $placeholders = implode(',', array_fill(0, count($ratings), '?'));
    $sql .= " AND rating IN ($placeholders)";
    $params = array_merge($params, array_map('intval', $ratings));
    $bind_types .= str_repeat('i', count($ratings));
}

$stmt = $conn->prepare($sql);
if ($stmt === false) {
    echo json_encode(["error" => "Failed to prepare statement."]);
    exit;
}

$stmt->bind_param($bind_types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

$tours = [];

while ($row = $result->fetch_assoc()) {
    $tours[] = [
        'id' => $row['id'],
        'title' => $row['name'],
        'location' => $row['location'],
        'image' => $row['image'],
        'price' => $row['price'],
        'rating' => $row['rating']
    ];
}

echo json_encode($tours);
?>
