<?php
    $inData = getRequestInfo();
    
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $userId = $inData["userId"];

    $conn = new mysqli("localhost", "admin", "1234", "CONTACTS");
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
            returnWithError("");
        }
        else 
        {
            returnWithMessage($firstName, $lastName);
        }
        
        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
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