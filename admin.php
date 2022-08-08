<?php
require_once './include/account.php';

$username = 'admin';
$passwd = 'erp_brickart';
$group = 0;
$collab_id = 0;

echo newAccount($username, $passwd, $group, $collab_id);

?>