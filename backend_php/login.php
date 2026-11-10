<?php
require_once '../db/dbconnect.php';
require_once 'helpers.php';
require_once 'session.php';

/** @var mysqli $conn */
secure_session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Invalid request method.'], 405);
}

$username = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

if ($username === '' || $password === '') {
    json_response(['error' => 'Email and password are required.'], 422);
}

$stmt = $conn->prepare('SELECT id, password FROM users WHERE email = ? LIMIT 1');
if ($stmt === false) json_response(['error' => 'Database error.'], 500);
$stmt->bind_param('s', $username);
$stmt->execute();
$res = $stmt->get_result();

if ($res && $res->num_rows > 0) {
    $user = $res->fetch_assoc();
    if (password_verify($password, $user['password'])) {
        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['id'];
        header('Location: ../index.html');
        exit;
    } else {
        json_response(['error' => 'Invalid credentials.'], 401);
    }
} else {
    json_response(['error' => 'No user found.'], 404);
}