const database = require('../services/database');

async function getData(req, res){
    const asignaturas = await database.selectAsignaturasData();
    const profesores = await database.selectProfesores();

    const data = {
        asignaturas,
        profesores
    }

    res.json(data);
}

async function generateHorarios(req, res){
    let asignaturas = req.body.asignaturas; // asignaturas: [id1, id2, id3, ... ]
    let profesoresNoDeseados = req.body.profesoresNoDeseados; // profesoresNoDeseados: [id1, id2, id3, ... ]

    //actualiza el contador de profesores
    updateProfesores(profesoresNoDeseados);
    
    //buscar todas las clases de cada asignatura que no contengan a los profesores no deseados
    await getAsignaturasClases(asignaturas, profesoresNoDeseados); // asignaturas: [{id, clases[id1, id2, ... ]}, ... ]
    // obtener la información de todas las clases de cada asignatura
    await getAsignaturasClasesData(asignaturas); // asignaturas: [{id, clases[{id, grupo, asignatura, profesor, horas{lunes, martes, miercoles, jueves, viernes}}, ... ]}, ... ]
    //convertir las horas de clases en formatos que javascript pueda procesar y comparar
    await processAsignaturasClasesHoras(asignaturas); // asignaturas: [{id, clases[{id, grupo, asignatura, profesor, horas{lunes, martes, miercoles, jueves, viernes}, horasProcessed{lunes{inicio, final}, ... }}, ... ]}, ... ]

    //crear horarios con todas las combinaciones posibles de clases de cada asignatura
    let horarios = getHorarios(asignaturas); // horarios: [horario[idClase1, idClase2, ... ], ... ]
    //descartar todos los horarios en donde al menos dos clases coincidan en alguna de sus horas
    filterOutHorariosCoincidences(horarios);
    //calcular horas libres de cada horario
    getHorariosHorasLibres(horarios); // horarios: [{horario[idClase1, ... ], horasLibres}, ... ]
    //ordenar los horarios de menor a mayor cantidad de horas libres
    sortHorarios(horarios);

    //calcular la suma de creditos totales de todas las asignaturas
    let creditos = await getCreditosTotales(asignaturas);

    //crea una versión comprimida de los horarios para ser almacenada en la base de datos
    let dataCompressed = compressHorarios(horarios, creditos);

    let logId = req.cookies['daad-LOG_ID'];

    if(logId){
        (await database.updateLog(logId, dataCompressed))
        database.newLog();
    }
    else{
        //almacena los datos como JSON en la base de datos y recupera el id de la inserción
        logId = (await database.insertLog(dataCompressed)).insertId;

        //se asigna una cookie al usuario con el id de los datos de sus horarios en la base de datos
        res.cookie('daad-LOG_ID', logId, {
            secure: true,
            sameSite: 'none',
            maxAge: 24*60*60*1000
        });
    }

    //se responde con el objeto JSON de los horarios
    res.json(horarios);
}

async function getCreditosTotales(asignaturas){
    let creditos = 0;

    for(let i=0, n=asignaturas.length; i<n; i++){
        let creditosAsignatura = (await database.selectCreditosAsignaturasId(asignaturas[i].id))[0]['creditos']?? null;

        if(creditosAsignatura) creditos += creditosAsignatura;
    }

    return creditos;
}

function updateProfesores(profesores){
    for(let i=0, n=profesores.length; i<n; i++){
        database.updateProfesoresCount(profesores[i]);
    }
}

async function getAsignaturasClases(asignaturas, profesoresNoDeseados){
    for(let i=0, n=asignaturas.length; i<n; i++){
        let clases = await database.selectClasesAsignatura(asignaturas[i]);
        let clasesFiltered = [];

        for(let j=0, m=clases.length; j<m; j++){
            if(!profesoresNoDeseados.includes(clases[j]['id_profesores'])) clasesFiltered.push(clases[j]['id']);
        }

        clases = clasesFiltered;

        asignaturas[i] = {
            id: asignaturas[i],
            clases
        };

        database.updateAsignaturasCount(asignaturas[i].id);
    }
}

