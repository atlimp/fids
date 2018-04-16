const express = require('express');
const {
  getDepartures,
  getArrivals,
  getAirlines,
  getStats,
} = require('./fetch');

const app = express();

const {
  PORT: port = 3000,
  HOST: host = '127.0.0.1',
} = process.env;

app.get('/', (req, res) => {
  res.status(200).json({
    arrivals: '/arrivals',
    departures: '/departures',
    byAirline: '/{arrivals, departures}/:airline',
    airlines: '/airlines',
    stats: '/stats',
  });
});


app.get('/arrivals/', async (req, res) => {
  const arrivals = await getArrivals();
  res.status(200).json(arrivals);
});

app.get('/arrivals/:airline', async (req, res) => {
  const { airline } = req.params;
  const arrivals = await getArrivals(airline);
  res.status(200).json(arrivals);
});

app.get('/departures/', async (req, res) => {
  const arrivals = await getArrivals();
  res.status(200).json(arrivals);
});

app.get('/departures/:airline', async (req, res) => {
  const { airline } = req.params;
  const arrivals = await getArrivals(airline);
  res.status(200).json(arrivals);
});

app.get('/airlines', async (req, res) => {
  const airlines = await getAirlines();
  res.status(200).json(airlines);
});

app.get('/stats', async (req, res) => {
  const stats = await getStats();
  res.status(200).json(stats);
});

app.listen(port, () => {
  console.info(`Server running http://${host}:${port}`);
});
