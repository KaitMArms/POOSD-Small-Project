<?php
    $inData = getRequestInfo();
    
    // Check if all required fields are present
    if (!isset($inData["firstName"]) || !isset($inData["lastName"]) || 
        !isset($inData["phone"]) || !isset($inData["email"]) || 
        !isset($inData["ID"]) || !isset($inData["userId"])) 
    {
        returnWithError("Missing required fields");
        exit();
    }

    $conn = new mysqli("localhost", "admin", "1234", "Contacts");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
        exit();
    } 
    else
    {
        // First verify that the contact belongs to the user
        $stmt = $conn->prepare("SELECT ID FROM Contacts WHERE ID=? AND UserID=?");
        $stmt->bind_param("ss", $inData["ID"], $inData["userId"]);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if($result->num_rows === 0) 
        {
            $stmt->close();
            $conn->close();
            returnWithError("Contact not found or unauthorized");
            exit();
        }
        
        // Update the contact information
        $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=? AND UserID=?");
        $stmt->bind_param("ssssss", 
            $inData["firstName"],
            $inData["lastName"],
            $inData["phone"],
            $inData["email"],
            $inData["ID"],
            $inData["userId"]
        );
        
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
    
    function returnWithInfo($message)
    {
        $retValue = '{"message":"' . $message . '","error":""}';
        sendResultInfoAsJson($retValue);
    }
?>
