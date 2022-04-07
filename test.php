<?php
require_once './include/admin_elems.php';
require_once './include/elems.php';
require_once './include/db.php';
?>
<script>
    var guidCookie = getCookie("userGUID");
    console.log(guidCookie);
    var guidTOid = "<?php echo getIDfromGUID($_COOKIE["userGUID"]); ?>";
    console.log(guidTOid);
</script>