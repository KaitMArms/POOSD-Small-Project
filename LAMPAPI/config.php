<?php
// Database configuration for luisalban.xyz
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'US44Poptart'); // You'll need to replace this with your actual password
define('DB_NAME', 'CONTACTS');

// CORS configuration
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
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    echo $obj;
}
?>