async function getAsignaturasClasesData(asignaturas){
    for(let i=0, n=asignaturas.length; i<n; i++){
        for(let j=0, m=asignaturas[i].clases.length; j<m; j++){
            const data = (await database.selectClasesDataId(asignaturas[i].clases[j]))[0];

            asignaturas[i].clases[j] = {
                id: data['id'],
                grupo: data['grupo'],
                asignatura: data['asignatura'],
                profesor: data['profesor'],
                horas: {
                    lunes: data['hora_lunes_inicio']? data['hora_lunes_inicio'] + ' - ' + data['hora_lunes_final'] : '',
                    martes: data['hora_martes_inicio']? data['hora_martes_inicio'] + ' - ' + data['hora_martes_final'] : '',
                    miercoles: data['hora_miercoles_inicio']? data['hora_miercoles_inicio'] + ' - ' + data['hora_miercoles_final'] : '',
                    jueves: data['hora_jueves_inicio']? data['hora_jueves_inicio'] + ' - ' + data['hora_jueves_final'] : '',
                    viernes: data['hora_viernes_inicio']? data['hora_viernes_inicio'] + ' - ' + data['hora_viernes_final'] : ''
                }
            };
        }
    }
}

async function processAsignaturasClasesHoras(asignaturas){
    for(let i=0, n=asignaturas.length; i<n; i++){
        for(let j=0, m=asignaturas[i].clases.length; j<m; j++){
            const data = (await database.selectClasesId(asignaturas[i].clases[j].id))[0];

            asignaturas[i].clases[j].horasProcessed = {
                lunes: (data['hora_lunes_inicio'] && data['hora_lunes_final']) ? {
                    inicio: new Date('11/08/2002 ' + data['hora_lunes_inicio']),
                    final: new Date(new Date('11/08/2002 ' + data['hora_lunes_final']) - 1000)
                } : null,
                martes: (data['hora_martes_inicio'] && data['hora_martes_final']) ? {
                    inicio: new Date('11/08/2002 ' + data['hora_martes_inicio']),
                    final: new Date(new Date('11/08/2002 ' + data['hora_martes_final']) - 1000)
                } : null,
                miercoles: (data['hora_miercoles_inicio'] && data['hora_miercoles_final']) ? {
                    inicio: new Date('11/08/2002 ' + data['hora_miercoles_inicio']),
                    final: new Date(new Date('11/08/2002 ' + data['hora_miercoles_final']) - 1000)
                } : null,
                jueves: (data['hora_jueves_inicio'] && data['hora_jueves_final']) ? {
                    inicio: new Date('11/08/2002 ' + data['hora_jueves_inicio']),
                    final: new Date(new Date('11/08/2002 ' + data['hora_jueves_final']) - 1000)
                } : null,
                viernes: (data['hora_viernes_inicio'] && data['hora_viernes_final']) ? {
                    inicio: new Date('11/08/2002 ' + data['hora_viernes_inicio']),
                    final: new Date(new Date('11/08/2002 ' + data['hora_viernes_final']) - 1000)
                } : null
            };
        }
    }
}

function getHorarios(asignaturas) {
    let horarios = [];
    
    function generateCombinations(clasesArray, currentIndex) {
        // Verificar si la asignatura actual tiene clases
        if (asignaturas[currentIndex].clases.length > 0) {
            // Recorrer todas las clases de la asignatura actual
            for (var j = 0; j < asignaturas[currentIndex].clases.length; j++) {
                // Clonar el array de clases para esta combinación
                var newArray = clasesArray.slice(0);
                // Agregar la clase actual al array de clases de esta combinación
                newArray.push(asignaturas[currentIndex].clases[j]);
                // Verificar si hemos llegado al final de las asignaturas
                if (currentIndex === asignaturas.length - 1) {
                    // Si es así, agregar esta combinación a los horarios
                    horarios.push(newArray);
                } else {
                    // Si no, continuar generando combinaciones con la siguiente asignatura
                    generateCombinations(newArray, currentIndex + 1);
                }
            }
        } else {
            // Si la asignatura actual no tiene clases, simplemente pasar a la siguiente asignatura
            if (currentIndex === asignaturas.length - 1) {
                // Si hemos llegado al final de las asignaturas, agregar la combinación actual a los horarios
                horarios.push(clasesArray.slice(0));
            } else {
                // Si no, continuar generando combinaciones con la siguiente asignatura
                generateCombinations(clasesArray, currentIndex + 1);
            }
        }
    }

    // Iniciar la generación de combinaciones con un array vacío y la primera asignatura
    generateCombinations([], 0);

    return horarios;
}

