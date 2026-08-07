<?php
require_once 'session.php';
require_once 'helpers.php';
require_once '../db/dbconnect.php';
/** @var mysqli $conn */
secure_session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_response(['error'=>'Invalid method'],405);
$data = json_decode(file_get_contents('php://input'), true) ?? [];
$tour_id = isset($data['tour_id']) ? (int)$data['tour_id'] : 0;
$date_from = isset($data['date_from']) ? sanitize_input($data['date_from']) : '';
$date_to = isset($data['date_to']) ? sanitize_input($data['date_to']) : '';
$seats = isset($data['seats']) ? (int)$data['seats'] : 1;

if (empty($_SESSION['user_id'])) json_response(['error'=>'Unauthorized'],401);
$user_id = $_SESSION['user_id'];

if ($tour_id <= 0 || $date_from === '') json_response(['error'=>'Missing data'],422);

$stmt = $conn->prepare('INSERT INTO bookings (user_id, tour_id, date_from, date_to, seats) VALUES (?, ?, ?, ?, ?)');
if ($stmt === false) json_response(['error'=>'DB error'],500);
$stmt->bind_param('iissi', $user_id, $tour_id, $date_from, $date_to, $seats);
if ($stmt->execute()) json_response(['success'=>true]);
json_response(['error'=>'Failed to book'],500);

?>
