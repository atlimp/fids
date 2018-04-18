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
    airline,
    origin_iata: origin,
    destination_iata: destination,
    scheduled_time,
    estimated_time,
    gate,
    stand,
    display_status: status,
    aircraft
  } = info;

  const s = new Date(scheduled_time);
  const e = estimated_time ? new Date(estimated_time) : null;

  const date = `${s.getDate()}-${s.getMonth() + 1}-${s.getFullYear()}`;
  const scheduled = s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});
  const estimated = e ? e.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}) : null;


  return {
    flight_no,
    airline,
    origin,
    destination,
    scheduled,
    estimated,
    date,
    gate,
    stand,
    status,
    aircraft,
  };
}

async function getData(url) {
  const text = await get(url);
  const data = JSON.parse(text).map(el => filter(el));
  return data;
}

function splitByDate(flights) {
  const td = new Date();
  const tm = new Date(td.getTime() + (24 * 60 * 60 * 1000));

  const todayKey = `${td.getDate()}-${td.getMonth() + 1}-${td.getFullYear()}`;
  const tomorrowKey = `${tm.getDate()}-${tm.getMonth() + 1}-${tm.getFullYear()}`;

  const all = {};
  all[todayKey] = [];
  all[tomorrowKey] = [];

  flights.forEach(e => {
    if (e.date === todayKey) all[todayKey].push(e);
    else if (e.date === tomorrowKey) all[tomorrowKey].push(e);
  });

  return all;
}

async function getArrivals(s) {
  let arrivals = await getData('https://isavia.is/fids/arrivals.aspx');

  if (s) arrivals = arrivals.filter(el => {
    return el.airline.toLowerCase().replace(/\s+/g, '_') === s;
  });

  const all = splitByDate(arrivals);
  return all;
}

async function getDepartures(s) {
  let departures = await getData('https://isavia.is/fids/departures.aspx');

  if (s) departures = departures.filter(el => {
    return el.airline.toLowerCase().replace(/\s+/g, '_') === s;
  });

  const all = splitByDate(departures);
  return all;
}

async function getAirlines() {
  const arrivals = await getArrivals();
  const departures = await getDepartures();

  const [ td, tm ] = Object.keys(arrivals);

  const data = arrivals[td]
    .concat(arrivals[tm])
    .concat(departures[td])
    .concat(departures[tm]);

  const all = [];

  data.forEach((el) => {
    const { airline } = el;
    const slug = el.airline.toLowerCase().replace(/\s+/g, '_');
    all.push({ airline, slug });
  });

  const airlines = all.filter((el, i, self) => {
    return i === self.findIndex(s =>
      s.airline === el.airline && s.slug === el.slug
    );
  }).sort((a, b) => a.airline.localeCompare(b.airline));



  return airlines;
}

async function getStats(airline) {
  const arrivals = await getArrivals(airline);
  const departures = await getDepartures(airline);

  const [ td, tm ] = Object.keys(arrivals);

  const stats = {};

  stats[td] = {};
  stats[tm] = {};

  stats[td].arrivals = arrivals[td].length;
  stats[td].departures = departures[td].length;

  stats[tm].arrivals = arrivals[tm].length;
  stats[tm].departures = departures[tm].length;

  return stats;
}

module.exports = {
  getArrivals,
  getDepartures,
  getAirlines,
  getStats,
};
