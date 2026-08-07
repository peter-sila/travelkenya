<?php
require_once '../db/dbconnect.php';
require_once 'helpers.php';
require_once 'session.php';

/** @var mysqli $conn */
secure_session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Invalid request method.'], 405);
}

$username = isset($_POST['username']) ? sanitize_input($_POST['username']) : '';
$email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';
$confirm = isset($_POST['confirm_password']) ? $_POST['confirm_password'] : '';

$errors = [];
if ($username === '') $errors['username'] = 'Username is required.';
if ($email === '') $errors['email'] = 'Email is required.';
elseif (!validate_email($email)) $errors['email'] = 'Invalid email format.';
if ($password === '') $errors['password'] = 'Password is required.';
elseif (strlen($password) < 6) $errors['password'] = 'Password must be at least 6 characters.';
if ($confirm !== '' && $confirm !== $password) $errors['password_confirm'] = 'Passwords do not match.';

if (!empty($errors)) {
    json_response(['errors' => $errors], 422);
}

$hashed = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare('SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1');
if ($stmt === false) json_response(['error' => 'Database error.'], 500);
$stmt->bind_param('ss', $username, $email);
$stmt->execute();
$res = $stmt->get_result();
if ($res && $res->num_rows > 0) {
    json_response(['error' => 'Username or email already exists.'], 409);
}

$insert = $conn->prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
if ($insert === false) json_response(['error' => 'Database error.'], 500);
$insert->bind_param('sss', $username, $email, $hashed);
if ($insert->execute()) {
    json_response(['success' => 'User registered successfully.']);
} else {
    json_response(['error' => 'Failed to register user.'], 500);
}

?>
