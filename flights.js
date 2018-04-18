const express = require('express');

const {
  getArrivals,
  getDepartures,
  getAirlines,
  getStats,
} = require('./fetch');

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

const router = express.Router();

async function getAll(req, res) {
  const arrivals = await getArrivals();
  const departures = await getDepartures();
  const stats = await getStats();
  const airlines = await getAirlines();

  const keys = Object.keys(arrivals);

  res.render('table', { keys, arrivals, departures, airlines, stats, title: 'All' });
}

async function byAirline(req, res, next) {
  const { slug } = req.params;

  const arrivals = await getArrivals(slug);
  const departures = await getDepartures(slug);
  const stats = await getStats(slug);
  const airlines = await getAirlines();

  const keys = Object.keys(arrivals);

  const [{ airline: title }] = airlines.filter(el => el.slug === slug);
  console.log(title);

  return res.render('table', { keys, arrivals, departures, stats, airlines, title });
}

router.get('/', catchErrors(getAll));
router.get('/:slug', catchErrors(byAirline));

module.exports = router;
