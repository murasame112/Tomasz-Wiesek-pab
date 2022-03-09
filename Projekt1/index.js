var express = require('express');
var app = express();
app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/dodaj/:num/:secnum', function (req, res) {
    
    
    let num1 = parseInt(req.params.num, 10);
    let num2 = parseInt(req.params.secnum, 10);
    let result = num1 + num2
    
    res.send(result+'');

});

app.get('/odejmij', function (req, res) {
    let result = req.query.num1 - req.query.num2
   
    res.send(result+'');
});

app.get('/pomnoz', function (req, res) {
    let result = req.query.num1 * req.query.num2
   
    res.send(result+'');
});


app.get('/podziel', function (req, res) {
    let result = req.query.num1 / req.query.num2
   
    res.send(result+'');
});





app.listen(3000);