function filterOutHorariosCoincidences(horarios){
    let horariosFiltered = [];

    for(let i=0, n=horarios.length; i<n; i++){
        let horario = horarios[i];
        let horas = {
            lunes: [],
            martes: [],
            miercoles: [],
            jueves: [],
            viernes: []
        }
        let hasCoincidences = false;

        for(let j=0, m=horario.length; j<m; j++){
            if(horario[j].horasProcessed.lunes) horas.lunes.push(horario[j].horasProcessed.lunes);
            if(horario[j].horasProcessed.martes) horas.martes.push(horario[j].horasProcessed.martes);
            if(horario[j].horasProcessed.miercoles) horas.miercoles.push(horario[j].horasProcessed.miercoles);
            if(horario[j].horasProcessed.jueves) horas.jueves.push(horario[j].horasProcessed.jueves);
            if(horario[j].horasProcessed.viernes) horas.viernes.push(horario[j].horasProcessed.viernes);
        }

        horas.lunes.sort((a, b)=> a.inicio - b.inicio);
        horas.martes.sort((a, b)=> a.inicio - b.inicio);
        horas.miercoles.sort((a, b)=> a.inicio - b.inicio);
        horas.jueves.sort((a, b)=> a.inicio - b.inicio);
        horas.viernes.sort((a, b)=> a.inicio - b.inicio);

        for(let j=0, m=horas.lunes.length-1; j<m; j++){
            if(horas.lunes[j].inicio <= horas.lunes[j+1].inicio && horas.lunes[j].final >= horas.lunes[j+1].inicio){
                hasCoincidences = true;
                break;
            }
        }

        if(hasCoincidences) continue;

        for(let j=0, m=horas.martes.length-1; j<m; j++){
            if(horas.martes[j].inicio <= horas.martes[j+1].inicio && horas.martes[j].final >= horas.martes[j+1].inicio){
                hasCoincidences = true;
                break;
            }
        }

        if(hasCoincidences) continue;

        for(let j=0, m=horas.miercoles.length-1; j<m; j++){
            if(horas.miercoles[j].inicio <= horas.miercoles[j+1].inicio && horas.miercoles[j].final >= horas.miercoles[j+1].inicio){
                hasCoincidences = true;
                break;
            }
        }

        if(hasCoincidences) continue;

        for(let j=0, m=horas.jueves.length-1; j<m; j++){
            if(horas.jueves[j].inicio <= horas.jueves[j+1].inicio && horas.jueves[j].final >= horas.jueves[j+1].inicio){
                hasCoincidences = true;
                break;
            }
        }

        if(hasCoincidences) continue;

        for(let j=0, m=horas.viernes.length-1; j<m; j++){
            if(horas.viernes[j].inicio <= horas.viernes[j+1].inicio && horas.viernes[j].final >= horas.viernes[j+1].inicio){
                hasCoincidences = true;
                break;
            }
        }

        if(hasCoincidences) continue;

        horariosFiltered.push(horario);
    }

    horarios.length = 0;
    horarios.push(...horariosFiltered);
}

