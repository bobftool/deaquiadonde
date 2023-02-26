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
        <?php

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
                </div>
                <!--Botón-->
                <a href="" class="boton">Actualizar</a>
            </div>
        </header>

        <!--Cabecera principal--------------------------------------------------------------->
        <section class="cabecera">
            <!--Decoración-->
            <div class="punto-container container">
                <img class="punto-img" src="resources\images\design\punto_blanco.png" alt="">
            </div>

            <!--Cabecera interior-->
            <div class="cabecera-interior">
                <div class="cabecera-contenido container">
                    <h2 class="cabecera-titulo" id="cabecera-track">Aulas libres</h2>
                    <!-- <span class="cabecera-subtitulo" id="cabecera-subtitulo">en tiempo real</span> -->
                </div>
            </div>
        </section>

        <!--Grid aulas disponibles--------------------------------------------------------------->
        <div class="subtitulo container"> Aulas libres ahora:</div>
        <div class="grid-aulas container">
            <?php
                include 'horarios-aulas.php';

                $result = obtener_aulas($horario, $connection, $sql);

                if($horario != 0 && ($dia_actual > 1 && $dia_actual < 7)){
                    while($row = $result->fetch_assoc()){
                        //Mostrar los resultados encontrados
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
                else{
                    echo "La esucela está cerrada :(";
                }
            ?>
        </div>

        <!--Grid aulas disponibles próxima hora--------------------------------------------------------------->
        <div class="subtitulo container"> Aulas libres en la próxima hora:</div>
        <div class="grid-aulas container">
            <?php
                $result = obtener_aulas($horario+1, $connection, $sql);

                if($horario != 0 && $horario != 10+($dia_actual-2)*10 && ($dia_actual > 1 && $dia_actual < 7)){
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
                else{
                    echo "La esucela está cerrada :(";
                }
            ?>
        </div>
        <!--Conexión con JavaScript-->
        <script src="main.js"></script>
    </body>
    <footer>

    </footer>
</html>