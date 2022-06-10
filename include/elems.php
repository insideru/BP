<?php
require_once 'db.php';
require_once 'account.php';

global $account;
$account->sessionLogin();

if ($account->authenticated || $_POST["action"]=="login") {} else 
{
    die();
}

function addAttendance(string $guid, string $date, string $start, string $end) {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    /* Insert query template */
    $query = 'INSERT INTO '.$schema.'.attendance (collab_id, date, start, end) VALUES (:collab_id, :date, :start, :end)';
    
    /* Values array for PDO */
    $values = array(':collab_id' => getIDfromGUID($guid), ':date' => date("Y-m-d", strtotime($date)), ':start' => $start, ':end' => $end);
    
    /* Execute the query */
    try
    {
        $res = $pdo->prepare($query);
        $res->execute($values);
    }

    catch (PDOException $e)
    {
        /* If there is a PDO exception, throw a standard exception */
        echo "Database error".$e->getMessage();
        die();
    }
    
    /* Return the new ID */
    return "Success:" . $pdo->lastInsertId();
}

function addTimesheetEntry(string $guid, string $date, int $project_id, int $activity_id, float $time) {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    /* Insert query template */
    $query = 'INSERT INTO '.$schema.'.timesheets (collab_id, date, project_id, activity_id, time) VALUES (:collab_id, :date, :project_id, :activity_id, :time)';
    
    /* Values array for PDO */
    $values = array(':collab_id' => getIDfromGUID($guid), ':date' => date("Y-m-d", strtotime($date)), ':project_id' => $project_id, ':activity_id' => $activity_id, ':time' => $time);
    
    /* Execute the query */
    try
    {
        $res = $pdo->prepare($query);
        $res->execute($values);
    }
    catch (PDOException $e)
    {
        /* If there is a PDO exception, throw a standard exception */
        echo "Database error".$e->getMessage();
        die();
    }
    
    /* Return the new ID */
    return "Success:" . $pdo->lastInsertId();
}

function getTimesheets (string $guid) {
	/* Global $pdo object */
	global $pdo;
	global $schema;
    global $account;

	$query = 'SELECT * FROM '.$schema.'.timesheets WHERE (collab_id = :cid)';
	$values = array(':cid' => $account->getCollabID());
	
	try
	{
		$res = $pdo->prepare($query);
		$res->execute($values);
	}
	catch (PDOException $e)
	{
		/* If there is a PDO exception, throw a standard exception */
		echo "Database error ".$e->getMessage();
	}

	$fields=array();

	while ($row = $res->fetch(PDO::FETCH_ASSOC)) 
    {
		array_push($fields, $row);
	}

	return $fields;
}

function getPontaje (string $guid) {
	/* Global $pdo object */
	global $pdo;
	global $schema;

	$query = 'SELECT * FROM '.$schema.'.attendance WHERE (collab_id = :cid)';
	$values = array(':cid' => getIDfromGUID($guid));
	
	try
	{
		$res = $pdo->prepare($query);
		$res->execute($values);
	}
	catch (PDOException $e)
	{
		/* If there is a PDO exception, throw a standard exception */
		echo "Database error ".$e->getMessage();
	}

	$fields=array();

	while ($row = $res->fetch(PDO::FETCH_ASSOC)) 
    {
		array_push($fields, $row);
	}

	return $fields;
}

function deleteTimesheet (string $guid, string $date) {
    global $pdo;
	global $schema;

	$query1 = 'DELETE FROM '.$schema.'.timesheets WHERE collab_id = :cid AND date = :date; DELETE FROM '.$schema.'.attendance WHERE collab_id = :cid AND date = :date';
	$values = array(':cid' => getIDfromGUID($guid), ':date' => date("Y-m-d", strtotime($date)));
	
	try
	{
		$res1 = $pdo->prepare($query1);
		$res1->execute($values);
        //$res2 = $pdo->prepare($query2);
		//$res2->execute($values);
	}
	catch (PDOException $e)
	{
		/* If there is a PDO exception, throw a standard exception */
		echo "Database error: ".$e->getMessage();
        die();
	}

    echo "Success!";
}

