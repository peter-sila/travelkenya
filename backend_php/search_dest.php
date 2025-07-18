<?php
header("Content-Type: application/json");
include '../db/dbconnect.php';

$keyword = isset($_GET['keyword']) ? $conn->real_escape_string($_GET['keyword']) : "";

$sql = "SELECT * FROM destinations WHERE title LIKE '%$keyword%' OR location LIKE '%$keyword%' LIMIT 10";
$result = $conn->query($sql);

$destinations = [];

if ($result) {
  while ($row = $result->fetch_assoc()) {
    $destinations[] = $row;
  }
}

echo json_encode($destinations);
?>
