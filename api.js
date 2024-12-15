const express = require('express');
let config = require('./config.json');
let app = express();

config.api.ip = config.api.ip == '' ? 'localehost' : config.api.ip;

app.get('/', function (req, res) {
	res.send('Hello');
});

app.get('/info.json', function (req, res) {
	res.send({ status: '🟢 Online', version: require('./package.json').version });
});

app.get('/get', function (req, res) {
	res.send(require('./src/build/locale.json'));
});

app.get('/get/:category', function (req, res) {
	res.send(require('./src/build/locale.json')[req.params.category]);
});

app.get('/get/:category/:subCategory', function (req, res) {
	res.send(require('./src/build/locale.json')[req.params.category][req.params.subCategory]);
});

app.get('/get/:category/:subCategory/:underCategory', function (req, res) {
	res.send(require('./src/build/locale.json')[req.params.category][req.params.subCategory][req.params.underCategory]);
});

app.get('/get/:category/:subCategory/:underCategory/:endCategory', function (req, res) {
	res.send(require('./src/build/locale.json')[req.params.category][req.params.subCategory][req.params.underCategory][req.params.endCategory]);
});

app.listen(config.api.port);
console.log(`Server started on: http://${config.api.ip}:${config.api.port}`);
