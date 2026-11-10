<?php

// Database configuration - prefer environment variables for container deployments
$host = getenv('DB_HOST') ?: 'localhost';
$dbname = getenv('DB_NAME') ?: 'explorekenya';
$username = getenv('DB_USER') ?: 'sa';
$password = getenv('DB_PASS') ?: 'Wise12.,';

?>