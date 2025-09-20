<?php
require_once 'config.php';

setCorsHeaders();
handlePreflight();
error_reporting(E_ALL);
ini_set('display_errors', 1);

$inData = getRequestInfo();

$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$userId = $inData["userId"];

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) 
{
    returnWithError($conn->connect_error);
} 
else
{
    // Delete contact matching first name, last name, and userId
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE FirstName=? AND LastName=? AND UserID=?");
    $stmt->bind_param("sss", $firstName, $lastName, $userId);
    $stmt->execute();
    
    // Check if any rows were affected by the delete
    if ($stmt->affected_rows > 1)
    {
        returnWithError("Multiple contacts deleted - this should not happen");
    }
    else if ($stmt->affected_rows === 0)
    {
        returnWithError("Contact not found or unauthorized");
    }
    else 
    {
        returnWithMessage($firstName, $lastName);
    }
    
    $stmt->close();
    $conn->close();
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithMessage($firstName, $lastName)
{
    $message = "Contact " . $firstName . " " . $lastName . " deleted.";
    returnWithInfo($message);
}

function returnWithInfo($message)
{
    $retValue = json_encode(array(
        "message" => $message,
        "error" => ""
    ));
    sendResultInfoAsJson($retValue);
}
?>