function verifyDate(string $guid, string $date):bool {
	/* Global $pdo object */
    global $pdo;
	global $schema;

	$query = 'SELECT date FROM '.$schema.'.attendance WHERE (collab_id = :cid)';
	$values = array(':cid' => getIDfromGUID($guid));
	
	try
	{
		$res = $pdo->prepare($query);
		$res->execute($values);
	}
	catch (PDOException $e)
	{
	   /* If there is a PDO exception, throw a standard exception */
	   echo "Database error ".$e->getMessage();
	}
	
	while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
		$dbDate = $row['date'];
		//verificam daca se potriveste cookieul cu tokenul

		if ($dbDate==date("Y-m-d", strtotime($date))) {
			return FALSE;
			break;
		}
	}
	return TRUE;
}

function addHoliday(string $date, string $name) {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    /* Insert query template */
    $query = 'INSERT INTO '.$schema.'.holidays (date, name) VALUES (:date, :name)';
    
    /* Values array for PDO */
    $values = array(':date' => date("Y-m-d", strtotime($date)), ':name' => $name);
    
    /* Execute the query */
    try
    {
        $res = $pdo->prepare($query);
        $res->execute($values);
    }
    catch (PDOException $e)
    {
        /* If there is a PDO exception, throw a standard exception */
        echo "Database error".$e->getMessage();
        die();
    }
    
    /* Return the new ID */
    return "Success:" . $pdo->lastInsertId();
}

function getZileLibere(string $guid) {
	/* Global $pdo object */
	global $pdo;
	global $schema;

	$query = 'SELECT zile_concediu, zile_report, zile_ramase FROM '.$schema.'.accounts WHERE guid = :guid';
	$values = array(':guid' => $guid);
	
	try
	{
		$res = $pdo->prepare($query);
		$res->execute($values);
	}
	catch (PDOException $e)
	{
		/* If there is a PDO exception, throw a standard exception */
		echo "Database error ".$e->getMessage();
	}

	$row = $res->fetch(PDO::FETCH_ASSOC); 

	return $row;
}

function addDaysoff (string $collab_guid, string $startDate, string $endDate, int $number) {
	/* Global $pdo object */
    global $pdo;
    global $schema;
	//update accounts set `zile_ramase` = `zile_concediu`-5 where guid="6f0c7834-4a68-433f-bc06-e8e1fd38d33a"

    /* Insert query template */
    $query = 'INSERT INTO '.$schema.'.daysoff (collab_id, startdate, enddate) VALUES (:collab_id, :startdate, :enddate); UPDATE '.$schema.'.accounts SET zile_ramase = zile_ramase - :number WHERE guid= :guid';
    
    /* Values array for PDO */
    $values = array(':collab_id' => getIDfromGUID($collab_guid), ':startdate' => date("Y-m-d", strtotime($startDate)), ':enddate' => date("Y-m-d", strtotime($endDate)), ':number' => $number, ':guid' => $collab_guid);
    
    /* Execute the query */
    try
    {
        $res = $pdo->prepare($query);
        $res->execute($values);
    }
    catch (PDOException $e)
    {
        /* If there is a PDO exception, throw a standard exception */
        echo "Database error".$e->getMessage();
        die();
    }
    
    /* Return the new ID */
    return "Success:" . $pdo->lastInsertId();
}

function deleteDaysoff (string $startDate, int $number) {
	/* Global $pdo object */
    global $pdo;
    global $schema;
    global $account;
	//update accounts set `zile_ramase` = `zile_concediu`-5 where guid="6f0c7834-4a68-433f-bc06-e8e1fd38d33a"

    /* Insert query template */
    $query = 'DELETE FROM '.$schema.'.daysoff WHERE collab_id = :collab_id AND startdate = :startdate; UPDATE '.$schema.'.accounts SET zile_ramase = zile_ramase + :number WHERE collab_id= :collab_id';
    
    /* Values array for PDO */
    $values = array(':collab_id' => $account->getCollabID(), ':startdate' => date("Y-m-d", strtotime($startDate)), ':number' => $number);
    
    /* Execute the query */
    try
    {
        $res = $pdo->prepare($query);
        $res->execute($values);
    }
    catch (PDOException $e)
    {
        /* If there is a PDO exception, throw a standard exception */
        echo "Database error".$e->getMessage();
        die();
    }
    
    /* Return the new ID */
    return "Success!";
}

