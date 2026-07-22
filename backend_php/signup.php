<?php

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