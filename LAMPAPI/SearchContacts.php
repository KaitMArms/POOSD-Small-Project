<?php
require_once 'config.php';

setCorsHeaders();
handlePreflight();
error_reporting(E_ALL);
ini_set('display_errors', 1);

$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) 
{
    returnWithError( $conn->connect_error );
} 
else
{
    $stmt = $conn->prepare("SELECT FirstName, LastName, Phone, Email FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ?) AND UserID=?");
    $searchName = "%" . $inData["search"] . "%";
    $stmt->bind_param("sss", $searchName, $searchName, $inData["userId"]);
    $stmt->execute();
    
    $result = $stmt->get_result();
    
    while($row = $result->fetch_assoc())
    {
        if( $searchCount > 0 )
        {
            $searchResults .= ",";
        }
        $searchCount++;
        // Build a JSON object for each contact
        $searchResults .= '{';
        $searchResults .= '"firstName":"' . $row["FirstName"] . '",';
        $searchResults .= '"lastName":"' . $row["LastName"] . '",';
        $searchResults .= '"phone":"' . $row["Phone"] . '",';
        $searchResults .= '"email":"' . $row["Email"] . '"';
        $searchResults .= '}';
    }
    
    if( $searchCount == 0 )
    {
        returnWithError( "No Records Found" );
    }
    else
    {
        returnWithInfo( $searchResults );
    }
    
    $stmt->close();
    $conn->close();
}

function returnWithError( $err )
{
    $retValue = '{"results":[],"error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}

function returnWithInfo( $searchResults )
{
    $retValue = '{"results":[' . $searchResults . '],"error":""}';
    sendResultInfoAsJson( $retValue );
}
?>
