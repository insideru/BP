<?php
require_once './include/account.php';

global $account;
$account->sessionLogin();
echo $account->getCollabID();
?>