const saes_api = require('../services/saes-api');

async function getCaptcha(req, res){
    const data = await saes_api.getLogin();

    res.cookie('saes-api_SESSION', data.credential, {
        secure: true,
        sameSite: 'none'
    });
    res.json(data.captcha);
}

async function login(req, res){
    const session = req.cookies['saes-api_SESSION'];
    const loginData = { ...req.body }
    const data = await saes_api.postLogin(session, loginData);

    if(data.credentials){
        res.cookie('saes-api_LOGIN', data.credentials.login, {
            secure: true,
            sameSite: 'none',
            expires: new Date(data.expires)
        });
        res.cookie('saes-api_SESSION', data.credentials.session, {
            secure: true,
            sameSite: 'none'
        });
        res.json({isLogged: true});
    }
    else{
        res.json({isLogged: false, message: data.message});
    }
}

async function checkLogin(req, res){
    const credentials = {
        login: req.cookies['saes-api_LOGIN'],
        session: req.cookies['saes-api_SESSION']
    };
    const data = await saes_api.getUserInfo(credentials);
    
    if(data.message) res.json({isLogged: false});
    else res.json({isLogged: true});
}

module.exports = {
    getCaptcha,
    login,
    checkLogin
}