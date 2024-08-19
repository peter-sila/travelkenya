<?php

session_start();

require '../connect/db_connect.php';

if (isset($_GET['login'])) {
    $username = $_GET['username'];
    $password = $_GET['password'];

    $sql = "SELECT * FROM users WHERE username=? LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $userCount  = $result->num_rows;

    if ($userCount > 0) {
        $errors['username'] = "Username already exists";
    }

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $username;

        header('location: ../index.html');
        exit();
        
    } else {
        $errors['login_fail'] = "Wrong credentials";
    }
}

?>