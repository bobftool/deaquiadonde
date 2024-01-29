async function getLogin(){
    const response = await fetch(process.env.SAES_API_URL + '/login');
    const data = await response.json();

    return data;
}

async function postLogin(session, loginData){
    const response = await fetch(process.env.SAES_API_URL + '/login', {
        method: 'POST',
        headers: {
            session,
            "Content-Type": "application/json",
          },
        body: JSON.stringify(loginData),
    });
    const data = await response.json();

    return data;
}

async function getUserInfo(credentials){
    const response = await fetch(process.env.SAES_API_URL + '/user/info', {
        method: 'GET',
        headers: { ...credentials }
    });
    const data = await response.json();

    return data;
}

async function getGeneralHorarios(credentials){
    const response = await fetch(process.env.SAES_API_URL + '/general/horarios', {
        method: 'GET',
        headers: { ...credentials }
    });
    const data = await response.json();

    return data;
}

async function getGeneralAsignaturas(credentials){
    const response = await fetch(process.env.SAES_API_URL + '/general/asignaturas', {
        method: 'GET',
        headers: { ...credentials }
    });
    const data = await response.json();

    return data;
}

module.exports = {
    getLogin,
    postLogin,
    getUserInfo,
    getGeneralHorarios,
    getGeneralAsignaturas
}