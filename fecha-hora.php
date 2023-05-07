<?php
    date_default_timezone_set('America/Mexico_City');
    $server_time_zone = new DateTimeZone('Europe/London');
    $local_time_zone = new DateTimeZone('America/Mexico_City');
    include 'credenciales.php';

    $connection = new mysqli($servername, $username, $password, $database);

    //revisa la conexión
    if($connection->connect_error){
        die("Connection failed: " . $connection->connect_error);
    }

    //revisar hora actual
    $sql = "SELECT CURRENT_TIME()";
    $result =  $connection->query($sql);
    $row = $result->fetch_assoc();
    $result_string = $row["CURRENT_TIME()"];
    $hora_actual = (new DateTime($result_string, $server_time_zone))->setTimezone($local_time_zone);
    $hora_actual = $hora_actual->modify('+60 minutes');

    //revisar fecha actual
    $sql = "SELECT CURRENT_TIMESTAMP";
    $result =  $connection->query($sql);
    $row = $result->fetch_assoc();
    $result_string = $row["CURRENT_TIMESTAMP"];
    $fecha_actual = (new DateTime($result_string, $server_time_zone))->setTimezone($local_time_zone);

    //revisar dia de la semana actual
    $sql = 'SELECT DAYOFWEEK("' . $fecha_actual->format('Y-m-d') . '")';
    $result =  $connection->query($sql);
    $row = $result->fetch_assoc();
    $result_string = $row['DAYOFWEEK("' . $fecha_actual->format('Y-m-d') . '")'];
    $dia_actual = intval($result_string);

    //variables para pruebas ---------------------------------------------------------------
    //echo $hora_actual->format('Y/m/d H:i:s');
    //$hora_actual = (new DateTime('07:10:00', $local_time_zone));
    //$dia_actual = 2;
?>