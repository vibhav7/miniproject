/* * ************************************************************ 
 * Date: 2 Sep, 2018
 * programmer: Shani Mahadeva <shani.mahadeva@blumatter.com>
 * Company : BluMatter Inc.
 * Javascript file ap.js
 * *************************************************************** */


var modulename = 'Main';

// Lib
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var async = require("async");
var http = require('http');

// Deps
// App Setup
var app = express();
app.enable('strict routing');

// Post data parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//this resolve cors error
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next();
})

// Compression
app.use(require('compression')({threshold: 2048}));

// Request Logging
app.use(require('morgan')(
    function (tokens, req, res) {
        return [
            new Date().toISOString(),
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            "'IP",
            tokens['remote-addr'](req,res),
            "GOT",
            tokens.res(req, res, 'content-length'), 
            "bytes IN",
            tokens['response-time'](req, res)+"ms'"
        ].join(' ');
    },{
        skip : function(req,res){  return req.url.match(/^\/(js|css|html|img)/); }
    })
);

var routes = require("./routes");
    
routes.init(app);

// Crash event handling
process.on('unhandledRejection', (reason, p) => { 
    console.log("APP",reason);
});

process.on('uncaughtException', (err) => { 
    console.log("APP",err);
});
