const test = require('node:test');
const assert = require('node:assert/strict');
const { destinationHosts } = require('../scripts/build-cai-hosts');

test('tracking hosts follow verified section domains without granting shared platforms', () => {
  const hosts = destinationHosts([
    { website: 'https://www.caisezione.example', calendarUrls: ['https://organizzazione.cai.it/sez-esempio/eventi'] },
    { website: 'https://facebook.com/section' },
    { url: 'https://user:password@other.example' },
    { url: 'javascript:alert(1)' }
  ]);
  assert.ok(hosts.includes('caisezione.example'));
  assert.ok(hosts.includes('organizzazione.cai.it'));
  assert.ok(!hosts.includes('facebook.com'));
  assert.ok(!hosts.includes('other.example'));
});
