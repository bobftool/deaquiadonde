window.addEventListener('scroll', function(){
    let objeto = document.getElementById('cabecera-track');
    let posicionObjeto = objeto.getBoundingClientRect().top;
    console.log(posicionObjeto);
    
    const cabecera = document.querySelector('.cabecera');
    const logoMono = document.querySelector('#logo-mono');
    const logoRosa = document.querySelector('#logo-rosa');
    const punto = document.querySelector('#punto-superior');
    if(posicionObjeto < 0){
        cabecera.style.cssText =
        `opacity: 0;
        transition: 0.3s;`

        logoMono.style.cssText =
        `opacity: 0;
        transition: 1s;`

        logoRosa.style.cssText =
        `opacity: 1;
        transition: 0.3s;`

        punto.style.cssText =
        `opacity: 0;
        transition: 0.3s;`
    }

    if(posicionObjeto > 0){
        cabecera.style.cssText =
        `opacity: 1;
        transition: 0.3s;`

        logoMono.style.cssText =
        `opacity: 1;
        transition: 0.3s;`

        logoRosa.style.cssText =
        `opacity: 0;
        transition: 1s;`

        punto.style.cssText =
        `opacity: 1;
        transition: 0.3s;`
    }
})