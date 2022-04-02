<?php
$host = 'localhost';
$user = 'r52771bric_worktracker';
$passwd = '43ypT]EhQY!i';
$schema = 'r52771bric_bp';
$pdo = NULL;
$dsn = 'mysql:host=' . $host . ';dbname=' . $schema;

try {
    $pdo = new PDO($dsn, $user,  $passwd);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}

catch (PDOException $e) {
    echo 'Database connection failed.';
    die();
}
?>