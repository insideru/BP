<?php
if ($_POST["key"] == "BP_ERROR_LOG") {
    $File = "js_error_logs.txt"; 
    $Handle = fopen($File, 'a');
    $Data = $_POST["err"];
    fwrite($Handle, $Data); 
    fclose($Handle); 
}
?>