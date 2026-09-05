#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const cheerio = require('cheerio');
const { fetchPage, pool, websiteUrl } = require('./discover-cai-sections');
const ROOT = path.resolve(__dirname, '../..');
const DIRECTORY = 'https://www.sat.tn.it/sezioni/';
const key = x => String(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/^(?:cai\s+|s\.a\.t\.\s*|sat\s+|sezione\s+)/,'').replace(/\([^)]*\)/g,'').replace(/[^a-z0-9]/g,'');
async function main() {
  const registry = JSON.parse(fs.readFileSync(path.join(ROOT,'backend/data/cai-sections.json'),'utf8'));
  const sat = registry.sections.filter(x => x.directoryId.startsWith('9118'));
  const page = await fetchPage(DIRECTORY);
  const $ = cheerio.load(page.body);
  const links = [...new Map($('main a[href]').map((_,e) => ({name:$(e).text().trim(),url:new URL($(e).attr('href'),DIRECTORY).href})).get().filter(x => /\/sezioni\/[^/]+\/$/.test(x.url)).map(x=>[x.url,x])).values()];
  const aliases = { coro:'corodellasat',carealto:'carealto',centa:'centasnicolo',altavaldisole:'altavaldisole',bindesi:'bindesivillazzano',pinzolo:'pinzoloaltarendena',toblino:'toblinopietramurata',smichele:'smichelealladige',slorenzoinbanale:'slorenzoinbanale',rabbi:'rabbisternai',peio:'pejo',altavaldifassa:'altavaldefasha',levico:'levicoterme' };
  const failures = [];
  const sections = (await pool(links,4,async (link,index) => {
    try {
      const nameKey = key(link.name);
      const matches = sat.filter(s => { const k=key(s.organizer); return k === nameKey || aliases[k] === nameKey; });
      if (matches.length !== 1) { failures.push({name:link.name,reason:'No unique match in official CAI SAT directory'}); return null; }
      const detail = await fetchPage(link.url);
      const d = cheerio.load(detail.body);
      const embeddedUrl = d('iframe').map((_,el)=>d(el).attr('data-litespeed-src') || d(el).attr('src')).get().find(url => /piattaforma\.sat\.tn\.it\/ws\/website\/GetSezioneDetails\.ashx/.test(url));
      if (!embeddedUrl) { failures.push({name:link.name,reason:'No official details iframe'}); return null; }
      const embedded = await fetchPage(embeddedUrl);
      const e = cheerio.load(embedded.body);
      const website = e('a[href]').map((_,el)=>e(el).attr('href')).get().map(websiteUrl).find(url => url && !/facebook\.com|instagram\.com|sat\.tn\.it|youtube\.com/.test(url));
      if (!website) { failures.push({name:link.name,reason:'Official profile has no independent website'}); return null; }
      if ((index+1)%15 === 0) console.log(`SAT profiles ${index+1}/${links.length}`);
      return {id:matches[0].id,directoryId:matches[0].directoryId,website,evidenceUrl:link.url,profileDataUrl:embeddedUrl};
    } catch(error) { failures.push({name:link.name,reason:error.message}); return null; }
  })).filter(Boolean);
  const result = {generatedAt:new Date().toISOString(),source:DIRECTORY,profiles:links.length,sections,unresolved:failures};
  fs.writeFileSync(path.join(ROOT,'backend/data/cai-sat-websites.json'),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify({profiles:links.length,matched:sections.length,unresolved:failures.length}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
