const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

connection.connect(
    (error)=>{
        if(error){
            throw error;
        }
        else{
            console.log('Connection to database successful');
        }
    }
);

function selectProfesoresNombre(nombre){
    return new Promise((resolve, reject)=>{
        connection.query(`SELECT * FROM profesores WHERE nombre='${nombre}'`, (error, result)=>{
            resolve(result);
        });
    });
}

function insertProfesores(nombre){
    return new Promise((resolve, reject)=>{
        connection.query(`INSERT INTO profesores(nombre) VALUES ('${nombre}')`, (error, result)=>{
            resolve();
        });
    });
}

function selectAsignaturasId(id){
    return new Promise((resolve, reject)=>{
        connection.query(`SELECT * FROM asignaturas WHERE id='${id}'`, (error, result)=>{
            resolve(result);
        });
    });
}

function selectAsignaturasCarreraNombre(carrera, nombre){
    return new Promise((resolve, reject)=>{
        connection.query(`SELECT * FROM asignaturas WHERE id_carreras='${carrera}' AND nombre='${nombre}'`, (error, result)=>{
            resolve(result);
        });
    });
}

function insertAsignaturas(asignatura){
    return new Promise((resolve, reject)=>{
        connection.query(`INSERT INTO asignaturas(id, id_carreras, nombre, creditos) VALUES ('${asignatura.clave}','${asignatura.carrera}','${asignatura.nombre}','${asignatura.creditos}')`, (error, result)=>{
            resolve();
        });
    });
}

function insertClases(clase){
    return new Promise((resolve, reject)=>{
        let request = `INSERT INTO clases(grupo, id_asignaturas, id_profesores, hora_lunes_inicio, hora_lunes_final, hora_martes_inicio, hora_martes_final, hora_miercoles_inicio, hora_miercoles_final, hora_jueves_inicio, hora_jueves_final, hora_viernes_inicio, hora_viernes_final) VALUES ('${clase.grupo}','${clase.asignaturaId}','${clase.profesorId}','${clase.horas.lunes.inicio}','${clase.horas.lunes.final}','${clase.horas.martes.inicio}','${clase.horas.martes.final}','${clase.horas.miercoles.inicio}','${clase.horas.miercoles.final}','${clase.horas.jueves.inicio}','${clase.horas.jueves.final}','${clase.horas.viernes.inicio}','${clase.horas.viernes.final}')`;

        connection.query(request, (error, result)=>{
            resolve();
        });
    });
}

////////////////////////////////////////////////////////////////////

function selectAsignaturasData(){
    return new Promise((resolve, reject)=>{
        connection.query(`SELECT asignaturas.*, carreras.nombre AS carrera FROM asignaturas INNER JOIN carreras ON asignaturas.id_carreras = carreras.id ORDER BY count DESC`, (error, result)=>{
            resolve(result);
        });
    });
}

function selectProfesores(){
    return new Promise((resolve, reject)=>{
        connection.query(`SELECT * FROM profesores ORDER BY count DESC`, (error, result)=>{
            resolve(result);
        });
    });
}

function updateProfesoresCount(id){
    connection.query(`UPDATE profesores SET count = count + 1 WHERE id = '${id}'`);
}

function updateAsignaturasCount(id){
    connection.query(`UPDATE asignaturas SET count = count + 1 WHERE id = '${id}'`);
}

function selectCreditosAsignaturasId(id){
    return new Promise((resolve, reject)=>{
        connection.query(`SELECT creditos FROM asignaturas WHERE id='${id}'`, (error, result)=>{
            resolve(result);
        });
    });
}

function selectClasesAsignatura(asignatura){
    return new Promise((resolve, reject)=>{
        let query = `SELECT id, id_profesores FROM clases WHERE id_asignaturas = '${asignatura}'`;

        connection.query(query, (error, result)=>{
            resolve(result);
        });
    });
}

function selectClasesDataId(id){
    return new Promise((resolve, reject)=>{
        let query = `SELECT clases.id, clases.grupo, asignaturas.nombre AS asignatura, profesores.nombre AS profesor, clases.hora_lunes_inicio, clases.hora_lunes_final, clases.hora_martes_inicio, clases.hora_martes_final, clases.hora_miercoles_inicio, clases.hora_miercoles_final, clases.hora_jueves_inicio, clases.hora_jueves_final, clases.hora_viernes_inicio, clases.hora_viernes_final FROM clases AS clases INNER JOIN asignaturas AS asignaturas ON clases.id_asignaturas = asignaturas.id INNER JOIN profesores AS profesores ON clases.id_profesores = profesores.id WHERE clases.id = '${id}'`

        connection.query(query, (error, result)=>{
            resolve(result);
        });
    });
}

function selectClasesId(id){
    return new Promise((resolve, reject)=>{
        let query = `SELECT hora_lunes_inicio, hora_lunes_final, hora_martes_inicio, hora_martes_final, hora_miercoles_inicio, hora_miercoles_final, hora_jueves_inicio, hora_jueves_final, hora_viernes_inicio, hora_viernes_final FROM clases WHERE id = '${id}'`

        connection.query(query, (error, result)=>{
            resolve(result);
        });
    });
}

function insertLog(data){
    return new Promise((resolve, reject)=>{
        let query = `INSERT INTO logs(data) VALUES ('${JSON.stringify(data)}')`;
    
        connection.query(query, (error, result)=>{
            resolve(result);
        });
    });
}

function newLog(){
    return new Promise((resolve, reject)=>{
        let query = `INSERT INTO logs() VALUES ()`;
    
        connection.query(query, (error, result)=>{
            resolve();
        });
    });
}

function selectLogId(id){
    return new Promise((resolve, reject)=>{
        let query = `SELECT data FROM logs WHERE id = ${id}`;
    
        connection.query(query, (error, result)=>{
            resolve(result);
        });
    });
}

function updateLog(id, data){
    return new Promise((resolve, reject)=>{
        let query = `UPDATE logs SET data = '${JSON.stringify(data)}' WHERE id = ${id}`;
    
        connection.query(query, (error, result)=>{
            resolve(result);
        });
    });
}

function insertUser(data){
    return new Promise((resolve, reject)=>{
        let query = `INSERT INTO users(data) VALUES ('${JSON.stringify(data)}')`;
    
        connection.query(query, (error, result)=>{
            resolve(result);
        });
    });
}

function selectUserId(id){
    return new Promise((resolve, reject)=>{
        let query = `SELECT data FROM users WHERE id = ${id}`;
    
        connection.query(query, (error, result)=>{
            resolve(result);
        });
    });
}

function updateUser(id, data){
    return new Promise((resolve, reject)=>{
        let query = `UPDATE users SET data = '${JSON.stringify(data)}' WHERE id = ${id}`;
    
        connection.query(query, (error, result)=>{
            resolve(result);
        });
    });
}

module.exports = {
    selectProfesoresNombre,
    insertProfesores,
    selectAsignaturasId,
    selectAsignaturasCarreraNombre,
    insertAsignaturas,
    insertClases,
    selectAsignaturasData,
    selectProfesores,
    updateProfesoresCount,
    updateAsignaturasCount,
    selectCreditosAsignaturasId,
    selectClasesAsignatura,
    selectClasesId,
    selectClasesDataId,
    insertLog,
    newLog,
    selectLogId,
    updateLog,
    insertUser,
    selectUserId,
    updateUser
};