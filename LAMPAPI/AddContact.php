<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phone = $inData["phone"];
	$email = $inData["email"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "admin", "1234", "CONTACTS");
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

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
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