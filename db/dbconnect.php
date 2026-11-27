<?php

// Load DB constants from same directory; using __DIR__ helps static analyzers resolve the file
require_once __DIR__ . '/constants.php';

/** @var string $host */
/** @var string $dbname */
/** @var string $username */
/** @var string $password */

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>