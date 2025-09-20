<?php
require_once 'config.php';

setCorsHeaders();
handlePreflight();
error_reporting(E_ALL);
ini_set('display_errors', 1);

$inData = getRequestInfo();

// Validate input data
if (!isset($inData["login"]) || !isset($inData["password"]) || 
    !isset($inData["firstName"]) || !isset($inData["lastName"])) {
    returnWithError("Missing required fields");
    exit();
}

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME); 	
if ($conn->connect_error)
{
    returnWithError($conn->connect_error);
    exit();
}

try {
    // First check if login already exists
    $stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("s", $inData["login"]);
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $result = $stmt->get_result();
    
    if ($result->fetch_assoc())
    {
        $stmt->close();
        returnWithError("Username already exists");
        exit();
    }

    $stmt->close();
    
    // If login is unique, proceed with registration
    $stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES (?,?,?,?)");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("ssss", 
        $inData["firstName"], 
        $inData["lastName"], 
        $inData["login"], 
        $inData["password"]
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    $id = $conn->insert_id;
    returnWithInfo($inData["firstName"], $inData["lastName"], $id);
    
    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    returnWithError($e->getMessage());
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
