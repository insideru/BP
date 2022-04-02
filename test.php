<?php
require_once './include/admin_elems.php';
require_once './include/elems.php';
require_once './include/db.php';

echo json_encode(getTimesheets(0));

?>