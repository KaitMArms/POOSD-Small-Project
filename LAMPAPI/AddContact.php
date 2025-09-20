<?php
require_once 'config.php';

setCorsHeaders();
handlePreflight();
error_reporting(E_ALL);
ini_set('display_errors', 1);

$inData = getRequestInfo();

$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$phone = $inData["phone"];
$email = $inData["email"];
$userId = $inData["userId"];

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) 
{
    returnWithError( $conn->connect_error );
} 
else
{
    $stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, Phone, Email, UserID) VALUES(?,?,?,?,?)");
    $stmt->bind_param("sssss", $firstName, $lastName, $phone, $email, $userId);
    $stmt->execute();
    $stmt->close();
    $conn->close();
    returnWithInfo($firstName, $lastName, $phone, $email, $userId);
}

function returnWithError( $err )
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}

function returnWithInfo($firstName, $lastName, $phone, $email, $userId)
{
    $retValue = json_encode(array(
        "firstName" => $firstName,
        "lastName" => $lastName,
        "phone" => $phone,
        "email" => $email,
        "userId" => $userId,
        "error" => ""
    ));
    sendResultInfoAsJson($retValue);
}
?>
