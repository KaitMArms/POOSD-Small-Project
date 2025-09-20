<?php
require_once 'config.php';

setCorsHeaders();
handlePreflight();

try {
    $inData = getRequestInfo();
    
    // Validate input
    if (!isset($inData["login"]) || !isset($inData["password"])) {
        handleError("Missing login credentials");
    }

    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        handleError($conn->connect_error);
    }

    // Log the attempt (for debugging)
    error_log("Login attempt for user: " . $inData["login"]);

    $stmt = $conn->prepare("SELECT ID, firstName, lastName FROM Users WHERE Login=? AND Password=?");
    if (!$stmt) {
        handleError("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("ss", $inData["login"], $inData["password"]);
    
    if (!$stmt->execute()) {
        handleError("Execute failed: " . $stmt->error);
    }
    
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        sendResultInfoAsJson(json_encode([
            'id' => $row['ID'],
            'firstName' => $row['firstName'],
            'lastName' => $row['lastName'],
            'error' => ""
        ]));
    } else {
        handleError("No Records Found");
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    handleError($e->getMessage());
}
?>