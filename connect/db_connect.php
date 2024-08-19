<?php

require 'constants.php';

//connection to the database
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die('Database error:' . $conn->connect_error);
}

?>
