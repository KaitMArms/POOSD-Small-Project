<?php
require_once 'config.php';

setCorsHeaders();
handlePreflight();

try {
    $inData = getRequestInfo();
    
    if (!isset($inData["search"]) || !isset($inData["userId"])) {
        handleError("Missing required fields");
    }

    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        handleError($conn->connect_error);
    }

    $stmt = $conn->prepare("SELECT FirstName, LastName, Phone, Email FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ?) AND UserID=?");
    if (!$stmt) {
        handleError("Prepare failed: " . $conn->error);
    }

    $searchTerm = $inData["search"];
    $searchName = ($searchTerm === "") ? "%" : $searchTerm . "%";
    $userId = (int)$inData["userId"];

    $stmt->bind_param("ssi", $searchName, $searchName, $userId);
    
    if (!$stmt->execute()) {
        handleError("Execute failed: " . $stmt->error);
    }
    
    $result = $stmt->get_result();
    $searchResults = array();
    
    while($row = $result->fetch_assoc()) {
        $searchResults[] = array(
            "firstName" => $row["FirstName"],
            "lastName" => $row["LastName"],
            "phone" => $row["Phone"],
            "email" => $row["Email"]
        );
    }
    
    sendResultInfoAsJson(json_encode([
        'results' => $searchResults,
        'error' => ""
    ]));

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    handleError($e->getMessage());
}
?>
