<?php
require_once './include/account.php';
global $account;

$account->sessionLogin();

if ($account->authenticated) {
    //user e logat
    if (isset($_GET['page'])) {
        if ($_GET['page']=="dashboard"){
            require 'dashboard.php';
            die;
        } else if ($_GET['page']=="addtime"){
            require 'addtime.php';
            die;
        }
    }
    require 'proto-dashboard.html';
    }
    else {
        //echo "Nu exista user logat";
        require 'login.php';
    }
?>