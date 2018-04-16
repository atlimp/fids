const express = require('express');

const {
  getDepartures,
  getArrivals,
  getAirlines,
  getStats,
} = require('./fetch');

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

const router = express.Router();

async function arrivalRoute(req, res) {
  const arrivals = await getArrivals();
  res.status(200).render('table.pug', { rows: arrivals, title: 'Arrivals' });
}

async function arrivalAirlineRoute(req, res) {
  const { airline } = req.params;
  const arrivals = await getArrivals(airline);
  res.status(200).render('table.pug', { rows: arrivals, title: 'Arrivals' });
}

async function departureRoute(req, res) {
  const departures = await getDepartures();
  res.status(200).render('table.pug', { rows: departures, title: 'Departures' });
}

async function departureAirlineRoute(req, res) {
  const { airline } = req.params;
  const departures = await getDepartures(airline);
  res.status(200).render('table.pug', { rows: departures, title: 'Departures' });
}

async function airlineRoute(req, res) {
  const airlines = await getAirlines();
  res.status(200).json(airlines);
}

async function statsRoute(req, res) {
  const stats = await getStats();
  res.status(200).json(stats);
}

router.get('/arrivals', catchErrors(arrivalRoute));
router.get('/arrivals/:airline', catchErrors(arrivalAirlineRoute));
router.get('/departures', catchErrors(departureRoute));
router.get('/departures/:airline', catchErrors(departureAirlineRoute));
router.get('/airlines', catchErrors(airlineRoute));
router.get('/stats', catchErrors(statsRoute));

module.exports = router;
