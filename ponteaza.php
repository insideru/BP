<?php
require_once './include/account.php';
require_once './include/elems.php';

if (!$account->authenticated) {
  //header("Location: http://");
  exit;
}
//ia initialele pentru cerculet
$accName = explode(" ", $account->getName(), 2);
$initials = substr($accName[0], 0, 1) . substr($accName[1], 0, 1);
?>
<!DOCTYPE html>
<html>
    <head>
        <!-- Compiled and minified CSS -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
        <!-- Compiled and minified JavaScript -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <link rel="stylesheet" href="styles/styles.css">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    </head>
    <!DOCTYPE html>
<html>
  <head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style href="styles/styles.css"></style>
    </head>
  <body>
    <nav>
        <div class="nav-wrapper">
          <ul id="nav-mobile" class="left">
            <li><a href="#">Adauga pontaj</a></li>
            <li><a href="#">Vezi Pontaje</a></li>
          </ul>
        </div>
      </nav>
      <div class="fixed-action-btn">
        <a class="btn-floating btn cyan"><div class="initials">
            <?php
            //<i class="large material-icons">mode_edit</i>
            echo $initials;
            ?>
            </div>
        </a>
        <ul>
          <?php
          if ($account->getGroup() == 2) {
            echo ('<li><a class="btn-floating pink lighten-3" onclick="menuItems(0)"><i class="material-icons">donut_small</i></a></li>');
          }
          ?>
          <li><a class="btn-floating red" onclick="menuItems(1)"><i class="material-icons">dashboard</i></a></li>
          <li><a class="btn-floating yellow darken-3" onclick="menuItems(2)"><i class="material-icons">watch_later</i></a></li>
          <li><a class="btn-floating green"><i class="material-icons">person</i></a></li>
          <li><a class="btn-floating blue" onclick="menuItems(4)"><i class="material-icons">lock</i></a></li>
        </ul>
      </div>
      <script>
         M.AutoInit();
        $(document).ready(function(){
          $('.fixed-action-btn').floatingActionButton();
        });

        function menuItems(i) {
        switch (i) {
            case 0:
                action = "admin";
                window.location.href = window.location.protocol + "//" + window.location.host + "?page=admin";
                break;
            case 1:
                action = "dashboard";
                window.location.href = window.location.protocol + "//" + window.location.host + "?page=dashboard";
                break;
            case 2:
                action = "addtime";
                window.location.href = window.location.protocol + "//" + window.location.host + "?page=addtime";
                break;
            case 3:
                action = "cpanel";
                break;
            case 4:
                action = "logout";
                break;
        }
        var formData = {
            'action'            : action
        };
        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : 'handler.php', // the url where we want to POST
            data        : formData, // our data object
            //dataType    : 'json', // what type of data do we expect back from the server
            encode      : true,
            success     : function(data) {
                switch (data) {
                    case "logged out":
                        window.location.reload(true);
                        break;
                 }
            },
            error: function(){
                //
            }
        });
    }
  </script>
</body>
