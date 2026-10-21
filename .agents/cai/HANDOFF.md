# Passaggio alla prossima sessione cloud

Prossima azione: **S1 del piano**, poi preparazione riproducibile del runtime S2.
Non lanciare subito un'altra raccolta nazionale.

## Contesto da recuperare

- Repository: `raffica93/trekking-lazio-portal`, attualmente pubblico.
- Branch operativo: `codex/cai-orchestrator-luna`; niente merge/deploy impliciti.
- Baseline dati: commit `9919927`, run `cai-20261020-piemonte-01`, 3.337 ID unici.
- I sei file del manifest coincidono con i blob Git della baseline.
- L'ultimo esito DB registrato è del 20 ottobre: 3.337 ID presenti/pubblicati,
  40 nuovi Piemonte, 4.405 righe complessive `places`, 837 `cai_sections`.
  Questi sono conteggi storici: verificarli nuovamente quando serve operare.
- `cai-20261020-piemonte-ocr-01` conserva uno stato con file/import pendenti:
  non è la baseline da importare.
- I report nazionali e regionali restano in `backend/data/agent-runs/`; non
  confondere l'import completato con la copertura completa delle fonti.

## Istruzioni da usare nella chat cloud

```text
Riprendi il passaggio full cloud del progetto CAI. Individua il checkout con
git rev-parse --show-toplevel; non assumere un percorso Windows o /workspace
specifico. Verifica identità e stato dell'ambiente attivo tramite gli strumenti
runtime supportati; non usare come prova le impostazioni di una vecchia chat.
Se uno strumento runtime non è disponibile, registra il controllo non verificato.

Verifica git status, origin e branch codex/cai-orchestrator-luna. Recupera il
branch remoto preservando modifiche e commit locali; non usare reset --hard.
Leggi AGENTS.md e .agents/cai/README.md, OBJECTIVES.md, PLAN.md, STATE.json,
HANDOFF.md. Controlla che questi file siano effettivamente nel commit recuperato.

Segui i passi S1–S6 del piano. Usa esattamente due agenti gpt-6-luna high:
cai-collector per bootstrap/raccolta/evidenze, cai-importer per validazione,
checkpoint e contratto di import. Tu mantieni coordinamento e stato. Dai a
ciascuno ownership esplicita e avvertilo delle modifiche degli altri.

La baseline dati è il run cai-20261020-piemonte-01 al commit 9919927, non il run
OCR rimasto pending. Non modificare manifest storici per far passare i controlli.
Prima dell'import devono esistere file verificati e un checkpoint recuperabile
su GitHub; dopo l'import servono query e ricevuta. Usa soltanto accessi già
autorizzati e verifica metodo e progetto. Non copiare o stampare credenziali.

Non eseguire test che scrivono nel catalogo corrente. Niente cron, cancellazioni
DB, sostituzioni di contenuti amministrati, merge o deploy. Mantieni separati
stato raccolta, file, commit remoto, import e sito. Pubblica a fine sessione
stato, prove e prossima azione. Non chiamare full cloud un lavoro provato solo
nello stesso vecchio checkout.
```

La preparazione di questo spazio è avvenuta localmente. La validazione definitiva
del nuovo flusso deve avvenire nelle sessioni cloud previste dal piano.
