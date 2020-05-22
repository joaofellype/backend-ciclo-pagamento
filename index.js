const express = require('express');
require('dotenv').config()
const bodyParse = require('body-parser');
const cors =  require('cors')
const app =express();
require('./src/database/index')
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended:true}));
app.use(cors())
require('./src/rotas/route')(app)
app.listen(3003,function(){
    console.log('Esta rodando o servidor')
})