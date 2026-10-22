# Soluzioni CAI verificate

## Retry limitato e isolamento scraper

- Soluzione: errori HTTP temporanei e access-denied hanno cooldown finiti; URL 404/410 scaduti sono riesaminati e la discovery ufficiale può trovare sostituzioni. I tentativi derivati da errori precedenti hanno un budget per fonte; gli errori non eliminano cache valida. `runScrape` con output temporaneo non copia cataloghi nella directory pubblica.
- Verifica: `backend npm test` include retry/cooldown, recheck removed URL, limite per fonte, conservazione cache e isolamento `sede.test.js`.
- Commit: `3469923fe6c21e28f2182753b7b5c4aa528baa91`.

## Classificazione trekking Mercury e filtro mappa

- Soluzione: adapter usa solo `POST /api/alpha/decisions` con modello richiesto `inception/mercury-decide`; conserva evidence/fingerprint/policy/confidenza e distingue il modello richiesto dall’eventuale modello attestato in risposta. Risposte senza campo model non ricevono attestazione inventata; modello discordante, errore API e output invalido non sono classificazioni valide. Bici/sci puri sono esclusi, ambiguità e ferrata/alpinismo senza componente a piedi restano da verificare. Le classificazioni risiedono in tabella separata; i pin mappa richiedono una classificazione trekking esplicita e i campi editoriali restano distinti.
- Verifica: `backend npm test` 161/161 e `frontend npm test -- --watch=false` 43/43, incluso il caso “Escursione in bici”. Le smoke/evaluation Mercury live sono riferite dall’utente in un’altra chat e non attestano dati reali.
- Commit: `3469923fe6c21e28f2182753b7b5c4aa528baa91`.

## Arresto sicuro batch Mercury e revisione QA separata

- Soluzione: il batch si arresta su 401/402/403/429 o attestazione modello non allowlisted; il run parziale non è importabile. L’importer conserva decisione/categoria candidate Mercury e valore effettivo separato con metadata QA verificabili, senza sovrascrivere i conflitti esistenti.
- Verifica: test circuito interruttore su status/model e persistenza run parziale; fixture per Sacile, Alatri e Omegna; `backend npm test` 173/173 e test importer 28/28.
- Commit: `902a1802dade16bead38f3aa61f3026f84e3ec49`, `3f93525f4f52dff9dd322278a6b3e4759455648b`.


## 2026-10-22 — classificazione catalogo completo

- Fare parsing e verifica 3336 ID/input/output prima di applicare qualsiasi overlay. Un comando di preparazione errato aveva prodotto un output temporaneo a un record: ripristino da input sigillato + cache esistente, quindi rigenerazione e verifica importer prima del gate; nessuna scrittura DB.
- Le risposte Mercury non sono deterministiche anche con stesso run/input. Alla ripresa verificare sempre output/manifest finali e non riutilizzare conteggi di un output precedente.
- Non escludere in massa candidati `non_trekking` basandosi soltanto sul modello o su PDF condivisi tra sezioni. QA puntuale ha confermato solo 8 esclusioni; candidati ambigui/non revisionati restano `da_verificare`.
- Controllare il ref remoto con `git ls-remote`: la cache del ref `origin/*` locale può essere indietro rispetto al branch effettivo.


## 2026-10-22 — import classification-only con Supabase MCP

- Quando il runtime di backend non espone Supabase URL/ruolo ma il connettore MCP è autorizzato, verificare prima assenza tabella/conflitti, poi applicare migration e inserire piccoli batch derivati da `verifyReadyClassificationRun`. `ON CONFLICT DO NOTHING` rende la ripresa idempotente; l’importer locale non deve interpretare una risposta MCP di forma differente come prova che il blocco non sia stato applicato: controllare stato SQL prima di ripetere.
- Una query SQL di riconciliazione può confrontare campi scalari con `IS DISTINCT FROM` e metadata `jsonb` direttamente, senza trasferire migliaia di record all’interprete; conservare conteggi e digest prima/dopo.
