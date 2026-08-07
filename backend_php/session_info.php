<?php
require_once 'session.php';
secure_session_start();
header('Content-Type: application/json');
if (isset($_SESSION['user_id'])) {
    echo json_encode(['user_id' => $_SESSION['user_id'], 'is_admin' => !empty($_SESSION['is_admin'])]);
} else {
    echo json_encode(['user_id' => null]);
}
?>
