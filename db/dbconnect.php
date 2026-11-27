<?php

<<<<<<< HEAD
// Load DB constants from same directory; using __DIR__ helps static analyzers resolve the file
require_once __DIR__ . '/constants.php';

/** @var string $host */
/** @var string $dbname */
/** @var string $username */
/** @var string $password */
=======
include_once 'constants.php';
>>>>>>> d7a3c8a4337a60f362ea27b57881dc92f3a17f39

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
<<<<<<< HEAD

=======
>>>>>>> d7a3c8a4337a60f362ea27b57881dc92f3a17f39
?>