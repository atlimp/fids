const path = require('path');
const express = require('express');
const flights = require('./flights');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', flights);

function notFoundHandler(req, res, next) {
  return res.status(404).render('error.pug', { error: '404 Not Found', title: 'Error' });
}

function errorHandler(err, res, res, next) {
  console.error(err);
  return res.status(500).render('error.pug', { error: '500 Internal Server Error', title: 'Error' });
}

app.use(notFoundHandler);
app.use(errorHandler);

const {
  PORT: port = 3000,
  HOST: host = '127.0.0.1',
} = process.env;
app.listen(port, () => {
  console.info(`Server running http://${host}:${port}`);
});
