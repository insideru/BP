<?php
require_once './include/account.php';
require_once './include/elems.php';
require_once './include/admin_elems.php';

global $account;
$account->sessionLogin();

if ($account->authenticated || $_POST["action"]=="login") {} else 
{
    die();
}

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
    $ziua = date("Y-m-d", strtotime($_POST["ziua"]));
    $oraVenire = $_POST["oraVenire"];
    $oraPlecare = $_POST["oraPlecare"];
    $timesheet = $_POST["timesheet"];
    if (!verifyDate($ziua)) {
		echo "Failure:Pentru data selectata exista deja un pontaj!";
        return 0;
	}
    addAttendance($ziua, $oraVenire, $oraPlecare);
    foreach ($timesheet as $timesheetProject) {
        $currID = $timesheetProject['id'];
        $currPhase = $timesheetProject['phase'];
        $currMilestone = $timesheetProject['milestone'];
        foreach($timesheetProject as $key => $value) {
            if ($key!="id" && $key!="phase" && $key!="milestone" && $value!=0.0) {
                addTimesheetEntry($ziua, $currID, $currPhase, $currMilestone, $key, $value);
            }
        }
    }
    echo "Success:Pontaj adaugat cu succes!";
}

if ($_POST["action"]=="addDaysoff") {
    echo addDaysoff($_POST["startdate"], $_POST["enddate"], $_POST["number"]);
}

if ($_POST["action"]=="reName") {
    echo renameName($_POST["table"], $_POST["oldname"], $_POST["newname"]);
}

if ($_POST["action"]=="getTimesheets") {
    $response["timesheets"] = getTimesheets();
    $response["daysoff"] = getDaysoff();
    $response["holidays"] = getHolidays();
    $response["projects"] = getProjects();
    $response["activities"] = getActivities();
    $response['phases'] = getProjectPhases(0);
    $response['milestones'] = getProjectMilestones(0);
    echo json_encode($response);
    
}

if ($_POST["action"]=="deleteTimesheets") {
    deleteTimesheet($_POST["date"]);
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
            //echo addProject($_POST['name'], $_POST['category'], $_POST['client']);
            $res = addProject(json_decode($_POST['info']));
            $id = substr($res,8);
            if (!is_numeric((int)$id)) {
                echo $id - $res;
                break;
            }
            $details = strlen($_POST['details'])==1?(int)$_POST['details']:json_decode($_POST['details']);
            if ($details !== 0) {
                $res = addProjectDetails((int)$id, $details);
                if (substr($res, 0, 8) != "Success!") {
                    echo $res;
                    break;
                }
            }
            $phases = strlen($_POST['phases'])==1?(int)$_POST['phases']:json_decode($_POST['phases']);
            if ($phases !== 0) {
                $res = addProjectPhases((int)$id, $phases);
                if (substr($res, 0, 8) != "Success!") {
                    echo $res;
                    break;
                }
            }
            $milestones = strlen($_POST['milestones'])==1?(int)$_POST['milestones']:json_decode($_POST['milestones']);
            if ($milestones !== 0) {
                $res = addProjectMilestones((int)$id, $milestones);
                if (substr($res, 0, 8) != "Success!") {
                    echo $res;
                    break;
                }
            }
            echo("Success:{$id}");
            break;
        case "addActivity":
            echo addActivity($_POST['name'], $_POST['category']);
            break;
        case "addHoliday":
            echo addHoliday($_POST["data"], $_POST['name']);
            break;
    }
}

if ($_POST["action"]=="saveTemplate") {
    echo saveTemplate((int)$_POST["type"], $_POST["name"], $_POST["data"]);
}

if ($_POST["action"]=="deleteTemplate") {
    echo deleteTemplate((int)$_POST["type"], $_POST["name"]);
}

if ($_POST["action"]=="changeProjState") {
    echo changeProjectState((int)$_POST["proj_id"]);
}

if ($_POST["action"]=="changeProjExternal") {
    echo changeProjExternal((int)$_POST["proj_id"]);
}

if ($_POST["action"]=="setProjectBudget") {
    echo setProjectBudget((int)$_POST["proj_id"], (int)$_POST['new_budget']);
}

if ($_POST["action"]=="setProjectDeadline") {
    echo setProjectDeadline((int)$_POST["proj_id"], $_POST['deadline']);
}

