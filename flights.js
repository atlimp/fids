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

async function getRoot(req, res) {
  const airlines = await getAirlines();
  res.render('index.pug', { airlines });
}

async function getAll(req, res) {
  const arrivals = await getArrivals();
  const departures = await getDepartures();

  const keys = Object.keys(arrivals);

  res.render('table', { keys, arrivals, departures });
}

async function byAirline(req, res, next) {
  const { slug } = req.params;

  const arrivals = await getArrivals(slug);
  const departures = await getDepartures(slug);
  const stats = await getStats(slug);

  const keys = Object.keys(arrivals);

  if (keys.length === 0) return next();

  return res.render('table', { keys, arrivals, departures, stats });
}

router.get('/', catchErrors(getRoot));
router.get('/all', catchErrors(getAll));
router.get('/:slug', catchErrors(byAirline));

module.exports = router;
