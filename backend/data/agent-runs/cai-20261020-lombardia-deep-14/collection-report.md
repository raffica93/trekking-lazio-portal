# Raccolta CAI Lombardia — deep-14

- Run: `cai-20261020-lombardia-deep-14`; singola passata bounded su 8 siti ufficiali di sezione non trattati nei deep06–13.
- Limiti: massimo 40 documenti/fonte, 90 secondi/fonte, concorrenza 8. Nessun retry successivo; URL social/feed filtrati.
- Risultato: deep13 3.206 → deep14 3.206 eventi; delta locale 0. Nessun nuovo source_id valido.
- Query DB read-only: 3.206/3.206 ID locali già `published`, 0 draft, 0 mancanti; nessuna scrittura DB.
- Stato finale: `collection=partial`, `files=ready`, `database=completed`. Le otto fonti restano `unsupported` e la copertura resta incompleta.

## Esito per fonte

| Source ID | Stato | Record file | Documenti | Metodi positivi | Residui/errori |
|---|---|---:|---:|---|---|
| `cai-busto-arsizio-9216014` | `unsupported` | 1 | 7 | html-calendar×2 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. [https://www.caibustoarsizio.it/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.caibustoarsizio.it%2Fattivita-invernali-2-2%2F]; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. [https://www.caibustoarsizio.it/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.caibustoarsizio.it%2Fattivita-invernali-2-2%2F&format=xml] |
| `cai-novate-milanese-9216043` | `unsupported` | 0 | 1 | wordpress-events×1 | nessun errore registrato |
| `cai-vestone-9216155` | `unsupported` | 0 | 31 | nessuno | nessun errore registrato |
| `cai-voghera-9216024` | `unsupported` | 0 | 1 | nessuno | nessun errore registrato |
| `cai-desio-9216011` | `unsupported` | 0 | 1 | nessuno | nessun errore registrato |
| `cai-magenta-9216041` | `unsupported` | 0 | 1 | nessuno | nessun errore registrato |
| `cai-muggio-9216142` | `unsupported` | 0 | 1 | nessuno | nessun errore registrato |
| `cai-alta-valle-seriana-9116133` | `unsupported` | 0 | 1 | nessuno | nessun errore registrato |

## cai-busto-arsizio-9216014 — CAI Busto Arsizio

- Stato: `unsupported`; eventi nel file: 1; documenti registrati: 7; URL iniziale: https://www.caibustoarsizio.it/attivita-invernali-2-2/.
- Documenti visitati (URL, metodo, candidati, cache SHA-256):
  - https://www.caibustoarsizio.it/attivita-invernali-2-2/ · `html-calendar` · 1 candidati · `4c863d687a434f712ad7971bfbdb0013afc008019f47c40dd53b8d22c9468f16`.
  - https://www.caibustoarsizio.it/ · nessun parser positivo · 0 candidati · `5e893114b4ae0ad237de5c9861bd04b1715eacc4d3002c9cd15d180b069f0b75`.
  - https://www.caibustoarsizio.it/attivita-estive-2-2-2/ · nessun parser positivo · 0 candidati · `bdb2d427ab5bd214cfc16cc559910efabc8c51643000787b704d7c1fb9282b11`.
  - https://www.caibustoarsizio.it/escursioni-del-mercoledi/ · nessun parser positivo · 0 candidati · `91de91b16003ad332d1c4535412edcd0c4f6346ec29e664976ac7f09dc2b4546`.
  - https://www.caibustoarsizio.it/attivita-invernali-2-2/ · `html-calendar` · 1 candidati · `2ff535a8c90b8281b7a9768024dfe9c93ffaec044c82772a1c653899db09bb45`.
  - https://www.caibustoarsizio.it/escursioni-del-mercoledi/ · nessun parser positivo · 0 candidati · `91de91b16003ad332d1c4535412edcd0c4f6346ec29e664976ac7f09dc2b4546`.
  - https://www.caibustoarsizio.it/regolamento-escursioni-sociali/ · nessun parser positivo · 0 candidati · `9a34b14e9b9b15459aa6c3b27a6387852ef6fdcb2b5aa5798d816548fad8387d`.
- Problemi residui:
  - `non-calendar-link-skipped` · Skipped social, feed, metadata, sharing, or unrelated image URL. · https://www.caibustoarsizio.it/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.caibustoarsizio.it%2Fattivita-invernali-2-2%2F
  - `non-calendar-link-skipped` · Skipped social, feed, metadata, sharing, or unrelated image URL. · https://www.caibustoarsizio.it/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.caibustoarsizio.it%2Fattivita-invernali-2-2%2F&format=xml

## cai-novate-milanese-9216043 — CAI Novate Milanese

- Stato: `unsupported`; eventi nel file: 0; documenti registrati: 1; URL iniziale: https://www.cainovate.it/.
- Documenti visitati (URL, metodo, candidati, cache SHA-256):
  - https://www.cainovate.it/ · `wordpress-events` · 0 candidati · `84bc0ef5bfd4a01108b44a6f5b2984f57b368d093835401800273c65546f603e`.

## cai-vestone-9216155 — CAI Vestone

- Stato: `unsupported`; eventi nel file: 0; documenti registrati: 31; URL iniziale: https://www.caivestone.it/it/gite/2026/gaver-giro-delle-malghe/.
- Documenti visitati (URL, metodo, candidati, cache SHA-256):
  - https://www.caivestone.it/it/gite/2026/gaver-giro-delle-malghe/ · nessun parser positivo · 0 candidati · `69595462e70219248a8bdd478da77bad02a0911535550f327619664a9312ab83`.
  - https://www.caivestone.it/it/gite/2026/monte-cengledino/ · nessun parser positivo · 0 candidati · `6f23568bb54e26d822e666d9cfda16aa698ef64d6f21b869e3f5c1b25c952c71`.
  - https://www.caivestone.it/it/gite/2026/monte-nambino-da-nord-est/ · nessun parser positivo · 0 candidati · `6d8450a9746f912f886f1abe42aad622971d696cfaa2d5a56c02d687d329e9bd`.
  - https://www.caivestone.it/it/gite/2026/piz-tri/ · nessun parser positivo · 0 candidati · `c1c92e87ce34f269e6c0d9a2d2ad3dc21f9a520c2b98f6a4959ad912a22bda55`.
  - https://www.caivestone.it/it/gite/2026/gaver-psso-serosine-lago-nero-bruffione/ · nessun parser positivo · 0 candidati · `33a869fc4962beb116b7f5ae8a7f82bdcb09b869b1e391c71985e3c8977698d6`.
  - https://www.caivestone.it/it/gite/2026/val-daone-diga-boazzo-porte-di-danerba/ · nessun parser positivo · 0 candidati · `e3a8c2a8c1e727908448a1867757653a1594708479d4b96cc230808b8f207d7b`.
  - https://www.caivestone.it/it/gite/2026/gruppo-del-lagorai/ · nessun parser positivo · 0 candidati · `97802930a084b0dd29e44f90ab104bfc01bbcaa52d6b9a09c7e63730bc1f7470`.
  - https://www.caivestone.it/it/gite/2026/sentiero-azzurro-cinque-terre/ · nessun parser positivo · 0 candidati · `ddaa61651b38fb6bc598a786f8f7351f147407b1f7f6186a14c72823399ed22b`.
  - https://www.caivestone.it/it/ · nessun parser positivo · 0 candidati · `1b8333d1d1a87ede07b985c14556d44febc3d3cfb0ac9572df5d46c7cd6192ab`.
  - https://www.caivestone.it/it/gite/2026/trekking-ad-amatrice-monti-della-laga-escursione-da-definire/ · nessun parser positivo · 0 candidati · `2215131deccbcf4ae44ff337cb0fd8bf0dfb35e075dc1ec3dc6972edd9408c94`.
  - https://www.caivestone.it/it/gite/2026/ · nessun parser positivo · 0 candidati · `2275bc90a38a3cd2576033e1131136a7f2f5bdb66affc496f565d4544198b0c3`.
  - https://www.caivestone.it/it/gite/2026/corno-di-bedole-pisganino/ · nessun parser positivo · 0 candidati · `5e75c0121bd14e0b040ba445674d5c3925e1211e5db8d2efc07b33e3e6da583e`.
  - https://www.caivestone.it/it/gite/2026/creste-di-mura/ · nessun parser positivo · 0 candidati · `b068080574892ac201b87192d09a05ddba6c93f66cc1f7c6c16e2f162feb7f5e`.
  - https://www.caivestone.it/it/gite/2026/punta-almana/ · nessun parser positivo · 0 candidati · `76d1d5f75661bd2f029e6f4d53c278a938c9eb069d93dc2edb11f537b4da47fe`.
  - https://www.caivestone.it/it/gite/2026/rifugio-chierego-mtb/ · nessun parser positivo · 0 candidati · `8515e7f6edba8e0c25d3f096c7fd766c3821dc40cbbad57401422547038665dd`.
  - https://www.caivestone.it/it/gite/2026/monte-tombea-in-notturna/ · nessun parser positivo · 0 candidati · `ae72fbbb17e236e0f92893cb02f4950429bb0f40c9fbcb1c10c300a768787cb8`.
  - https://www.caivestone.it/it/gite/2026/monte-listino/ · nessun parser positivo · 0 candidati · `15945d0c2d343333c72614780a15a00348b90ac96dd2f831605a5e9581a9f1cf`.
  - https://www.caivestone.it/it/gite/2026/cornone-di-blumone/ · nessun parser positivo · 0 candidati · `47ac11f6d713b72da19ac478dd6e77e517abedf59053395aaaa51483295f8bd1`.
  - https://www.caivestone.it/it/gite/2026/cima-sassari/ · nessun parser positivo · 0 candidati · `6751d1bb79ac57e14836654ef63c661350633a8dc9da5bb9a2081f8863cf3693`.
  - https://www.caivestone.it/it/gite/2026/intersezionale-in-val-di-breguzzo/ · nessun parser positivo · 0 candidati · `8fdbfe696dd87d403d739937e60fd9987c125ccd2dc6b43d90a0745890e00dd5`.
  - https://www.caivestone.it/it/gite/2026/ferrata-sasse/ · nessun parser positivo · 0 candidati · `0ce05a120893ac44e754bbc293c4005c25ff5bb447a4f082c282618bb91b73bc`.
  - https://www.caivestone.it/it/gite/2026/vobarno-gardoncello/ · nessun parser positivo · 0 candidati · `69b62ec2c31767c2ae67e7a20d991cc3cffda11b914b79e55d38dc80439d276d`.
  - https://www.caivestone.it/it/gite/2026/cresta-del-monte-paraine/ · nessun parser positivo · 0 candidati · `ecf9161050094112ee8a97f8f21111176b9e175c10a9d51eff443c183591a753`.
  - https://www.caivestone.it/it/gite/2026/forti-di-brione-a-riva-del-garda-gruppo-base/ · nessun parser positivo · 0 candidati · `f6783ad7c23f4d6fd21fefd4eccaf4fe5726fffd1ff784cf0e988b841069d0b2`.
  - https://www.caivestone.it/it/gite/2026/ferrata-del-rio-sallagoni-gruppo-avanzato/ · nessun parser positivo · 0 candidati · `92bb0c7b506a5f3b6cf41788f506ef6e94fd2d5a1a65615f811e98741fd558e1`.
  - https://www.caivestone.it/it/gite/2026/sotterranei-del-castello-di-brescia/ · nessun parser positivo · 0 candidati · `a513633ec8dc4238c125d2dc12834b2ee047a01ddef7c2ddba936c77fd388391`.
  - https://www.caivestone.it/it/gite/2026/monte-baldo/ · nessun parser positivo · 0 candidati · `c727e3278017e0b0c9558b17f39a8dc0e7249bd921ac55f9147e851cda66ef49`.
  - https://www.caivestone.it/it/gite/2026/laghi-di-san-giuliano/ · nessun parser positivo · 0 candidati · `60cbe4393c5ab748c9f0d5dc0f994f313a0e08dbfa777c60f93e35ee727fc07b`.
  - https://www.caivestone.it/it/gite/2026/alta-via-delladamello/ · nessun parser positivo · 0 candidati · `6026e186b70e3ed35196477a60743f7f8ef91be5c9810a620ed28f3127b6d7ae`.
  - https://www.caivestone.it/it/gite/ · nessun parser positivo · 0 candidati · `19d81279f45816858e77c1ce85094d418a8378e5ae1693ed75cbdf76d57b3326`.
  - https://www.caivestone.it/it/gite/galleria-anni-80/ · nessun parser positivo · 0 candidati · `295943ed554be60c4fdf17282eeba30908646e5df2e2a1851515e03813cd3b22`.

## cai-voghera-9216024 — CAI Voghera

- Stato: `unsupported`; eventi nel file: 0; documenti registrati: 1; URL iniziale: http://www.caivoghera.it/.
- Documenti visitati (URL, metodo, candidati, cache SHA-256):
  - http://www.caivoghera.it/ · nessun parser positivo · 0 candidati · `9ad9c821d9d1c54f7f37787999c3d695cc113cb64a431fdc5a33d3f0c37bdddf`.

## cai-desio-9216011 — CAI Desio

- Stato: `unsupported`; eventi nel file: 0; documenti registrati: 1; URL iniziale: https://www.caidesio.net/.
- Documenti visitati (URL, metodo, candidati, cache SHA-256):
  - https://www.caidesio.net/ · nessun parser positivo · 0 candidati · `919b9ed6c93cc496114e426e763cd228048400d3d0fc827fccd7a801fdb543ec`.

## cai-magenta-9216041 — CAI Magenta

- Stato: `unsupported`; eventi nel file: 0; documenti registrati: 1; URL iniziale: https://www.caimagenta.it/.
- Documenti visitati (URL, metodo, candidati, cache SHA-256):
  - https://www.caimagenta.it/ · nessun parser positivo · 0 candidati · `5a4efd3feb78d9ddb2407ea5fe5c7d7875bdd06f8b4cbe32e0cb410676671c77`.

## cai-muggio-9216142 — CAI Muggio'

- Stato: `unsupported`; eventi nel file: 0; documenti registrati: 1; URL iniziale: https://www.caidimuggio.com/.
- Documenti visitati (URL, metodo, candidati, cache SHA-256):
  - https://www.caidimuggio.com/ · nessun parser positivo · 0 candidati · `2085545670dbd6cdea42985ac4e7fe62584566dc8b2025739abdbe0db94fc5dd`.

## cai-alta-valle-seriana-9116133 — CAI Alta Valle Seriana

- Stato: `unsupported`; eventi nel file: 0; documenti registrati: 1; URL iniziale: https://www.caialtavalleseriana.it/.
- Documenti visitati (URL, metodo, candidati, cache SHA-256):
  - https://www.caialtavalleseriana.it/ · nessun parser positivo · 0 candidati · `483a887a569b48210cd36f639752e3b4ad564760cb9d2aa7ff8d0e673c661ecc`.

## QA e database

- I record CAI Busto Arsizio già presenti (un risultato del 3 ottobre) sono passati e non costituiscono un nuovo evento futuro; non sono stati aggiunti.
- Le altre sette fonti non hanno prodotto record parsabili; pagine ufficiali visitate e hash cache sono indicati nei rispettivi registri. Nessuna data/titolo è stata inferita da contenuto non parsabile.
- Query Supabase read-only ha verificato tutti i 3.206 ID del file già `published`, 0 draft e 0 mancanti; 4.365 `places`, 837 `cai_sections`. Nessun record esistente è stato sovrascritto.

Le fonti restano unresolved; non si dichiara completata la copertura regionale o nazionale.