function getHorariosHorasLibres(horarios){
    for(let i=0, n=horarios.length; i<n; i++){
        let horario = horarios[i];
        let horas = {
            lunes: [],
            martes: [],
            miercoles: [],
            jueves: [],
            viernes: []
        };
        let tiempo = 0;

        for(let j=0, m=horario.length; j<m; j++){
            if(horario[j].horasProcessed.lunes) horas.lunes.push(horario[j].horasProcessed.lunes);
            if(horario[j].horasProcessed.martes) horas.martes.push(horario[j].horasProcessed.martes);
            if(horario[j].horasProcessed.miercoles) horas.miercoles.push(horario[j].horasProcessed.miercoles);
            if(horario[j].horasProcessed.jueves) horas.jueves.push(horario[j].horasProcessed.jueves);
            if(horario[j].horasProcessed.viernes) horas.viernes.push(horario[j].horasProcessed.viernes);

            //quitar horasProcessed del objeto
            let {horasProcessed, ...horarioCleaned} = horario[j];
            horario[j] = horarioCleaned;
        }

        horas.lunes.sort((a, b)=> a.inicio - b.inicio);
        horas.martes.sort((a, b)=> a.inicio - b.inicio);
        horas.miercoles.sort((a, b)=> a.inicio - b.inicio);
        horas.jueves.sort((a, b)=> a.inicio - b.inicio);
        horas.viernes.sort((a, b)=> a.inicio - b.inicio);
        
        for(let j=0, m=horas.lunes.length-1; j<m; j++){
            tiempo += horas.lunes[j+1].inicio - horas.lunes[j].final - 1000;
        }

        for(let j=0, m=horas.martes.length-1; j<m; j++){
            tiempo += horas.martes[j+1].inicio - horas.martes[j].final - 1000;
        }

        for(let j=0, m=horas.miercoles.length-1; j<m; j++){
            tiempo += horas.miercoles[j+1].inicio - horas.miercoles[j].final - 1000;
        }

        for(let j=0, m=horas.jueves.length-1; j<m; j++){
            tiempo += horas.jueves[j+1].inicio - horas.jueves[j].final - 1000;
        }

        for(let j=0, m=horas.viernes.length-1; j<m; j++){
            tiempo += horas.viernes[j+1].inicio - horas.viernes[j].final - 1000;
        }

        horarios[i] = {
            horario,
            horasLibres: tiempo / (1000*60*60)
        }
    }
}

function sortHorarios(horarios){
    horarios.sort((a ,b)=> a.horasLibres - b.horasLibres);
}

function compressHorarios(horarios, creditos){
    let horariosCompressed = [];
    let clases = [];
    
    for(let i=0, n=horarios.length; i<n; i++){
        let horarioCompressed = {
            horario: [],
            horasLibres: horarios[i].horasLibres
        }

        for(let j=0, m=horarios[i].horario.length; j<m; j++){
            horarioCompressed.horario.push(horarios[i].horario[j].id);

            if(!clases.includes(horarios[i].horario[j].id)) clases.push(horarios[i].horario[j].id);
        }

        horariosCompressed.push(horarioCompressed);
    }

    let dataCompressed = {
        clases,
        horarios: horariosCompressed,
        creditos
    }

    return dataCompressed;
}

