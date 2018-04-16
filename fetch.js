require('isomorphic-fetch');

async function get(url) {
  const response = await fetch(url);
  if (response.status !== 200) return null;
  const data = await response.text();
  return data;
}

function filter(info) {
  const {
    flight_no,
    type,
    airline,
    origin_iata: origin,
    destination_iata: destination,
    scheduled_time: scheduled,
    estimated_time: estimated,
    gate,
    stand,
    display_status: status,
    belt,
    aircraft
  } = info;

  return {
    flight_no,
    type,
    airline,
    origin,
    destination,
    scheduled,
    estimated,
    gate,
    stand,
    status,
    belt,
    aircraft,
  };
}

async function getData(url) {
  const text = await get(url);
  const data = JSON.parse(text).map(el => filter(el));
  return data;
}

async function getArrivals(s) {
  let arrivals = await getData('https://isavia.is/fids/arrivals.aspx');

  if (s) arrivals = arrivals.filter(el => {
    return el.airline.toLowerCase().replace(/\s+/g, '_') === s;
  });

  return arrivals;
}

async function getDepartures(s) {
  let departures = await getData('https://isavia.is/fids/departures.aspx');

  if (s) departures = departures.filter(el => {
    return el.airline.toLowerCase().replace(/\s+/g, '_') === s;
  });

  return departures;
}

async function getAirlines() {
  const arrivals = await getArrivals();
  const departures = await getDepartures();

  const data = arrivals.concat(departures);
  const set = new Set();

  data.forEach((el) => {
    const airline = el.airline.toLowerCase().replace(/\s+/g, '_');
    set.add(airline);
  });

  return Array.from(set);
}

async function getStats() {
  const airlines = await getAirlines();
  const stats = [];

  for (let i = 0; i < airlines.length; i++) {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));

    const arrivals = await getArrivals(airlines[i]);
    const departures = await getDepartures(airlines[i]);

    const todayArrivals = arrivals.filter(el => {
      const date = new Date(el.scheduled);
      return today.getFullYear() === date.getFullYear() &&
        today.getMonth() === date.getMonth() &&
        today.getDate() === date.getDate();
    });

    const tomorrowArrivals = arrivals.filter(el => {
      const date = new Date(el.scheduled);
      return tomorrow.getFullYear() === date.getFullYear() &&
        tomorrow.getMonth() === date.getMonth() &&
        tomorrow.getDate() === date.getDate();
    });

    const todayDepartures = departures.filter(el => {
      const date = new Date(el.scheduled);
      return today.getFullYear() === date.getFullYear() &&
        today.getMonth() === date.getMonth() &&
        today.getDate() === date.getDate();
    });

    const tomorrowDepartures = departures.filter(el => {
      const date = new Date(el.scheduled);
      return tomorrow.getFullYear() === date.getFullYear() &&
        tomorrow.getMonth() === date.getMonth() &&
        tomorrow.getDate() === date.getDate();
    });

    stats.push({
      airline: airlines[i],
      today: {
        arrivals: todayArrivals.length,
        departures: todayDepartures.length,
      },
      tomorrow: {
        arrivals: tomorrowArrivals.length,
        departures: tomorrowDepartures.length,
      },
    });
  }

  return stats;
}

module.exports = {
  getArrivals,
  getDepartures,
  getAirlines,
  getStats,
};
