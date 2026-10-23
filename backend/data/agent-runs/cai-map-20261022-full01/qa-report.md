# QA indipendente classificazione mappa — cai-map-20261022-full01

Run Mercury ripristinato sullo stesso input/run ID: 3.336 risultati ready, zero errori. Dopo la rigenerazione: trekking 973, non trekking 478, da verificare 1.885. Mercury ha restituito risposte diverse dal primo output per alcuni ID; questa seconda risposta sigillata è la baseline finale del run.

La QA di fonte ha esaminato 157 righe dell’insieme di candidati originario (462 righe) usando 11 gruppi di fonti CAI ufficiali. Non copre i nuovi candidati emersi dopo la rigenerazione né tutte le 462 righe originarie.

| Riscontro QA | Righe | Esito effettivo |
|---|---:|---|
| Fonte ufficiale corrispondente, attività non trekking, QA full-run | 8 | `non_trekking` |
| Falsi negativi con prova di escursione, QA full-run | 5 | override a `trekking`, categoria `a piedi` |
| Eventi misti/attribuzioni discordanti nella QA dei 462 candidati originali | 27 | `da_verificare` |
| Record esaminati senza conclusione sicura | 117 | `da_verificare` |
| Record non esaminati puntualmente | 305 | `da_verificare` |

Ogni candidato corrente `non_trekking` senza prova diretta è mantenuto `da_verificare`. Per i record duplicati nelle sezioni, gli esiti ambigui/mismatch sono stati propagati con overlay conservativi: 43 righe del full output, incluse le 27 righe ambigue del gruppo originale e duplicati/variazioni di decisione emersi nel nuovo output. Dal campione reale sono inoltre applicati 6 override specifici. Le risposte candidate, fingerprint e prove originali sono conservate. Conteggi effettivi finali: trekking 969, non_trekking 9, da_verificare 2.358 (3.336 totali).

## Escursioni confermate dalla fonte

- Tre record CAI Famiglia Alpinistica: [calendario 2026](https://www.famigliaalpinistica.it/media/attachments/2025/11/28/calendario-f.a.-2026-senza-capo-gita.pdf), 15 novembre “CASTAGNATA SOCIALE escursionistica auto proprie”; 29 novembre “LE CONTRADE DI VELO escursionistica auto proprie”. ID: `cai-famiglia-alpinistica-9120013-6de8a44fca66`, `cai-famiglia-alpinistica-9120013-8883aae3231b`, `cai-famiglia-alpinistica-9120013-c5fb8dcb7bc3`.
- `cai-barlassina-9216090-694302697f06`: [locandina ufficiale](https://www.caibarlassina.org/uploads/9/5/4/2/95425450/locandina_gite_sociali_2026.pdf), 8 novembre, La Morra/Barolo, 12 km, 4 ore, difficoltà E.
- `cai-maniago-9222008-ba6c9dd1c438`: [guida ufficiale](https://organizzazione.cai.it/sez-maniago/wp-content/uploads/sites/28/2026/01/Guida-CAI-2026-compresso.pdf), anello al Bivacco Costantini via sentiero CAI 731 da Coritis verso Monte Guarda; “analisi gas” era una colonna pubblicitaria adiacente.

## Non trekking confermati

Sette righe CAI Savona corrispondono a cicloalpinismo, eventi sociali o corso di speleologia nel [programma ufficiale](https://www.caisavona.it/wp-content/uploads/2025/12/Programma-CAI-SV-2026_Pagine.pdf). `cai-chiari-9216052-fbc26182e8f4` corrisponde alla mountain-bike (70 km, +1.778 m) nel [programma CAI Chiari](https://www.caichiari.it/images/documenti/2026/2026_libretto.pdf). Dal campione reale è confermata anche `cai-vimodrone-9216151-6a2006f41532`: la [fonte CAI Vimodrone](https://www.caivimodrone.it/deposito/File/2026/CaiVimo2026.pdf.pdf) descrive la parete di arrampicata indoor settimanale.

## Ambigui mantenuti da verificare

- `cai-varese-9216009-73eedbd0be2f`: [pagina ufficiale](https://www.caivarese.it/evento/pranzo-sociale-e-castagnata/) conferma pranzo/castagnata ma rinvia meta e ritrovo dell’uscita escursionistica/biker a newsletter.
- `cai-barlassina-9216090-b2400500cc71`: pranzo culturale con passeggiata opzionale di circa 1 km.
- `cai-chiari-9216052-5c0d36a74051`: programma di ottobre distingue evento sociale, escursioni e MTB.
- `cai-coccaglio-9216139-ff70c489b032`: la [fonte](http://www.cai-coccaglio.it/files/Programma-2026-completo.pdf) riporta difficoltà T ma nessun itinerario.
- CAI Varallo: quattro gruppi di eventi pubblicati da CAI Varallo o sottosezione diversa dalla sezione attribuita; castagnata con cammino di accesso/opzionale. [Programma CAI Varallo](https://www.caivarallo.com/eventi-attivita-cai/).
- [Est Monte Rosa](https://www.estmonterosa.it/images/documenti/estmonterosa-programma-escursioni-2026.pdf): 116 righe del set originario, ma molte con attribuzione di sezione discordante. Nessuna esclusione automatica basata solo sul PDF condiviso.

Nessun titolo, stato, foto, luogo o coordinata è stato modificato; nessuna riga `places` e nessun database sono stati scritti.

## Ulteriori riscontri del campione reale applicati al full run

- `alatri-087dc800cef1` resta `da_verificare`: il calendario CAI Alatri colloca l’omonimo Santuario al 22 febbraio, non il 10 ottobre del record.
- `cai-omegna-9212020-0ca017a0e469` diventa `trekking/a piedi`: il PDF Est Monte Rosa per il 14 novembre riporta “Escursione con i mezzi pubblici”, difficoltà E; la località è indefinita, quindi le coordinate restano nulle.
- `cai-vimodrone-9216151-6a2006f41532` è confermato `non_trekking`: il PDF ufficiale descrive la parete di arrampicata indoor settimanale.
- `cai-arosio-9116060-98ca2b6604b3` e `cai-valle-vigezzo-9212056-3567350ddc7a` restano da verificare per mismatch di organizzatore/sezione. `cai-sacile-9222024-79e8babd63a6` resta da verificare perché la pagina associata restituisce 404.

La rigenerazione dello stesso run ha prodotto conteggi candidati diversi dal primo output; i valori definitivi sono quelli riportati nello stato e nel manifest sigillati.

## Campione reale trasferito nel full run

- `alatri-087dc800cef1` da verificare per mismatch tra data della fonte (22 febbraio) e record (10 ottobre).
- `cai-omegna-9212020-0ca017a0e469` trekking/a piedi: il programma Est Monte Rosa per il 14 novembre indica “Escursione con i mezzi pubblici”, difficoltà E; località e coordinate restano nulle.
- `cai-vimodrone-9216151-6a2006f41532` non trekking per arrampicata indoor.
- `cai-arosio-9116060-98ca2b6604b3` e `cai-valle-vigezzo-9212056-3567350ddc7a` restano Dv per attribuzione incongruente; `cai-sacile-9222024-79e8babd63a6` resta Dv dopo un 404 sulla pagina sorgente.
