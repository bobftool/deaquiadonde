/**
 * Asks for the current time of the server
 */
function getCurrentTime(server){
    return new Promise((resolve, reject)=>{
        var request =
        'SELECT CURRENT_TIME()';
    
        server.query(request, (error, result)=>{
            if(error) throw error;
            var data = result[0]['CURRENT_TIME()'];
            resolve(data);
        });
    });
}

/**
 * Asks for the current day of week of the server
 */
function getCurrentDayOfWeek(server){
    return new Promise((resolve, reject)=>{
        var request =
        'SELECT DAYOFWEEK(CURDATE())';
    
        server.query(request, (error, result)=>{
            if(error) throw error;
            var data = result[0]['DAYOFWEEK(CURDATE())'];
            resolve(data);
        });
    });
}

/**
 * After receiving the information of the current time and day of week, asks for the 'id' column of the item in the 'horarios' database that matches with that information
 */
function getCurrentSchedule(server){
    return new Promise((resolve, reject)=>{
        getCurrentTime(server).then((currentTime)=>{
            getCurrentDayOfWeek(server).then((currentDayOfWeek)=>{
                /*/ ONLY FOR TEST PURPOSES
                currentTime = '09:00:00';
                currentDayOfWeek = 2;
                //*/
                var schedulesTable =
                `SELECT *
                FROM horarios
                WHERE id_dias = ${currentDayOfWeek}`;
    
                var hoursTable =
                `SELECT *
                FROM horas
                WHERE '${currentTime}'
                BETWEEN TIME_FORMAT(hora_inicio, "%H:%i:%s")
                AND TIME_FORMAT(hora_final, "%H:%i:%s")`;
    
                var request =
                `SELECT horarios.id, id_dias, hora_inicio, hora_final
                FROM (${schedulesTable}) AS horarios
                INNER JOIN (${hoursTable}) AS horas
                ON horarios.id_horas = horas.id`;
        
                server.query(request, (error, result)=>{
                    var data = -1;
                    if(error) throw error;
                    if(result.length > 0) data = result[0]['id'];
                    resolve(data);
                });
            });
        });
    });
}


/**
 * After obtaining the current schedule, asks for the 'id_aulas' column of the items in the 'horarios_aulas' database that matches with the current schedule
 */
function getCurrentClassrooms(server){
    return new Promise((resolve, reject)=>{
        getCurrentSchedule(server).then((currentSchedule)=>{
            var classroomsTable =
            `SELECT id_aulas
            FROM horarios_aulas
            WHERE id_horarios = ${currentSchedule}`;
    
            var request =
            `SELECT id, edificio, piso, salon, capacidad
            FROM aulas AS classroomsInfo
            INNER JOIN (${classroomsTable}) AS classroomsId
            ON classroomsInfo.id = classroomsId.id_aulas`;
        
            server.query(request, (error, result)=>{
                if(error) throw error;
                var data = result;
                resolve(data);
            });
        });
    });
}

module.exports = {
    getCurrentTime,
    getCurrentDayOfWeek,
    getCurrentSchedule,
    getCurrentClassrooms
};

/**
 * COMMAND FOR TESTING:
 * node server\requests\aulas-libres.js
 */