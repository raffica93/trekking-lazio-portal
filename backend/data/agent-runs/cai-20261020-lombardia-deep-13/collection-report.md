# Raccolta CAI Lombardia — deep-13

- Run: `cai-20261020-lombardia-deep-13`; passata singola bounded su sei fonti ufficiali non incluse nei deep06–12.
- Limiti: massimo 40 documenti per fonte, 90 secondi per fonte, concorrenza 8; estrazione deterministica HTML/ICS/PDF con cache. Nessun retry ulteriore.
- Conteggio locale: deep12 3.205; output grezzo 3.208; dopo QA 3.206. Delta locale +1.
- Nuovo ID verificato: `cai-cernusco-sul-naviglio-9216051-e564f9cc5caf` (CAI Cernusco, Alpe Devero (VB), 25 ottobre 2026). La query DB read-only prima dell’import lo identifica come ID mancante; gli ID preesistenti restano immutati.
- Stato finale: `collection=partial`, `files=ready`, `database=completed`; copertura Lombardia incompleta.

## Risultati per fonte

| Source ID | Stato | Record nel file | Documenti registrati | Metodi positivi | Residui/errori |
|---|---|---:|---:|---|---|
| `cai-cernusco-sul-naviglio-9216051` | `partial` | 3 | 36 | pdf-ocr×1, html-calendar×8, wordpress-events×1, pdf-text×2, ics×1 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. [https://organizzazione.cai.it/sez-cernusco-sul-naviglio/wp-json/oembed/1.0/embed?url=https%3A%2F%2Forganizzazione.cai.it%2Fsez-cernusco-sul-naviglio%2F2026%2F02%2Fattivita-2026-2%2F]; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. [https://organizzazione.cai.it/sez-cernusco-sul-naviglio/wp-json/oembed/1.0/embed?url=https%3A%2F%2Forganizzazione.cai.it%2Fsez-cernusco-sul-naviglio%2F2026%2F02%2Fattivita-2026-2%2F&format=xml]; issue: timeout of 1000ms exceeded [https://organizzazione.cai.it/sez-cernusco-sul-naviglio/eventi/elenco/?eventDisplay=past&outlook-ical=1] |
| `cai-malnate-9216067` | `partial` | 2 | 1 | pdf-text×1 | issue: timeout of 8000ms exceeded [https://www.caimalnate.it/] |
| `cai-legnano-9216022` | `partial` | 3 | 40 | html-calendar×9, pdf-text×1 | discovery-limit: Discovery budget reached; 175 candidate documents remain. [https://www.cailegnano.it/news/attivita-della-sezione/marino-rabolini-luglio-2026/267/] |
| `cai-castiglione-stiviere-9216096` | `unsupported` | 2 | 15 | html-calendar×1, wordpress-events×1 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. [https://www.caicastiglione.it/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.caicastiglione.it%2Fprogramma-sociale%2F]; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. [https://www.caicastiglione.it/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.caicastiglione.it%2Fprogramma-sociale%2F&format=xml]; previous-unavailable-skipped: Skipped URL previously confirmed unavailable: Failed to establish tunnel to accounts.google.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden [https://calendar.google.com/calendar/render?action=TEMPLATE&text=PIZZO%20ARERA&dates=20260906T060000/20260906T080000&details=Da%20Plassa%20si%20procede%20in%20direzione%20rifugio%20Capanna%202000%2C%20prima%20su%20asfalto%2C%20poi%20per%20sentiero%20in%20parte%20nel%20bosco%20fino%20al%20parcheggio%20del%20rifugio.%20Da%20qui%20si%20sale%20lungo%20il%20costone%20erboso%20con%20radi%20alberi%20fino%20al%20pianoro%20di%20Capanna%202000%20dove%20si%20fermer%C3%A0%20chi%20fa%20solamente%20la%20parte%20escursionistica.%20Per%20la%20cima%20si%20prosegue%20salendo%20dal%20crestone%20sud%2C%20molto%20ripida%2C%20zigzagando%20fino%20a%20raggiungere%20l%27anticima%2C%202400%20m.%20Si%20risale%20una%20crepatura%20nella%20roccia%20attrezzata%2C%20fare%20attenzione%20alla%20possibile%20caduta%20di%20sassi%2C%20fatto%20questo%20passaggio%20il%20percorso%20risale%20bruscamente%20fino%20alla%20cima%20a%20volte%20con%20necessit%C3%A0%20di%20aiutarsi%20con%20le%20mani.%20Rientro%20per%20lo%20stesso%20percorso.https%3A%2F%2Fwww.caicastiglione.it%2Fuscite-cai%2F2026-09-06-pizzo-arera-2512m%2F&location=Parcheggio%20piscine] |
| `cai-rovagnate-9216068` | `unsupported` | 0 | 1 | pdf-text×1 | nessuno |
| `cai-villasanta-9216126` | `partial` | 1 | 10 | html-calendar×5 | previous-unavailable-skipped: Skipped URL previously confirmed unavailable: Failed to establish tunnel to se146653a1f3ce618.jimcontent.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden [https://www.caivillasanta.org/app/download/10454176686/PROGRAMMA%20GINNASTICA%20PRESCIISTICA%202026-2027.pdf?t=1785418876]; previous-unavailable-skipped: Skipped URL previously confirmed unavailable: Failed to establish tunnel to se146653a1f3ce618.jimcontent.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden [https://www.caivillasanta.org/app/download/10442704286/Fascicolo+informativo+programma+Corsica+2026.pdf?t=1791637339]; previous-unavailable-skipped: Skipped URL previously confirmed unavailable: Failed to establish tunnel to se146653a1f3ce618.jimcontent.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden [https://www.caivillasanta.org/app/download/10464570886/Itinerario+volantino+escursione+%2Bpranzo+sociale-2026.pdf?t=1791637339]; previous-unavailable-skipped: Skipped URL previously confirmed unavailable: Failed to establish tunnel to se146653a1f3ce618.jimcontent.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden [https://www.caivillasanta.org/app/download/10454049986/Informazioni+itin.+volantino+trekking+VAL+VARAITA+2026.pdf?t=1791637339]; previous-unavailable-skipped: Skipped URL previously confirmed unavailable: Failed to establish tunnel to se146653a1f3ce618.jimcontent.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden [https://www.caivillasanta.org/app/download/10454091286/CORSO+DI+SCI+2026+PROGRAMMA+E+REGOLAMENTO.pdf?t=1785418123]; previous-unavailable-skipped: Skipped URL previously confirmed unavailable: Failed to establish tunnel to se146653a1f3ce618.jimcontent.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden [https://www.caivillasanta.org/app/download/10454090286/PROGRAMMA+GINNASTICA+PRESCIISTICA+2025-2026.doc?t=1785418123]; previous-unavailable-skipped: Skipped URL previously confirmed unavailable: Failed to establish tunnel to se146653a1f3ce618.jimcontent.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden [https://www.caivillasanta.org/app/download/10454176686/PROGRAMMA+GINNASTICA+PRESCIISTICA+2026-2027.pdf?t=1785418876]; previous-unavailable-skipped: Skipped URL previously confirmed unavailable: Failed to establish tunnel to se146653a1f3ce618.jimcontent.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden [https://www.caivillasanta.org/app/download/10464570886/Itinerario%20volantino%20escursione%20+pranzo%20sociale-2026.pdf?t=1790772565] |

## cai-cernusco-sul-naviglio-9216051 — CAI Cernusco Sul Naviglio

- Stato: `partial`; record locali: 3; documenti registrati: 36; URL iniziale: https://organizzazione.cai.it/sez-cernusco-sul-naviglio/wp-content/uploads/sites/19/2025/12/Locandina-programma-2026.pdf.
- Documenti positivi (URL, metodo, candidati estratti, cache SHA-256):
  - https://organizzazione.cai.it/sez-cernusco-sul-naviglio/wp-content/uploads/sites/19/2025/12/Locandina-programma-2026.pdf · `pdf-ocr` · 8 candidati · `654a51f8d310cd6b65ad6e99a5a74ef05165a18d6e6411f6e21e9389720aa291`.
  - https://organizzazione.cai.it/sez-cernusco-sul-naviglio/2026/02/attivita-2026-2/ · `html-calendar` · 1 candidati · `0db43b5e0a723a356becb3ebf2ae8cef4202b54be8a982eb7c5a783cb43e6d31`.
  - https://organizzazione.cai.it/wp-json/tribe/events/v1/events?start_date=2026-10-01&per_page=100 · `wordpress-events` · 0 candidati · `eaca2e80a2cfb766900fa54fd286638f08c31dac887cf9ebd5869b7f15e46a84`.
  - https://organizzazione.cai.it/sez-cernusco-sul-naviglio/2026/01/2025-01-25_escursione-sentiero-delle-portatrici-di-ardesia/ · `html-calendar` · 1 candidati · `09567395c3c93eb3a74feef03d3116668d9ba316305ccfc9a7fbf707b9c3b584`.
  - https://organizzazione.cai.it/sez-cernusco-sul-naviglio/2026/01/2026-02-8_escursione-speleologica-buco-della-volpe/ · `html-calendar` · 1 candidati · `5a812c4402a642d57d6ea6e32bcfff9e4bda93397944f3ba1034c4ced14641a0`.
  - https://organizzazione.cai.it/sez-cernusco-sul-naviglio/wp-content/uploads/sites/19/2026/01/2026-02-08_grotta-Buco-della-Volpe.pdf · `pdf-text` · 1 candidati · `57a7a6f42124ea1325e4128cd10ec78179d2577afce6c0559ac39e5c610294d9`.
  - https://organizzazione.cai.it/sez-cernusco-sul-naviglio/wp-content/uploads/sites/19/2026/02/programma-ONC-2026.pdf · `pdf-text` · 3 candidati · `083d35c7388171a5f364f27a8a93e93ae8e6622c6e26fee80ebbdad71475e27d`.
  - https://organizzazione.cai.it/sez-cernusco-sul-naviglio/attivita/presciistica/ · `html-calendar` · 1 candidati · `743b23479c5d78b5e85e3fe182d36109e69f7f497c79998b601ceb5fd7949575`.
  - https://organizzazione.cai.it/sez-cernusco-sul-naviglio/eventi/mese/ · `html-calendar` · 1 candidati · `17dc3c2cd1989acda277fa6f9ccf48e6d52c8db0cab8cae127f97271d5ad6a56`.
  - https://organizzazione.cai.it/sez-cernusco-sul-naviglio/eventi/mese/2026-09/ · `html-calendar` · 1 candidati · `4c6679270beba72494bfed95c2de99cdba7e3a06be1445813cb9038015cb10b7`.
  - https://organizzazione.cai.it/sez-cernusco-sul-naviglio/eventi/2026-10-16/ · `html-calendar` · 1 candidati · `366bf49f02e90e9209ca8d31279022245672cfabde592e24b01ce013c11bd313`.
  - https://organizzazione.cai.it/sez-cernusco-sul-naviglio/eventi/elenco/?eventDisplay=past · `html-calendar` · 11 candidati · `4331bf732d23870d239f03c4018fb5b56f7a5cf339fba209f4801a09bf00ea54`.
  - https://organizzazione.cai.it/sez-cernusco-sul-naviglio/eventi/elenco/?eventDisplay=past&ical=1 · `ics` · 11 candidati · `7bf35744c09d7b3b8f9c191f698666e51332b7a082e4294e1a4db0fdb9532b97`.
- Problemi residui:
  - `non-calendar-link-skipped` · Skipped social, feed, metadata, sharing, or unrelated image URL. · https://organizzazione.cai.it/sez-cernusco-sul-naviglio/wp-json/oembed/1.0/embed?url=https%3A%2F%2Forganizzazione.cai.it%2Fsez-cernusco-sul-naviglio%2F2026%2F02%2Fattivita-2026-2%2F
  - `non-calendar-link-skipped` · Skipped social, feed, metadata, sharing, or unrelated image URL. · https://organizzazione.cai.it/sez-cernusco-sul-naviglio/wp-json/oembed/1.0/embed?url=https%3A%2F%2Forganizzazione.cai.it%2Fsez-cernusco-sul-naviglio%2F2026%2F02%2Fattivita-2026-2%2F&format=xml
  - `issue` · timeout of 1000ms exceeded · https://organizzazione.cai.it/sez-cernusco-sul-naviglio/eventi/elenco/?eventDisplay=past&outlook-ical=1

## cai-malnate-9216067 — CAI Malnate

- Stato: `partial`; record locali: 2; documenti registrati: 1; URL iniziale: https://caimalnate.it/wp-content/uploads/2026/03/calendario-gite-2026-CAI-Malnate-approvato-V2.pdf.
- Documenti positivi (URL, metodo, candidati estratti, cache SHA-256):
  - https://caimalnate.it/wp-content/uploads/2026/03/calendario-gite-2026-CAI-Malnate-approvato-V2.pdf · `pdf-text` · 9 candidati · `cd6e7f6839114eb67e7b5a3cb7b657f67002c78c20ad091483383f45563c0fdc`.
- Problemi residui:
  - `issue` · timeout of 8000ms exceeded · https://www.caimalnate.it/

## cai-legnano-9216022 — CAI Legnano

- Stato: `partial`; record locali: 3; documenti registrati: 40; URL iniziale: https://www.cailegnano.it/news/attivita-della-sezione/marino-rabolini-luglio-2026/267/.
- Documenti positivi (URL, metodo, candidati estratti, cache SHA-256):
  - https://www.cailegnano.it/attivita/sci-alpinismo/ · `html-calendar` · 4 candidati · `413ee3d9318ebf5d2997e5c7376c5e75dfda45d994f6f317722218d817d6b65d`.
  - https://www.cailegnano.it/docs/documenti/16_CAI_Legnano_programma2025_web.pdf · `pdf-text` · 3 candidati · `3a853311bc64ff72289c7c118c08655f7e207ba13bb286c0684a7110b502e82d`.
  - https://www.cailegnano.it/attivita-archivio/ · `html-calendar` · 15 candidati · `60e1b5d5485d4206386b38d2d4aaec1452ab4f944497005947462bdae94f904c`.
  - https://www.cailegnano.it/attivita-archivio/escursionismo/ · `html-calendar` · 19 candidati · `8bd9d84f073bcd69ba61bfcc739c9d6d83d2f82b4dc4e4a2427ca3b5829720f6`.
  - https://www.cailegnano.it/attivita-archivio/alpinismo-giovanile/ · `html-calendar` · 20 candidati · `4e3850be36a6a67e4e57eba3e5e4d48925bc54bbf35fc31bc93c88eb3def9580`.
  - https://www.cailegnano.it/attivita-archivio/juniores/ · `html-calendar` · 11 candidati · `9140c3ee307c6ce7c6de1593546534b9a18c6512b99aea4934377cf9c6baf9c2`.
  - https://www.cailegnano.it/attivita-archivio/sci-alpinismo/ · `html-calendar` · 20 candidati · `1ce39543a04b61dc777604a90f95fea391ef893a339421ded55205dfecc3f253`.
  - https://www.cailegnano.it/attivita-archivio/mtb/ · `html-calendar` · 6 candidati · `c556d0ca444143177928c5ce7afc4bd3d12e0d50d9644b8f5e7a7bfabe9cc7f8`.
  - https://www.cailegnano.it/attivita-archivio/attivita/ · `html-calendar` · 4 candidati · `135ddfbb308ff67c8580a9b021524ff0efc03cbf2399a676937499b0d8fa376e`.
  - https://www.cailegnano.it/attivita-archivio/escursionismo/ch-grigioni-rifugio-curciusa-2358-m--761/ · `html-calendar` · 1 candidati · `a2489cd759a479704cf61074c9bb4de9ef43cc11d362020ac72af3f0e71ba633`.
- Problemi residui:
  - `discovery-limit` · Discovery budget reached; 175 candidate documents remain. · https://www.cailegnano.it/news/attivita-della-sezione/marino-rabolini-luglio-2026/267/

## cai-castiglione-stiviere-9216096 — CAI Castiglione Stiviere

- Stato: `unsupported`; record locali: 2; documenti registrati: 15; URL iniziale: https://www.caicastiglione.it/events/?ical=1.
- Documenti positivi (URL, metodo, candidati estratti, cache SHA-256):
  - https://www.caicastiglione.it/corso-di-escursionismo-eea-2026-ferrate/ · `html-calendar` · 7 candidati · `0d8a6457330318af1e8574d714e7e5b06aebfd04a18f91c1a7483d948de8450a`.
  - https://www.caicastiglione.it/wp-json/tribe/events/v1/events?start_date=2026-10-01&per_page=100 · `wordpress-events` · 0 candidati · `0471388cd92d3a5e0cf6c63492a978ba7adfe99da810ce95930835eac63fd17f`.
- Problemi residui:
  - `non-calendar-link-skipped` · Skipped social, feed, metadata, sharing, or unrelated image URL. · https://www.caicastiglione.it/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.caicastiglione.it%2Fprogramma-sociale%2F
  - `non-calendar-link-skipped` · Skipped social, feed, metadata, sharing, or unrelated image URL. · https://www.caicastiglione.it/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.caicastiglione.it%2Fprogramma-sociale%2F&format=xml
  - `previous-unavailable-skipped` · Skipped URL previously confirmed unavailable: Failed to establish tunnel to accounts.google.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden · https://calendar.google.com/calendar/render?action=TEMPLATE&text=PIZZO%20ARERA&dates=20260906T060000/20260906T080000&details=Da%20Plassa%20si%20procede%20in%20direzione%20rifugio%20Capanna%202000%2C%20prima%20su%20asfalto%2C%20poi%20per%20sentiero%20in%20parte%20nel%20bosco%20fino%20al%20parcheggio%20del%20rifugio.%20Da%20qui%20si%20sale%20lungo%20il%20costone%20erboso%20con%20radi%20alberi%20fino%20al%20pianoro%20di%20Capanna%202000%20dove%20si%20fermer%C3%A0%20chi%20fa%20solamente%20la%20parte%20escursionistica.%20Per%20la%20cima%20si%20prosegue%20salendo%20dal%20crestone%20sud%2C%20molto%20ripida%2C%20zigzagando%20fino%20a%20raggiungere%20l%27anticima%2C%202400%20m.%20Si%20risale%20una%20crepatura%20nella%20roccia%20attrezzata%2C%20fare%20attenzione%20alla%20possibile%20caduta%20di%20sassi%2C%20fatto%20questo%20passaggio%20il%20percorso%20risale%20bruscamente%20fino%20alla%20cima%20a%20volte%20con%20necessit%C3%A0%20di%20aiutarsi%20con%20le%20mani.%20Rientro%20per%20lo%20stesso%20percorso.https%3A%2F%2Fwww.caicastiglione.it%2Fuscite-cai%2F2026-09-06-pizzo-arera-2512m%2F&location=Parcheggio%20piscine

## cai-rovagnate-9216068 — CAI Rovagnate

- Stato: `unsupported`; record locali: 0; documenti registrati: 1; URL iniziale: https://www.cairovagnate.it/wp-content/uploads/2026/02/Calendario-26-A3-pdf_compressed-1.pdf.
- Documenti positivi (URL, metodo, candidati estratti, cache SHA-256):
  - https://www.cairovagnate.it/wp-content/uploads/2026/02/Calendario-26-A3-pdf_compressed-1.pdf · `pdf-text` · 0 candidati · `d630504e6c6527d89588640187108a0e122309a4bf0833c09037b8e528bb66f6`.

## cai-villasanta-9216126 — CAI Villasanta

- Stato: `partial`; record locali: 1; documenti registrati: 10; URL iniziale: https://www.caivillasanta.org/app/download/10454176686/PROGRAMMA%20GINNASTICA%20PRESCIISTICA%202026-2027.pdf?t=1785418876.
- Documenti positivi (URL, metodo, candidati estratti, cache SHA-256):
  - https://www.caivillasanta.org/eventi-2026/ · `html-calendar` · 2 candidati · `4df152fcfd4645f286893c70c84cc30f32f51a712b53b32538cb408cd19c1370`.
  - https://www.caivillasanta.org/attivita-escursionistica-2026/ · `html-calendar` · 9 candidati · `473ab4a7ab3b00705cf87f3d98481c9238249de2a0aa2b78c1777915daabacf2`.
  - https://www.caivillasanta.org/attivita-cicloescursionismo-2026/ · `html-calendar` · 2 candidati · `cba2f7cfee837ee0a6ef9cd2617c674fa76fa56253779f33470e91e4414b34b0`.
  - https://www.caivillasanta.org/attivita-sport-invernali-2026-1/ · `html-calendar` · 1 candidati · `96b0eeb35ef32c23a3632a4eca2e017d75d61affc59839ec0befe9b69d0c95da`.
  - https://www.caivillasanta.org/attivita-giovanili-2026/attivita-alpinismo-giovanile/ · `html-calendar` · 5 candidati · `608d5666d185d2138132c03f357af7f82f05ff9eac359c0cc4121b9d945bd7c9`.
- Problemi residui:
  - `previous-unavailable-skipped` · Skipped URL previously confirmed unavailable: Failed to establish tunnel to se146653a1f3ce618.jimcontent.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden · https://www.caivillasanta.org/app/download/10454176686/PROGRAMMA%20GINNASTICA%20PRESCIISTICA%202026-2027.pdf?t=1785418876
  - `previous-unavailable-skipped` · Skipped URL previously confirmed unavailable: Failed to establish tunnel to se146653a1f3ce618.jimcontent.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden · https://www.caivillasanta.org/app/download/10442704286/Fascicolo+informativo+programma+Corsica+2026.pdf?t=1791637339
  - `previous-unavailable-skipped` · Skipped URL previously confirmed unavailable: Failed to establish tunnel to se146653a1f3ce618.jimcontent.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden · https://www.caivillasanta.org/app/download/10464570886/Itinerario+volantino+escursione+%2Bpranzo+sociale-2026.pdf?t=1791637339
  - `previous-unavailable-skipped` · Skipped URL previously confirmed unavailable: Failed to establish tunnel to se146653a1f3ce618.jimcontent.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden · https://www.caivillasanta.org/app/download/10454049986/Informazioni+itin.+volantino+trekking+VAL+VARAITA+2026.pdf?t=1791637339
  - `previous-unavailable-skipped` · Skipped URL previously confirmed unavailable: Failed to establish tunnel to se146653a1f3ce618.jimcontent.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden · https://www.caivillasanta.org/app/download/10454091286/CORSO+DI+SCI+2026+PROGRAMMA+E+REGOLAMENTO.pdf?t=1785418123
  - `previous-unavailable-skipped` · Skipped URL previously confirmed unavailable: Failed to establish tunnel to se146653a1f3ce618.jimcontent.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden · https://www.caivillasanta.org/app/download/10454090286/PROGRAMMA+GINNASTICA+PRESCIISTICA+2025-2026.doc?t=1785418123
  - `previous-unavailable-skipped` · Skipped URL previously confirmed unavailable: Failed to establish tunnel to se146653a1f3ce618.jimcontent.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden · https://www.caivillasanta.org/app/download/10454176686/PROGRAMMA+GINNASTICA+PRESCIISTICA+2026-2027.pdf?t=1785418876
  - `previous-unavailable-skipped` · Skipped URL previously confirmed unavailable: Failed to establish tunnel to se146653a1f3ce618.jimcontent.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden · https://www.caivillasanta.org/app/download/10464570886/Itinerario%20volantino%20escursione%20+pranzo%20sociale-2026.pdf?t=1790772565

## QA manuale

### Evento nuovo CAI Cernusco: Alpe Devero

- ID finale: `cai-cernusco-sul-naviglio-9216051-e564f9cc5caf`; titolo e località: Alpe Devero (VB); data: 2026-10-25.
- URL ufficiale: https://organizzazione.cai.it/sez-cernusco-sul-naviglio/wp-content/uploads/sites/19/2025/12/Locandina-programma-2026.pdf, pagina 2, colonna sinistra “Programma escursionistico”. La riga originale dice “25 Ottobre - Alpe Devero (VB)”.
- PDF originale: 5.716 KiB, due pagine raster; `pdftotext` non ha trovato testo. Verifica sul rendering della pagina 2. Scartati dal titolo i frammenti OCR spillati dalle colonne adiacenti (“Cesare Andreoni 2026”, “Pi gi i Me eli PE e a”).
- Descrizione minima usa solo la dicitura presente nella locandina; luogo non esteso oltre “Alpe Devero (VB)”.

### Pulizia Codogno/Cernusco

- Rimossa la variante ASCII del concerto Cernusco del 16 ottobre (`cai-cernusco-sul-naviglio-9216051-dda58dc0afc9`); mantenuta la riga preesistente tipografica `cai-cernusco-sul-naviglio-9216051-767f6d7d47c4`.
- L’ID OCR iniziale `cai-cernusco-sul-naviglio-9216051-e3a21530ab45` aveva titolo contaminato dalle colonne. È stato sostituito nel file con l’ID stabile `cai-cernusco-sul-naviglio-9216051-e564f9cc5caf` dopo aver corretto il titolo dalla pagina originale.
- Esclusa dal file locale la falsa seconda riga `cai-cernusco-sul-naviglio-9216051-61c82c9856f6` (“PROGRAMMA Accompagnamento durante le escursioni”): è un heading descrittivo della sezione CAI Scuola, non un evento autonomo. Il record DB già pubblicato non è stato cancellato né modificato.

### Riconciliazione DB

- Query finale sul file: 3.206 source_id; l’evento Alpe Devero è stato inserito come `published`. Verifica SQL: 3.206/3.206 ID presenti e `published`, 0 draft/mancanti; 4.365 `places`, 837 `cai_sections`.
- Nessun titolo, stato o foto di righe DB preesistenti è stato modificato.

Gli altri candidati delle sei fonti erano già presenti come source_id o non hanno fornito righe nuove verificabili; residui e cache restano registrati sopra. La raccolta regionale/nazionale rimane incompleta.
