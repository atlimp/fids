const express = require('express');
const flights = require('./flights');

const app = express();


app.get('/', (req, res) => {
  res.status(200).json({
    arrivals: '/arrivals',
    departures: '/departures',
    byAirline: '/{arrivals, departures}/:airline',
    airlines: '/airlines',
    stats: '/stats',
  });
});

app.use('/', flights);

function notFoundHandler(req, res, next) {
  return res.status(404).json({ error: '404-Not Found' });
}

function errorHandler(err, res, res, next) {
  return res.status(500).json({ error: '500-Internal Server Error'});
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
