<?php
require_once 'db.php';
require_once 'account.php';

global $account;
$account->sessionLogin();

if (($account->authenticated) || $_POST["action"]=="login") { //&& $account->getGroup() == 0
} else {
    die();
}

function addProjCat(string $name) {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    /* Insert query template */
    $query = 'INSERT INTO '.$schema.'.project_types (name) VALUES (:name)';
    
    /* Values array for PDO */
    $values = array(':name' => $name);
    
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

function getProjCat() {
	/* Global $pdo object */
	global $pdo;
	global $schema;

	$query = 'SELECT * FROM '. $schema . '.project_types ORDER BY name ASC';

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

	while ($row = $res->fetch(PDO::FETCH_ASSOC)) 
    {
		array_push($fields, $row);
	}

	return $fields;
}

function addCollabCat(string $name) {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    /* Insert query template */
    $query = 'INSERT INTO '.$schema.'.collab_groups (name) VALUES (:name)';
    
    /* Values array for PDO */
    $values = array(':name' => $name);
    
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

function getCollabCat() {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    $query = 'SELECT * FROM '. $schema . '.collab_groups ORDER BY name ASC';

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

function addClient (string $name) {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    /* Insert query template */
    $query = 'INSERT INTO '.$schema.'.clients (name) VALUES (:name)';
    
    /* Values array for PDO */
    $values = array(':name' => $name);
    
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

function saveTemplate (int $type, string $name, string $data) {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    /* Insert query template */
    $query = 'SELECT * FROM '.$schema.'.project_templates WHERE (type = :type) AND (name = :name)';
    
    /* Values array for PDO */
    $values = array(':type' => $type, ':name' => $name);

    /* Execute the query */
    try
    {
        $res = $pdo->prepare($query);
        $res->execute($values);
    }
    catch (PDOException $e)
    {
        /* If there is a PDO exception, throw a standard exception */
        echo "Database error: ".$e->getMessage();
        die();
    }

    $fields=array();

    while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
        array_push($fields, $row);
    }
    if (sizeof($fields)==0) {
        /* Insert query template */
        $query = 'INSERT INTO '.$schema.'.project_templates (type, name, options) VALUES (:type, :name, :options)';
    } else {
        $query = 'UPDATE '.$schema.'.project_templates SET options = :options WHERE (type = :type) AND (name = :name)';
    }
    
    /* Values array for PDO */
    $values = array(':type' => $type, ':name' => $name, ':options' => $data);
    
    /* Execute the query */
    try
    {
        $res = $pdo->prepare($query);
        $res->execute($values);
    }
    catch (PDOException $e)
    {
        /* If there is a PDO exception, throw a standard exception */
        echo "Database error: ".$e->getMessage();
        die();
    }
    
    /* Return the new ID */
    return "Success:" . $pdo->lastInsertId();
}

function deleteTemplate (int $type, string $name) {
    global $pdo;
	global $schema;

	$query = 'DELETE FROM '.$schema.'.project_templates WHERE (type = :type) AND (name = :name)';
	$values = array(':type' => $type, ':name' => $name);
	
	try
	{
		$res = $pdo->prepare($query);
		$res->execute($values);
	}
	catch (PDOException $e)
	{
		/* If there is a PDO exception, throw a standard exception */
		echo "Database error: ".$e->getMessage();
        die();
	}

    echo "Success!";
}

function getTemplates() {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    $query = 'SELECT * FROM '. $schema . '.project_templates';

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

function getClients() {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    $query = 'SELECT * FROM '. $schema . '.clients ORDER BY name ASC';

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

function addCollab (string $name, int $id) {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    /* Insert query template */
    $query = 'INSERT INTO '.$schema.'.collaborators (name, collabCatID) VALUES (:name, :collabCatID)';
    
    /* Values array for PDO */
    $values = array(':name' => $name, ":collabCatID" => $id);
    
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

function addProject (array $basicData) {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    /* Insert query template */
    $query = 'INSERT INTO '.$schema.'.projects (name, client_id, type_id, external, budget, start_date, deadline) VALUES (:name, :client_id, :type_id, :external, :budget, :start_date, :deadline)';
    
    /* Values array for PDO */
    $values = array(':name' => $basicData[0], ":client_id" => (int)$basicData[1], ":type_id" => (int)$basicData[2], ":external" => (int)$basicData[3], ":budget" => (int)$basicData[4], ":start_data" => date("Y-m-d", strtotime($basicData[5])), "deadline" => date("Y-m-d", strtotime($basicData[6])));
    
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

function addProjectDetails (int $proj_id, array $detailsData) {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    /* Insert query template */
    $query = 'INSERT INTO '.$schema.'.project_info (proj_id, name, type, value) VALUES ';

    foreach ($detailsData as $element) {
        $query+="({$proj_id}, {$element}['name'], {$element}['type'], {$element}['val']), ";
    }

    $query = substr($query, 0, strlen($query)-2);
    $query += ';';
    
    /* Execute the query */
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
    
    /* Return the new ID */
    return "Success!";
}

function addProjectPhases (int $proj_id, array $phaseData) {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    /* Insert query template */
    $query = 'INSERT INTO '.$schema.'.project_phases (proj_id, name) VALUES ';

    foreach ($phaseData as $element) {
        $query+="({$proj_id}, {$element}['name']), ";
    }

    $query = substr($query, 0, strlen($query)-2);
    $query += ';';
    
    /* Execute the query */
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
    
    /* Return the new ID */
    return "Success!";
}

function addProjectMilestones (int $proj_id, array $milestoneData) {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    /* Insert query template */
    $query = 'INSERT INTO '.$schema.'.project_milestones (proj_id, name) VALUES ';

    foreach ($milestoneData as $element) {
        $query+="({$proj_id}, {$element}['name']), ";
    }

    $query = substr($query, 0, strlen($query)-2);
    $query += ';';
    
    /* Execute the query */
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
    
    /* Return the new ID */
    return "Success!";
}

function changeProjectState (int $proj_id) {

    /* Global $pdo object */
    global $pdo;
    global $schema;

    $query = 'UPDATE '. $schema . '.projects SET active = CASE WHEN active = 1 THEN 0 ELSE 1 END WHERE id = :id';
    $values = array(":id" => $proj_id);

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
    $fields=array();

    while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
        array_push($fields, $row);
    }
    return $fields;
}

function changeProjExternal (int $proj_id) {

    /* Global $pdo object */
    global $pdo;
    global $schema;

    $query = 'UPDATE '. $schema . '.projects SET external = CASE WHEN external = 1 THEN 0 ELSE 1 END WHERE id = :id';
    $values = array(":id" => $proj_id);

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
    $fields=array();

    while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
        array_push($fields, $row);
    }
    return $fields;
}

function changeAccountDetails (string $accID, string $column, int $value) {

    /* Global $pdo object */
    global $pdo;
    global $schema;

    $query = 'UPDATE '. $schema . '.accounts SET '.$column.' = :value WHERE account_id = :id';
    $values = array(":id" => $accID, ":value" => $value);

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
    $return = $res->rowCount();

    return $return == 1 ? "Success!" : $query . "||" . $accID . "||" . $value;
}

function changeUserState (int $user_id) {

    /* Global $pdo object */
    global $pdo;
    global $schema;

    $query = 'UPDATE '. $schema . '.accounts SET account_enabled = CASE WHEN account_enabled = 1 THEN 0 ELSE 1 END WHERE account_id = :id';
    $values = array(":id" => $user_id);

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
    $fields=array();

    while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
        array_push($fields, $row);
    }
    return $fields;
}

function addActivity (string $name, int $id) {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    /* Insert query template */
    $query = 'INSERT INTO '.$schema.'.activities (name, project_type) VALUES (:name, :project_type)';
    
    /* Values array for PDO */
    $values = array(':name' => $name, ":project_type" => $id);
    
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

function setProjectBudget (int $proj_id, int $new_budget) {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    $query = 'UPDATE '. $schema . '.projects SET budget = :new_budget WHERE id = :proj_id';
    $values = array(':proj_id' => $proj_id, ':new_budget' => $new_budget);

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

    return "Success!" . $res->fetch(PDO::FETCH_ASSOC);
}

function setProjectDeadline (int $proj_id, string $deadline) {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    $query = 'UPDATE '. $schema . '.projects SET deadline = :deadline WHERE id = :proj_id';
    $values = array(':proj_id' => $proj_id, ':deadline' => date("Y-m-d", strtotime($deadline)));

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

    return "Success!" . $res->fetch(PDO::FETCH_ASSOC);
}

function setProjectStartDate (int $proj_id, string $startdate) {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    $query = ' UPDATE '. $schema . '.projects SET start_date = :startdate WHERE id = :proj_id';
    $values = array(':proj_id' => $proj_id, ':startdate' => date("Y-m-d", strtotime($startdate)));

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

    return "Success!" . $res->fetch(PDO::FETCH_ASSOC);
}

function getAllTimesheets() {
	/* Global $pdo object */
	global $pdo;
	global $schema;

	$query = 'SELECT * FROM '.$schema.'.timesheets ORDER BY date ASC';
	
	try
	{
		$res = $pdo->prepare($query);
		$res->execute();
	}
	catch (PDOException $e)
	{
		/* If there is a PDO exception, throw a standard exception */
		echo "Database error ".$e->getMessage();
	}

	$fields=array();

	while ($row = $res->fetch(PDO::FETCH_ASSOC))
    {
        if (($account->permissions['external'] && $row['external']) || ($account->permissions['admin']) || (!$row['external'])) {
		    array_push($fields, $row);
        }
	}

	return $fields;
}

function getAttendance() {
	/* Global $pdo object */
	global $pdo;
	global $schema;

	$query = 'SELECT * FROM '.$schema.'.attendance';
	
	try
	{
		$res = $pdo->prepare($query);
		$res->execute();
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

function getPermissions() {
	/* Global $pdo object */
	global $pdo;
	global $schema;

	$query = 'SELECT * FROM '.$schema.'.permissions';
	
	try
	{
		$res = $pdo->prepare($query);
		$res->execute();
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

function getSalaries() {
	/* Global $pdo object */
	global $pdo;
	global $schema;

	$query = 'SELECT * FROM '.$schema.'.salaries ORDER BY date ASC';
	
	try
	{
		$res = $pdo->prepare($query);
		$res->execute();
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

function addSalary(int $collab_id, int $hourly, int $monthly, string $date) {
        /* Global $pdo object */
        global $pdo;
        global $schema;
    
        /* Insert query template */
        $query = 'INSERT INTO '.$schema.'.salaries (collab_id, hourly, monthly, date) VALUES (:collab_id, :hourly, :monthly, :date)';
        
        /* Values array for PDO */
        $values = array(':date' => date("Y-m-d", strtotime($date)), ':collab_id' => $collab_id, ':hourly' => $hourly, ':monthly' => $monthly);
        
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

function modifySalary(int $id, int $hourly, int $monthly, string $date) {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    /* Insert query template */
    $query = 'UPDATE '.$schema.'.salaries SET hourly = :hourly, monthly = :monthly, date = :date WHERE id = :id';
    
    /* Values array for PDO */
    $values = array(':date' => date("Y-m-d", strtotime($date)), ':id' => $id, ':hourly' => $hourly, ':monthly' => $monthly);
    
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
    
    return "Success!";
}

function deleteHoliday (string $date) {
    global $pdo;
	global $schema;

	$query = 'DELETE FROM '.$schema.'.holidays WHERE date = :date';
	$values = array(':date' => date("Y-m-d", strtotime($date)));
	
	try
	{
		$res = $pdo->prepare($query);
		$res->execute($values);
	}
	catch (PDOException $e)
	{
		/* If there is a PDO exception, throw a standard exception */
		echo "Database error: ".$e->getMessage();
        die();
	}

    echo "Success!";
}

function getAllDaysOff() {
    global $pdo;
	global $schema;
    global $account;

	$query = 'SELECT * FROM '.$schema.'.daysoff';
	
	try
	{
		$res = $pdo->prepare($query);
		$res->execute();
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


function getAccounts () {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    $query = 'SELECT account_id, collab_id, account_username, account_group, account_enabled, norma, zile_concediu, zile_report, zile_ramase FROM '. $schema . '.accounts ORDER BY account_enabled DESC';

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

function changePermissionItem(int $rowNo, string $columnName) {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    $query = 'UPDATE '. $schema . '.permissions SET '.$columnName.' = CASE WHEN '.$columnName.' = 1 THEN 0 ELSE 1 END WHERE id = :rowNo';
    $values = array(":rowNo" => $rowNo);

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

    return "Success!";
}

function addPermissionsGroup() {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    /* Insert query template */
    $query = 'INSERT INTO '.$schema.'.permissions () VALUES ()';

    /* Values array for PDO */
    $values = array();

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
?>