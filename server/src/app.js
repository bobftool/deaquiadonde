require('dotenv').config();
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5000;
const app = express();

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const updateRouter = require('./routes/update');
const horariosRouter = require('./routes/horarios');

/*
const allowedOrigins = [
    'http://localhost:3000',
    'https://deaquiadonde.com'
];
*/

app.use(cors({
    /*
    origin: (origin, callback)=>{
        if(allowedOrigins.includes(origin)){
            return callback(null, true);
        }

        if(!origin){
            return callback(null, true);
        }
    },
    */
    origin: (origin, callback)=>{
        return callback(null, true);
    },
    credentials: true
}));


app.use(express.json());
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/update', updateRouter);
app.use('/horarios', horariosRouter);

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});