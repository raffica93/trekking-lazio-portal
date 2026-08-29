const express = require('express');
const cors = require('cors');
const { scrapeCaiRoma } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Enhanced mock data for CAI Roma as fallback
function getRomaMocks() {
  return [
    {
      id: 'roma-mock-1',
      title: 'Tuscia: Anello da Oriolo sui Monti Sabatini',
      date: '2026-03-14',
      category: 'MTB',
      link: 'https://www.cairoma.it/escursioni/programma-escursioni/',
      organizer: 'CAI Roma',
      location: 'Sabatini',
      lat: 42.138,
      lng: 12.235,
      cost: 'Soci CAI',
      time: '08:30'
    },
    {
      id: 'roma-mock-2',
      title: 'Monti Lucretili: Giro del Parco',
      date: '2026-03-21',
      category: 'MTB',
      link: 'https://www.cairoma.it/escursioni/programma-escursioni/',
      organizer: 'CAI Roma',
      location: 'Monti Lucretili',
      lat: 42.148,
      lng: 12.894,
      cost: 'Soci CAI',
      time: '08:00'
    }
  ];
}

function generateMockExcursions() {
  const sections = ['CAI Viterbo', 'CAI Latina', 'CAI Rieti', 'CAI Frosinone'];
  const extra = [];
  const locations = [
    { name: 'Cimini', lat: 42.368, lng: 12.182 },
    { name: 'Semprevisa', lat: 41.566, lng: 13.067 },
    { name: 'Terminillo', lat: 42.483, lng: 12.984 },
    { name: 'Ernici', lat: 41.802, lng: 13.486 }
  ];

  for (let i = 0; i < 8; i++) {
    const section = sections[i % sections.length];
    const loc = locations[i % locations.length];
    const date = new Date();
    date.setDate(date.getDate() + (i * 2) + 5);
    
    extra.push({
      id: 100 + i,
      title: `Escursione sui ${loc.name}`,
      date: date.toISOString().split('T')[0],
      category: 'Escursionismo',
      link: '#',
      organizer: section,
      location: loc.name,
      lat: loc.lat,
      lng: loc.lng,
      cost: '15€',
      time: '07:30'
    });
  }
  return extra;
}

app.get('/api/excursions', async (req, res) => {
  try {
    let caiRoma = await scrapeCaiRoma();
    if (caiRoma.length === 0) {
      caiRoma = getRomaMocks();
    }
    const mock = generateMockExcursions();
    const all = [...caiRoma, ...mock].sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(all);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch excursions' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