if ($_POST["action"]=="setProjectStartDate") {
    echo setProjectStartDate((int)$_POST["proj_id"], $_POST['startdate']);
}

if ($_POST["action"]=="changeUserState") {
    echo changeUserState((int)$_POST["user_id"]);
}

if ($_POST["action"]=="changePass") {
    echo changePass((int)$_POST["userid"], $_POST["newpass"]);
}

if ($_POST["action"]=="changePermissionItem") {
    echo changePermissionItem((int)$_POST["row"], $_POST["column"]);
}

if ($_POST["action"]=="addPermissionsGroup") {
    echo addPermissionsGroup();
}

if ($_POST["action"]=="addNewUser") {
    $response = array();
    //$response["newAccount"] = (object) ['message' => newAccount($_POST["username"], $_POST["passwd"], $_POST["group"], $_POST["collab_id"])];
    $response["newAccount"] = newAccount($_POST["username"], $_POST["passwd"], $_POST["group"], $_POST["collab_id"]);
    $response["accounts"] = getAccounts();
    
    echo json_encode($response);
}

if ($_REQUEST["r"]=="getProjDetails") {
    $response = array();
    $response["basic"] = getProjectBasic($_REQUEST["proj"]);
    $response["info"] = getProjectInfo($_REQUEST["proj"]);
    $response["phases"] = getProjectPhases($_REQUEST["proj"]);
    $response["milestones"] = getProjectMilestones($_REQUEST["proj"]);
    echo json_encode($response);
}

if ($_REQUEST["r"]=="init") {
    //trimitem toate datele de initalizare tabele
    $response = array();
    if ($account->permissions['admin']) {
        $response["clients"] = getClients();
        $response["collabCats"] = getCollabCat();
        $response["projCats"] = getProjCat();
        $response["collabs"] = getCollabs();
        $response["projects"] = getProjects();
        $response["activities"] = getActivities();
        $response["holidays"] = getHolidays();
        $response["accounts"] = getAccounts();
        $response["timesheets"] = getAllTimesheets();
        $response["salaries"] = getSalaries();
        $response["permissions"] = getPermissions();
        $response["daysoff"] = getAllDaysOff();
        $response["templates"] = getTemplates();
        $response["attendance"] = getAttendance();
        $response['phases'] = getProjectPhases(0);
        $response['milestones'] = getProjectMilestones(0);
    } else {
        $response["collabs"] = getCollabs();
        $response["projects"] = getProjects();
        $response["activities"] = getActivities();
        $response["timesheets"] = getAllTimesheets();
        $response['phases'] = getProjectPhases(0);
        $response['milestones'] = getProjectMilestones(0);
    }
    echo json_encode($response);
}

if ($_REQUEST["r"]=="holidays") {    
    $response = array();
    $response["holidays"] = getHolidays();
    $response["daysoff"] = getDaysoff();
    $response["pontaje"] = getPontaje();
    echo json_encode($response);
}

if ($_POST["action"]=="changeAccountDetails") {
    echo changeAccountDetails($_POST['id'], $_POST['column'], $_POST['value']);
}

if ($_POST["action"]=="getPhasesAndMilestones") {
    $response = array();
    $response['phases'] = getProjectPhases((int)$_POST['proj_id']);
    $response['milestones'] = getProjectMilestones((int)$_POST['proj_id']);
    echo json_encode($response);
}

if ($_POST["action"]=="getPhases") {
    $response = getProjectPhases((int)$_POST['proj_id']);
    echo json_encode($response);
}

if ($_POST["action"]=="getMilestones") {
    $response = getProjectMilestones((int)$_POST['proj_id']);
    echo json_encode($response);
}

if ($_POST["action"]=="addSalary") {
    echo addSalary((int)$_POST['collab_id'], (int)$_POST['hourly'], (int)$_POST['monthly'], $_POST['date']);
}

if ($_POST["action"]=="modifySalary") {
    echo modifySalary((int)$_POST['id'], (int)$_POST['hourly'], (int)$_POST['monthly'], $_POST['date']);
}

if ($_POST["action"]=="deleteDayoff") {
    echo deleteDaysoff($_POST['date'], (int)$_POST['days']);
}

if ($_REQUEST["r"]=="concediu") {    
    $response = array();
    $response["holidays"] = getHolidays();
    $response["concediu"] = getZileLibere();
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