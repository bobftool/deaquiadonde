<?php
    include 'fecha-hora.php';

    //obtener todos los horarios
    $sql = "SELECT * FROM horas";
    $result =  $connection->query($sql);
    for($i = 1; $row = $result->fetch_assoc(); $i++){
        $result_string = $row["hora_inicio"];
        $horas[$i] = new DateTime($result_string, $local_time_zone);
    }

    //obtener todos los dias
    $sql = "SELECT * FROM dias";
    $result =  $connection->query($sql);
    for($i = 1; $row = $result->fetch_assoc(); $i++){
        $result_string = $row["dias"];
        $dias[$i] = $result_string;
    }

    //obtener id del horario actual de acuerdo a la hora y dia de la semana actual
    $horario = 0;
    for($i=1; $i<=sizeof($horas); $i++){
        if($hora_actual >= $horas[$i] && $hora_actual <= $horas[$i]->modify('+90 minutes')){
            $horario=$i+($dia_actual-2)*10;
            break;
        }
    }

    //variables para pruebas ---------------------------------------------------------------
    //$horario = 1;
?>