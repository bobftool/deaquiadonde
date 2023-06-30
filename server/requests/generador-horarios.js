function getHorario(server, asignaturas){
    return new Promise((resolve, reject)=>{
        getCombinations(asignaturas).then((combinaciones)=>{
            
        });
    });
}

function getCombinations(args){
    return new Promise((resolve, reject)=>{
        var r = [], max = args.length-1;
        function helper(arr, i) {
            for (var j=0, l=args[i].length; j<l; j++) {
                var a = arr.slice(0); // clone arr
                a.push(args[i][j]);
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

module.exports = {
    getHorario
}