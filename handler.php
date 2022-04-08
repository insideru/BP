<?php
require_once './include/account.php';
require_once './include/elems.php';
require_once './include/admin_elems.php';

//if (!isset($_POST["action"])) {
//    die("Aceasta pagina nu se acceseaza direct.");
//}

if ($_POST["action"]=="login") {
    if (!empty($_POST["email"])) {
        return login($_POST["email"], $_POST["password"], $_POST["remember"]);
    } else {
        die("no email");
    }
}

if ($_POST["action"]=="register") {
    $reg = FALSE;
    if (!empty($_POST["email"])) {
        $reg = TRUE;
    } else {
        die("no email");
    }
    if (!empty($_POST["password"])) {
        $reg = TRUE;
    } else {
        die("no pass");
    }
    if (!empty($_POST["name"])) {
        $reg = TRUE;
    } else {
        die("no name");
    }
    if ($reg) {
        newAccount($_POST["name"], $_POST["email"], $_POST["password"]);
        return login($_POST["email"], $_POST["password"], $_POST["remember"]);
    }
}

if ($_POST["action"]=="addTimesheet") {
    $collabGUID = $_POST["collab_guid"];
    $ziua = date("Y-m-d", strtotime($_POST["ziua"]));
    $oraVenire = $_POST["oraVenire"];
    $oraPlecare = $_POST["oraPlecare"];
    $timesheet = $_POST["timesheet"];
    if (!verifyDate($collabGUID, $ziua)) {
		echo "Failure:Pentru data selectata exista deja un pontaj!";
        return 0;
	}
    addAttendance($collabGUID, $ziua, $oraVenire, $oraPlecare);
    foreach ($timesheet as $timesheetProject) {
        $currID = $timesheetProject['id'];
        foreach($timesheetProject as $key => $value) {
            if ($key!="id" && $value!=0.0) {
                addTimesheetEntry($collabGUID, $ziua, $currID, $key, $value);
            }
        }
    }
    echo "Success:Pontaj adaugat cu succes!";
}

if ($_POST["action"]=="addDaysoff") {
    echo addDaysoff($_POST["collab_guid"], $_POST["startdate"], $_POST["enddate"]);
}

if ($_POST["action"]=="reName") {
    echo renameName($_POST["table"], $_POST["oldname"], $_POST["newname"]);
}

if ($_POST["action"]=="getTimesheets") {
    $response["timesheets"] = getTimesheets($_POST["collab_guid"]);
    $response["daysoff"] = getDaysoff($_POST["collab_guid"]);
    $response["holidays"] = getHolidays();
    echo json_encode($response);
    
}

if ($_POST["action"]=="deleteTimesheets") {
    deleteTimesheet($_POST["collab_guid"], $_POST["date"]);
}

if ($_POST["action"]=="logout") {
    logout();
    echo "logged out";
}

if ($_POST["action"]=="addElem") {
    echo "Success:" . addTrackerElement($_POST['type'], $_POST['name']);
}

if ($_POST["action"]=="addToDB") {
    switch ($_POST['type']) {
        case "addProjCategory":
            echo addProjCat($_POST['name']);
            break;
        case "addCollabCategory":
            echo addCollabCat($_POST['name']);
            break;
        case "addClient":
            echo addClient($_POST['name']);
            break;
        case "addCollab":
            echo addCollab($_POST['name'], $_POST['category']);
            break;
        case "addProject":
            echo addProject($_POST['name'], $_POST['category'], $_POST['client']);
            break;
        case "addActivity":
            echo addActivity($_POST['name'], $_POST['category']);
            break;
        case "addHoliday":
            echo addHoliday($_POST["data"], $_POST['name']);
            break;
    }
}

if ($_POST["action"]=="changeProjState") {
    echo changeProjectState((int)$_POST["proj_id"]);
}

if ($_POST["action"]=="addNewUser") {
    $response = array();
    //$response["newAccount"] = (object) ['message' => newAccount($_POST["username"], $_POST["passwd"], $_POST["group"], $_POST["collab_id"])];
    $response["newAccount"] = newAccount($_POST["username"], $_POST["passwd"], $_POST["group"], $_POST["collab_id"]);
    $response["accounts"] = getAccounts();
    
    echo json_encode($response);
}

if ($_REQUEST["r"]=="init") {
    //trimitem toate datele de initalizare tabele
    $response = array();
    $response["clients"] = getClients();
    $response["collabCats"] = getCollabCat();
    $response["projCats"] = getProjCat();
    $response["collabs"] = getCollabs();
    $response["projects"] = getProjects();
    $response["activities"] = getActivities();
    $response["holidays"] = getHolidays();
    $response["accounts"] = getAccounts();
    
    echo json_encode($response);
}

if ($_REQUEST["r"]=="holidays") {    
    $response = array();
    $response["holidays"] = getHolidays();
    $response["daysoff"] = getDaysoff($_GET["collab_guid"]);
    $response["pontaje"] = getPontaje($_GET["collab_guid"]);
    echo json_encode($response);
}

if ($_REQUEST["r"]=="deleteHoliday") {    
    $date=$_GET['date'];
    echo deleteHoliday($date);
}

if ($_POST["action"]=="addWorkDay") {
    $timeWorkedArray = $_POST['worktime'];

    //echo print_r($timeWorkedArray);

    //populam obiectul $account
    $account->sessionLogin();

    //verificam daca a mai fost introduse date in ziua asta
    if (verifyDate($account->getId(), $timeWorkedArray[0][4])) {
        //echo "Am verificat sa vad daca e rost sa adaug la id: " . $account->getId() . " in data de " . $timeWorkedArray[0][4] . " si e rost!";
        foreach ($timeWorkedArray as $timeWorkedSlice) {
            // adaugam fiecare slice in db
            addWorkDay($account->getId(), $timeWorkedSlice[4], $timeWorkedSlice[0], $timeWorkedSlice[1], $timeWorkedSlice[2], $timeWorkedSlice[3]);
        }
        echo "Rost";
    } else {
        //echo "Am verificat sa vad daca e rost sa adaug la id: " . $account->getId() . " in data de " . $timeWorkedArray[0][4] . " si nu e rost!";
        echo "Nerost";
    }
}

if ($_POST["action"]=="verifyDate") {
    $timeWorkedArray = $_POST['worktime'];
}

if ($_POST['action'] == "chart") {
    //populam obiectul $account
    $account->sessionLogin();

    $data = [];
    $entries = getAllWork($account->getId());

    //myprint_r($entries);

    foreach ($entries as $key ) {
        $project_name = idToName($key['project_id'], "proj");
        $phase_name = idToName($key['phase_id'], "phase");
        $descr_name = idToName($key['descr_id'], "descr");
        if (empty($data[$project_name])) {
            //proiectul nu a fost adaugat si trebuie adaugat
            $descr = array($descr_name => $key['time']);
            $phase = array($phase_name => $descr);
            $data[$project_name] = $phase;
        } else {
            //trebuie adaugat la proiectul existent
            //verificam daca a fost adaugata faza intai
            if (empty($data[$project_name][$phase_name])) {
                //faza nu e adaugata si trebuie sa o adaugam
                $descr = array($descr_name => $key['time']);
                $data[$project_name][$phase_name] = $descr;
                } else { 
                    if (empty($data[$project_name][$phase_name][$descr_name])){
                        // nu e adaugata descrierea
                        $data[$project_name][$phase_name][$descr_name]=$key['time'];
                    }
                else {
                    // e si descrierea adaugata, haida
                    $data[$project_name][$phase_name][$descr_name]+=$key['time'];
                }
            }
        }
    }

    echo json_encode($data);
}
?>