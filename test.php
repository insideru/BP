<?php
require_once './include/admin_elems.php';
require_once './include/elems.php';
require_once './include/db.php';
require_once './include/account.php';

$hashedToken = '$2y$10$h2Y4KSuUWv/g.E1lg21wuOt7QZGucSjZWjpb0HppreN8vGIjyznbe';
$accountToken = '1DzMKRp22YGermY5';

echo password_verify($accountToken, $hashedToken);
?>