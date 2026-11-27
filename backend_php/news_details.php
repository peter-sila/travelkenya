<?php
<<<<<<< HEAD

$allowed_origins = [
    'http://127.0.0.1:5501',
    'http://127.0.0.1:5500',
    'http://localhost:8000'
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

=======
>>>>>>> d7a3c8a4337a60f362ea27b57881dc92f3a17f39
include '../db/dbconnect.php';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);

    $stmt = $conn->prepare("SELECT * FROM news WHERE id = ?");
    $stmt->bind_param('id', $id);
    $stmt->execute();
    $news = $stmt->get_result();;


    if ($news) {
        // Return as JSON
        echo json_encode($news);
    } else {
        echo json_encode(['error' => 'News not found']);
    }
} else {
    echo json_encode(['error' => 'No ID provided']);
}

$conn = null;
?>
