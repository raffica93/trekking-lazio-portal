const fs = require('node:fs');
const path = require('node:path');
const { SOURCES } = require('../sources');

// Shared publishing hosts cannot safely be allowed as whole-domain redirects.
const SHARED_HOSTS = new Set(['facebook.com', 'm.facebook.com', 'instagram.com', 'youtube.com', 'youtu.be', 'google.com', 'drive.google.com', 'docs.google.com', 'calendar.google.com', 'sites.google.com', 'wordpress.com', 'linktr.ee', 't.me']);

function destinationHosts(sources) {
  const hosts = new Set(['cai.it', 'cailazio.org']);
  for (const source of sources) {
    for (const raw of [source.website, source.url, ...(source.calendarUrls || [])]) {
      try {
        const url = new URL(typeof raw === 'string' ? raw : raw.url);
        const host = url.hostname.toLowerCase().replace(/^www\./, '');
        if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) continue;
        if (SHARED_HOSTS.has(host) || /^\d+\.\d+\.\d+\.\d+$/.test(host) || host === 'localhost') continue;
        hosts.add(host);
      } catch { /* Missing source URLs stay outside the redirect allow-list. */ }
    }
  }
  return [...hosts].sort();
}

function main() {
  const content = '// Generated from the official CAI registry by backend/scripts/build-cai-hosts.js.\n'
    + `export const CAI_DESTINATION_HOSTS: readonly string[] = ${JSON.stringify(destinationHosts(SOURCES), null, 2)};\n`;
  for (const output of [
    '../../frontend/src/app/core/cai-destination-hosts.ts',
    '../../supabase/functions/track-cai-click/cai-destination-hosts.ts'
  ]) fs.writeFileSync(path.join(__dirname, output), content);
  console.log(`Generated ${destinationHosts(SOURCES).length} verified CAI destination hosts`);
}

if (require.main === module) main();
module.exports = { destinationHosts };
