# Raccolta Lombardia deep-05

- Run: `cai-20261020-lombardia-deep-05`
- Stato: `collection=partial`, `files=ready`, `database=completed` tramite verifica SQL read-only; nessun dato importato in questo run.
- Un solo passaggio bounded su 24 fonti; concurrency 8; massimo 40 documenti e 90 secondi per fonte. Nessun retry successivo. Sono stati saltati link social, URL condivisi senza attribuzione e URL con 403/404/5xx già documentati.
- Prima del controllo manuale: 3.184 righe. Dopo controllo: 3.179 eventi, variazione netta **+0** rispetto al deep-04 verificato (3.179). Le 5 righe rimosse erano eventi ambigui/duplicati o varianti già risolte nel lotto precedente; il batch non ha prodotto nuovi eventi validi.
- Le fonti candidate sono state riesaminate entro i cap; status unresolved e candidate residui sono mantenuti e riportati sotto.
- Copie frontend/backend sincronizzate byte per byte; manifest verificato.
- Verifica DB del manifest aggiornato nel progetto `snwzxegtqnnuvlawnpgl`: 3.179/3.179 source ID presenti e pubblicati, 0 draft, 0 mancanti. Nessuna scrittura o sync del registro in questo run. Conteggi progetto: 4.338 `places`, 837 `cai_sections`.

## Controllo manuale record

| sourceId | ID rimosso | Motivo |
|---|---|---|
| cai-codogno-9216071 | `cai-codogno-9216071-bfe5c3553005` | Ambiguous source date (“Domenica 15 o Sabato 21”). |
| cai-codogno-9216071 | `cai-codogno-9216071-282383842231` | Column association error: the 8 November date belongs to another item, not the Rif. Grassi event. |
| cai-codogno-9216071 | `cai-codogno-9216071-6159f1b267dd` | Duplicate of the 8 November Progetto Donne event retained from the official PDF. |
| cai-sesto-calende-9216044 | `cai-sesto-calende-9216044-141f17fa1d1a` | The source describes the meeting on 29 September 2026; 2027 is the program year, not the event year. |
| cai-somma-lombardo-9216065 | `cai-somma-lombardo-9216065-00e9fbeee0cc` | Superseded generic-title variant of the same official PDF event; preserve the corrected preexisting Sacra di San Michele record. |

Somma Lombardo conserva il record preesistente corretto `cai-somma-lombardo-9216065-25f28820d036` (“Sacra di San Michele”, 04/10/2026); rimossa la variante generica con lo stesso URL/data. Sono state rimosse nuovamente le righe Codogno e Sesto Calende già escluse dai controlli precedenti e riprodotte dalla cache del parser.

## Stato per fonte dopo il passaggio

| sourceId | Stato | Eventi nel file | Issue rimaste |
|---|---:|---:|---|
| cai-brescia-9216005 | partial | 43 | previous-unavailable-skipped, discovery-limit |
| cai-premana-9216089 | partial | 1 | non-calendar-link-skipped, discovery-limit |
| cai-borno-9216113 | partial | 1 | previous-unavailable-skipped, source-error |
| cai-carate-brianza-9216030 | partial | 6 | source-error, discovery-limit |
| cai-codogno-9216071 | partial | 13 | non-calendar-link-skipped, discovery-limit, manual-qa-ambiguous-date-skipped, manual-qa-multicolumn-date-skipped, manual-qa-duplicate-skipped |
| cai-dongo-9216131 | partial | 13 | discovery-limit |
| cai-gazzada-schianno-9216148 | partial | 11 | previous-unavailable-skipped, source-error, discovery-limit |
| cai-inveruno-9216128 | partial | 10 | previous-unavailable-skipped, discovery-limit |
| cai-iseo-9216157 | partial | 4 | previous-unavailable-skipped, discovery-limit |
| cai-s-e-m-9216028 | partial | 14 | discovery-limit |
| cai-sesto-calende-9216044 | partial | 7 | non-calendar-link-skipped, source-error, discovery-limit, manual-qa-year-mismatch-skipped |
| cai-sesto-s-giovanni-9216020 | partial | 6 | non-calendar-link-skipped, previous-unavailable-skipped, discovery-limit |
| cai-somma-lombardo-9216065 | partial | 1 | source-error, discovery-limit, manual-qa-existing-id-variant-skipped |
| cai-valmadrera-9216081 | partial | 7 | discovery-limit |
| cai-varese-9216009 | partial | 58 | discovery-limit |
| cai-veduggio-9216147 | partial | 13 | discovery-limit |
| cai-cremona-9216007 | partial | 6 | previous-unavailable-skipped, discovery-limit |
| cai-gavirate-9216059 | unsupported | 0 | discovery-limit |
| cai-legnano-9216022 | partial | 3 | discovery-limit |
| cai-lissone-9216040 | partial | 7 | discovery-limit |
| cai-milano-9216003 | partial | 9 | discovery-limit |
| cai-missaglia-9216150 | unsupported | 0 | source-error, discovery-limit |
| cai-seregno-9216016 | partial | 7 | discovery-limit |
| cai-varano-borghi-9116118 | unsupported | 0 | shared-attribution-skipped, discovery-limit |

I conteggi candidati osservati prima del passaggio per le fonti con discovery-limit erano: Brescia 2; Premana 10; Borno 3; Carate 344; Codogno 346; Dongo 75; Gazzada 23; Inveruno 41; Iseo 40; SEM 12; Sesto Calende 5; Sesto San Giovanni 46; Somma Lombardo 15; Valmadrera 24; Varese 93; Veduggio 25; Cremona 96; Gavirate 258; Legnano 175; Lissone 65; Milano 54; Missaglia 41; Seregno 21; Varano Borghi 75. Il cap del singolo passaggio non ha risolto i residui: non si dichiara completa nessuna copertura ulteriore.

## Esito della copertura Lombardia

Dopo il passaggio restano fonti `partial` e `unsupported`; per i dettagli usare il registro `scrape-status.json`. I documenti irraggiungibili, i PDF eccedenti i limiti, l’OCR non riuscito, i link social e i candidati non processati restano impedimenti espliciti. Il database non è stato modificato.

### Impedimenti registrati nel passaggio

- Brescia, Inveruno, Iseo, Cremona e altre fonti: URL precedentemente irraggiungibili saltati senza nuovi tentativi; discovery-limit resta attivo.
- Borno: il documento DOCX ufficiale puntava a Filesusr, bloccato dal proxy con HTTP 403.
- Carate Brianza: una pagina candidata è scaduta per timeout (2.564 ms); altri candidati restano oltre il limite discovery.
- Gazzada Schianno e Sesto Calende: PDF ufficiali oltre il limite di download da 32 MiB.
- Somma Lombardo: due PDF riepilogativi superano 32 MiB; il PDF specifico “Sacra di San Michele” era già leggibile e il relativo evento corretto è preservato.
- Missaglia: PDF giovanile ufficiale, OCR fallito sulla pagina 21 con psm 6 e fallback psm 4 oltre il budget di circa 80 secondi.
- Varano Borghi: i calendari sono condivisi con CAI Gavirate e non attribuibili in modo affidabile alla sottosezione; esclusi.
- Gavirate: 258 candidati erano ancora indicati al raggiungimento del limite, ma il passaggio bounded non ha prodotto eventi attribuibili; resta `unsupported`.

Le fonti con discovery-limit mantengono le quantità candidate osservate prima del passaggio, riportate sopra; queste non sono eventi confermati e non sono state aggiunte ai file.
