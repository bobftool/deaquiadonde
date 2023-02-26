<?php
    include 'horarios.php';
    
    function obtener_actividades($horario, $connection, $sql){
        $sql = "SELECT * FROM actividades WHERE id IN (SELECT id_actividades FROM horarios_actividades WHERE id_horarios = ".$horario.")";
        $result = $connection->query($sql);
        
        if(!$result){
            die("Invalid query: " . $connection->error);
        }
        
        return $result;
    }
?>