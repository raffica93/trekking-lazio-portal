const test = require('node:test');
const assert = require('node:assert/strict');
const { DateTime } = require('luxon');
const {
  parseCaiRomaHtml,
  parseCostAmount,
  parseDateRange,
  parseDistanceKm,
  parseDurationHours,
  parseTransport,
  resolveRegion
} = require('../scraper');

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
  assert.equal(result[0].dateEnd, '2026-09-20');
  assert.equal(result[0].days, 1);
  assert.equal(result[0].distanceKm, 13);
  assert.equal(result[0].durationHours, 6);
  assert.equal(result[0].region, 'Lazio');
  assert.equal(result[0].transport, 'auto private');
  assert.equal(result[0].privateCar, true);
  assert.match(result[0].time, /6 ore/);
  assert.match(result[0].link, /\?p=123$/);
});

test('parses multi-day ranges, km, hours and region', () => {
  const html = `
    <table>
      <tr><td>SETTEMBRE 2026</td></tr>
      <tr><td>Data/Mezzo</td><td>Gruppo montuoso/Percorso</td><td>Difficoltà</td><td>Accompagnatori</td><td>Note</td></tr>
      <tr>
        <td>da sab 12 set a dom 13 set<br>auto private</td>
        <td><b>Gran Sasso</b><br>Pizzo Confalonieri</td>
        <td>EE<br>↑1350 m<br>13,1 km.<br>7.30 ore (soste escluse)</td>
        <td>CAI Roma</td><td></td>
      </tr>
    </table>`;

  const result = parseCaiRomaHtml(html, {
    now: DateTime.fromISO('2026-08-29', { zone: 'Europe/Rome' })
  });

  assert.equal(result[0].date, '2026-09-12');
  assert.equal(result[0].dateEnd, '2026-09-13');
  assert.equal(result[0].days, 2);
  assert.equal(result[0].distanceKm, 13.1);
  assert.equal(result[0].durationHours, 7.5);
  assert.equal(result[0].region, 'Abruzzo');
});

test('rolls the end date into the next year across December', () => {
  const range = parseDateRange('da mer 30 dic a ven 2 gen', 2026);
  assert.equal(range.date, '2026-12-30');
  assert.equal(range.dateEnd, '2027-01-02');
});

test('keeps a multi-day trip that started before today if it still ends in the future', () => {
  const html = `
    <table>
      <tr><td>AGOSTO 2026</td></tr>
      <tr><td>Data/Mezzo</td><td>Percorso</td><td>Difficoltà</td><td>Accompagnatori</td><td>Note</td></tr>
      <tr>
        <td>da sab 29 ago a sab 5 set<br>auto private</td>
        <td>Trentino<br>Settimana delle Ferrate</td>
        <td>EEA</td><td></td><td></td>
      </tr>
    </table>`;

  const result = parseCaiRomaHtml(html, {
    now: DateTime.fromISO('2026-08-30', { zone: 'Europe/Rome' })
  });

  assert.equal(result.length, 1);
  assert.equal(result[0].date, '2026-08-29');
  assert.equal(result[0].dateEnd, '2026-09-05');
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

test('parseDurationHours reads CAI hour formats', () => {
  assert.equal(parseDurationHours(['6 ore (escluse soste)']), 6);
  assert.equal(parseDurationHours(['7.30 ore (soste escluse)']), 7.5);
  assert.equal(parseDurationHours(['max 5/6 ore']), 6);
  assert.equal(parseDurationHours(["ore 6h 30'"]), 6.5);
  assert.equal(parseDurationHours(['Vedi sito']), undefined);
});

test('parseTransport classifies private car, organized travel and unknown', () => {
  assert.deepEqual(parseTransport('dom 20 set auto private'), { transport: 'auto private', privateCar: true });
  assert.deepEqual(parseTransport('da sab 12 set a dom 13 set Mezzi Propri'), { transport: 'Mezzi Propri', privateCar: true });
  assert.deepEqual(parseTransport('sab 26 set pullman'), { transport: 'pullman', privateCar: false });
  assert.deepEqual(parseTransport('da sab 3 ott a sab 10 ott Aereo + macchina'), {
    transport: 'Aereo + macchina',
    privateCar: true
  });
  assert.deepEqual(parseTransport('dom 20 set'), { transport: undefined, privateCar: null });
});

test('resolveRegion maps mountain groups and parseCostAmount skips vedi sito', () => {
  assert.equal(resolveRegion('Gran Sasso'), 'Abruzzo');
  assert.equal(resolveRegion('Monti Reatini'), 'Lazio');
  assert.equal(resolveRegion('Turchia'), 'Estero');
  assert.equal(parseCostAmount('Vedi sito'), undefined);
  assert.equal(parseCostAmount('25 euro'), 25);
});
