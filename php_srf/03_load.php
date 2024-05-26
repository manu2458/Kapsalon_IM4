<?php

require_once '02_transform.php';
require_once '../config/00_config.php';

// Connect to the database
try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}


$sql = "INSERT INTO songList (duration, title, artist, date) 
        VALUES (:duration, :title, :artist, :date)";

// Prepare the statement
$stmt = $pdo->prepare($sql);

// Check if the article already exists in the database based on its title
foreach ($songList as $item) {

    if ($item['duration'] === 0) {
        continue;
    }


    // Bind parameters
    $stmt->bindParam(':duration', $item['duration']);
    $stmt->bindParam(':title', $item['title']);
    $stmt->bindParam(':artist', $item['artist']);
    $stmt->bindParam(':date', $item['date']);


    // Execute the statement
    try {
        $stmt->execute();
        echo "Article data for '{$item['title']}' inserted successfully.\n";
    } catch (PDOException $e) {
        echo "Error inserting article data for '{$item['title']}': " . $e->getMessage() . "\n";
    }
}


