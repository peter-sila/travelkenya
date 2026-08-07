<?php
/**
 * Simple input helpers for backend scripts
 * @package backend
 */

/**
 * Sanitize a value (string or array of strings) for safe output.
 * @param mixed $value
 * @return mixed
 */
function sanitize_input($value)
{
    if (is_array($value)) {
        return array_map('sanitize_input', $value);
    }
    $v = trim((string)$value);
    return htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/**
 * Validate an email address.
 * @param string $email
 * @return bool
 */
function validate_email(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Send a JSON response and exit.
 * @param mixed $data
 * @param int $status
 * @return void
 */
function json_response($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

?>
