function getClases(server){
    return new Promise((resolve, reject)=>{    
        let request =
        `SELECT clases.id, clases.grupo, asignaturas.nombre AS asignaturas, profesores.nombre AS profesores
        FROM clases AS clases
        INNER JOIN asignaturas AS asignaturas
        ON clases.id_asignaturas = asignaturas.id
        INNER JOIN profesores AS profesores
        ON clases.id_profesores = profesores.id`;
    
        server.query(request, (error, result)=>{
            if(error) throw error;
            const data = result;
            resolve(data);
        });
    });
}

function getAsignaturas(server){
    return new Promise((resolve, reject)=>{    
        let request =
        `SELECT asignaturas.id, carreras.nombre AS carrera, asignaturas.nombre, asignaturas.creditos
        FROM asignaturas AS asignaturas
        INNER JOIN carreras AS carreras
        ON asignaturas.id_carreras = carreras.id`;
    
        server.query(request, (error, result)=>{
            if(error) throw error;
            const data = result;
            resolve(data);
        });
    });
}

function getProfesores(server){
    return new Promise((resolve, reject)=>{    
        let request =
        `SELECT *
        FROM profesores`;
    
        server.query(request, (error, result)=>{
            if(error) throw error;
            const data = result;
            resolve(data);
        });
    });
}

function getHorarios(server){
    return new Promise((resolve, reject)=>{    
        let request =
        `SELECT horarios.id, dias.dias, horas.hora_inicio, horas.hora_final
        FROM horarios AS horarios
        INNER JOIN dias AS dias
        ON horarios.id_dias = dias.id
        INNER JOIN horas AS horas
        ON horarios.id_horas = horas.id`;
    
        server.query(request, (error, result)=>{
            if(error) throw error;
            const data = result;
            resolve(data);
        });
    });
}

module.exports = {
    getClases,
    getAsignaturas,
    getProfesores,
    getHorarios
}