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

    function getCookie(cookiename) 
        {
        // Get name followed by anything except a semicolon
        var cookiestring=RegExp(cookiename+"=[^;]+").exec(document.cookie);
        // Return everything after the equal sign, or an empty string if the cookie name not found
        return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
        }
</script>