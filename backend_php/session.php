<?php
// Centralized secure session start
function secure_session_start() {
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    $cookieParams = session_get_cookie_params();
    session_set_cookie_params([
        'lifetime' => $cookieParams['lifetime'],
        'path' => $cookieParams['path'],
        'domain' => $cookieParams['domain'],
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

?>