function getDaysoff(string $guid) {
    global $pdo;
	global $schema;

	$query = 'SELECT * FROM '.$schema.'.daysoff WHERE (collab_id = :cid)';
	$values = array(':cid' => getIDfromGUID($guid));
	
	try
	{
		$res = $pdo->prepare($query);
		$res->execute($values);
	}
	catch (PDOException $e)
	{
		/* If there is a PDO exception, throw a standard exception */
		echo "Database error ".$e->getMessage();
	}

	$fields=array();

	while ($row = $res->fetch(PDO::FETCH_ASSOC)) 
    {
		array_push($fields, $row);
	}

	return $fields;
}

function getIDfromGUID (string $guid) {
	/* Global $pdo object */
	global $pdo;
	global $schema;

	$query = 'SELECT collab_id FROM '.$schema.'.accounts WHERE (guid = :guid)';
	$values = array(':guid' => $guid);
	
	try
	{
		$res = $pdo->prepare($query);
		$res->execute($values);
	}
	catch (PDOException $e)
	{
		/* If there is a PDO exception, throw a standard exception */
		echo "Database error ".$e->getMessage();
	}

	$row = $res->fetch(PDO::FETCH_ASSOC); 

	return $row['collab_id'];
}

function renameName (string $table, string $oldName, string $newName) {
	/* Global $pdo object */
	global $pdo;
	global $schema;

	$query = 'UPDATE '.$schema.'.'.$table.' SET name = :newName WHERE name = :oldName';
	$values = array(':newName' => $newName, ':oldName' => $oldName);
	
	try
	{
		$res = $pdo->prepare($query);
		$res->execute($values);
	}
	catch (PDOException $e)
	{
		/* If there is a PDO exception, throw a standard exception */
		echo "Database error ".$e->getMessage();
		exit();
	}
	echo "Success!";
}

function getProjects() {
    /* Global $pdo object */
    global $pdo;
    global $schema;
    global $account;

    $query = 'SELECT * FROM '. $schema . '.projects ORDER BY active DESC, start_date ASC';

    try
    {
        $res = $pdo->prepare($query);
        $res->execute();
    }

    catch (PDOException $e)
    {
        /* If there is a PDO exception, throw a standard exception */
        echo "Database error".$e->getMessage();
        die();
    }
    $fields=array();

    while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
        if (($account->permissions['external'] && $row['external']) || ($account->permissions['admin']) || (!$row['external'])) {
            array_push($fields, $row);
        }
    }
    return $fields;
}

function getActivities() {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    $query = 'SELECT * FROM '. $schema . '.activities ORDER BY name ASC';

    try
    {
        $res = $pdo->prepare($query);
        $res->execute();
    }

    catch (PDOException $e)
    {
        /* If there is a PDO exception, throw a standard exception */
        echo "Database error".$e->getMessage();
        die();
    }
    $fields=array();

    while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
        array_push($fields, $row);
    }
    return $fields;
}

function getHolidays() {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    $query = 'SELECT * FROM '. $schema . '.holidays ORDER BY date ASC';

    try
    {
        $res = $pdo->prepare($query);
        $res->execute();
    }

    catch (PDOException $e)
    {
        /* If there is a PDO exception, throw a standard exception */
        echo "Database error".$e->getMessage();
        die();
    }
    $fields=array();

    while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
        array_push($fields, $row);
    }
    return $fields;
}

function getCollabs() {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    $query = 'SELECT * FROM '. $schema . '.collaborators ORDER BY name ASC';

    try
    {
        $res = $pdo->prepare($query);
        $res->execute();
    }

    catch (PDOException $e)
    {
        /* If there is a PDO exception, throw a standard exception */
        echo "Database error".$e->getMessage();
        die();
    }
    $fields=array();

    while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
        array_push($fields, $row);
    }
    return $fields;
}
?>