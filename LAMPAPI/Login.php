<?php
require_once 'config.php';

setCorsHeaders();
handlePreflight();
error_reporting(E_ALL);
ini_set('display_errors', 1);

$inData = getRequestInfo();

// Validate input data
if (!isset($inData["login"]) || !isset($inData["password"])) {
    returnWithError("Missing login credentials");
    exit();
}

$id = 0;
$firstName = "";
$lastName = "";

// Connect to your remote database
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME); 	
if ($conn->connect_error)
{
    returnWithError($conn->connect_error);
    exit();
}

$stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=? AND Password =?");
$stmt->bind_param("ss", $inData["login"], $inData["password"]);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc())
{
    returnWithInfo($row['firstName'], $row['lastName'], $row['ID']);
}
else
{
    returnWithError("No Records Found");
}

$stmt->close();
$conn->close();

function returnWithError($err)
{
    $retValue = json_encode(array(
        "id" => 0,
        "firstName" => "",
        "lastName" => "",
        "error" => $err
    ));
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($firstName, $lastName, $id)
{
    $retValue = json_encode(array(
        "id" => $id,
        "firstName" => $firstName,
        "lastName" => $lastName,
        "error" => ""
    ));
    sendResultInfoAsJson($retValue);
}
?>
