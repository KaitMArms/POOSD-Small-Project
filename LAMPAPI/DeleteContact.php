<?php
require_once 'config.php';

setCorsHeaders();
handlePreflight();

try {
    $inData = getRequestInfo();
    
    if (!isset($inData["firstName"]) || !isset($inData["lastName"]) || !isset($inData["userId"])) {
        handleError("Missing required fields");
    }

    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        handleError($conn->connect_error);
    }

    $stmt = $conn->prepare("DELETE FROM Contacts WHERE FirstName=? AND LastName=? AND UserID=?");
    if (!$stmt) {
        handleError($conn->error);
    }

    $stmt->bind_param("sss", $inData["firstName"], $inData["lastName"], $inData["userId"]);
    
    if (!$stmt->execute()) {
        handleError($stmt->error);
    }
    
    if ($stmt->affected_rows > 0) {
        returnWithInfo("Contact deleted successfully");
    } else {
        handleError("Contact not found");
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    handleError($e->getMessage());
}

function returnWithInfo($message) {
    $retValue = json_encode([
        'message' => $message,
        'error' => ""
    ]);
    sendResultInfoAsJson($retValue);
}
?>