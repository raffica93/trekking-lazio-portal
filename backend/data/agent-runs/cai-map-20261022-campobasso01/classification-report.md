# Classificazione delta — CAI Campobasso 01

- Run raccolta: `cai-20261022-molise-campobasso01`
- Run classificazione: `cai-map-20261022-campobasso01`
- Stato raccolta: `partial`; artefatti file pronti e QA importer passata.
- Stato classificazione: `ready`, 2/2 completati, 0 errori.
- Input esatto: `../cai-20261022-molise-campobasso01/candidate-input.json`, SHA-256 `a0cab9771df021bd96c7baca7fcab0c170bab0cf1137cba1a7bded35ef14d700`.
- Manifest classificazione SHA-256: `80d7f646b0c12cdd35943248429243fad7c364c554f4c03e0dfce52d84733925`.
- Output classificazione SHA-256: `d6e54aa214d648b4b6d9351d417a0dd7fb10fe01ea80e0bae0dd148b863038fd`.
- Policy: `cai-trekking-v2`; modello richiesto `inception/mercury-decide`; per entrambe le righe risposta/modello attestato `inception/mercury-decide-20260930`.
- QA indipendente importer: PASS sull'allineamento ID/input-output, modello attestato e preservazione byte-semantica dei campi non classificatori. Nessuna scrittura DB inclusa in questo checkpoint.

| Source ID | Evento e data | Decisione/categoria | Confidence / probability | Esito |
|---|---|---|---|---|
| `cai-campobasso-9236001-8e0c09de00c9` | Parco Nazionale della Sila: I Giganti della Sila, Lago Ariamàcina e Pietra dell’Altare; 16–18 ottobre 2026 | `trekking` / `altro` | 0,774473 / 0,849649 | Importabile; coordinate nulle e località da verificare. Evento con date passate alla data della raccolta. |
| `cai-campobasso-9236001-a99c427d4321` | PNALM: Lago Vivo – Fonte degli Uccelli; 6 dicembre 2026 | `da_verificare` / `altro` | 0,292935 / 0,528623 | Importabile e mantenuto per revisione; non è una decisione `non_trekking`. Coordinate nulle e località da verificare. |

Conteggi del delta: 1 trekking, 0 non trekking, 1 da verificare, 0 errori. QA e classificazione non provano consegna in `places`; non sono state eseguite query o scritture DB in questo passaggio. Prossimo gate: verificare da Supabase la presenza esatta dei due ID e il contratto FK, poi checkpoint file remoto prima dell'eventuale import mirato insert-only e riconciliazione.
