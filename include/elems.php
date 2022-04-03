<?php
require_once 'db.php';
require_once 'account.php';

// if (!$account->authenticated || $account->getGroup()!=2) {
  //header("Location: http://");
//  exit;
//}

function addAttendance(int $collab_id, string $date, string $start, string $end) {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    /* Insert query template */
    $query = 'INSERT INTO '.$schema.'.attendance (collab_id, date, start, end) VALUES (:collab_id, :date, :start, :end)';
    
    /* Values array for PDO */
    $values = array(':collab_id' => $collab_id, ':date' => date("Y-m-d", strtotime($date)), ':start' => $start, ':end' => $end);
    
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

function addTimesheetEntry(int $collab_id, string $date, int $project_id, int $activity_id, float $time) {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    /* Insert query template */
    $query = 'INSERT INTO '.$schema.'.timesheets (collab_id, date, project_id, activity_id, time) VALUES (:collab_id, :date, :project_id, :activity_id, :time)';
    
    /* Values array for PDO */
    $values = array(':collab_id' => $collab_id, ':date' => date("Y-m-d", strtotime($date)), ':project_id' => $project_id, ':activity_id' => $activity_id, ':time' => $time);
    
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

function getTimesheets (int $collab_id) {
	/* Global $pdo object */
	global $pdo;
	global $schema;

	$query = 'SELECT * FROM '.$schema.'.timesheets WHERE (collab_id = :cid)';
	$values = array(':cid' => $collab_id);
	
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

function getPontaje (int $collab_id) {
	/* Global $pdo object */
	global $pdo;
	global $schema;

	$query = 'SELECT * FROM '.$schema.'.attendance WHERE (collab_id = :cid)';
	$values = array(':cid' => $collab_id);
	
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

function deleteTimesheet (int $collab_id, string $date) {
    global $pdo;
	global $schema;

	$query1 = 'DELETE FROM '.$schema.'.timesheets WHERE collab_id = :cid AND date = :date; DELETE FROM '.$schema.'.attendance WHERE collab_id = :cid AND date = :date';
	$values = array(':cid' => $collab_id, ':date' => date("Y-m-d", strtotime($date)));
	
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

function verifyDate(int $accountId, string $date):bool {
	/* Global $pdo object */
    global $pdo;
	global $schema;

	$query = 'SELECT date FROM '.$schema.'.attendance WHERE (collab_id = :cid)';
	$values = array(':cid' => $accountId);
	
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

function getDaysoff(int $collab_id) {
    global $pdo;
	global $schema;

	$query = 'SELECT * FROM '.$schema.'.daysoff WHERE (collab_id = :cid)';
	$values = array(':cid' => $collab_id);
	
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
?>