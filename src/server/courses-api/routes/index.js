var express = require('express');
var app = express();
var path=require("path");

/* GET home page. */

app.get('/', function(req, res){
        res.sendFile(path.join(__dirname + '/../../../webapp/index.html'));
});

module.exports = app;
