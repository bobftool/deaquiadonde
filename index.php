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
        <meta name="theme-color" content="#000000">
        
        <!-- Icono homescreen -->
        <link rel="apple-touch-icon" href="resources\images\design\icono-web_rosa.png">
    </head>
    <body>
        <?php
            include 'horarios-aulas.php';
            include 'horarios-actividades.php';
        ?>


        <!--Header flotante--------------------------------------------------------------->
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
                    <div class="logo-container" id="logo-verde">
                        <img class="logo-img" src="resources\images\design\logo-sinpunto_verde.png" alt="">
                    </div>
                </div>
                <!--Botón-->
                <a href="" class="boton">Actualizar</a>
            </div>
        </header>

        <!--Sección aulas--------------------------------------------------------------->
        <section class="cabecera" id="cabecera-seccion-1">
            <!--Decoración-->
            <div class="punto-container container">
                <img class="punto-img" id="punto-superior" src="resources\images\design\punto_blanco.png" alt="">
            </div>
            <!--Cabecera interior-->
            <div class="cabecera-interior" id="cabecera-interior-seccion-1">
                <div class="cabecera-contenido container">
                    <h2 class="cabecera-titulo" id="track-inicio-seccion-1">Aulas libres</h2>
                    <!-- <span class="cabecera-subtitulo" id="cabecera-subtitulo">en tiempo real</span> -->
                </div>
            </div>
        </section>

        <!--Decoración-->
        <div class="punto-container container">
                <img class="punto-img" src="resources\images\design\punto_rosa.png" alt="">
        </div>
        <!--Grid aulas disponibles--------------------------------------------------------------->
        <div class="subtitulo container"> Aulas libres ahora:</div>
        <div class="grid-aulas container">
            <?php
                $result = obtener_aulas($horario, $connection, $sql);
                
                if($horario != 0 && ($dia_actual > 1 && $dia_actual < 7)){
                    while($row = $result->fetch_assoc()){
                        //Mostrar los resultados encontrados
                        if($row["id"] != 100){
                            echo
                            "<div class='aula-container'>
                            <div class='aula-estado'>Libre</div>
                            <div class='aula-numero'>" . $row["id"] . "</div>
                            <div class='aula-edificio'>Edificio <span>" . $row["edificio"] . "</span></div>
                            <div class='aula-piso'>Piso <span>" . $row["piso"] . "</span></div>
                            <div class='aula-salon'>Salón <span>" . $row["salon"] . "</span></div>
                            </div>";
                        }
                    }
                }
                else{
                    echo "La escuela está cerrada :(";
                }
            ?>
        </div>

        <!--Decoración-->
        <div class="punto-container container">
                <img class="punto-img" src="resources\images\design\punto_rosa.png" alt="">
        </div>
        <!--Grid aulas disponibles siguiente hora--------------------------------------------------------------->
        <div class="subtitulo container"> Aulas libres en la siguiente hora:</div>
        <div class="grid-aulas container">
            <?php
                $result = obtener_aulas($horario+1, $connection, $sql);

                if($horario != 0 && $horario != 10+($dia_actual-2)*10 && ($dia_actual > 1 && $dia_actual < 7)){
                    //Mostrar los resultados encontrados
                    while($row = $result->fetch_assoc()){
                        if($row["id"] != 100){
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
                }
                else{
                    echo "La escuela está cerrada :(";
                }
            ?>
        </div>




        <!--Decoración-->
        <div class="punto-container container">
                <img class="punto-img" id="track-final-seccion-1" src="" alt="">
        </div>
        <!--Sección actividades--------------------------------------------------------------->
        <section class="cabecera" id="cabecera-seccion-2">
            <!--Cabecera interior-->
            <div class="cabecera-interior" id="cabecera-interior-seccion-2">
                <div class="cabecera-contenido container">
                    <h2 class="cabecera-titulo" id="track-inicio-seccion-2">Actividades</h2>
                    <!-- <span class="cabecera-subtitulo" id="cabecera-subtitulo">en tiempo real</span> -->
                </div>
            </div>
        </section>

        <!--Decoración-->
        <div class="punto-container container">
                <img class="punto-img" src="resources\images\design\punto_verde.png" alt="">
        </div>
        <!--Grid actividades--------------------------------------------------------------->
        <div class="subtitulo container"> Actividades ocurriendo ahora:</div>
        <div class="grid-actividades container">
            <?php
                $result = obtener_actividades($horario, $connection, $sql);

                if($horario != 0 && ($dia_actual > 1 && $dia_actual < 7)){
                    while($row = $result->fetch_assoc()){
                        //Mostrar los resultados encontrados
                        echo
                        "<div class='actividad-container'>
                            <div class='actividad-estado'>Ahora</div>
                            <div class='actividad-nombre'>" . $row["actividad"] . "</div>
                            <div class='actividad-ubicacion'>" . $row["ubicacion"] . "</div>
                        </div>";
                    }
                }
                else{
                    echo "No hay actividades en este momento :(";
                }
            ?>
        </div>

        <!--Decoración-->
        <div class="punto-container container">
                <img class="punto-img" src="resources\images\design\punto_verde.png" alt="">
        </div>
        <!--Grid actividades en la siguiente hora--------------------------------------------------------------->
        <div class="subtitulo container"> Actividades en la siguiente hora:</div>
        <div class="grid-actividades container">
            <?php
                $result = obtener_actividades($horario+1, $connection, $sql);

                if($horario != 0 && ($dia_actual > 1 && $dia_actual < 7)){
                    while($row = $result->fetch_assoc()){
                        //Mostrar los resultados encontrados
                        echo
                        "<div class='actividad-container' id='disabled'>
                            <div class='actividad-estado'>[" . $horas[$i]->format('h:i a') . "]</div>
                            <div class='actividad-nombre'>" . $row["actividad"] . "</div>
                            <div class='actividad-ubicacion'>" . $row["ubicacion"] . "</div>
                        </div>";
                    }
                }
                else{
                    echo "No hay actividades en este momento :(";
                }
            ?>
        </div>

        <!--Conexión con JavaScript-->
        <script src="main.js"></script>
    </body>
    <footer>
        <section class="pie-de-pagina container">
            <div class="informacion">
                Desarrollado por alumnos del Instituto Politécnico Nacional.
            </div>
            <div class="informacion">
                Contacto:
                <br>
                <a class="link" href="https://www.twitter.com/bobftool/" target="_blank">Twitter</a>
                <br>
                <a class="link" href="https://www.instagram.com/bobftool/" target="_blank">Instagram</a>
                <br>
                <a class="link" href="mailto: gonzalezalan321@gmail.com">gonzalezalan321@gmail.com</a>
            </div>
            <div class="informacion">
                <img id="logo-verdev" src="resources\images\design\verdev_logo_fondo.png" alt="">
                <br>
                <a class="link" href="https://www.twitter.com/verdev_/" target="_blank">Twitter</a>
                <br>
                <a class="link" href="https://www.instagram.com/verdev__/" target="_blank">Instagram</a>
                <br>
            </div>
            <div class="informacion">
                <a class="link" href="https://github.com/bobftool/deaquiadonde" target="_blank">Repositorio en GitHub</a>
                <br>
                Última actualización: 26-02-2023
            </div>
        </section>
    </footer>
</html>