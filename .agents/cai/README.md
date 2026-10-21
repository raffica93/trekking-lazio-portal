# Spazio operativo degli agenti CAI

Punto di ingresso per riprendere il progetto da una sessione cloud nuova,
senza dipendere dal PC o dai file non pubblicati di una chat precedente.

**Visibilità:** questo spazio eredita quella del repository, attualmente pubblico.
Non è un archivio privato. Conserva solo contesto di progetto ed evidenze pubbliche;
credenziali, `.env`, cookie e conversazioni personali restano fuori da Git.

## Leggere all'avvio

1. [Obiettivi](OBJECTIVES.md): risultato da ottenere e criteri misurabili.
2. [Piano](PLAN.md): passi ordinati, dipendenze e impedimenti osservati.
3. [Stato](STATE.json): fase attuale e riferimenti alla baseline verificata.
4. [Passaggio di consegne](HANDOFF.md): istruzioni per la prossima sessione cloud.
5. [Decisioni](DECISIONS.md): regole condivise da non riscoprire ogni volta.
6. [Registro errori](FAILURES.json): fonti/fasi osservate, tentativi effettivi
   quando noti, cooldown candidati e verifiche risolutive.
7. [Avanzamento regionale](REGIONS.md): stato aggregato dell'ultimo snapshot,
   con limiti e prossima regione da lavorare.
8. [Soluzioni verificate](LEARNINGS.md): solo correzioni con test e commit.

Completano il contesto `AGENTS.md`, `docs/orchestratore-cai.md`,
`docs/cai-italia.md` e `docs/procedura-pdf-cai.md`.

## Dove risiede ogni informazione

| Informazione | Fonte da usare |
|---|---|
| Codice, piano, contesto e checkpoint condivisi | Commit pubblicato sul branch GitHub |
| Stato e prove di un lotto | `backend/data/agent-runs/<run-id>/` |
| Catalogo corrente e copia statica | `backend/data/` e `frontend/public/` |
| Eventi effettivamente importati | Supabase, verificato con query e ricevuta |
| Rete, strumenti e accessi della sessione | Osservazioni del runtime cloud corrente |
| Segreti | Configurazione autorizzata dell'ambiente o connessioni già autorizzate |
| Cache e temporanei OCR | Ricostruibili; non sono l'unica copia di una prova |

Una modifica non committata non è un checkpoint condiviso. Un commit locale non
è pubblicato finché il push non è confermato. La persistenza della stessa chat
non dimostra che una chat nuova possa recuperare il lavoro.

## Stato di questo passaggio

Il checkpoint codice per errori, classificatore Mercury e filtro mappa è stato verificato offline e pubblicato al commit `3469923fe6c21e28f2182753b7b5c4aa528baa91`. La nuova chat cloud destinataria è `01a1604c-7018-7460-8316-df3c57dfd077`; i suoi dati di test live sintetici sono riferiti dall’utente e non sostituiscono il campione reale. Nessun batch o aggiornamento DB è stato eseguito in questo checkpoint. La mappa legge la popolazione Supabase pubblicata e corrente/futura, quindi non classificare soltanto il JSON statico. Procedere per regione e chiudere prima la coda Lombardia documentata in `REGIONS.md`.

Baseline dati storica: commit `9919927`, run `cai-20261020-piemonte-01`, 3.337 ID unici; import storico +40 Piemonte. Non è copertura nazionale completa. Il catalogo in checkout è invariato rispetto al suo hash `1200e9a3921b606f341de413e34665b29fe91b5f6f86c5090c21d18effd12877`.

## Responsabilità

- Orchestratore: aggiorna questo spazio, assegna il run, verifica i checkpoint e
  registra il prossimo passo. È l'unico autore di `STATE.json` e `HANDOFF.md`.
- `cai-collector`, `gpt-6-luna`: fonti, parser, raccolta, file ed evidenze del lotto.
- `cai-importer`, `gpt-6-luna`: verifica del passaggio file/DB, import e ricevuta.
- La classificazione Mercury usa solo `inception/mercury-decide` e l'endpoint
  Decisions documentato. La sessione aggiornata separata ha riferito una smoke sintetica live riuscita; questo checkout non ha effettuato chiamate live e il relativo artefatto di 12 fixture non è qui.

Non duplicare qui il catalogo o l'intero stato di tutte le fonti: usare riferimenti
ai lotti. I modelli per sessioni e ricevute sono in [templates](templates/).
I modelli vuoti non attestano operazioni eseguite.

## Chiusura di ogni sessione

Aggiornare stato e prossimo passo, salvare i file necessari, eseguire commit e
push sul branch di lavoro e verificare il commit remoto. Se il push fallisce,
registrare il blocco e conservare un artifact recuperabile; non chiamare il lavoro
"online". Nessun cron, nessun merge o deploy implicito.
