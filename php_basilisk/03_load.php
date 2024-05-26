<?php

require_once '02_transform.php';
require_once '../config/00_config.php';

// Connect to the database
try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}


$sql = "INSERT INTO basiliskSongList (start, title, artistCredits) 
        VALUES (:start, :title, :artistCredits)";

// Prepare the statement
$stmt = $pdo->prepare($sql);

// Check if the article already exists in the database based on its title
foreach ($songList as $item) {

    // Bind parameters
    $stmt->bindParam(':start', $item['start']);
    $stmt->bindParam(':title', $item['title']);
    $stmt->bindParam(':artistCredits', $item['artistCredits']);


    // Execute the statement
    try {
        $stmt->execute();
        echo "Article data for '{$item['title']}' inserted successfully.\n";
    } catch (PDOException $e) {
        echo "Error inserting article data for '{$item['title']}': " . $e->getMessage() . "\n";
    }
}


