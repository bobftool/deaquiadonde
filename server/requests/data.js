const server = require('../connection');

const getClases = new Promise((resolve, reject) => {
    let request =
    `SELECT clases.id, clases.grupo, asignaturas.nombre AS asignatura, profesores.nombre AS profesor
    FROM clases AS clases
    INNER JOIN asignaturas AS asignaturas
    ON clases.id_asignatura = asignaturas.id
    INNER JOIN profesores AS profesores
    ON clases.id_profesor = profesores.id`;

    server.query(request, (error, result) => {
        if(error) throw error;
        const data = result;
        resolve(data);
    });
});

const getAsignaturas = new Promise((resolve, reject) => {
    let request =
    `SELECT * FROM asignaturas`;

    server.query(request, (error, result) => {
        if(error) throw error;
        const data = result;
        resolve(data);
    });
});

const getProfesores = new Promise((resolve, reject) => {
    let request =
    `SELECT * FROM profesores`;

    server.query(request, (error, result) => {
        if(error) throw error;
        const data = result;
        resolve(data);
    });
});

module.exports = {
    server,
    getClases,
    getAsignaturas,
    getProfesores
};