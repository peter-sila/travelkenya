<?php
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

header("Content-Type: application/json");
require_once '../db/dbconnect.php';
/** @var mysqli $conn */

$data = json_decode(file_get_contents("php://input"), true) ?? [];

$keyword = isset($data['keyword']) ? "%" . $conn->real_escape_string($data['keyword']) . "%" : "%";
$price = isset($data['price']) ? (int)$data['price'] : 50000;
$ratings = isset($data['ratings']) ? $data['ratings'] : [];
$types = isset($data['types']) ? $data['types'] : [];

// Pagination
$page = isset($data['page']) && (int)$data['page'] > 0 ? (int)$data['page'] : 1;
$per_page = isset($data['per_page']) && (int)$data['per_page'] > 0 ? (int)$data['per_page'] : 10;

// Build base WHERE clause and params
$sql_where = "FROM tours WHERE name LIKE ? AND price <= ?";
$params = [$keyword, $price];
$bind_types = 'si';

// Handle tour types
if (!empty($types)) {
    $placeholders = implode(',', array_fill(0, count($types), '?'));
    $sql_where .= " AND type IN ($placeholders)";
    $params = array_merge($params, $types);
    $bind_types .= str_repeat('s', count($types));
}

// Handle ratings
if (!empty($ratings)) {
    $placeholders = implode(',', array_fill(0, count($ratings), '?'));
    $sql_where .= " AND rating IN ($placeholders)";
    $params = array_merge($params, array_map('intval', $ratings));
    $bind_types .= str_repeat('i', count($ratings));
}

// Get total count for pagination
$count_sql = "SELECT COUNT(*) as total " . $sql_where;
$count_stmt = $conn->prepare($count_sql);
if ($count_stmt === false) {
    echo json_encode(["error" => "Failed to prepare count statement."]);
    exit;
}
$count_stmt->bind_param($bind_types, ...$params);
$count_stmt->execute();
$count_res = $count_stmt->get_result();
$total = 0;
if ($row = $count_res->fetch_assoc()) {
    $total = (int)$row['total'];
}

// Apply ordering and limits
$offset = ($page - 1) * $per_page;
$sql = "SELECT * " . $sql_where . " ORDER BY id DESC LIMIT ?, ?";
$params_with_limit = array_merge($params, [$offset, $per_page]);
$bind_types_with_limit = $bind_types . 'ii';

$stmt = $conn->prepare($sql);
if ($stmt === false) {
    echo json_encode(["error" => "Failed to prepare statement."]);
    exit;
}

$stmt->bind_param($bind_types_with_limit, ...$params_with_limit);
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

echo json_encode(['tours' => $tours, 'total' => $total]);
?>
