<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Common functions used across all API files
function setCorsHeaders() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');
}

function handlePreflight() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

function getRequestInfo() {
    $rawData = file_get_contents('php://input');
    error_log("Raw input: " . $rawData);
    
    $data = json_decode($rawData, true);
    if ($data === null) {
        handleError("Invalid JSON input: " . json_last_error_msg());
    }
    return $data;
}

function sendResultInfoAsJson($obj) {
    header('Content-Type: application/json');
    echo $obj;
}

function handleError($error) {
    error_log("API error: " . $error);
    http_response_code(500);
    echo json_encode(['error' => $error]);
    exit();
}

// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'admin');
define('DB_PASS', '1234');
define('DB_NAME', 'CONTACTS');

// Test database connection
try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        handleError('Database connection failed: ' . $conn->connect_error);
    }
    $conn->close();
} catch (Exception $e) {
    handleError('Database error: ' . $e->getMessage());
}
?>