async function regenerateHorarios(req, res){
    //obtiene el id del log del usuario
    let logId = req.cookies['daad-LOG_ID'];
    //obtiene el json de los horarios del usuario y lo convierte en un objeto
    let data = JSON.parse((await database.selectLogId(logId))[0]['data']);
    let clasesDeseadas = req.body.clasesDeseadas; // clasesDeseadas[id1, id2, id3, ... ]
    let clasesNoDeseadas = req.body.clasesNoDeseadas; // clasesNoDeseadas[id1, id2, id3, ... ]
    let horarios = data.horarios;

    if(horarios>1) horarios.shift();

    /*
    //eliminar todos los horarios sin clasesDeseadas
    let horariosClasesDeseadas = data.horarios.filter((element)=>clasesDeseadas.every((clase) => element.horario.includes(clase)));

    //si no se encontró ningún horario con clasesDeseadas, se mantienen los mismos horarios
    if(horariosClasesDeseadas.length == 0) horariosClasesDeseadas = data.horarios;
    */

    //contar cuantas coincidencias con clasesDeseadas tiene cada horario y sumarlo en el rank
    horarios = horarios.map((element)=>({
        ...element,
        rank: element.horario.filter((clase)=>clasesDeseadas.includes(clase)).length
    }))

    //contar cuantas coincidencias con clasesNoDeseadas tiene cada horario y restarlo en el rank
    horarios = horarios.map((element)=>({
        ...element,
        rank:  element.rank - element.horario.filter((clase)=>clasesNoDeseadas.includes(clase)).length
    }))

    //ordenar de mayor a menor según el rank
    horarios.sort((a, b)=> b.rank - a.rank);

    //obtener los datos de todas las clases
    let clasesData = await getClasesData(data.clases);

    //asignar los datos de todas las clases en cada horario
    horarios = horarios.map((element)=>({
        ...element,
        horario: element.horario.map((clase)=>(
            clasesData.filter((data)=> data.id==clase)[0]
        )),
    }));

    //crea una versión comprimida de los horarios para ser almacenada en la base de datos
    let dataCompressed = compressHorarios(horarios, data.creditos);

    //actualiza los datos JSON de la base de datos en el log del usuario
    await updateData(logId, dataCompressed);

    //se responde con el objeto JSON de los horarios con las clases deseadas
    res.json(horarios);
}

async function getClasesData(clases){
    let clasesData = [];

    for(let i=0, n=clases.length; i<n; i++){
        const data = (await database.selectClasesDataId(clases[i]))[0];
        let clase = {
            id: data['id'],
            grupo: data['grupo'],
            asignatura: data['asignatura'],
            profesor: data['profesor'],
            horas: {
                lunes: data['hora_lunes_inicio']? data['hora_lunes_inicio'] + ' - ' + data['hora_lunes_final'] : '',
                martes: data['hora_martes_inicio']? data['hora_martes_inicio'] + ' - ' + data['hora_martes_final'] : '',
                miercoles: data['hora_miercoles_inicio']? data['hora_miercoles_inicio'] + ' - ' + data['hora_miercoles_final'] : '',
                jueves: data['hora_jueves_inicio']? data['hora_jueves_inicio'] + ' - ' + data['hora_jueves_final'] : '',
                viernes: data['hora_viernes_inicio']? data['hora_viernes_inicio'] + ' - ' + data['hora_viernes_final'] : ''
            }
        };

        clasesData.push(clase)
    }

    return clasesData;
}

async function updateData(id, data){
    await database.updateLog(id, data);
}

async function saveHorarioUser(req, res){
    let userId = req.cookies['daad-USER_ID'];
    let horario = req.body.horario;
    let data = userId? JSON.parse((await database.selectUserId(userId))[0]['data']) : [];

    data.push(horario);
    data = data.map((element, index)=>({...element, index}));

    if(userId){
        await database.updateUser(userId, data);
    }
    else{
        userId = (await database.insertUser(data)).insertId;

        res.cookie('daad-USER_ID', userId, {
            secure: true,
            sameSite: 'none',
            maxAge: 7*24*60*60*1000
        });
    }

    res.json(data);
}

async function getSavedHorariosUser(req, res){
    let userId = req.cookies['daad-USER_ID'];
    let data = userId? JSON.parse((await database.selectUserId(userId))[0]['data']) : null;

    res.json(data);
}

async function unsaveHorarioUser(req, res){
    let userId = req.cookies['daad-USER_ID'];
    let index = req.body.index;
    let data = userId? JSON.parse((await database.selectUserId(userId))[0]['data']) : null;

    data = data.filter((element)=>element.index!=index);
    data = data.map((element, index)=>({...element, index}));

    await database.updateUser(userId, data);

    res.json(data);
}

module.exports = {
    getData,
    generateHorarios,
    regenerateHorarios,
    saveHorarioUser,
    getSavedHorariosUser,
    unsaveHorarioUser
}