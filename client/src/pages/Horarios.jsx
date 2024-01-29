import { useEffect, useState } from "react";
import MultiSelector from "../components/MultiSelector";
import styles from "../stylesheets/horarios.module.css";

function Horarios() {
  const [data, setData] = useState();
  const [horarios, setHorarios] = useState();
  const [regenerate, setRegenerate] = useState(false);
  const [previousHorarios, setPreviousHorarios] = useState([]);
  const [savedHorarios, setSavedHorarios] = useState([]);
  const [horarioIsSaved, setHorarioIsSaved] = useState(false);

  useEffect(() => {
    serveHorarios();
    serveSavedHorarios();
  }, []);

  async function serveHorarios() {
    const response = await fetch(process.env.REACT_APP_API + "/horarios");
    const data = await response.json();
    
    setData(data);
  }

  async function serveSavedHorarios() {
    const response = await fetch(
      process.env.REACT_APP_API + "/horarios/user/get",
      {
        credentials: "include",
      }
    );

    const savedHorarios = await response.json();
    if(savedHorarios) setSavedHorarios(savedHorarios);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const data = {
      asignaturas: [...event.target.asignaturas.selectedOptions].map(
        (option) => option.value
      ),
      profesoresNoDeseados: [...event.target.profesores.selectedOptions].map(
        (option) => option.value
      ),
    };

    if (data.asignaturas.length > 0) {
      const response = await fetch(
        process.env.REACT_APP_API + "/horarios/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      const horarios = await response.json();

      setPreviousHorarios([]);
      setHorarios(horarios);
      setRegenerate(false);
      setHorarioIsSaved(false);

      console.log(horarios);
    }
  }

  async function handleSaveHorario(event) {
    event.preventDefault();

    const data = {
      horario: horarios[0],
    };

    const response = await fetch(
      process.env.REACT_APP_API + "/horarios/user/save",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      }
    );

    const savedHorarios = await response.json();

    setSavedHorarios(savedHorarios);
    setHorarioIsSaved(true);
  }

  async function hanldeUnsaveHorario(event) {
    event.preventDefault();

    const data = {
      index: event.target.value,
    };

    const response = await fetch(
      process.env.REACT_APP_API + "/horarios/user/unsave",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      }
    );

    const savedHorarios = await response.json();

    setSavedHorarios(savedHorarios);
  }

  function handleRegenerateButton(event) {
    if (!regenerate) {
      event.preventDefault();

      setRegenerate(true);
    }
  }

  async function handleRegenerateSubmit(event) {
    event.preventDefault();

    const data = {
      clasesDeseadas: [...event.target]
        .filter((checkbox) => !checkbox.checked)
        .map((checkbox) => checkbox.value)
        .slice(0, -1),
      clasesNoDeseadas: [...event.target]
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value),
    };

    const response = await fetch(
      process.env.REACT_APP_API + "/horarios/regenerate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      }
    );

    const newHorarios = await response.json();

    setPreviousHorarios([...previousHorarios, horarios]);
    setHorarios(newHorarios);
    setRegenerate(false);
    setHorarioIsSaved(false);
  }

  async function handlePreviousButton(event) {
    event.preventDefault();

    const data = previousHorarios;

    await fetch(process.env.REACT_APP_API + "/horarios/set", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    setHorarios(previousHorarios.pop());
    setRegenerate(false);
  }

  return (
    <>
      <h1>Generador de horario</h1>
      <section>
        {data ? (
          <form onSubmit={handleSubmit}>
            <label htmlFor="asignaturas">Elige tus materias:</label>
            <MultiSelector
              name="asignaturas"
              placeholder="Buscar"
              options={data.asignaturas.map((asignatura, index) => ({
                index,
                value: asignatura.id,
                text: asignatura.nombre + " - [" + asignatura.carrera + "]",
                selected: false,
              }))}
            />
            <label htmlFor="profesores">No incluir:</label>
            <MultiSelector
              name="profesores"
              placeholder="Buscar"
              options={data.profesores.map((profesor, index) => ({
                index,
                value: profesor.id,
                text: profesor.nombre,
                selected: false,
              }))}
            />
            <button className={styles.button} type="submit">
              Generar horario
            </button>
          </form>
        ) : (
          <div>Cargando...</div>
        )}
      </section>

      <section>
        {horarios ? (
          <form onSubmit={handleRegenerateSubmit}>
            {regenerate ? (
              <h2>Elige la(s) clase(s) que no quieres en tu horario:</h2>
            ) : (
              <>
                <h2>El mejor horario para ti:</h2>
                <p>Horas libres por semana: {horarios[0].horasLibres}</p>
              </>
            )}
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Grupo</th>
                  <th>Asignatura</th>
                  <th>Profesor</th>
                  <th className={styles.dias}>Lun</th>
                  <th className={styles.dias}>Mar</th>
                  <th className={styles.dias}>Mie</th>
                  <th className={styles.dias}>Jue</th>
                  <th className={styles.dias}>Vie</th>
                </tr>
              </thead>
              <tbody>
                {horarios[0].horario.map((clase, index) => (
                  <tr key={index}>
                    <td>
                      {regenerate ? (
                        <>
                          <p>{clase.grupo}</p>
                          <input type="checkbox" value={clase.id} />
                        </>
                      ) : (
                        <>{clase.grupo}</>
                      )}
                    </td>
                    <td>{clase.asignatura}</td>
                    <td>{clase.profesor}</td>
                    <td className={styles.dias}>{clase.horas.lunes}</td>
                    <td className={styles.dias}>{clase.horas.martes}</td>
                    <td className={styles.dias}>{clase.horas.miercoles}</td>
                    <td className={styles.dias}>{clase.horas.jueves}</td>
                    <td className={styles.dias}>{clase.horas.viernes}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="8">deaquiadonde.com</th>
                </tr>
              </tfoot>
            </table>
            {savedHorarios.length >= 5 ? (
              <p>Sólo puedes guardar 5 horarios a la vez</p>
            ) : (
              <></>
            )}
            <button
              disabled={horarioIsSaved || savedHorarios.length >= 5}
              className={styles.button}
              onClick={handleSaveHorario}
            >
              {horarioIsSaved ? "Guardado" : "Guardar para más tarde"}
            </button>
            <button className={styles.button} onClick={handleRegenerateButton}>
              {regenerate ? "Generar otro horario sin esas clases" : "Quitar clases"}
            </button>
            {previousHorarios.length > 0 ? (
              <button className={styles.button} onClick={handlePreviousButton}>
                Regresar al horario anterior
              </button>
            ) : (
              <></>
            )}
          </form>
        ) : (
          <></>
        )}
      </section>

      <section>
        {savedHorarios.length > 0 ? (
          <>
            <h2>Tus horarios guardados:</h2>
            {savedHorarios.map(({ horario, horasLibres, index }) => (
              <div key={index}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Grupo</th>
                      <th>Asignatura</th>
                      <th>Profesor</th>
                      <th className={styles.dias}>Lun</th>
                      <th className={styles.dias}>Mar</th>
                      <th className={styles.dias}>Mie</th>
                      <th className={styles.dias}>Jue</th>
                      <th className={styles.dias}>Vie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {horario.map((clase, index) => (
                      <tr key={index}>
                        <td>{clase.grupo}</td>
                        <td>{clase.asignatura}</td>
                        <td>{clase.profesor}</td>
                        <td className={styles.dias}>{clase.horas.lunes}</td>
                        <td className={styles.dias}>{clase.horas.martes}</td>
                        <td className={styles.dias}>{clase.horas.miercoles}</td>
                        <td className={styles.dias}>{clase.horas.jueves}</td>
                        <td className={styles.dias}>{clase.horas.viernes}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan="8">deaquiadonde.com</th>
                    </tr>
                  </tfoot>
                </table>
                <button
                  value={index}
                  className={styles.button}
                  onClick={hanldeUnsaveHorario}
                >
                  Borrar
                </button>
              </div>
            ))}
          </>
        ) : (
          <></>
        )}
      </section>
    </>
  );
}

export default Horarios;
