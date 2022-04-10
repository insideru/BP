<?php
require_once './include/account.php';
$username = 'adrian';
$passwd = 'barbosu2022';
$group = 0;
$collab_id = 0;
//echo newAccount($username, $passwd, $group, $collab_id);
global $account;
$account->sessionLogin();
?>