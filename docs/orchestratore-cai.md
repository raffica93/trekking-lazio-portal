# Orchestratore CAI con due agenti Luna

Per la revisione del flusso full cloud e il contesto condiviso degli agenti,
partire da [`.agents/cai/README.md`](../.agents/cai/README.md). Il piano distingue
il lavoro già eseguito dalla qualifica di una ripartenza in sessioni cloud nuove.

L'orchestratore coordina esattamente due ruoli Codex, entrambi `gpt-6-luna`:
`cai-collector` raccoglie calendari e produce file; `cai-importer` importa i file
verificati in Supabase. Le definizioni sono in `.codex/agents/`, con limite di due
sottoagenti in `.codex/config.toml`. Questi file configurano gli agenti: non
avviano attività cloud, non creano ambienti e non schedulano aggiornamenti.

## Preparazione di Codex Cloud

1. Accedere a Codex Cloud con l'account proprietario del repository.
2. Creare/selezionare un ambiente per `raffica93/trekking-lazio-portal`.
   Per questa preparazione selezionare il branch `codex/cai-orchestrator-luna`
   quando si avvia la chat cloud; le modifiche non sono ancora in `main`.
3. Selezionare Node.js 22 o superiore e impostare il setup:
   `bash .codex/setup-cloud.sh`. Installa dipendenze backend, Poppler e Tesseract
   italiano/inglese. Il setup non raccoglie eventi e non scrive nel DB.
   Se la prima creazione della cache usa ancora `main` e il file non è presente,
   installare gli stessi pacchetti nel setup dell'ambiente e usare
   `npm --prefix backend ci`; il comando sul file sarà disponibile sul branch
   preparato. Non unire il branch a `main` soltanto per inizializzare l'ambiente.
4. Per il collector, abilitare l'accesso Internet ai siti CAI e ai calendari
   pubblici. Senza rete il lavoro deve restare esplicitamente bloccato.
5. Per l'importer servono `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` nell'ambiente
   backend al momento dell'esecuzione. Impostare `SUPABASE_IMPORT_STATUS=published`
   per pubblicare gli eventi nuovi, oppure `draft` per bozze (default). Usare i
   secret disponibili nell'ambiente di esecuzione, mai versionarli. I secret di
   GitHub Actions non sono automaticamente disponibili a Codex Cloud. Se non si
   vuole fornire la service role al cloud, trasferire i file verificati al backend
   autorizzato e svolgere lì soltanto l'import.
   Negli ambienti Codex Cloud legacy i secret sono disponibili solo al setup e
   vengono rimossi prima della fase agente: configurarli lì, da solo, non abilita
   l'import durante il lavoro. Verificare l'accesso a runtime oppure usare il
   backend autorizzato; lo script di setup non copia credenziali su disco.
6. Verificare che l'ambiente supporti `gpt-6-luna` e la delega a sottoagenti. Se
   manca uno dei due, registrare il blocco: non sostituire il modello o dichiarare
   che i due agenti sono stati avviati.

Documentazione ufficiale: [ambienti cloud](https://developers.openai.com/codex/cloud/environments)
e [sottoagenti](https://developers.openai.com/codex/subagents).

## Esecuzione manuale e passaggio file → database

I comandi seguenti si eseguono in `backend`. Il run ID identifica un singolo lotto;
usare un ID nuovo per una nuova raccolta.

```bash
npm run orchestrate -- init --run cai-20261019-01 --all --concurrency 8
# Agente collector:
npm run orchestrate -- collect --run cai-20261019-01
# Solo dopo files=ready, agente importer:
npm run orchestrate -- import --run cai-20261019-01
# Orchestratore:
npm run orchestrate -- status --run cai-20261019-01
```

Per un lotto più piccolo sostituire `--all` con `--source roma` o `--region Lazio`
nel comando `init`. Lo script non chiama modelli AI: i due agenti Codex Luna
usano gli strumenti deterministici del repository. La raccolta orchestrata passa
esplicitamente `apiKey=null` alla pipeline: non invoca Gemini neppure quando sono
presenti chiavi legacy nell'ambiente. Gli script storici mantengono la loro
configurazione per gli altri utilizzi.

`backend/data/agent-runs/<run>/state.json` contiene stato, cronologia, risultato
import e attività per fonte. `manifest.json` registra SHA-256 di escursioni,
censimento e rapporto di raccolta. L'import verifica tutti e tre i file prima
di qualsiasi accesso in scrittura al database. Un file cambiato richiede un nuovo
lotto con raccolta e verifica; non modificare manualmente il manifest.

Gli stati sono indipendenti: `collection=partial` mantiene le fonti da riprendere
anche se i file sono pronti e l'import degli eventi validi è completato. La lista
fonti comprende anche le sezioni precedenti non richieste nel lotto: `updatedAt`
mostra quando sono state controllate l'ultima volta. Una fonte senza eventi futuri
ma letta correttamente è completata; una fonte non leggibile rimane da fare.

Una raccolta o un'importazione fallita può essere ripetuta con lo stesso comando.
Le fasi completate non vengono rieseguite. L'import esistente riconcilia gli ID
già presenti senza duplicarli, conservando contenuti curati dall'amministratore.
Lo stato `database=completed` indica la conclusione dell'importatore; l'agente
deve anche verificare e riportare i conteggi con una query DB.

Il lock in `backend/data/agent-runs/.lock` esclude altre esecuzioni
dell'orchestratore. Non eseguire contemporaneamente gli script legacy di scrape
o import sullo stesso checkout. Dopo un arresto forzato verificare prima che il
processo precedente sia terminato, poi rimuovere soltanto quella directory lock.

## Prompt dell'orchestratore cloud

```text
Leggi AGENTS.md e docs/orchestratore-cai.md. Sei l'orchestratore del completamento
della raccolta nazionale CAI già presente nel repository. Usa esattamente due
agenti gpt-6-luna: cai-collector per calendari/scraping/OCR/file, cai-importer per
validazione/importazione DB. Verifica modello e strumenti prima di delegare.
Crea un run ID nuovo e registra ogni fase con npm run orchestrate. Il collector
lavora per primo; l'importer può preparare solo controlli in lettura finché i file
non sono ready. Non inventare dati, preserva cache e contenuti amministrati,
conserva URL e problemi delle fonti. Dopo i file verificati, assegna l'import allo
stesso run e controlla il DB. Segna fonti complete e fonti ancora da fare e conserva
un rapporto finale. Se mancano rete o credenziali registra il blocco reale.
Non aggiungere cron, scheduler o aggiornamenti periodici. Non fare merge o deploy.
```

## Controllo scheduler

Il workflow `.github/workflows/scrape.yml` è esclusivamente `workflow_dispatch`.
Usa le stesse fasi `init`, `collect`, `import`: un errore di raccolta/verifica
blocca l'import. Stato e manifest vengono conservati tra gli artifact del run.
Questo workflow esegue gli strumenti deterministici: i due agenti Luna sono
coordinati nella sessione Codex Cloud, non da GitHub Actions.
Non aggiungere trigger `schedule`. Non è necessario disattivare il workflow
manuale per rispettare questa regola. Le pianificazioni esterne vanno controllate
e quelle dedicate all'aggiornamento eventi disattivate se presenti.
