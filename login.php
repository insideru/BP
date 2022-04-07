<!DOCTYPE html>
<html>
    <head>
        <!-- Compiled and minified CSS -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
        <!-- Compiled and minified JavaScript -->
        <link rel="stylesheet" href="styles/styles.css">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    </head>
    <body class="teal lighten-5 valign-wrapper">
        <div class="container container-750">
            <div class="z-depth-5 blue-grey lighten-5 loginCard">
                <div class="z-depth-2 grey lighten-5 container">
                    <div class="row">
                        <form class="col s12" id="form">
                            <div class="row">
                                <div class="progress hidden2" id="loader1">
                                    <div class="indeterminate hidden2" id="loader2"></div>
                                </div>
                            </div>
                            <div class="row">
                                <div class = "col s1"><i class = "material-icons prefix">account_circle</i></div>
                                <div class = "col s11 center-align"><span class="errorSpan" id="error"></span></div>
                            </div>
                            <div class = "row">
                                <div class = "input-field col s12">
                                    <input id = "email" type = "text" data-error="user invalid" class="validate" required>
                                    <label for = "email">User</label>
                                </div>
                                <div class = "input-field col s12">      
                                    <label for = "password">Parola</label>
                                    <input id = "password" type = "password" class = "validate" required>          
                                </div>
                            </div>
                            <div class = "row">
                                <label class="col s12">
                                    <input type="checkbox" class="filled-in" checked="checked" id="remember"/>
                                    <span>Tine-ma minte</span>
                                    </label>
                            </div>
                            <div class = "row">
                                <div class="col s12 center-align">
                                    <button class="waves-effect waves-light btn" id="login" type="submit" name="action" onclick="logReg=1;">Login</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script>
    isLoaded = false;
    logReg = 0;

    $( document ).ready(function() {
        isLoaded = true;

        $('form').submit(function(event) {
            switch (logReg) {
                case 1: 
                    clickLogin();
                    break;
                case 2:
                    clickRegister();
                    break;
            }
            event.preventDefault();
        });
        //console.log('done');
    });

    function clickLogin() {
        document.getElementById('loader1').classList.remove('hidden2');
        document.getElementById('loader2').classList.remove('hidden2');
        
        if (document.getElementById('remember').checked) {
            memberMe=1;
        } else {
            memberMe=0;
        }

        var formData = {
            'action'            : 'login',
            'email'             : $('input[id=email]').val(),
            'password'          : $('input[id=password]').val(),
            'remember'          : memberMe
        };

        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : 'handler.php', // the url where we want to POST
            data        : formData, // our data object
            //dataType    : 'json', // what type of data do we expect back from the server
            encode      : true,
            success     : function(data) {
                document.getElementById('loader1').classList.add('hidden2');
                document.getElementById('loader2').classList.add('hidden2');
                switch (data) {
                    case "no email":
                        document.getElementById('error').innerHTML = "E-mailul este necesar!";
                        break;
                    case "Authentication successful.":
                        window.location.reload(true);
                        break;
                    default:
                        document.getElementById('error').innerHTML = data;
                 }
            },
            error: function(){
                document.getElementById('error').innerHTML = data;
            }
        });
    }
</script>
    </body>
</html>
