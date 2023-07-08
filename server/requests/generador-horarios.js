function getHorario(server, asignaturas){
    return new Promise(async(resolve, reject)=>{
        console.log('ETAPA 1:');
        console.log('buscando clases...');
        let clases = await getClases(server, asignaturas);
        let horarios = await getHorarios(server, clases);
        console.log('se encontraron '+clases.length+' clases.');

        console.log('ETAPA 2:');
        console.log('buscando combinaciones...')
        let combinacionesClases = await getCombinations(clases);
        let combinacionesHorarios = await getCombinations(horarios);
        console.log('se encontraron '+combinacionesClases.length+' combinaciones posibles.');

        console.log('ETAPA 3:');
        console.log('buscando y descartando coincidencias...');
        let clasesFiltradas = await getCoincidences(combinacionesHorarios, combinacionesClases);
        let horariosFiltrados = await getCoincidences(combinacionesHorarios, combinacionesHorarios);
        console.log('se obtuvieron '+clasesFiltradas.length+' clases.');

        /*
        console.log('ETAPA 4:');
        console.log('filtrando clases...');
        let clasesFiltradas = await discardCoincidences(combinacionesClases, coincidencias);
        let horariosFiltrados = await discardCoincidences(combinacionesHorarios, coincidencias);
        console.log('se obtuvieron '+clasesFiltradas.length+' clases.');
        */

        console.log('ETAPA 4:');
        console.log('obteniendo horas libres...');
        let horasLibres = await getHorasLibres(horariosFiltrados);
        console.log('se obtuvieron las horas libres de '+clasesFiltradas.length+' clases.');

        console.log('ETAPA 5:');
        console.log('ordenando clases...');
        let clasesOrdenadas = await sort(clasesFiltradas, horasLibres);
        let horariosOrdenados = await sort(horariosFiltrados, horasLibres);
        console.log('se ordenaron '+clasesFiltradas.length+' clases.');

        console.log('ETAPA 6:');
        console.log('generando horarios...');
        let tablaHorarios = await createHorarios(server, clasesOrdenadas, horariosOrdenados, horasLibres);
        console.log('se generaron '+tablaHorarios.length+' horarios.');

        resolve(tablaHorarios);
    });
}

function getClases(server, asignaturas){
    return new Promise(async(resolve, reject)=>{
        let clases = [];

        for(let i=0, n=asignaturas.length; i<n; i++){
            let data = await getClasesAsignatura(server, asignaturas[i]);
            clases.push(data);
        }

        resolve(clases);
    });
}

function getClasesAsignatura(server, asignatura){
    return new Promise((resolve, reject)=>{
        let request =
        `SELECT id FROM clases WHERE id_asignaturas = '${asignatura}'`;

        server.query(request, async(error, result)=>{
            if(error) throw error;
            let data = [];

            for(let i=0, n=result.length; i<n; i++){
                data[i] = result[i]['id'];
            }

            resolve(data);
        });
    });
}

function getHorarios(server, clases){
    return new Promise(async(resolve, reject)=>{
        let horarios = [];

        for(let i=0, n=clases.length; i<n; i++){
            horarios[i] = [];

            for(let j=0, m=clases[i].length; j<m; j++){
                let data = await getHorariosClase(server, clases[i][j]);
                horarios[i].push(data);
            }
        }

        resolve(horarios);
    });
}

function getHorariosClase(server, clase){
    return new Promise((resolve, reject)=>{
        let request =
        `SELECT id_horarios FROM horarios_clases WHERE id_clases = '${clase}'`;

        server.query(request, async(error, result)=>{
            if(error) throw error;
            let data = [];

            for(let i=0, n=result.length; i<n; i++){
                data[i] = result[i]['id_horarios'];
            }

            resolve(data);
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

function getCoincidences(args, filter){
    return new Promise(async(resolve, reject)=>{
        //let coincidences = [];
        let argsFiltered = [];

        for(let i=0, n=args.length; i<n; i++){
            let data = [];

            for(let j=0, m=args[i].length; j<m; j++){
                data = data.concat(args[i][j]);
            }

            data.sort((a, b)=> a - b);

            for(let j=0, m=data.length-1; j<m; j++){
                if(data[j] == data[j+1]){
                    //coincidences.push(i);
                    break;
                }
                else if(j == m-1){
                    argsFiltered.push(filter[i]);
                }
            }
        }

        resolve(argsFiltered);
    });
}

function discardCoincidences(args, coincidences){
    return new Promise(async(resolve, reject)=>{
        /*
        let removed = 0;

        for(let i=0, n=coincidences.length; i<n; i++){
            args.splice(coincidences[i]-removed, 1);
            removed++
        }
        */

        let argsFiltered = [];

        for(let i=0, n=args.length; i<n; i++){
            if(!coincidences.includes(i)){
                argsFiltered.push(args[i]);
                coincidences.splice(coincidences.indexOf(i), 1);
            }
        }

        resolve(argsFiltered);
    });
}

function getHorasLibres(args){
    return new Promise(async(resolve, reject)=>{
        let horasLibres = [];

        for(let i=0, n=args.length; i<n; i++){
            let data = [];

            for(let j=0, m=args[i].length; j<m; j++){
                data = data.concat(args[i][j]);
            }

            data.sort((a, b) => a - b);

            let week = [[],[],[],[],[]];
            
            for(let j=0, m=data.length; j<m; j++){
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

            horasLibres[i] = 0;

            for(let j=0, m=week.length; j<m; j++){
                if(week[j].length > 0){
                    for(let k=week[j][0], p=week[j][week[j].length-1]; k<p; k++){
                        if(!week[j].includes(k)){
                            horasLibres[i]++;
                        }
                    }
                }
            }
        }

        resolve(horasLibres);
    });
}

function sort(args, horasLibres){
    return new Promise(async(resolve, reject)=>{
        let sort = [];

        for(let i=0, n=args.length; i<n; i++){
            sort.push({
                number: horasLibres[i],
                key: args[i]
            });
        }

        sort.sort((a ,b)=> a.number - b.number);

        let sorted = [];

        for(let i=0, n=sort.length; i<n; i++){
            sorted.push(sort[i].key);
        }

        resolve(sorted);
    });
}

function createHorarios(server, clases, horarios, horasLibres){
    return new Promise(async(resolve, reject)=>{
        let tablaHorarios = [];
        let n;

        horasLibres.sort((a, b)=> a - b);

        if(clases.length > 20){
            n = 10;
        }
        else{
            n = clases.length;
        }

        for(let i=0; i<n; i++){
            let horario = {
                clases: [],
                horas: horasLibres[i]
            };

            for(let j=0, m=clases[i].length; j<m; j++){
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

        for(let i=0, n=horario.length; i<n; i++){
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

            if(i == n-1){
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