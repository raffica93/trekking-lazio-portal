const test = require('node:test');
const assert = require('node:assert/strict');
const { DateTime } = require('luxon');
const { parseCaiRomaHtml, parseDistanceKm } = require('../scraper');

test('parses a CAI Roma excursion table', () => {
  const html = `
    <table>
      <tr><td>SETTEMBRE 2026</td></tr>
      <tr><td>Data/Mezzo</td><td>Gruppo montuoso/Percorso</td><td>Difficoltà</td><td>Accompagnatori</td><td>Note</td></tr>
      <tr>
        <td>dom 20 set<br><br>auto private</td>
        <td><a href="/?p=123"><b>Monti Reatini</b><br>Monte Pozzoni</a><br><br>Da Cittareale</td>
        <td>EE<br><br>13 km<br>6 ore</td><td>CAI Roma</td><td></td>
      </tr>
    </table>`;

  const result = parseCaiRomaHtml(html, {
    now: DateTime.fromISO('2026-08-29', { zone: 'Europe/Rome' })
  });

  assert.equal(result.length, 1);
  assert.equal(result[0].date, '2026-09-20');
  assert.equal(result[0].location, 'Monti Reatini');
  assert.equal(result[0].category, 'EE');
  assert.equal(result[0].distanceKm, 13);
  assert.match(result[0].time, /6 ore/);
  assert.match(result[0].link, /\?p=123$/);
});

test('ignores past excursions and keeps the year from the month heading', () => {
  const html = `
    <table>
      <tr><th>DICEMBRE 2026</th></tr>
      <tr><td>Data/Mezzo</td><td>Percorso</td><td>Difficoltà</td><td>Accompagnatori</td><td>Note</td></tr>
      <tr><td>dom 20 dic<br>auto</td><td>Simbruini<br>Monte Autore</td><td>E</td><td></td><td></td></tr>
    </table>`;

  const result = parseCaiRomaHtml(html, {
    now: DateTime.fromISO('2026-01-01', { zone: 'Europe/Rome' })
  });

  assert.equal(result[0].date, '2026-12-20');
  assert.equal(result[0].distanceKm, undefined);
});

test('parseDistanceKm reads decimal values and ignores missing km', () => {
  assert.equal(parseDistanceKm(['EE', '13,5 km']), 13.5);
  assert.equal(parseDistanceKm(['E', '6 ore']), undefined);
});
