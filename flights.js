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
  const airlines = await getAirlines();

  const keys = Object.keys(arrivals);

  res.render('table', { keys, arrivals, departures, airlines });
}

async function byAirline(req, res, next) {
  const { slug } = req.params;

  const arrivals = await getArrivals(slug);
  const departures = await getDepartures(slug);
  const stats = await getStats(slug);
  const airlines = await getAirlines();

  const keys = Object.keys(arrivals);

  return res.render('table', { keys, arrivals, departures, stats, airlines });
}

router.get('/', catchErrors(getAll));
router.get('/:slug', catchErrors(byAirline));

module.exports = router;
