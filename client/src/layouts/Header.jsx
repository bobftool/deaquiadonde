import { useEffect, useRef } from "react";
import logoTexto from "../images/logo-texto.png";
import logoIcono from "../images/logo-icono_morado.png";
import styles from "../stylesheets/header.module.css";

function Header({subtitle}) {
  const subtitleRef = useRef();

  function handleScroll() {
    if (Math.ceil(window.scrollY) > 150) {
      if(subtitleRef.current) subtitleRef.current.hidden = true;
    } else {
      if(subtitleRef.current) subtitleRef.current.hidden = false;
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
  }, []);

  return (
    <header>
      <div className={styles.margin}></div>

      <div className={styles.barra_container}>
        <div className={styles.barra}>
          <div className={styles.titulo_container}>
            <img className={styles.titulo_imagen} src={logoTexto} alt="logo" />
          </div>
          <div className={styles.subtitulo_container} ref={subtitleRef}>
            <div className={styles.subtitulo}>{subtitle}</div>
          </div>
          <div className={styles.titulo_container}>
            <img className={styles.icono_imagen} src={logoIcono} alt="icono" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
