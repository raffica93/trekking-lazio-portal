const axios = require('axios');
const cheerio = require('cheerio');
const { DateTime } = require('luxon');

async function scrapeCaiRoma() {
  try {
    const url = 'https://www.cairoma.it/escursioni/programma-escursioni/';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const excursions = [];

    // The data is usually in tables
    $('table tr').each((i, el) => {
      if (i === 0) return; // Skip header

      const tds = $(el).find('td');
      if (tds.length < 2) return;

      const dateStr = $(tds[0]).text().trim(); // E.g. "15 MAR"
      const title = $(tds[1]).text().trim();
      const link = $(tds[1]).find('a').attr('href') || '#';
      
      if (!title || title.toLowerCase().includes('programma')) return;

      // Parsing date (CAI Roma often uses "15 MAR" or similar)
      let date = DateTime.now();
      try {
        const months = {
          'GEN': 1, 'FEB': 2, 'MAR': 3, 'APR': 4, 'MAG': 5, 'GIU': 6,
          'LUGLIO': 7, 'AGO': 8, 'SET': 9, 'OTT': 10, 'NOV': 11, 'DIC': 12,
          'LUG': 7, 'DIC': 12 // common short versions
        };
        const parts = dateStr.split(/[\s-]+/);
        if (parts.length >= 2) {
          const day = parseInt(parts[0]);
          const monthStr = parts[1].toUpperCase();
          const month = months[monthStr] || 3; // Fallback to March for now
          date = DateTime.fromObject({ year: 2026, month, day });
        }
      } catch (e) {}

      const coords = getMockCoords(title);

      excursions.push({
        id: `roma-${i}`,
        title,
        date: date.isValid ? date.toISODate() : DateTime.now().toISODate(),
        category: 'Escursionismo',
        link: link.startsWith('http') ? link : `https://www.cairoma.it${link}`,
        organizer: 'CAI Roma',
        location: coords.name,
        lat: coords.lat,
        lng: coords.lng,
        cost: 'Vedi sito',
        time: '08:00'
      });
    });

    return excursions;
  } catch (error) {
    console.error('Scraping failed:', error);
    return [];
  }
}

function getMockCoords(title) {
  const locations = [
    { name: 'Monti Lucretili', lat: 42.148, lng: 12.894 },
    { name: 'Sperlonga', lat: 41.258, lng: 13.433 },
    { name: 'Simbruini', lat: 41.934, lng: 13.235 },
    { name: 'Albani', lat: 41.723, lng: 12.705 },
    { name: 'Gran Sasso', lat: 42.482, lng: 13.565 },
    { name: 'Abruzzo', lat: 41.792, lng: 13.869 },
    { name: 'Tuscia', lat: 42.417, lng: 12.101 },
    { name: 'Sabatini', lat: 42.138, lng: 12.235 },
    { name: 'Cicolano', lat: 42.235, lng: 13.254 },
    { name: 'S. Severa', lat: 42.023, lng: 11.954 },
    { name: 'Terni', lat: 42.563, lng: 12.641 },
    { name: 'Sora', lat: 41.716, lng: 13.612 }
  ];

  const found = locations.find(l => title.toLowerCase().includes(l.name.toLowerCase()));
  return found || { name: 'Lazio', lat: 41.891, lng: 12.492 };
}

module.exports = { scrapeCaiRoma };
