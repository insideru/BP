<?php
require_once './include/account.php';

global $account;
$account->sessionLogin();
//echo json_encode($account->permissions());
?>