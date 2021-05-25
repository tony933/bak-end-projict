require('dotenv').config();
const express = require('express'),
    app = express(),
    port = 7000;
     bodyParser = require('body-parser'),
//===========
// Middleware
//===========
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(express.static(__dirname + '/public'));

    // app.use((req , res , next)=>{
    //     if(!req.is('application/json'))
    //         return res.status(400).json({error: "\' Request \' the type of request is not supported!"});
    //     next();
    // })
//===========
//  Routes
//===========
app.use('/', require("./route/routes"));

//===========
//  CONECTIN PORT
//===========
app.listen(port, () => {
    console.log("it work") 


})