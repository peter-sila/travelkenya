<?php
<<<<<<< HEAD
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

$stmt = $conn->prepare('SELECT id FROM users WHERE



 email = ? LIMIT 1');
if ($stmt === false) json_response(['error' => 'Database error.'], 500);
$stmt->bind_param('s', $email);
$stmt->execute();
$res = $stmt->get_result();
if ($res && $res->num_rows > 0) {
    json_response(['error' => 'Email already exists.'], 409);
}

$insert = $conn->prepare('INSERT INTO users (email, password) VALUES (?, ?)');
if ($insert === false) json_response(['error' => 'Database error.'], 500);
$insert->bind_param('ss', $email, $hashed);
if ($insert->execute()) {
    json_response(['success' => 'User registered successfully.']);
    Header('Location: ../login.html');
} else {
    json_response(['error' => 'Failed to register user.'], 500);
}
=======

include '../db/dbconnect.php';

session_start();

$errors = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Validate inputs
    if (empty($username)) {
        $errors['username'] = "Username is required.";
    }

    if (empty($email)) {
        $errors['email'] = "Email is required.";
        exit();
    }

    if (empty($password)) {
        $errors['password'] = "Password is required.";
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = "Invalid email format.";
        exit();
    }

    if (strlen($password) < 6) {
        $errors['password'] = "Password must be at least 6 characters long.";
        exit();
    }

    if (isset($_POST['confirm_password']) && $_POST['confirm_password'] !== $password) {
        $errors['password'] = "Passwords do not match.";
        exit();
    }

    if ($errors) {
        echo json_encode(['errors' => $errors]);
        exit();
    } else {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Check if username or email already exists
        $stmt = $conn->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
        $stmt->bind_param('username', $username);
        $stmt->bind_param('email', $email);
        $stmt->execute();

        if ($stmt->num_rows() > 0) {
            echo json_encode(['error' => 'Username or email already exists.']);
            exit();
        }

        // Insert new user
        $insert_stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        $insert_stmt->bind_param('username', $username);
        $insert_stmt->bind_param('email', $email);
        $insert_stmt->bind_param('password', $hashed_password);

        if ($insert_stmt->execute()) {
            echo json_encode(['success' => 'User registered successfully.']);
        } else {
            echo json_encode(['error' => 'Failed to register user.']);
        }
    }

    $conn = null;
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
>>>>>>> d7a3c8a4337a60f362ea27b57881dc92f3a17f39
