<?php
    include 'horarios.php';
    
    function obtener_aulas($horario, $connection, $sql){
        $sql = "SELECT * FROM aulas WHERE id IN (SELECT id_aulas FROM horarios_aulas WHERE id_horarios = ".$horario.")";
        $result = $connection->query($sql);
        
        if(!$result){
            die("Invalid query: " . $connection->error);
        }
        
        return $result;
    }
?>