<?php
header('Content-Type: application/json');
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

$conn = new mysqli("localhost", "admin", "1234", "Contacts"); 	
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

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    echo $obj;
}

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
