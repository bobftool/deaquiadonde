import styles from "../stylesheets/footer.module.css";
import logo from "../images/verdev_logo_fondo.png";

function Footer() {
  return (
      <div className={styles.fondo}>
      <div className={styles.container}>
        <div className={styles.informacion}>
        </div>
        <div className={styles.informacion}>
          Desarrollado por alumnos del Instituto Politécnico Nacional.
        </div>
        <div className={styles.informacion}>
            Muchas gracias por tu donación :)
            <br />
            Tu apoyo desde $1 me ayuda un montón
            <br />
            <p className={styles.link}>BBVA: 012180015870106286</p>
        </div>
        <div className={styles.informacion}>
          Contacto:
          <br />
          <a
            className={styles.link}
            rel="noreferrer"
            href="https://www.twitter.com/bobftool/"
            target="_blank"
          >
            Twitter
          </a>
          <br />
          <a
            className={styles.link}
            rel="noreferrer"
            href="https://www.instagram.com/bobftool/"
            target="_blank"
          >
            Instagram
          </a>
          <br />
          <a className={styles.link} href="mailto: gonzalezalan321@gmail.com">
            gonzalezalan321@gmail.com
          </a>
        </div>
        <div className={styles.informacion}>
          <img className={styles.logo_verdev} src={logo} alt="" />
          <br />
          <a
            className={styles.link}
            rel="noreferrer"
            href="https://www.twitter.com/verdev_/"
            target="_blank"
          >
            Twitter
          </a>
          <br />
          <a
            className={styles.link}
            rel="noreferrer"
            href="https://www.instagram.com/verdev__/"
            target="_blank"
          >
            Instagram
          </a>
          <br />
        </div>
        <div className={styles.informacion}>
          <a
            className={styles.link}
            rel="noreferrer"
            href="https://github.com/bobftool/deaquiadonde"
            target="_blank"
          >
            Repositorio de GitHub
          </a>
          <br />
          Última actualización: 29-01-2024
        </div>
      </div>
      </div>
  );
}

export default Footer;
