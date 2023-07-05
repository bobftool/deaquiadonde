function getHorario(server, asignaturas){
    return new Promise((resolve, reject)=>{
        getClases(server, asignaturas).then((clases)=>{
            getHorarios(server, clases).then((horarios)=>{
                getCombinations(clases).then((combinacionesClases)=>{
                    getCombinations(horarios).then((combinacionesHorarios)=>{
                        getCoincidences(combinacionesHorarios).then((coincidencias)=>{
                            discardCoincidences(combinacionesHorarios, coincidencias).then((horariosFiltrados)=>{
                                console.log(clases);
                                console.log(horarios);
                                console.log(combinacionesClases);
                                console.log(combinacionesHorarios);
                                console.log(coincidencias);
                                console.log(horariosFiltrados);
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
    return new Promise((resolve, reject)=>{
        console.log(args);
        for(let i=0; i<coincidences.length; i++){
            args.splice(coincidences[i], 1);
            console.log(args);
        }

        resolve(args);
    });
}

module.exports = {
    getHorario,
    getClases
}