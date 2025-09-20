<?php
require_once 'config.php';

setCorsHeaders();
handlePreflight();

try {
    $inData = getRequestInfo();
    
    if (!isset($inData["firstName"]) || !isset($inData["lastName"]) || 
        !isset($inData["phone"]) || !isset($inData["email"]) || !isset($inData["userId"])) {
        handleError("Missing required fields");
    }

    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        handleError($conn->connect_error);
    }

    $stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
    if (!$stmt) {
        handleError($conn->error);
    }

    $stmt->bind_param("sssss", $inData["firstName"], $inData["lastName"], 
                      $inData["phone"], $inData["email"], $inData["userId"]);
    
    if (!$stmt->execute()) {
        handleError($stmt->error);
    }
    
    $id = $stmt->insert_id;
    returnWithInfo($inData["firstName"], $inData["lastName"], 
                  $inData["phone"], $inData["email"], $id);

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    handleError($e->getMessage());
}

function returnWithInfo($firstName, $lastName, $phone, $email, $id) {
    $retValue = json_encode([
        'id' => $id,
        'firstName' => $firstName,
        'lastName' => $lastName,
        'phone' => $phone,
        'email' => $email,
        'error' => ""
    ]);
    sendResultInfoAsJson($retValue);
}
?>