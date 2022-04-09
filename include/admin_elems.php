<?php
require_once 'db.php';
require_once 'account.php';

// if (!$account->authenticated || $account->getGroup()!=2) {
  //header("Location: http://");
//  exit;
//}

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

function addProject (string $name, int $catid, int $clientid) {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    /* Insert query template */
    $query = 'INSERT INTO '.$schema.'.projects (name, client_id, type_id) VALUES (:name, :client_id, :type_id)';
    
    /* Values array for PDO */
    $values = array(':name' => $name, ":client_id" => $clientid, ":type_id" => $catid);
    
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

function getProjects() {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    $query = 'SELECT * FROM '. $schema . '.projects ORDER BY active DESC, name ASC';

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

function changeProjectState (int $proj_id) {
    $projects = array();
    $projects = getProjects();
    $proj_state = 0;

    foreach ($projects as $project) {
        $object = (object) $project;
        if ($object->id == $proj_id) {
            if ($object->active=="0") {
                $proj_state = 1;
            }
            else {
                $proj_state = 0;
            }
            break;
        }
    }

    /* Global $pdo object */
    global $pdo;
    global $schema;

    $query = ' UPDATE '. $schema . '.projects SET active = :active WHERE id = :id';
    $values = array(':active' => $proj_state, ":id" => $proj_id);

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

function changeUserState (int $user_id) {

    /* Global $pdo object */
    global $pdo;
    global $schema;

    $query = ' UPDATE '. $schema . '.accounts SET account_enabled = CASE WHEN account_enabled = 1 THEN 0 ELSE 1 END WHERE id = :id';
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

function getAccounts () {
    /* Global $pdo object */
    global $pdo;
    global $schema;

    $query = 'SELECT collab_id, account_username, account_group, account_enabled FROM '. $schema . '.accounts';

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
?>