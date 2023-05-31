function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.addEventListener('scroll', function(){
    let inicioSeccion1 = document.getElementById('track-inicio-seccion-1');
    let posicionInicioSeccion1 = inicioSeccion1.getBoundingClientRect().top;
    let finalSeccion1 = document.getElementById('track-final-seccion-1');
    let posicionFinalSeccion1 = finalSeccion1.getBoundingClientRect().top;

    let inicioSeccion2 = document.getElementById('track-inicio-seccion-2');
    let posicionInicioSeccion2 = inicioSeccion2.getBoundingClientRect().top;
    //console.log(posicionInicioSeccion1);
    
    const cabeceraSeccion1 = document.querySelector('#cabecera-seccion-1');
    const cabeceraSeccion2 = document.querySelector('#cabecera-seccion-2');
    const boton = document.querySelector('.boton:hover');
    const punto = document.querySelector('#punto-superior');
    const logoMono = document.querySelector('#logo-mono');
    const logoRosa = document.querySelector('#logo-rosa');
    const logoVerde = document.querySelector('#logo-verde');
    
    if(posicionInicioSeccion1 < 0){
        punto.style.cssText =
        `opacity: 0;
        transition: 0.3s;`

        cabeceraSeccion1.style.cssText =
        `opacity: 0;
        transition: 0.3s;`

        logoMono.style.cssText =
        `opacity: 0;
        transition: 0.3s;`

        logoRosa.style.cssText =
        `opacity: 1;
        transition: 0.3s;`
    }

    if(posicionInicioSeccion1 > 0){
        punto.style.cssText =
        `opacity: 1;
        transition: 0.3s;`

        cabeceraSeccion1.style.cssText =
        `opacity: 1;
        transition: 0.3s;`

        logoMono.style.cssText =
        `opacity: 1;
        transition: 0.3s;`

        logoRosa.style.cssText =
        `opacity: 0;
        transition: 0.3s;`
    }

    if(posicionFinalSeccion1 < 0){
        logoRosa.style.cssText =
        `opacity: 0;
        transition: 0.3s;`

        logoMono.style.cssText =
        `opacity: 1;
        transition: 0.3s;`
    }
    
    //---------------------------------------------

    if(posicionInicioSeccion2 < 0){
        cabeceraSeccion2.style.cssText =
        `opacity: 0;
        transition: 0.3s;`

        logoRosa.style.cssText =
        `opacity: 0;
        transition: 0.3s;`

        logoVerde.style.cssText =
        `opacity: 1;
        transition: 0.3s;`
    }

    if(posicionInicioSeccion2 > 0){
        cabeceraSeccion2.style.cssText =
        `opacity: 1;
        transition: 0.3s;`

        logoMono.style.cssText =
        `opacity: 1;
        transition: 0.3s;`

        logoVerde.style.cssText =
        `opacity: 0;
        transition: 0.3s;`
    }
})