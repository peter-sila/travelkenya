<?php
require_once 'session.php';
require_once '../db/dbconnect.php';
require_once 'helpers.php';
/** @var mysqli $conn */
secure_session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Invalid method'], 405);
}

$data = json_decode(file_get_contents('php://input'), true) ?? [];
$action = $data['action'] ?? '';
$tour_id = isset($data['tour_id']) ? (int)$data['tour_id'] : 0;

if (empty($_SESSION['user_id'])) {
    json_response(['error' => 'Unauthorized'], 401);
}
$user_id = $_SESSION['user_id'];

if ($action === 'add') {
    $stmt = $conn->prepare('INSERT INTO favorites (user_id, tour_id) VALUES (?, ?)');
    if ($stmt === false) json_response(['error' => 'DB error'], 500);
    $stmt->bind_param('ii', $user_id, $tour_id);
    if ($stmt->execute()) json_response(['success' => true]);
    json_response(['error' => 'Failed to add'], 500);
} elseif ($action === 'remove') {
    $stmt = $conn->prepare('DELETE FROM favorites WHERE user_id = ? AND tour_id = ?');
    if ($stmt === false) json_response(['error' => 'DB error'], 500);
    $stmt->bind_param('ii', $user_id, $tour_id);
    if ($stmt->execute()) json_response(['success' => true]);
    json_response(['error' => 'Failed to remove'], 500);
} else {
    json_response(['error' => 'Invalid action'], 400);
}

?>
