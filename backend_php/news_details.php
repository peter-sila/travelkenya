<?php
include '../db/dbconnect.php';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);

    $stmt = $conn->prepare("SELECT * FROM news WHERE id = :id ");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    $news = $stmt->fetch(PDO::FETCH_ASSOC);


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
