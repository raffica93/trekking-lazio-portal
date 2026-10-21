# Soluzioni CAI verificate

## Retry limitato e isolamento scraper

- Soluzione: errori HTTP temporanei e access-denied hanno cooldown finiti; URL 404/410 scaduti sono riesaminati e la discovery ufficiale può trovare sostituzioni. I tentativi derivati da errori precedenti hanno un budget per fonte; gli errori non eliminano cache valida. `runScrape` con output temporaneo non copia cataloghi nella directory pubblica.
- Verifica: `backend npm test` include retry/cooldown, recheck removed URL, limite per fonte, conservazione cache e isolamento `sede.test.js`.
- Commit: `3469923fe6c21e28f2182753b7b5c4aa528baa91`.

## Classificazione trekking Mercury e filtro mappa

- Soluzione: adapter usa solo `POST /api/alpha/decisions` con modello richiesto `inception/mercury-decide`; conserva evidence/fingerprint/policy/confidenza e distingue il modello richiesto dall’eventuale modello attestato in risposta. Risposte senza campo model non ricevono attestazione inventata; modello discordante, errore API e output invalido non sono classificazioni valide. Bici/sci puri sono esclusi, ambiguità e ferrata/alpinismo senza componente a piedi restano da verificare. Le classificazioni risiedono in tabella separata; i pin mappa richiedono una classificazione trekking esplicita e i campi editoriali restano distinti.
- Verifica: `backend npm test` 161/161 e `frontend npm test -- --watch=false` 43/43, incluso il caso “Escursione in bici”. Le smoke/evaluation Mercury live sono riferite dall’utente in un’altra chat e non attestano dati reali.
- Commit: `3469923fe6c21e28f2182753b7b5c4aa528baa91`.
