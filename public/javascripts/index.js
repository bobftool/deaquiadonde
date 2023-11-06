function like(id){
    fetch('/like', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            idHorariosAulas: id,
        }),
        credentials: 'same-origin'
    }).then(()=>{
        if(document.getElementById(`imagen-like_${id}`).src.includes("images/like_unselected.png")){
            document.getElementById(`imagen-like_${id}`).src = "images\\like_selected.png"
        }
        else{
            document.getElementById(`imagen-like_${id}`).src = "images\\like_unselected.png"
        }
        
        document.getElementById(`imagen-dislike_${id}`).src = "images\\dislike_unselected.png";
    });
}

function dislike(id){
    fetch('/dislike', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            idHorariosAulas: id,
        }),
        credentials: 'same-origin'
    }).then(()=>{
        if(document.getElementById(`imagen-dislike_${id}`).src.includes("images/dislike_unselected.png")){
            document.getElementById(`imagen-dislike_${id}`).src = "images\\dislike_selected.png"
        }
        else{
            document.getElementById(`imagen-dislike_${id}`).src = "images\\dislike_unselected.png"
        }

        document.getElementById(`imagen-like_${id}`).src = "images\\like_unselected.png";
    });
}