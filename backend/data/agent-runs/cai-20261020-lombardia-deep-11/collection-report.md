# Raccolta CAI Lombardia — deep-11

- Run: `cai-20261020-lombardia-deep-11`; singola passata bounded su 8 fonti.
- Limiti: max 40 documenti/fonte, 90 s/fonte, concorrenza 8; parser deterministico HTML/ICS/PDF e cache esistente. Nessun retry, social esclusi.
- Risultato QA: baseline deep-10 3.205 eventi; output grezzo 3.207; rimossi due falsi positivi Codogno → **3.205 eventi**, delta netto valido/importabile **0**.
- Verifica DB read-only progetto `snwzxegtqnnuvlawnpgl`: 3.205/3.205 source_id già presenti e `published`, 0 draft; nessuna scrittura DB.
- Stato finale: `collection=partial`, `files=ready`, `database=completed`; manifest SHA-256 include i tre JSON backend e i tre mirror frontend, tutti verificati identici. Le fonti con residui restano da completare.

## Esito fonte per fonte

| Source ID | Stato | Record finali | Documenti positivi | Metodi | Residuo/errori |
|---|---|---:|---:|---|---|
| `cai-codogno-9216071` | `partial` | 13 | 23 | pdf-text×3, pdf-ocr×1, html-calendar×19 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. (https://twitter.com/intent/tweet?url=https://www.caicodogno.it/le-attivita/programma-2026); non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. (https://www.linkedin.com/shareArticle?mini=true&url=https://www.caicodogno.it/le-attivita/programma-2026); discovery-limit: Discovery budget reached; 431 candidate documents remain. (https://www.caicodogno.it/media/137807/a4-programma-2026-one-page.pdf) |
| `cai-livigno-9216120` | `failed` | 2 | 0 | nessuno | errore: Skipped social, feed, metadata, sharing, or unrelated image URL. |
| `cai-nerviano-9216100` | `partial` | 4 | 8 | html-calendar×4, pdf-text×3, image-ocr×1 | previous-unavailable-skipped: Skipped URL previously confirmed unavailable: Skipped URL previously confirmed unavailable: Request failed with status code 404 (https://www.cainerviano.it/images/CAI/Documents/2026/2026_Varie/2025_11_21_Programma_CAI_2026_Stampa_013.pdf) |
| `cai-lissone-9216040` | `partial` | 7 | 34 | html-calendar×2, pdf-text×32 | discovery-limit: Discovery budget reached; 65 candidate documents remain. (https://cai-lissone.it/attivita/dettaglio/?num=255&tipo=escursionismo) |
| `cai-laveno-mombello-9216032` | `partial` | 9 | 12 | pdf-text×3, html-calendar×9 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. (https://cailavenomombello.it/2026/05/23/29-maggio-2026-presentazione-attivita-cicloescursionismo/feed/); non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. (https://cailavenomombello.it/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fcailavenomombello.it%2F2026%2F05%2F23%2F29-maggio-2026-presentazione-attivita-cicloescursionismo%2F); non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. (https://cailavenomombello.it/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fcailavenomombello.it%2F2026%2F05%2F23%2F29-maggio-2026-presentazione-attivita-cicloescursionismo%2F&format=xml); errore: timeout of 8000ms exceeded (https://cailavenomombello.it/escursioni/) |
| `cai-strada-storta-9116052` | `partial` | 6 | 8 | ics×8 | previous-unavailable-skipped: Skipped URL previously confirmed unavailable: Failed to establish tunnel to accounts.google.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden (https://www.google.com/calendar/event?action=TEMPLATE&text=60%C2%B0+Strada+Storta&dates=20260912T160000/20260912T220000&details=CiaoIl+percorso+dei+festeggiamenti+per+i+60+anni+del+CAI+Strada+Storta+PROSEGUE+con+un+nuovo+appuntamento+da+condividere.+Segnatevi+sul+calendario+il+12+settembre%21Festeggeremo+all%26%238217%3Boratorio+di+Acquate%3A+l%C3%AC+trascorreremo+del+tempo+insieme+passando+per+merenda%2C+arrampicata%2C+Santa+Messa%2C+musica%2C+aperitivo+e+cena.Un+momento+pensato+per+ritrovarsi%2C+incontrare+vecchi+e+nuovi+amici+e+continuare+a+celebrare+una+storia+che+%C3%A8+fatta+da+60+anni+di+montagna%2C+persone+e+condivisione.%26nbsp%3BVi+aspettiamo+per+festeggiare+insieme%21%3Ca+href%3D%22https%3A%2F%2Fstradastorta.it%2Fwp-content%2Fuploads%2F2026%2F07%2F60esimo_StradaStorta.pdf%22%3ESCARICA+LA+LOCANDINA%3C%2Fa%3E&location=&trp=false&sprop=https%3A%2F%2Fstradastorta.it%2Feventi%2F60-strada-storta%2F&sprop=name:CAI+Strada+Storta&ctz=Europe%2FRome); non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. (https://outlook.office.com/calendar/0/deeplink/compose?allday=false&body=CiaoIl+percorso+dei+festeggiamenti+per+i+60+anni+del+CAI+Strada+Storta+PROSEGUE+con+un+nuovo+appuntamento+da+condividere.+Segnatevi+sul+calendario+il+12+settembre%21Festeggeremo+all%26%238217%3Boratorio+di+Acquate%3A+l%C3%AC+trascorreremo+del+tempo+insieme+passando+per+merenda%2C+arrampicata%2C+Santa+Messa%2C+musica%2C+aperitivo+e+cena.Un+momento+pensato+per+ritrovarsi%2C+incontrare+vecchi+e+nuovi+amici+e+continuare+a+celebrare+una+storia+che+%C3%A8+fatta+da+60+anni+di+montagna%2C+persone+e+condivisione.%26nbsp%3BVi+aspettiamo+per+festeggiare+insieme%21%3Ca+href%3D%22https%3A%2F%2Fstradastorta.it%2Fwp-content%2Fuploads%2F2026%2F07%2F60esimo_StradaStorta.pdf%22%3ESCARICA+LA+LOCANDINA%3C%2Fa%3E&location=&path=/calendar/action/compose&rru=addevent&startdt=2026-09-12T16%3A00%3A00%2B02%3A00&enddt=2026-09-12T22%3A00%3A00%2B02%3A00&subject=60%C2%B0+Strada+Storta); non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. (https://outlook.live.com/calendar/0/deeplink/compose?allday=false&body=CiaoIl+percorso+dei+festeggiamenti+per+i+60+anni+del+CAI+Strada+Storta+PROSEGUE+con+un+nuovo+appuntamento+da+condividere.+Segnatevi+sul+calendario+il+12+settembre%21Festeggeremo+all%26%238217%3Boratorio+di+Acquate%3A+l%C3%AC+trascorreremo+del+tempo+insieme+passando+per+merenda%2C+arrampicata%2C+Santa+Messa%2C+musica%2C+aperitivo+e+cena.Un+momento+pensato+per+ritrovarsi%2C+incontrare+vecchi+e+nuovi+amici+e+continuare+a+celebrare+una+storia+che+%C3%A8+fatta+da+60+anni+di+montagna%2C+persone+e+condivisione.%26nbsp%3BVi+aspettiamo+per+festeggiare+insieme%21%3Ca+href%3D%22https%3A%2F%2Fstradastorta.it%2Fwp-content%2Fuploads%2F2026%2F07%2F60esimo_StradaStorta.pdf%22%3ESCARICA+LA+LOCANDINA%3C%2Fa%3E&location=&path=/calendar/action/compose&rru=addevent&startdt=2026-09-12T16%3A00%3A00%2B02%3A00&enddt=2026-09-12T22%3A00%3A00%2B02%3A00&subject=60%C2%B0+Strada+Storta) |
| `cai-como-9216006` | `partial` | 1 | 8 | ics×6, html-calendar×2 | previous-unavailable-skipped: Skipped URL previously confirmed unavailable: Request failed with status code 500 (https://www.caicomo.it/la-sezione/eventi/corso-geologia-2026); previous-unavailable-skipped: Skipped URL previously confirmed unavailable: Request failed with status code 500 (https://www.caicomo.it/la-sezione/eventi/corsi-torrentismo) |
| `cai-abbiategrasso-9216049` | `partial` | 1 | 3 | html-calendar×1, pdf-text×1, image-ocr×1 | previous-unavailable-skipped: Skipped URL previously confirmed unavailable: Skipped URL previously confirmed unavailable: Request failed with status code 404 (https://www.caiabbiategrasso.it/calendario/eventi/4x100-autunno-2026); previous-unavailable-skipped: Skipped URL previously confirmed unavailable: Skipped URL previously confirmed unavailable: Request failed with status code 404 (https://www.caiabbiategrasso.it/calendario/eventi/alpinismo-giovanile-autunno-2026); non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. (https://twitter.com/intent/tweet?text=&url=https%3A%2F%2Fwww.caiabbiategrasso.it%2Fnews%2Fprogramma-inverno-e-primavera-2026&related=); non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. (https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fwww.caiabbiategrasso.it%2Fnews%2Fprogramma-inverno-e-primavera-2026&title=Programma+Inverno+e+Primavera+2026&summary=); non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. (https://twitter.com/intent/tweet?text=&url=https%3A%2F%2Fwww.caiabbiategrasso.it%2Fcalendario%2Feventi%2F4x100-autunno-2026&related=); non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. (https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fwww.caiabbiategrasso.it%2Fcalendario%2Feventi%2F4x100-autunno-2026&title=4X100+AUTUNNO+2026&summary=); previous-unavailable-skipped: Skipped URL previously confirmed unavailable: Request failed with status code 404 (https://www.caiabbiategrasso.it/it/attivita-sezionali); previous-unavailable-skipped: Skipped URL previously confirmed unavailable: Request failed with status code 404 (https://www.caiabbiategrasso.it/images/news/pdf/Calendario_Intersezionale_Escursionismo_e_AG_2022__def.pdf); previous-unavailable-skipped: Skipped URL previously confirmed unavailable: Request failed with status code 404 (https://www.caiabbiategrasso.it/images/attivita/sci/Programma_2024_def-1.jpg); previous-unavailable-skipped: Skipped URL previously confirmed unavailable: Request failed with status code 404 (https://www.caiabbiategrasso.it/images/attivita/sci/Programma_2024_def-2.jpg) |

## Tracce documento e cache

### cai-codogno-9216071 — CAI Codogno

- Stato finale: `partial`; 13 record nel file; 36 documenti registrati. URL iniziale: https://www.caicodogno.it/media/137807/a4-programma-2026-one-page.pdf.
- Estratti positivi:
  - https://www.caicodogno.it/media/137807/a4-programma-2026-one-page.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `357fc4dff6eec5e19b58b3af68359f7e616a84738da63372908ecd0fd907f70a`.
  - https://www.caicodogno.it/media/138129/programma-cai-2026_new.pdf · `pdf-ocr` · 30 eventi estratti · cache SHA-256 `11920638de3f996520d916d45184bdf9b678c209077a677ed45439f056342f23`.
  - https://www.caicodogno.it/le-attivita/elenco-escursioni-2026 · `html-calendar` · 4 eventi estratti · cache SHA-256 `f04558807e29e665a652b17a5071adabfa9b45c16088878a0a9ac0e4514ef9fc`.
  - https://www.caicodogno.it/attivita/2026/escursione-e-ferrata-in-dolomiti-rifugio-pisciadu-bz · `html-calendar` · 1 eventi estratti · cache SHA-256 `a18b6830676f7b73bb66b6516d98490eacdcd4ffa43bcd949872fb3f69288ea4`.
  - https://www.caicodogno.it/attivita/2026/escursione-al-monte-alben-bg · `html-calendar` · 1 eventi estratti · cache SHA-256 `e4a6c6bae7ea6f3612b79e99caa03a7abea431f4a3ac4b3ef5ab51d37c47875c`.
  - https://www.caicodogno.it/media/138490/2026-escursionismo-v02.pdf · `pdf-text` · 2 eventi estratti · cache SHA-256 `5365861c89fa205bfe7531d28462f6883fc1c23c626ca4fca460c3252a1636a2`.
  - https://www.caicodogno.it/attivita/2026/escursione-con-ciaspole-localit%C3%A0-da-definire · `html-calendar` · 1 eventi estratti · cache SHA-256 `c29ee8d6f006ce9982898be9e1f7938042864e941bbc44e5b4982f24bd6e7ec6`.
  - https://www.caicodogno.it/attivita/2026/bus-della-neve-al-passo-del-tonale · `html-calendar` · 1 eventi estratti · cache SHA-256 `2c2b30ef07052713ddcdb6129a61193257e51b096b7cfec227f4bd8afa1131d8`.
  - https://www.caicodogno.it/attivita/2026/escursione-con-ciaspole-in-notturna-al-monte-penice-pc · `html-calendar` · 1 eventi estratti · cache SHA-256 `8e4bb855434467d4311513893476d41bcf2fa101223446ad3aac792579d03439`.
  - https://www.caicodogno.it/attivita/2026/escursione-con-ciaspole-al-monte-ragola-pc · `html-calendar` · 1 eventi estratti · cache SHA-256 `4f270365d0f49610bec8812d7809ad1752e7205d69cc1fd8ed47166a5fc4e5b6`.
  - https://www.caicodogno.it/attivita/2026/scialpinismo-monte-facciabella-ao · `html-calendar` · 1 eventi estratti · cache SHA-256 `6465da8be7bca89f975cc44af6fba4a37589b21b504e6300ca6ef879e34f95cc`.
  - https://www.caicodogno.it/media/148797/04_bilancio-preventivo-2026-18022026.pdf · `pdf-text` · 0 eventi estratti · cache SHA-256 `cc39b87621d27b35b549ceb06bd70cff50a4a47f0a3d97821a86de5b6ea8fcd3`.
  - https://www.caicodogno.it/attivita/2026/scialpinismo-in-adamello · `html-calendar` · 1 eventi estratti · cache SHA-256 `c1c909b334e685038203470d73663e944543e6c76c90d9b9a45c301e446820a9`.
  - https://www.caicodogno.it/attivita/2026/escursione-in-liguria-i-forti-di-genova-ge · `html-calendar` · 1 eventi estratti · cache SHA-256 `0e97d171b796e0abc480b54e8c79facb83b0d6ea37971098367ec5208946ae98`.
  - https://www.caicodogno.it/attivita/2026/urban-trekking-brescia-bs · `html-calendar` · 1 eventi estratti · cache SHA-256 `a1e68cb63952a83204f456fb9d67686b1e9773f295ba0ffd6d095745b3792da8`.
  - https://www.caicodogno.it/attivita/2026/escursione-alla-corna-trentapassi-bs · `html-calendar` · 1 eventi estratti · cache SHA-256 `cda125b3fe5614073527fd453a08ee7042119ff62eb74f34c785f80152884cbc`.
  - https://www.caicodogno.it/attivita/2026/escursione-alla-pietra-di-bismantova-e-ferrata-degli-alpini-re · `html-calendar` · 1 eventi estratti · cache SHA-256 `2288ab722fef98aa4f4c0f752df64bd4291e0543e67a8324d41cd2d23fc47598`.
  - https://www.caicodogno.it/attivita/2026/arrampicata-con-il-liceo-dello-sport-a-bolzano · `html-calendar` · 1 eventi estratti · cache SHA-256 `de91e1aa0d2ba67680fee060d05df1b7ce738195dff5071521388a360b5b69ac`.
  - https://www.caicodogno.it/attivita/2026/serata-di-approfondimento-progressione-su-ghiacciaio-e-via-ferrata · `html-calendar` · 1 eventi estratti · cache SHA-256 `2297dab3f92ba912255d71c96f7af9f113a7e20efc293e6749d81bd7d2a40e48`.
  - https://www.caicodogno.it/attivita/2026/assemblea-nazionale-dei-delegati-2026 · `html-calendar` · 1 eventi estratti · cache SHA-256 `f7f6d6982c9c97d67de993ef59307d304cb93468ce4a6bb26ee5cfb59c45541d`.
  - https://www.caicodogno.it/attivita/2026/uscita-alpinistica-ai-breithorn-ao · `html-calendar` · 1 eventi estratti · cache SHA-256 `c7e0cf987b0dfb6640f9c78a30d4c01946fd4d64514bfcbc7bb48643c8a9da60`.
  - https://www.caicodogno.it/attivita/2026/escursione-in-val-maira-rifugio-campobase-cn · `html-calendar` · 1 eventi estratti · cache SHA-256 `50287ed4bc9b3030631b9e0aeb3de63ed8e9f0b9bfbc964c707991412af5e605`.
  - https://www.caicodogno.it/attivita/2026/escursione-in-liguria-levante-ligure-levanto-sp · `html-calendar` · 1 eventi estratti · cache SHA-256 `9e540549d07430dfccadbd36b464de82a527ed43e49b3cc259b582711331cf52`.
- Problemi/residui:
  - `non-calendar-link-skipped` · Skipped social, feed, metadata, sharing, or unrelated image URL. · https://twitter.com/intent/tweet?url=https://www.caicodogno.it/le-attivita/programma-2026
  - `non-calendar-link-skipped` · Skipped social, feed, metadata, sharing, or unrelated image URL. · https://www.linkedin.com/shareArticle?mini=true&url=https://www.caicodogno.it/le-attivita/programma-2026
  - `discovery-limit` · Discovery budget reached; 431 candidate documents remain. · https://www.caicodogno.it/media/137807/a4-programma-2026-one-page.pdf

### cai-livigno-9216120 — CAI Livigno

- Stato finale: `failed`; 2 record nel file; 0 documenti registrati. URL iniziale: https://organizzazione.cai.it/sez-livigno/eventi/?ical=1.
- Nessun documento con metodo di estrazione positivo.
- Errore della fonte: Skipped social, feed, metadata, sharing, or unrelated image URL.
- Nessun problema residuo registrato.

### cai-nerviano-9216100 — CAI Nerviano

- Stato finale: `partial`; 4 record nel file; 10 documenti registrati. URL iniziale: https://www.cainerviano.it/images/CAI/Documents/2026/2026_Varie/2025_11_21_Programma_CAI_2026_Stampa_013.pdf.
- Estratti positivi:
  - https://www.cainerviano.it/index.php?option=com_content&view=article&id=55:programma-2026&catid=9&Itemid=222 · `html-calendar` · 1 eventi estratti · cache SHA-256 `47ea914b5979b9a9c4b27ec84f2c8fcc73fbc4b16367a3e2c5acecfc9449c1f6`.
  - https://www.cainerviano.it/index.php?option=com_content&view=article&id=55:programma-2026&catid=9&Itemid=222&tmpl=component&print=1&layout=default&page= · `html-calendar` · 1 eventi estratti · cache SHA-256 `2460cc68747bb7b4d2b3e0862bd654ca5fab15e4f66191fc63408d14bc60e79a`.
  - https://www.cainerviano.it/images/CAI/Documents/2026/2026_Varie/2026_06_27_Trekking_Marguareis_Volant.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `ec66b7f26352697bb989d4ebde829b2a74c2ebad96c6c394a76f2f860e528c9c`.
  - https://www.cainerviano.it/index.php?option=com_content&view=article&id=55&Itemid=222 · `html-calendar` · 1 eventi estratti · cache SHA-256 `bb524adb999654efd0585a0435c396850244b96c7be01151c0905d19302015eb`.
  - https://www.cainerviano.it/images/CAI/Documents/2026/2026_Varie/2025_11_21_Programma_CAI_2026_Stampa_015.pdf · `pdf-text` · 5 eventi estratti · cache SHA-256 `6d02d95ed3671de54959b658855ddf4055e853bcbd531a5851718ed8fb7c9042`.
  - https://www.cainerviano.it/images/CAI/Documents/Regolamenti/CAI_Nerviano_Regolamento_Gite.pdf · `pdf-text` · 0 eventi estratti · cache SHA-256 `4ef6cd8c9731782e82640772281d6277f54f196928a726affa7f2ed713604f79`.
  - https://www.cainerviano.it/index.php?option=com_content&view=article&id=55:programma-2026&catid=9&Itemid=213 · `html-calendar` · 1 eventi estratti · cache SHA-256 `000c70230528e29712e11c58eb335a78d5ee3c4454ccf096d18e94da3e05ab56`.
  - https://www.cainerviano.it/images/CAI/Documents/2026/2026_Varie/2026_09_25_Vol_Trekking_Dolomiti.png · `image-ocr` · 0 eventi estratti · cache SHA-256 `8011cd826f3931479b4f8eae0d004164c00f60c9c61fa16c5ec6a25fd4879b9e`.
- Problemi/residui:
  - `previous-unavailable-skipped` · Skipped URL previously confirmed unavailable: Skipped URL previously confirmed unavailable: Request failed with status code 404 · https://www.cainerviano.it/images/CAI/Documents/2026/2026_Varie/2025_11_21_Programma_CAI_2026_Stampa_013.pdf

### cai-lissone-9216040 — CAI Lissone

- Stato finale: `partial`; 7 record nel file; 40 documenti registrati. URL iniziale: https://cai-lissone.it/attivita/dettaglio/?num=255&tipo=escursionismo.
- Estratti positivi:
  - https://www.cai-lissone.it/ · `html-calendar` · 2 eventi estratti · cache SHA-256 `0a3cb220027a29a26a17a346c556aeb43ef0d11eeb0be0b617b4e8da458d6314`.
  - https://www.cai-lissone.it/escursionismo/ · `html-calendar` · 24 eventi estratti · cache SHA-256 `60696821c6dead1eb316ec198706d1c42d48b774747646ed50d04a0375c13d9b`.
  - https://www.cai-lissone.it/archivio/attivita/264/r-264.pdf · `pdf-text` · 0 eventi estratti · cache SHA-256 `f6717dd17a50d99b7fcb91244c27c95593a314bcce04cb997efc22fdb5625ff9`.
  - https://www.cai-lissone.it/archivio/attivita/262/r-262.pdf · `pdf-text` · 0 eventi estratti · cache SHA-256 `fe48d32c77bab8fe1cea899ae54873f735b29f3cbf4ce1cacb7119f0f525fbc9`.
  - https://www.cai-lissone.it/archivio/attivita/259/r-259.pdf · `pdf-text` · 0 eventi estratti · cache SHA-256 `d1f3bd5232c1a1dd758a16b6a64c91217e8d2c5f59958f32581ae7c2d8ea36f2`.
  - https://www.cai-lissone.it/archivio/attivita/254/r-254.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `d9f4ef714bfd85f374e4931802ced749cb43dadd1ec3cb96a4e0975c29038b6f`.
  - https://www.cai-lissone.it/archivio/attivita/228/r-228.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `9e4ff6dcea36ea63d457ac7e1b99fb2c0ff037e7e4426a38b6d856d786245373`.
  - https://www.cai-lissone.it/archivio/attivita/250/r-250.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `428f95457c8edd6f9acdd1c08a572cc5ad585eec61259e40fc9c7d2b67abe34d`.
  - https://www.cai-lissone.it/archivio/attivita/249/r-249.pdf · `pdf-text` · 0 eventi estratti · cache SHA-256 `09fd55601b052730b37b298a9359252696d0c7254d1895226ef55c4b4b9d1ea2`.
  - https://www.cai-lissone.it/archivio/attivita/248/r-248.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `9c74e6a78c732adbf725a03d7fd999bd70b259a86ef41a747ac74527971f3064`.
  - https://www.cai-lissone.it/archivio/attivita/238/r-238.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `047460124a58df5f9660cdb621ecbc8de48f5b6db5fe8a316edd2ae395319d94`.
  - https://www.cai-lissone.it/archivio/attivita/234/r-234.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `640423575b4837b495fab976bef3b87a63907ad6907e2922aceaa968f167a251`.
  - https://www.cai-lissone.it/archivio/attivita/229/r-229.pdf · `pdf-text` · 0 eventi estratti · cache SHA-256 `fb7d473acb2dde8ce42438a2f402a072785b6abff98004e3de4a1cac5b654031`.
  - https://www.cai-lissone.it/archivio/attivita/225/r-225.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `455371a4bdbf3de780048160f085c7c5a5c165410a5e80ce997f2bba64b5fdc7`.
  - https://www.cai-lissone.it/archivio/attivita/223/r-223.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `e937b0285bcf1f30c68d9367185315d35b15b663253fcb75c92a6398128d63c2`.
  - https://www.cai-lissone.it/archivio/attivita/222/r-222.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `ee6f746355e90b747c8af707ccf1ae56f7b633a26a6b2a81dde1ebad9ce31283`.
  - https://www.cai-lissone.it/archivio/attivita/219/r-219.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `eab814e644ba2b0b0bf3d53d608f48bd11c7f1925ba5e9cdcc2633a229301f5e`.
  - https://www.cai-lissone.it/archivio/attivita/217/r-217.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `f14409f6243fb9296445dc1aa0fe8f34db4a5295b69be97fff598c8e55f35a44`.
  - https://www.cai-lissone.it/archivio/attivita/201/r-201.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `7f62aeeab949227a27559bc9488c59339c2c6e98622697df65debede7888843f`.
  - https://www.cai-lissone.it/archivio/attivita/200/r-200.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `f73af2568a1ff4ae5a5598339a130fb86ab8286e04f3a6f21739184ddd04a54d`.
  - https://www.cai-lissone.it/archivio/attivita/199/r-199.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `a36cf2f94691a65a707547ed3eb13e800c75537312292593be2e042ff083e1dc`.
  - https://www.cai-lissone.it/archivio/attivita/193/r-193.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `19ea29a31fc2a481b949ad29589a094b62a9f0256765d463d4630cd2e5c8686f`.
  - https://www.cai-lissone.it/archivio/attivita/198/r-198.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `a88f87f8902898a9dc4faa70f9b97754079397e3228d131d94f0f943248553a9`.
  - https://www.cai-lissone.it/archivio/attivita/192/r-192.pdf · `pdf-text` · 0 eventi estratti · cache SHA-256 `367e29bfbb1799aa70a34617ac5ea8f7e05323a197ee6cca190bdf2c89706883`.
  - https://www.cai-lissone.it/archivio/attivita/191/r-191.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `51fae867d7f04a19ae85cd7d2914743ca5c04031fa32648acfede95f164f6aad`.
  - https://www.cai-lissone.it/archivio/attivita/159/r-159.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `055483804e5bad75b444937378c36c249587f2933fdb2f1d674bc1ea5914b027`.
  - https://www.cai-lissone.it/archivio/attivita/189/r-189.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `207f8d98870df4e773393ed7a8bc85b2ccc3362a285066063986b7cd532d024c`.
  - https://www.cai-lissone.it/archivio/attivita/169/r-169.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `af00f72a79596bef9f9125c0c65d2550bcbef3ff8e1ad79202a0d7ede2c22bcc`.
  - https://www.cai-lissone.it/archivio/attivita/166/r-166.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `89f73a3e2dcb9ed7542b9a95891bf459ecb8aa5a73a8c499ab141acf1a99e78d`.
  - https://www.cai-lissone.it/archivio/attivita/165/r-165.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `024f4151c7b5c462ae9c7cc8e28357a982fbb7272f3c40fb8d99ae5ecd46a82c`.
  - https://www.cai-lissone.it/archivio/attivita/175/r-175.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `c39e4bac39be78d1cdb57bfcf04f2667ae9622fb8db57fdd113f2ae633c8bd6c`.
  - https://www.cai-lissone.it/archivio/attivita/150/r-150.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `41d01f7abd2fd65cb0f5266469ee4432e58aa2929ab76293e80d8df08aad10e7`.
  - https://www.cai-lissone.it/archivio/attivita/109/r-109.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `6534860f98b376a96ad83357379c7ad53c29179e24934d034e095c4c64e03ab2`.
  - https://www.cai-lissone.it/archivio/attivita/107/r-107.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `2dd76505ef41c78af68e4317ebf38e13e7583ac2e81ab5b7b5adc1bdee30a26b`.
- Problemi/residui:
  - `discovery-limit` · Discovery budget reached; 65 candidate documents remain. · https://cai-lissone.it/attivita/dettaglio/?num=255&tipo=escursionismo

### cai-laveno-mombello-9216032 — CAI Laveno Mombello

- Stato finale: `partial`; 9 record nel file; 16 documenti registrati. URL iniziale: https://cailavenomombello.it/wp-content/uploads/2026/05/260529_Volantino-pesentazione-Cicloescursionismo-CAI.pdf.
- Estratti positivi:
  - https://cailavenomombello.it/wp-content/uploads/2026/05/260529_Volantino-pesentazione-Cicloescursionismo-CAI.pdf · `pdf-text` · 0 eventi estratti · cache SHA-256 `62d3ea5e8ea2535a6aee7e03f7c7cc5e025845a632e5f138164ad461c4ffe5dc`.
  - https://cailavenomombello.it/settori/ · `html-calendar` · 29 eventi estratti · cache SHA-256 `db7ee6ecbe42babe9df41641d668a55fa1dbb45a6f52d4ae7bcb6910b02af5d1`.
  - https://cailavenomombello.it/2026/05/23/29-maggio-2026-presentazione-attivita-cicloescursionismo/ · `html-calendar` · 1 eventi estratti · cache SHA-256 `a65b0fb8c9acee00f283f592869193faa25bf61305f666ec925a5e1f1a09cfde`.
  - https://cailavenomombello.it/2026/04/14/19-aprile-2026-escursione-intersezionale-con-cai-dongo_-trekking-penne-nere-mesenzana/ · `html-calendar` · 1 eventi estratti · cache SHA-256 `a0d8cd9e8395a4a7efb36ba60090c4a15786bd91026830f0dbe8825ed308c6df`.
  - https://cailavenomombello.it/wp-content/uploads/2026/03/escursione-liguria-12.4.26-1.pdf · `pdf-text` · 1 eventi estratti · cache SHA-256 `f7f3e1a7b53401679eef03337dd4048d7514cba60bc3cb1ef9b1f1ccbfe49f12`.
  - https://cailavenomombello.it/wp-content/uploads/2026/09/Escursione-enogastronomica-Oltrepo-Pavese-4-ott.pdf · `pdf-text` · 0 eventi estratti · cache SHA-256 `276ddfd4fcc24d041af0ca63241036863a260d528e6a3f1d125c2098af0015b0`.
  - https://cailavenomombello.it/2026/07/09/1-2-agosto-2026-escursione-intersezionale-con-cai-somma-lombardo-rifugio-somma-e-blinnenhorn/ · `html-calendar` · 1 eventi estratti · cache SHA-256 `981ffb6df2a2ad398d15ed0d526596db7f67a561fd9d5da333756814193c5be5`.
  - https://cailavenomombello.it/2026/05/13/17-maggio-2026-escursione-intersezionale-con-cai-dongo-sentiero-delle-espressioni-sasso-gordona/ · `html-calendar` · 1 eventi estratti · cache SHA-256 `c532da97d94a69d7c575a38a60f00a3690f09d1f29c0bb58c57f3ae054e93bd4`.
  - https://cailavenomombello.it/2026/04/23/1-maggio-2026-escursione-intersezionale-con-cai-gazzada-schianno_-colmine-di-crevola/ · `html-calendar` · 2 eventi estratti · cache SHA-256 `c616815de7c1bf0f95ba9b326ecfd6100c3defcf1b5306daeab7d32351a4dd89`.
  - https://cailavenomombello.it/category/eventi/ · `html-calendar` · 1 eventi estratti · cache SHA-256 `b7e1e6d352641a5df6a23f56d4b77e7bbdb850ada5a8877ac1bbc61af706d031`.
  - https://cailavenomombello.it/category/escursioni/ · `html-calendar` · 1 eventi estratti · cache SHA-256 `5657da8cd214d7e1c5cb02de4ecfb156b5de9744fe2409f0785034c31630cb5b`.
  - https://cailavenomombello.it/category/eventi/page/2/ · `html-calendar` · 2 eventi estratti · cache SHA-256 `410439389aa4623700712c1975d3541b92104dbb626e2dda180df9bb64939e25`.
- Problemi/residui:
  - `non-calendar-link-skipped` · Skipped social, feed, metadata, sharing, or unrelated image URL. · https://cailavenomombello.it/2026/05/23/29-maggio-2026-presentazione-attivita-cicloescursionismo/feed/
  - `non-calendar-link-skipped` · Skipped social, feed, metadata, sharing, or unrelated image URL. · https://cailavenomombello.it/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fcailavenomombello.it%2F2026%2F05%2F23%2F29-maggio-2026-presentazione-attivita-cicloescursionismo%2F
  - `non-calendar-link-skipped` · Skipped social, feed, metadata, sharing, or unrelated image URL. · https://cailavenomombello.it/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fcailavenomombello.it%2F2026%2F05%2F23%2F29-maggio-2026-presentazione-attivita-cicloescursionismo%2F&format=xml
  - `error` · timeout of 8000ms exceeded · https://cailavenomombello.it/escursioni/

### cai-strada-storta-9116052 — CAI Strada Storta

- Stato finale: `partial`; 6 record nel file; 19 documenti registrati. URL iniziale: https://www.google.com/calendar/event?action=TEMPLATE&text=60%C2%B0+Strada+Storta&dates=20260912T160000/20260912T220000&details=CiaoIl+percorso+dei+festeggiamenti+per+i+60+anni+del+CAI+Strada+Storta+PROSEGUE+con+un+nuovo+appuntamento+da+condividere.+Segnatevi+sul+calendario+il+12+settembre%21Festeggeremo+all%26%238217%3Boratorio+di+Acquate%3A+l%C3%AC+trascorreremo+del+tempo+insieme+passando+per+merenda%2C+arrampicata%2C+Santa+Messa%2C+musica%2C+aperitivo+e+cena.Un+momento+pensato+per+ritrovarsi%2C+incontrare+vecchi+e+nuovi+amici+e+continuare+a+celebrare+una+storia+che+%C3%A8+fatta+da+60+anni+di+montagna%2C+persone+e+condivisione.%26nbsp%3BVi+aspettiamo+per+festeggiare+insieme%21%3Ca+href%3D%22https%3A%2F%2Fstradastorta.it%2Fwp-content%2Fuploads%2F2026%2F07%2F60esimo_StradaStorta.pdf%22%3ESCARICA+LA+LOCANDINA%3C%2Fa%3E&location=&trp=false&sprop=https%3A%2F%2Fstradastorta.it%2Feventi%2F60-strada-storta%2F&sprop=name:CAI+Strada+Storta&ctz=Europe%2FRome.
- Estratti positivi:
  - https://stradastorta.it/eventi/60-strada-storta/ical/ · `ics` · 1 eventi estratti · cache SHA-256 `2c32eb3c19c8eff3bf23040ef64e6a3cf6dd457417d0ccdcafc2d98bed005293`.
  - https://stradastorta.it/eventi/lagh-da-cavloc/ical/ · `ics` · 1 eventi estratti · cache SHA-256 `4cd8e2ac15ce8f3d7060d25c382ba8dcdc0f5fb626723b78d314800043fe1958`.
  - https://stradastorta.it/eventi/gara-sociale-di-marcia-alpina-e-castagnata/ical/ · `ics` · 1 eventi estratti · cache SHA-256 `d509899d0a26e1a0d7226f288da014ea85b9d292b7435aba6f1eb868c399a274`.
  - https://stradastorta.it/eventi/messa-in-ricordo-dei-nostri-defunti/ical/ · `ics` · 1 eventi estratti · cache SHA-256 `5f362da89ad7fbe79a7a38c7d9f347bbc6c820e79c7eb60567d636a9d147c892`.
  - https://stradastorta.it/eventi/ferrata-medale/ical/ · `ics` · 1 eventi estratti · cache SHA-256 `bb2fee92b64d385caa80266b444c7a33bc5b16cff34f0f194ebc07548e58b483`.
  - https://stradastorta.it/eventi/pranzo-sociale/ical/ · `ics` · 1 eventi estratti · cache SHA-256 `e56cc4fbceaf6475ed41402462cdde4abc719c92bc68c5354a9d0900a838681b`.
  - https://stradastorta.it/eventi/gita-culturale/ical/ · `ics` · 1 eventi estratti · cache SHA-256 `fb34f0a9a3cf31b45f039b661207efaf185936654e2f8803f6dd5964a3077c25`.
  - https://stradastorta.it/eventi/auguri-natalizi/ical/ · `ics` · 1 eventi estratti · cache SHA-256 `e5632bc045646e3f6a830b05dcca997b845b106a1166850deb6e1f2773d6e18c`.
- Problemi/residui:
  - `previous-unavailable-skipped` · Skipped URL previously confirmed unavailable: Failed to establish tunnel to accounts.google.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden · https://www.google.com/calendar/event?action=TEMPLATE&text=60%C2%B0+Strada+Storta&dates=20260912T160000/20260912T220000&details=CiaoIl+percorso+dei+festeggiamenti+per+i+60+anni+del+CAI+Strada+Storta+PROSEGUE+con+un+nuovo+appuntamento+da+condividere.+Segnatevi+sul+calendario+il+12+settembre%21Festeggeremo+all%26%238217%3Boratorio+di+Acquate%3A+l%C3%AC+trascorreremo+del+tempo+insieme+passando+per+merenda%2C+arrampicata%2C+Santa+Messa%2C+musica%2C+aperitivo+e+cena.Un+momento+pensato+per+ritrovarsi%2C+incontrare+vecchi+e+nuovi+amici+e+continuare+a+celebrare+una+storia+che+%C3%A8+fatta+da+60+anni+di+montagna%2C+persone+e+condivisione.%26nbsp%3BVi+aspettiamo+per+festeggiare+insieme%21%3Ca+href%3D%22https%3A%2F%2Fstradastorta.it%2Fwp-content%2Fuploads%2F2026%2F07%2F60esimo_StradaStorta.pdf%22%3ESCARICA+LA+LOCANDINA%3C%2Fa%3E&location=&trp=false&sprop=https%3A%2F%2Fstradastorta.it%2Feventi%2F60-strada-storta%2F&sprop=name:CAI+Strada+Storta&ctz=Europe%2FRome
  - `non-calendar-link-skipped` · Skipped social, feed, metadata, sharing, or unrelated image URL. · https://outlook.office.com/calendar/0/deeplink/compose?allday=false&body=CiaoIl+percorso+dei+festeggiamenti+per+i+60+anni+del+CAI+Strada+Storta+PROSEGUE+con+un+nuovo+appuntamento+da+condividere.+Segnatevi+sul+calendario+il+12+settembre%21Festeggeremo+all%26%238217%3Boratorio+di+Acquate%3A+l%C3%AC+trascorreremo+del+tempo+insieme+passando+per+merenda%2C+arrampicata%2C+Santa+Messa%2C+musica%2C+aperitivo+e+cena.Un+momento+pensato+per+ritrovarsi%2C+incontrare+vecchi+e+nuovi+amici+e+continuare+a+celebrare+una+storia+che+%C3%A8+fatta+da+60+anni+di+montagna%2C+persone+e+condivisione.%26nbsp%3BVi+aspettiamo+per+festeggiare+insieme%21%3Ca+href%3D%22https%3A%2F%2Fstradastorta.it%2Fwp-content%2Fuploads%2F2026%2F07%2F60esimo_StradaStorta.pdf%22%3ESCARICA+LA+LOCANDINA%3C%2Fa%3E&location=&path=/calendar/action/compose&rru=addevent&startdt=2026-09-12T16%3A00%3A00%2B02%3A00&enddt=2026-09-12T22%3A00%3A00%2B02%3A00&subject=60%C2%B0+Strada+Storta
  - `non-calendar-link-skipped` · Skipped social, feed, metadata, sharing, or unrelated image URL. · https://outlook.live.com/calendar/0/deeplink/compose?allday=false&body=CiaoIl+percorso+dei+festeggiamenti+per+i+60+anni+del+CAI+Strada+Storta+PROSEGUE+con+un+nuovo+appuntamento+da+condividere.+Segnatevi+sul+calendario+il+12+settembre%21Festeggeremo+all%26%238217%3Boratorio+di+Acquate%3A+l%C3%AC+trascorreremo+del+tempo+insieme+passando+per+merenda%2C+arrampicata%2C+Santa+Messa%2C+musica%2C+aperitivo+e+cena.Un+momento+pensato+per+ritrovarsi%2C+incontrare+vecchi+e+nuovi+amici+e+continuare+a+celebrare+una+storia+che+%C3%A8+fatta+da+60+anni+di+montagna%2C+persone+e+condivisione.%26nbsp%3BVi+aspettiamo+per+festeggiare+insieme%21%3Ca+href%3D%22https%3A%2F%2Fstradastorta.it%2Fwp-content%2Fuploads%2F2026%2F07%2F60esimo_StradaStorta.pdf%22%3ESCARICA+LA+LOCANDINA%3C%2Fa%3E&location=&path=/calendar/action/compose&rru=addevent&startdt=2026-09-12T16%3A00%3A00%2B02%3A00&enddt=2026-09-12T22%3A00%3A00%2B02%3A00&subject=60%C2%B0+Strada+Storta

### cai-como-9216006 — CAI Como

- Stato finale: `partial`; 1 record nel file; 19 documenti registrati. URL iniziale: https://www.caicomo.it/la-sezione/eventi/programma-150.
- Estratti positivi:
  - https://www.caicomo.it/la-sezione/calendario-eventi?task=ical.download&id=28 · `ics` · 21 eventi estratti · cache SHA-256 `19df037774249a95dffb695c59ef1c7f8b57428bee0748a7cdc926ba47fc94bf`.
  - https://www.caicomo.it/la-sezione/calendario-eventi?task=ical.download&id=29 · `ics` · 52 eventi estratti · cache SHA-256 `00a3526cb8b43cf69ffa8a4bf77c33cd8ad8479c8437143f345fde1c933fc3a9`.
  - https://www.caicomo.it/la-sezione/calendario-eventi?task=ical.download&id=30 · `ics` · 81 eventi estratti · cache SHA-256 `718be5c0255e9cd9120cff8328a14b4d127329f1f393ca6b1db1b423c10b0799`.
  - https://www.caicomo.it/la-sezione/calendario-eventi?task=ical.download&id=31 · `ics` · 0 eventi estratti · cache SHA-256 `8a5c46f87b5734c6b6bb2f407c6a57f96d6e0013268bf947f1142758d7076932`.
  - https://www.caicomo.it/la-sezione/calendario-eventi?task=ical.download&id=33 · `ics` · 104 eventi estratti · cache SHA-256 `2ed463081858e15ffdcf37e93ad0a2c29581fac5488cdbf3de69ac6ef469404e`.
  - https://www.caicomo.it/la-sezione/calendario-eventi?task=ical.download&id=34 · `ics` · 25 eventi estratti · cache SHA-256 `ca77117565003558bade9e7665db32000dfd46304ad2e7135d8e90e4768f7d23`.
  - https://www.caicomo.it/la-sezione/eventi/open-day-speleo · `html-calendar` · 1 eventi estratti · cache SHA-256 `584d3bd4a0d940b7d77988f0166146fb8050074e85b472e5c90e6d38a7eeeb56`.
  - https://www.caicomo.it/la-sezione/eventi/open-day-speleo/open-day-speleo-08-novembre-2026 · `html-calendar` · 1 eventi estratti · cache SHA-256 `ec939c60550dbf0ecbe4dfcb8c78f1b0e3ad21d6b364c99a3d938215460c8b8a`.
- Problemi/residui:
  - `previous-unavailable-skipped` · Skipped URL previously confirmed unavailable: Request failed with status code 500 · https://www.caicomo.it/la-sezione/eventi/corso-geologia-2026
  - `previous-unavailable-skipped` · Skipped URL previously confirmed unavailable: Request failed with status code 500 · https://www.caicomo.it/la-sezione/eventi/corsi-torrentismo

### cai-abbiategrasso-9216049 — CAI Abbiategrasso

- Stato finale: `partial`; 1 record nel file; 27 documenti registrati. URL iniziale: https://www.caiabbiategrasso.it/news/programma-inverno-e-primavera-2026.
- Estratti positivi:
  - https://www.caiabbiategrasso.it/ · `html-calendar` · 1 eventi estratti · cache SHA-256 `54a894e7cfac90dda972b8b72706ddb44f0ff86082244cceab0561189d677a7f`.
  - https://www.caiabbiategrasso.it/images/file/369/trekking-foreste-casentinesi-2026-1.pdf · `pdf-text` · 0 eventi estratti · cache SHA-256 `9d2421f69c8d89dd1dea2a4df47cc6424d4934d430923105ced26a47921ae3cd`.
  - https://www.caiabbiategrasso.it/images/file/402/locandina-trekking-2027ver-2-pz.png · `image-ocr` · 0 eventi estratti · cache SHA-256 `ad7f8dd8a9d8645e7306dc71dd23cbf4e7b4aa4518f47c8b9ce2ea0b65bba1cf`.
- Problemi/residui:
  - `previous-unavailable-skipped` · Skipped URL previously confirmed unavailable: Skipped URL previously confirmed unavailable: Request failed with status code 404 · https://www.caiabbiategrasso.it/calendario/eventi/4x100-autunno-2026
  - `previous-unavailable-skipped` · Skipped URL previously confirmed unavailable: Skipped URL previously confirmed unavailable: Request failed with status code 404 · https://www.caiabbiategrasso.it/calendario/eventi/alpinismo-giovanile-autunno-2026
  - `non-calendar-link-skipped` · Skipped social, feed, metadata, sharing, or unrelated image URL. · https://twitter.com/intent/tweet?text=&url=https%3A%2F%2Fwww.caiabbiategrasso.it%2Fnews%2Fprogramma-inverno-e-primavera-2026&related=
  - `non-calendar-link-skipped` · Skipped social, feed, metadata, sharing, or unrelated image URL. · https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fwww.caiabbiategrasso.it%2Fnews%2Fprogramma-inverno-e-primavera-2026&title=Programma+Inverno+e+Primavera+2026&summary=
  - `non-calendar-link-skipped` · Skipped social, feed, metadata, sharing, or unrelated image URL. · https://twitter.com/intent/tweet?text=&url=https%3A%2F%2Fwww.caiabbiategrasso.it%2Fcalendario%2Feventi%2F4x100-autunno-2026&related=
  - `non-calendar-link-skipped` · Skipped social, feed, metadata, sharing, or unrelated image URL. · https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fwww.caiabbiategrasso.it%2Fcalendario%2Feventi%2F4x100-autunno-2026&title=4X100+AUTUNNO+2026&summary=
  - `previous-unavailable-skipped` · Skipped URL previously confirmed unavailable: Request failed with status code 404 · https://www.caiabbiategrasso.it/it/attivita-sezionali
  - `previous-unavailable-skipped` · Skipped URL previously confirmed unavailable: Request failed with status code 404 · https://www.caiabbiategrasso.it/images/news/pdf/Calendario_Intersezionale_Escursionismo_e_AG_2022__def.pdf
  - `previous-unavailable-skipped` · Skipped URL previously confirmed unavailable: Request failed with status code 404 · https://www.caiabbiategrasso.it/images/attivita/sci/Programma_2024_def-1.jpg
  - `previous-unavailable-skipped` · Skipped URL previously confirmed unavailable: Request failed with status code 404 · https://www.caiabbiategrasso.it/images/attivita/sci/Programma_2024_def-2.jpg

## QA record rimossi

La query read-only ha trovato due ID locali assenti da Supabase, entrambi già identificati nei report deep-04/deep-05 come invalidi e ripresentati dal passaggio Codogno. Rimossi solo dai JSON locali; nessun record DB è stato toccato:

- `cai-codogno-9216071-282383842231` — “Escursione al Rif. Grassi e salita al Pizzo ▪ Domenica”, 2026-11-08. **Scartato:** associazione tra colonne errata; il giorno 8 novembre appartiene a un altro evento nel PDF ufficiale.
- Fonte: https://www.caicodogno.it/media/138129/programma-cai-2026_new.pdf; stesso documento registrato nel report deep-05.

- `cai-codogno-9216071-bfe5c3553005` — “o Sabato 21 Pranzo o Cena Sociale, da definire.”, data parser 2026-11-15. **Scartato:** il PDF dice “Domenica 15 o Sabato 21”; la data non è determinabile.
- Fonte: https://www.caicodogno.it/media/138129/programma-cai-2026_new.pdf; esclusione già documentata nel report deep-03.

Gli altri 3.205 ID locali risultano tutti presenti e `published`; query finale: 0 draft/mancanti, 4.364 `places` e 837 `cai_sections`. Nessun record valido aggiunto dal deep-11 e nessuna scrittura DB eseguita.
