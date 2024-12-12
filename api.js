const express = require('express');
let config = require('./config.json');
let app = express();

config.api.ip = config.api.ip == '' ? 'localhost' : config.api.ip;

app.get('/', function (req, res) {
	res.send('Visit /user/0 or /users/0-2');
});

app.get('/get/:category', function (req, res) {
	res.send(require('./src/build/local.json')[req.params.category]);
});

app.get('/get/:category/:subCategory', function (req, res) {
	res.send(require('./src/build/local.json')[req.params.category][req.params.subCategory]);
});

app.get('/get/:category/:subCategory/:underCategory', function (req, res) {
	res.send(require('./src/build/local.json')[req.params.category][req.params.subCategory][req.params.underCategory]);
});

app.get('/get/:category/:subCategory/:underCategory/:endCategory', function (req, res) {
	res.send(require('./src/build/local.json')[req.params.category][req.params.subCategory][req.params.underCategory][req.params.endCategory]);
});

app.listen(config.api.port);
console.log(`Server start on: http://${config.api.ip}:${config.api.port}`);
