# Stato orchestratore CAI

Aggiornamento: 19 ottobre 2026 (Europe/Rome).

## Completato

- Recuperato il lavoro nazionale esistente e il contesto della verifica accessi.
- Verificato Supabase `snwzxegtqnnuvlawnpgl`: 2.680 righe in `places`, 837 in
  `cai_sections`. Nessun dato è stato modificato durante la preparazione.
- Configurati i ruoli `cai-collector` e `cai-importer` su `gpt-6-luna`, con massimo
  due sottoagenti. Due sottoagenti Luna di questa chat hanno preparato e verificato
  il codice; non sono sessioni Codex Cloud.
- Aggiunto fallback PDF OCR italiano/inglese con Poppler/Tesseract, timeout,
  pulizia temporanei e riprova degli errori; conservati parser e cache precedenti.
- Aggiunto comando manuale `orchestrate` con stato persistente, attività per fonte,
  cronologia, lock e fasi raccolta → file verificati → importazione.
- Aggiunta verifica SHA-256 di tutti e tre i file prima del DB; l'import usa gli
  snapshot verificati in memoria. Righe esistenti deduplicate e contenuti
  amministrati preservati.
- Preparati setup Linux e prompt per l'orchestratore remoto.
- Verifica finale: 141 test backend superati; sintassi TOML e Bash valida;
  workflow YAML valido con solo trigger manuale.
- Preparato il lotto `cai-20261019-01`, ancora con raccolta/file/DB in `pending`.
  Branch di preparazione: `codex/cai-orchestrator-luna`.
- Controllato workflow GitHub: `Refresh excursion data` usa solo avvio manuale;
  nessuna esecuzione dello scrape in corso al controllo.
- Integrato lo stesso passaggio verificato anche nel workflow manuale: import
  bloccato su errori di raccolta/file, stato e manifest conservati negli artifact.
- Controllato Supabase: estensione `pg_cron` assente, tabella `cron.job` assente.
- Nessuna automazione Codex locale corrispondente al progetto trovata nel controllo.

## Da completare prima della raccolta remota

- **Accesso utente:** il browser del pannello mostra il login ChatGPT, quindi
  l'ambiente cloud non è stato ancora creato da questa sessione.
- Creare l'ambiente del repository, eseguire `.codex/setup-cloud.sh`, verificare
  rete, disponibilità effettiva di Luna e supporto ai due sottoagenti.
- Configurare l'accesso DB nell'ambiente di esecuzione: i secret presenti in
  GitHub Actions non sono automaticamente disponibili in Codex Cloud.
- Avviare il collector cloud, completare i file e controllare le evidenze.
- Consegnare manifest e run ID all'importer, eseguire import e query di verifica.
- Mantenere aperte le sezioni `partial`, `unsupported`, `failed`, `idle` o `skipped`;
  un'importazione riuscita non dichiara completata la copertura nazionale.

Nessuna nuova raccolta nazionale o importazione è stata avviata in preparazione.
Non sono stati creati cron o aggiornamenti ricorrenti.
