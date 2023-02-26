<!-- Esta es la página principal axel-->
<!-- SET GLOBAL time_zone = '+00:00' -->

<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>de aqui a donde?</title>
        <!--Conexión con CSS-->
        <link rel="stylesheet" href="style.css">
        <!--Iconos externos-->
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
        
        <!-- Google analytics -->
            <!-- Google tag (gtag.js) -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-V638K0WE9F"></script>
            <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-V638K0WE9F');
            </script>
        <!-- -->
        
        <!-- Color del navegador -->
        <meta name="theme-color" content="#f16d9f">
        
        <!-- Icono homescreen -->
        <link rel="apple-touch-icon" href="resources\images\design\icono-web_rosa.png">
    </head>
    <body>
        <!--Header-->
        <header>
            <!--Barra superior-->
            <div class="barra container">
                <div class="logos-container">
                    <div class="logo-container" id="logo-mono">
                        <img class="logo-img" src="resources\images\design\logo-sinpunto_mono.png" alt="">
                    </div>
                    <div class="logo-container" id="logo-rosa">
                        <img class="logo-img" src="resources\images\design\logo-sinpunto_rosa.png" alt="">
                    </div>
                </div>
                <!--Botón-->
                <a href="" class="boton">Actualizar</a>
            </div>
        </header>

        <!--Cabecera-->
        <section class="cabecera">
            <!--Decoración-->
            <div class="punto-container container">
                <img class="punto-img" src="resources\images\design\punto_blanco.png" alt="">
            </div>

            <!--Cabecera interior-->
            <div class="cabecera-interior">
                <div class="cabecera-contenido container">
                    <h2 class="cabecera-titulo" id="cabecera-track">Hola :)</h2>
                    <!-- <span class="cabecera-subtitulo" id="cabecera-subtitulo">en tiempo real</span> -->
                </div>
            </div>
        </section>

        <!--
        Filtro
        <div class="filtro container">
            <span class="filtro-item filtro-activo" data-filter="todos">Todos</span>
            <span class="filtro-item" data-filter="e1">Edificio 1</span>
            <span class="filtro-item" data-filter="e2">Edificio 2</span>
            <span class="filtro-item" data-filter="e3">Edificio 3</span>
            <span class="filtro-item" data-filter="e4">Edificio 4</span>
        </div>
        -->

        <!--Grid aulas-->
        <div class="subtitulo container"> Salones libres ahora:</div>
        <div class="grid-aulas container">
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
                //$hora_actual = (new DateTime('12:00:00', $local_time_zone));


                //echo $hora_actual->format('Y/m/d H:i:s');
                
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

                //obtener todos los horarios
                $sql = "SELECT * FROM horas";
                $result =  $connection->query($sql);
                for($i = 1; $row = $result->fetch_assoc(); $i++){
                    $result_string = $row["hora_inicio"];
                    $horas[$i] = new DateTime($result_string, $local_time_zone);
                    //echo date_format($horarios[$i], "H:i:s");
                }

                //obtener todos los dias
                $sql = "SELECT * FROM dias";
                $result =  $connection->query($sql);
                for($i = 1; $row = $result->fetch_assoc(); $i++){
                    $result_string = $row["dias"];
                    $dias[$i] = $result_string;
                }

                //comparar dia y hora con los horarios
                //echo $dia_actual . " XD " . "XDXDXD";
                //echo date('H:i:s', strtotime('10:30:00'));
                //echo strtotime('10:30:00');

                //obtener id del horario actual de acuerdo a la hora y dia de la semana actual
                $horario = 0;
                for($i=1; $i<=sizeof($horas); $i++){
                    if($hora_actual >= $horas[$i] && $hora_actual <= $horas[$i]->modify('+90 minutes')){
                        $horario=$i+($dia_actual-2)*10;
                        break;
                    }
                }


                //Leer datos de la base de datos
                //$sql = "SELECT * FROM aulas";
                /*
                $sql = "SELECT DISTINCT aulas.*
                        FROM aulas AS aulas
                        JOIN horarios_aulas AS lista ON aulas.id = lista.id_aulas
                        JOIN horarios AS horarios ON horarios.id = lista.id_horarios
                        AND horarios.id = DAYOFWEEK(CURDATE())-1";
                
                $dia_actual = DAYOFWEEK(CURDATE());
                $hora_actual =  intval(HOUR(CURTIME) .  MINUTE(CURTIME));
                echo $hora_actual;
                $horario_actual=9;

                if($hora_actual >= 700 and $hora_actual < 830){
                    
                }*/

                /*$sql =
                "SELECT DISTINCT aulas.*
                FROM horarios_aulas AS lista
                JOIN aulas AS aulas ON aulas.id = lista.id_aulas
                JOIN horarios AS horarios ON horarios.id = lista.id_horarios
                WHERE lista.id_horarios = " . $horario_actual;
                */
                
                $sql = "SELECT * FROM aulas WHERE id IN (SELECT id_aulas FROM horarios_aulas WHERE id_horarios = ".$horario.")";
                $result = $connection->query($sql);

                if(!$result){
                    die("Invalid query: " . $connection->error);
                }

                if($horario==0){
                    echo "La esucela está cerrada :(";
                }

                //Mostrar los resultados encontrados
                while($row = $result->fetch_assoc()){
                    echo
                    "<div class='aula-container'>
                        <div class='aula-estado'>Libre</div>
                        <div class='aula-numero'>" . $row["id"] . "</div>
                        <div class='aula-edificio'>Edificio <span>" . $row["edificio"] . "</span></div>
                        <div class='aula-piso'>Piso <span>" . $row["piso"] . "</span></div>
                        <div class='aula-salon'>Salón <span>" . $row["salon"] . "</span></div>
                    </div>";
                }
            ?>
        </div>

        <div class="subtitulo container"> Salones libres en la próxima hora:</div>
        <div class="grid-aulas container">
            <?php
                $sql = "SELECT * FROM aulas WHERE id IN (SELECT id_aulas FROM horarios_aulas WHERE id_horarios = ".($horario+1).")";
                $result = $connection->query($sql);

                if(!$result){
                    die("Invalid query: " . $connection->error);
                }

                if($horario==0){
                    echo "La esucela está cerrada :(";
                }
                else{
                    //Mostrar los resultados encontrados
                    while($row = $result->fetch_assoc()){
                        echo
                        "<div class='aula-container' id='disabled'>
                            <div class='aula-estado'>[" . $horas[$i]->format('h:i a') . "]</div>
                            <div class='aula-numero'>" . $row["id"] . "</div>
                            <div class='aula-edificio'>Edificio <span>" . $row["edificio"] . "</span></div>
                            <div class='aula-piso'>Piso <span>" . $row["piso"] . "</span></div>
                            <div class='aula-salon'>Salón <span>" . $row["salon"] . "</span></div>
                        </div>";
                    }
                }
            ?>
        </div>
        <!--Conexión con JavaScript-->
        <script src="main.js"></script>
    </body>
    <footer>

    </footer>
</html>