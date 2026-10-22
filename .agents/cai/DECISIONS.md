# Decisioni condivise

| Data | Decisione | Motivo |
|---|---|---|
| 2026-10-21 | Spazio operativo nel repository attuale, in `.agents/cai/`. | Scelta dell'utente; recuperabile con il codice e i dati. |
| 2026-10-21 | Lo spazio non viene descritto come privato: il repository è pubblico. | Una directory non ha una visibilità GitHub diversa dal repository. Nessun segreto o contenuto personale qui. |
| 2026-10-21 | GitHub è il riferimento dei checkpoint condivisi; l'ambiente conserva strumenti/accessi. | La persistenza della stessa chat non trasferisce automaticamente file e modifiche a una chat nuova. |
| 2026-10-21 | Orchestratore con due soli agenti `cai-collector` e `cai-importer`, entrambi Luna. | Continuità con AGENTS.md e con la richiesta dell'utente. |
| 2026-10-21 | Prima checkpoint dei file verificati, poi DB, poi ricevuta pubblicata. | Recuperare anche una sessione interrotta tra produzione file e importazione. È un requisito del piano, ancora da implementare. |
| 2026-10-21 | Non ricreare la pipeline da zero. | Riutilizzare registro, parser/OCR, importatore, stati e rapporti esistenti. |
| 2026-10-21 | Manifest storici preservati e baseline identificata esplicitamente. | I file correnti possono cambiare tra lotti; il run OCR pending non sostituisce il run finale verificato. |
| 2026-10-21 | Una sessione cloud responsabile per ogni run. | Il lock sul filesystem protegge solo quel checkout; il passaggio tra sessioni deve essere esplicito. |
| 2026-10-21 | La qualifica full cloud richiede una prova tra sessioni nuove. | Il successo storico con interventi nel vecchio runtime non dimostra riproducibilità. |
| 2026-10-21 | Raccolta manuale, niente cron; merge/deploy separati. | Vincolo dell'utente. L'import DB può aggiornare i dati letti dal sito anche senza deploy del codice. |

## Riferimenti di prodotto consultati

- [OpenAI: ambienti cloud](https://learn.chatgpt.com/docs/environments/cloud-environments):
  setup pubblicato, isolamento delle nuove chat, salvataggio del lavoro e
  configurazione delle variabili/segreti. Una ripubblicazione vale per nuove task;
  quelle esistenti mantengono il proprio stato.
- [OpenAI: sottoagenti](https://learn.chatgpt.com/docs/agent-configuration/subagents):
  ruoli, modello e limiti della delega.

Le impostazioni desiderate e la disponibilità osservata nel runtime sono due
informazioni distinte. Uno strumento non disponibile non equivale a un check
riuscito; una variabile proxy con placeholder non equivale a una credenziale
mancante.

| 2026-10-22 | Conservare in DB sia candidato Mercury sia decisione/categoria effettive QA, con motivo e URL di evidenza. | Le fonti 404 e le attribuzioni/data discordanti non devono diventare esclusioni automatiche; report e override devono essere verificabili. |
| 2026-10-22 | Arrestare un batch su 401/402/403/429 o risposta con modello non allowlisted. | Evitare migliaia di chiamate invalide; riprendere solo dopo la causa risolta, senza retry infiniti. |
| 2026-10-22 | Nessuna scrittura classification DB prima di output QA e manifest verificati su GitHub. | Il lavoro deve essere recuperabile e l’import classification-only deve preservare conflitti e campi editoriali. |
