const saes_api = require('../services/saes-api');
const database = require('../services/database');

async function updateAll(req, res){
    const credentials = {
        login: req.cookies['saes-api_LOGIN'],
        session: req.cookies['saes-api_SESSION']
    };
    console.log('Obteniendo información...');
    const dataHorarios = await saes_api.getGeneralHorarios(credentials);
    const dataAsignaturas = await saes_api.getGeneralAsignaturas(credentials);

    console.log('Actualizando profesores...');
    await updateProfesores(dataHorarios);
    console.log('Actualizando asignaturas...');
    await updateAsignaturas(dataAsignaturas);
    console.log('Actualizando clases...');
    await updateClases(dataHorarios);

    res.send();
}

async function updateProfesores(data){
    for(let i=0, n=data.length; i<n; i++){
        let dataProfesor = data[i].profesor.replace(/\w\S*/g, (txt)=>{ return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()});

        let profesoresFound = await database.selectProfesoresNombre(dataProfesor);

        if(profesoresFound.length == 0) await database.insertProfesores(dataProfesor);
    }
}

async function updateAsignaturas(data){
    for(let i=0, n=data.length; i<n; i++){
        let dataAsignatura = data[i];
        dataAsignatura.nombre = dataAsignatura.nombre.replace(/\w\S*/g, (txt)=>{ return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()});

        let asignaturasFound = await database.selectAsignaturasId(dataAsignatura.clave);

        if(asignaturasFound.length == 0) await database.insertAsignaturas(dataAsignatura);
    }
}

async function updateClases(data){
    for(let i=0, n=data.length; i<n; i++){
        let dataClase = data[i];
        dataClase.asignaturaNombre = dataClase.asignatura.replace(/\w\S*/g, (txt)=>{ return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()});
        dataClase.profesorNombre = dataClase.profesor.replace(/\w\S*/g, (txt)=>{ return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()});

        dataClase.asignaturaId = (await database.selectAsignaturasCarreraNombre(dataClase.carrera, dataClase.asignaturaNombre))[0].id;
        dataClase.profesorId = (await database.selectProfesoresNombre(dataClase.profesorNombre))[0].id;
        dataClase.horas = {
            lunes: {
                inicio: dataClase.horas.lunes.split('-')[0]?.trim()?? '',
                final: dataClase.horas.lunes.split('-')[1]?.trim()?? ''
            },
            martes: {
                inicio: dataClase.horas.martes.split('-')[0]?.trim()?? '',
                final: dataClase.horas.martes.split('-')[1]?.trim()?? ''
            },
            miercoles: {
                inicio: dataClase.horas.miercoles.split('-')[0]?.trim()?? '',
                final: dataClase.horas.miercoles.split('-')[1]?.trim()?? ''
            },
            jueves: {
                inicio: dataClase.horas.jueves.split('-')[0]?.trim()?? '',
                final: dataClase.horas.jueves.split('-')[1]?.trim()?? ''
            },
            viernes: {
                inicio: dataClase.horas.viernes.split('-')[0]?.trim()?? '',
                final: dataClase.horas.viernes.split('-')[1]?.trim()?? ''
            }
        }

        await database.insertClases(dataClase);
    }
}

module.exports = {
    updateAll
}