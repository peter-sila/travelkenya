<?php
require_once 'session.php';
secure_session_start();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Invalid request method.']);
    exit;
}

$_SESSION = [];
$cookieParams = session_get_cookie_params();
$destroyed = session_destroy();

if (!$destroyed) {
    http_response_code(500);
    echo json_encode(['error' => 'Unable to end session.']);
    exit;
}

setcookie(session_name(), '', [
    'expires' => time() - 42000,
    'path' => $cookieParams['path'],
    'domain' => $cookieParams['domain'],
    'secure' => $cookieParams['secure'],
    'httponly' => $cookieParams['httponly'],
    'samesite' => $cookieParams['samesite']
]);

echo json_encode(['success' => 'Logged out.']);
