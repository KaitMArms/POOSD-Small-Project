<?php
require_once 'config.php';

setCorsHeaders();
handlePreflight();
error_reporting(E_ALL);
ini_set('display_errors', 1);

$inData = getRequestInfo();

// Check if required identification fields are present
if (!isset($inData["search"]) || !isset($inData["userId"]) || 
    !isset($inData["updates"])) 
{
    returnWithError("Missing required fields");
    exit();
}

// Get the search criteria
$searchFirstName = $inData["search"]["firstName"] ?? null;
$searchLastName = $inData["search"]["lastName"] ?? null;

if (!$searchFirstName && !$searchLastName) {
    returnWithError("At least firstName or lastName must be provided in search criteria");
    exit();
}

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) 
{
    returnWithError($conn->connect_error);
    exit();
} 
else
{
    // First find and verify the contact belongs to the user
    $stmt = $conn->prepare("SELECT ID FROM Contacts WHERE FirstName=? AND LastName=? AND UserID=?");
    $stmt->bind_param("sss", $searchFirstName, $searchLastName, $inData["userId"]);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if($result->num_rows === 0) 
    {
        $stmt->close();
        $conn->close();
        returnWithError("Contact not found or unauthorized");
        exit();
    }
    
    // Get the contact ID
    $contactId = $result->fetch_assoc()["ID"];
    
    // Build the update query dynamically based on what fields are provided
    $updates = $inData["updates"];
    $updateFields = [];
    $updateValues = [];
    $types = "";
    
    if (isset($updates["firstName"])) {
        $updateFields[] = "FirstName=?";
        $updateValues[] = $updates["firstName"];
        $types .= "s";
    }
    if (isset($updates["lastName"])) {
        $updateFields[] = "LastName=?";
        $updateValues[] = $updates["lastName"];
        $types .= "s";
    }
    if (isset($updates["phone"])) {
        $updateFields[] = "Phone=?";
        $updateValues[] = $updates["phone"];
        $types .= "s";
    }
    if (isset($updates["email"])) {
        $updateFields[] = "Email=?";
        $updateValues[] = $updates["email"];
        $types .= "s";
    }
    
    if (empty($updateFields)) {
        returnWithError("No fields to update");
        exit();
    }
    
    // Add the WHERE clause parameters
    $updateValues[] = $contactId;
    $updateValues[] = $inData["userId"];
    $types .= "ss";
    
    // Prepare and execute the update query
    $updateQuery = "UPDATE Contacts SET " . implode(", ", $updateFields) . " WHERE ID=? AND UserID=?";
    $stmt = $conn->prepare($updateQuery);
    
    // Bind parameters dynamically
    $stmt->bind_param($types, ...$updateValues);
    
    if($stmt->execute())
    {
        returnWithInfo("Contact updated successfully");
    }
    else
    {
        returnWithError("Error updating contact");
    }
    
    $stmt->close();
    $conn->close();
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($message)
{
    $retValue = '{"message":"' . $message . '","error":""}';
    sendResultInfoAsJson($retValue);
}
?>
