<?php
require_once 'session.php';
require_once 'helpers.php';
require_once '../db/dbconnect.php';
/** @var mysqli $conn */

secure_session_start();

if (empty($_SESSION['is_admin'])) {
    json_response(['error' => 'Forbidden'], 403);
}

$data = json_decode(file_get_contents('php://input'), true) ?? [];
$title = isset($data['title']) ? sanitize_input($data['title']) : '';
$location = isset($data['location']) ? sanitize_input($data['location']) : '';
$price = isset($data['price']) ? (float)$data['price'] : 0;
$type = isset($data['type']) ? sanitize_input($data['type']) : '';
$image = isset($data['image']) ? sanitize_input($data['image']) : '';

if ($title === '') json_response(['error'=>'Title required'], 422);

$stmt = $conn->prepare('INSERT INTO tours (name, location, price, type, image) VALUES (?, ?, ?, ?, ?)');
if ($stmt === false) json_response(['error'=>'DB prepare failed'], 500);
$stmt->bind_param('ssiss', $title, $location, $price, $type, $image);
if ($stmt->execute()) json_response(['success' => true]);
json_response(['error' => 'Failed to create'], 500);

?>
