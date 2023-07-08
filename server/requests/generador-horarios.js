function getHorario(server, asignaturas){
    return new Promise((resolve, reject)=>{
        getClases(server, asignaturas).then((clases)=>{
            //console.log('etapa 1');
            getHorarios(server, clases).then((horarios)=>{
                //console.log('etapa 2');
                getCombinations(clases).then((combinacionesClases)=>{
                    //console.log('etapa 3');
                    getCombinations(horarios).then((combinacionesHorarios)=>{
                        //console.log('etapa 4');
                        getCoincidences(combinacionesHorarios).then((coincidencias)=>{
                            //console.log('etapa 5');
                            //console.log(clases);
                            //console.log(horarios);
                            //console.log(combinacionesClases);
                            //console.log(combinacionesHorarios);
                            //console.log(coincidencias);
                            discardCoincidences(combinacionesClases, coincidencias).then((clasesFiltradas)=>{
                                //console.log('etapa 6');
                                discardCoincidences(combinacionesHorarios, coincidencias).then((horariosFiltrados)=>{
                                    //console.log('etapa 7');
                                    //console.log(clasesFiltradas);
                                    //console.log(horariosFiltrados);

                                    getHorasLibres(horariosFiltrados).then((horasLibres)=>{
                                        console.log(horasLibres);

                                        sort(clasesFiltradas, horasLibres).then((clasesOrdenadas)=>{
                                            console.log(clasesOrdenadas);
                                            sort(horariosFiltrados, horasLibres).then((horariosOrdenados)=>{
                                                console.log(horariosOrdenados);
                                                createHorario(server, clasesOrdenadas, horariosOrdenados, horasLibres).then((horario)=>{
                                                    //console.log(horario);
                                                    resolve(horario);
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

function getClases(server, asignaturas){
    return new Promise(async(resolve, reject)=>{
        let clases = [];

        for(let i=0; i<asignaturas.length; i++){
            let data = await getClasesAsignatura(server, asignaturas[i]);
            clases.push(data);

            if(i == asignaturas.length-1){
                resolve(clases);
            }
        }
    });
}

function getClasesAsignatura(server, asignatura){
    return new Promise((resolve, reject)=>{
        let request =
        `SELECT id FROM clases WHERE id_asignaturas = '${asignatura}'`;

        server.query(request, (error, result)=>{
            if(error) throw error;
            let data = [];
            if(result.length > 0){
                for(let i=0; i<result.length; i++){
                    data[i] = result[i]['id'];
    
                    if(i == result.length-1){
                        resolve(data);
                    }
                }
            }else{
                resolve(data);
            }
        });
    });
}

function getHorarios(server, clases){
    return new Promise(async(resolve, reject)=>{
        let horarios = [];

        for(let i=0; i<clases.length; i++){
            horarios[i] = [];

            for(let j=0; j<clases[i].length; j++){
                let data = await getHorariosClase(server, clases[i][j]);
                horarios[i].push(data);

                if(i == clases.length-1 && j == clases[i].length-1){
                    resolve(horarios);
                }
            }
        }
    });
}

function getHorariosClase(server, clase){
    return new Promise((resolve, reject)=>{
        let request =
        `SELECT id_horarios FROM horarios_clases WHERE id_clases = '${clase}'`;

        server.query(request, (error, result)=>{
            if(error) throw error;
            let data = [];
            if(result.length > 0){
                for(let i=0; i<result.length; i++){
                    data[i] = result[i]['id_horarios'];
    
                    if(i == result.length-1){
                        resolve(data);
                    }
                }
            }else{
                resolve(data);
            }
        });
    });
}

function getCombinations(args){
    return new Promise((resolve, reject)=>{
        var r = [], max = args.length-1;
        function helper(arr, i) {
            if(args[i].length > 0){
                for (var j=0, l=args[i].length; j<l; j++) {
                    var a = arr.slice(0); // clone arr
                    a.push(args[i][j]);
                    if (i==max)
                        r.push(a);
                    else
                        helper(a, i+1);
                }
            }else{
                var a = arr.slice(0);
                if (i==max)
                    r.push(a);
                else
                    helper(a, i+1);
            }
        }
        helper([], 0);
        resolve(r);
    });
}

function getCoincidences(args){
    return new Promise(async(resolve, reject)=>{
        let coincidences = [];

        for(let i=0; i<args.length; i++){
            let data = [];

            for(let j=0; j<args[i].length; j++){
                data.push(args[i][j]);
            }

            let combinations = await getCombinations(data);

            let coincidenceFound = false;

            for(let j=0; j<combinations.length; j++){
                for(let k=0; k<combinations[j].length; k++){
                    if(combinations[j].indexOf(combinations[j][k]) != k){
                        coincidences.push(i);
                        coincidenceFound = true;
                        break;
                    }
                }

                if(coincidenceFound){
                    break;
                }
            }
        }

        resolve(coincidences);
    });
}

function discardCoincidences(args, coincidences){
    return new Promise(async(resolve, reject)=>{
        let removed = 0;

        for(let i=0; i<coincidences.length; i++){
            args.splice(coincidences[i]-removed, 1);
            removed++
        }

        resolve(args);
    });
}

function getHorasLibres(args){
    return new Promise(async(resolve, reject)=>{
        let best = [];

        for(let i=0; i<args.length; i++){
            let data = [];

            for(let j=0; j<args[i].length; j++){
                data = data.concat(args[i][j]);
            }

            data.sort((a, b) => a - b);

            let week = [[],[],[],[],[]];
            
            for(let j=0; j<data.length; j++){
                if(data[j] >= 1 && data[j] <= 10){
                    week[0].push(data[j]);
                }

                if(data[j] >= 11 && data[j] <= 20){
                    week[1].push(data[j]);
                }

                if(data[j] >= 21 && data[j] <= 30){
                    week[2].push(data[j]);
                }

                if(data[j] >= 31 && data[j] <= 40){
                    week[3].push(data[j]);
                }

                if(data[j] >= 41 && data[j] <= 50){
                    week[4].push(data[j]);
                }
            }

            best[i] = 0;

            for(let j=0; j<week.length; j++){
                if(week[j].length > 0){
                    for(let k=week[j][0]; k<week[j][week[j].length-1]; k++){
                        if(!week[j].includes(k)){
                            best[i]++;
                        }
                    }
                }
            }
        }

        resolve(best);
    });
}

function sort(args, horasLibres){
    return new Promise(async(resolve, reject)=>{
        let sort = [];

        for(let i=0; i<args.length; i++){
            sort.push({
                number: horasLibres[i],
                key: args[i]
            });
        }

        sort.sort((a ,b)=> a.number - b.number);

        let sorted = [];

        for(let i=0; i<sort.length; i++){
            sorted.push(sort[i].key);
        }

        resolve(sorted);
    });
}

function createHorario(server, clases, horarios, horasLibres){
    return new Promise(async(resolve, reject)=>{
        let tablaHorarios = [];
        let loop;

        horasLibres.sort((a, b)=> a - b);

        if(clases.length > 20){
            loop =10;
        }
        else{
            loop = clases.length;
        }

        for(let i=0; i<loop; i++){
            let horario = {
                clases: [],
                horas: horasLibres[i]
            };

            for(let j=0; j<clases[i].length; j++){
                let clase = await createClase(server, clases[i][j], horarios[i][j]);

                if(clase){
                    horario.clases.push(clase);
                }
            }

            tablaHorarios.push(horario);
        }

        resolve(tablaHorarios);
    });
}

function createClase(server, idClase, horario){
    return new Promise(async(resolve, reject)=>{
        let info = await getInfoClase(server, idClase);
        let week = await createWeek(server, horario);

        if(week){
            let clase = {
                id: info[0]['id'],
                grupo: info[0]['grupo'],
                asignatura: info[0]['asignatura'],
                profesor: info[0]['profesor'],
                horaLunes: week[0]['lunes'],
                horaMartes: week[0]['martes'],
                horaMiercoles: week[0]['miercoles'],
                horaJueves: week[0]['jueves'],
                horaViernes: week[0]['viernes']
            }
    
            resolve(clase);
        }
        else{
            resolve();
        }
    });
}

function getInfoClase(server, idClase){
    return new Promise((resolve, reject)=>{
        let request =
        `SELECT clases.id, clases.grupo, asignaturas.nombre AS asignatura, profesores.nombre AS profesor
        FROM clases AS clases
        INNER JOIN asignaturas AS asignaturas
        ON clases.id_asignaturas = asignaturas.id
        INNER JOIN profesores AS profesores
        ON clases.id_profesores = profesores.id
        WHERE clases.id = '${idClase}'`;
    
        server.query(request, (error, result)=>{
            if(error) throw error;
            let data = result;
            resolve(data);
        });
    });
}

function createWeek(server, horario){
    return new Promise((resolve, reject)=>{
        let week = [];

        let dias = {
            lunes: '',
            martes: '',
            miercoles: '',
            jueves: '',
            viernes: ''
        };

        let horas = [
            '',
            '7:00 - 8:30',
            '8:30 - 10:00',
            '10:00 - 11:30',
            '11:30 - 13:00',
            '13:00 - 14:30',
            '14:30 - 16:00',
            '16:00 - 17:30',
            '17:30 - 19:00',
            '19:00 - 20:30',
            '20:30 - 22:00'
        ];

        for(let i=0; i<horario.length; i++){
            if(horario[i] >= 1 && horario[i] <= 10){
                dias.lunes += horas[horario[i]];
            }

            if(horario[i] >= 11 && horario[i] <= 20){
                dias.martes += horas[horario[i]-10]; 
            }

            if(horario[i] >= 21 && horario[i] <= 30){
                dias.miercoles += horas[horario[i]-20]; 
            }

            if(horario[i] >= 31 && horario[i] <= 40){
                dias.jueves += horas[horario[i]-30]; 
            }

            if(horario[i] >= 41 && horario[i] <= 50){
                dias.viernes += horas[horario[i]-40]; 
            }

            if(i == horario.length-1){
                week.push(dias);
                resolve(week);
            }
        }

        if(horario.length == 0){
            resolve();
        }
    });
}

module.exports = {
    getHorario,
    getClases
}