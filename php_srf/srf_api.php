<?php

// Include database configuration and connect to the database
require_once '../config/00_config.php';

// Connect to the database
try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Set default filter value
$defaultFilter = '24h';

// Get the filter parameter from the frontend (e.g., 24h, 7d, 1m)
$filter = isset($_GET['filter']) ? $_GET['filter'] : $defaultFilter;

// Modify the SQL query based on the selected filter
switch ($filter) {
    case '24h':
        $sql = "SELECT * FROM songList WHERE created_at >= NOW() - INTERVAL 1 DAY";
        break;
    case '7d':
        $sql = "SELECT * FROM songList WHERE created_at >= NOW() - INTERVAL 7 DAY";
        break;
    case '1m':
        $sql = "SELECT * FROM songList WHERE created_at >= NOW() - INTERVAL 1 MONTH";
        break;
    default:
        $sql = "SELECT * FROM songList"; // Default query without filtering
}

// Execute the modified SQL query
$stmt = $pdo->query($sql);

// Fetch data as associative array
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Output data as JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
