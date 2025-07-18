<?php
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
