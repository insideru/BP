<?php
$host = 'localhost';
$user = 'localhost';
$passwd = 'localhost-pass';
$schema = 'bp';
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