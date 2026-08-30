# Riepilogo scrape sezioni CAI Lazio

Aggiornato il 2026-08-30 dopo lo split per sede.

## Come si lancia

```bash
cd backend
npm run scrape:roma
npm run scrape:sora -- --dry-run
npm run scrape:all
```

In admin: `/#/admin/sedi` (ogni riga è uno script; richiede backend locale o Docker). In GitHub Actions: workflow *Refresh excursion data*, input `source` oppure tutte, una alla volta.

Stato: `backend/data/scrape-status.json` (copia in `frontend/public/scrape-status.json`).

## Catalogo

| id | Sezione | Template | Enabled | Script |
|---|---|---|---|---|
| roma | CAI Roma | tabella HTML | sì | `scrape:roma` |
| viterbo | CAI Viterbo | programma HTML | sì | `scrape:viterbo` |
| tivoli | CAI Tivoli | PDF programma | sì | `scrape:tivoli` |
| rieti | CAI Rieti | PDF programma | sì | `scrape:rieti` |
| monterotondo | CAI Monterotondo | PDF programma | sì | `scrape:monterotondo` |
| frosinone | CAI Frosinone | programma HTML | sì | `scrape:frosinone` |
| leonessa | CAI Leonessa | PDF pieghevole | sì | `scrape:leonessa` |
| sora | CAI Sora | PDF 2026 | sì | `scrape:sora` |
| amatrice | CAI Amatrice | PDF programma | sì | `scrape:amatrice` |
| esperia | CAI Esperia | PDF calendario | sì | `scrape:esperia` |
| alatri | CAI Alatri | calendario HTML | sì | `scrape:alatri` |
| aprilia | CAI Aprilia | programma HTML | sì | `scrape:aprilia` |
| colleferro | CAI Colleferro | calendario HTML | sì | `scrape:colleferro` |
| frascati | CAI Frascati | calendario HTML | sì | `scrape:frascati` |
| palestrina | CAI Palestrina | calendario HTML | sì | `scrape:palestrina` |
| antrodoco | CAI Antrodoco | calendario HTML | sì | `scrape:antrodoco` |
| latina | CAI Latina | eventi pianificati HTML | sì | `scrape:latina` |
| cassino | CAI Cassino | eventi HTML | sì | `scrape:cassino` |
| gallinaro | CAI Gallinaro | Facebook | sì | `scrape:gallinaro` |

Roma usa Cheerio. Tutte le altre abilitate usano Gemini 3.5 Flash sul documento indicato in `backend/sources.js`.
