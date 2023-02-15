<!-- Esta es la página principal axel-->

<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>De aquí pa' dónde</title>
        <!--Conexión con CSS-->
        <link rel="stylesheet" href="style.css">
        <!--Iconos externos-->
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>

    </head>
    <body>
        <!--Header-->
        <header>
            <!--Barra superior-->
            <div class="barra container">
                <div class="logos-container">
                    <div class="logo-container" id="logo-mono">
                        <img class="logo-img" src="resources\images\design\logo_sinpunto_mono.png" alt="">
                    </div>
                    <div class="logo-container" id="logo-rosa">
                        <img class="logo-img" src="resources\images\design\logo_sinpunto_rosa.png" alt="">
                    </div>
                </div>
                <!--Botón-->
                <a href="#" class="boton">Actualizar</a>
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
                    <h2 class="cabecera-titulo">Salones libres</h2>
                    <span class="cabecera-subtitulo" id="cabecera-subtitulo">en tiempo real</span>
                </div>
            </div>
        </section>

        <!--Filtro-->
        <div class="filtro container">
            <span class="filtro-item filtro-activo" data-filter="todos">Todos</span>
            <span class="filtro-item" data-filter="e1">Edificio 1</span>
            <span class="filtro-item" data-filter="e2">Edificio 2</span>
            <span class="filtro-item" data-filter="e3">Edificio 3</span>
            <span class="filtro-item" data-filter="e4">Edificio 4</span>
        </div>

        <!--Grid aulas-->
        <div class="grid-aulas container">
            <?php
            $servername = "localhost";
            $username = "root";
            $password = "";
            $database = "deaquipadonde";

            $connection = new mysqli($servername, $username, $password, $database);

            //revisa la conexión
            if($connection->connect_error){
                die("Connection failed: " . $connection->connect_error);
            }

            //Leer datos de la base de datos
            $sql = "SELECT * FROM aulas";
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

            $result = $connection->query($sql);

            if(!$result){
                die("Invalid query: " . $connection->error);
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

        <!--Conexión con JavaScript-->
        <script src="main.js"></script>
    </body>
    <footer>

    </footer>
</html>