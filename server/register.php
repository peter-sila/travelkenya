<?php

session_start();

require 'connect/db_connect.php';

if (isset($_POST['register'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];


    $query_username = "SELECT * FROM users WHERE username=? LIMIT 1";
    $user_st = $conn->prepare($query_username);
    $user_st->bind_param('s', $username);
    $user_st->execute();
    $result = $user_st->get_result();
    $userCount  = $result->num_rows;
    $user_st->close();

    if ($userCount > 0) {
        $errors['username'] = "Username already exists";
    }

    $password = password_hash($password, PASSWORD_DEFAULT);

       
    $register_sql = "INSERT INTO users (username, password) VALUES (?,?)";
    $stmt = $conn->prepare($register_sql);
    $stmt->bind_param('ss', $username, $password);
    
    if ($stmt->execute()) {
        $_SESSION['success_send'] = "User registered successfully";
        $user_id = $conn->insert_id;
        $_SESSION['user_id'] = $user_id;
        $_SESSION['username'] = $username;
        header('location: ../login.html');
        exit();

    } else {
        $errors['db_error'] = "Database error: failed to register";
    }
   

}

?>