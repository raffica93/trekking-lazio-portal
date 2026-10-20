# Raccolta CAI Lombardia — deep-03

- Run: `cai-20261020-lombardia-deep-03`; singolo passaggio deterministico; 7 fonti selezionate; concorrenza 8; massimo 40 documenti e 90 s per fonte. Nessun retry.
- Raccolta: **partial**; file locali dopo la revisione: **3.170 eventi**, registry da 838 fonti.
- Risultato della raccolta prima della revisione manuale: 3.171 eventi. L’import iniziale aveva inserito 8 source ID e preservato 3.163 preesistenti.
- Riconciliazione DB verificata dopo QA: rimosso source ID `cai-codogno-9216071-bfe5c3553005`; 3.170 pubblicati, 0 draft, 3.170 source ID corrispondenti, 0 mancanti. Query verificata con 4.327 places e 837 cai_sections. La raccolta locale e il DB ora concordano su 3.170 source ID; 7 nuovi eventi restano pubblicati.

## Fonti del deep-03

| Fonte | Stato | Eventi locali dopo revisione | Candidati estratti (dato crawler) | Esito / impedimenti |
|---|---:|---:|---:|---|
| CAI Codogno (cai-codogno-9216071) | partial | 11 | 36 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; discovery-limit: Discovery budget reached; 62 candidate documents remain.; ambiguous-date-skipped: Excluded event “Domenica 15 o Sabato 21 – Pranzo o Cena Sociale, da definire”: the official calendar gives two alternative dates and co |
| CAI Varese (cai-varese-9216009) | partial | 58 | 547 | discovery-limit: Discovery budget reached; 93 candidate documents remain. |
| CAI Busto Arsizio (cai-busto-arsizio-9216014) | unsupported | 1 | 2 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. |
| CAI Lissone (cai-lissone-9216040) | partial | 7 | 52 | discovery-limit: Discovery budget reached; 65 candidate documents remain. |
| CAI Novate Milanese (cai-novate-milanese-9216043) | unsupported | 0 | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |
| CAI Carate Brianza (cai-carate-brianza-9216030) | partial | 6 | 19 | timeout of 2423ms exceeded; discovery-limit: Discovery budget reached; 344 candidate documents remain. |
| CAI Erba (cai-erba-9216099) | partial | 3 | 14 | PDF OCR unavailable or failed: OCR failed for page-06.png: psm 6: Command failed: tesseract /tmp/cai-pdf-ocr-yl0r3L/page-06.png stdout -l ita+eng --psm 6 ; psm 4: PDF OCR exceeded its 85055 ms time limit; discovery-limit: Discovery budget reached; 6 candidate documents remain. |

Codogno: il PDF ufficiale `https://www.caicodogno.it/media/138129/programma-cai-2026_new.pdf` ha recuperato testo OCR dopo il fallback pagina per pagina PSM 4. Il PDF segnala “Domenica 15 o Sabato 21 – Pranzo o Cena Sociale, da definire”; non specifica la data. È stato rimosso dal file locale l’evento `cai-codogno-9216071-bfe5c3553005`, titolo “o Sabato 21 Pranzo o Cena Sociale, da definire.”, data precedente 2026-11-15. Le fonti ufficiali confermano quindi il motivo dell’esclusione.

## Copertura Lombardia dopo il passaggio

Fonti abilitate: **125**; distribuzione: no-upcoming=18, ok=37, partial=39, unsupported=31. Fonti ancora unresolved (partial/unsupported/failed): **70** (39 partial, 31 unsupported, 0 failed).

| Fonte unresolved | Stato | Eventi correnti | Problemi registrati |
|---|---:|---:|---|
| CAI Bagolino (cai-bagolino-9116018) | unsupported | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |
| CAI Brescia (cai-brescia-9216005) | partial | 43 | Failed to establish tunnel to accesso.cai.it:443 via http://proxy:8080: HTTP/1.1 403 Forbidden; Failed to establish tunnel to accesso.cai.it:443 via http://proxy:8080: HTTP/1.1 403 Forbidden; Request failed with status code 404; discovery-limit: Discovery budget reached; 141 candidate documents remain. |
| CAI Cidneo O.m. (cai-cidneo-o-m-9116019) | unsupported | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |
| CAI Collebeato (cai-collebeato-9116110) | unsupported | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |
| CAI Iseo (diventata Sezione) (cai-iseo-diventata-sezione-9116023) | unsupported | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |
| CAI Manerbio (cai-manerbio-9116106) | unsupported | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |
| CAI Marone (cai-marone-9116024) | unsupported | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |
| CAI Nave (cai-nave-9116093) | unsupported | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |
| CAI Odolo (cai-odolo-9116025) | unsupported | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |
| CAI Provaglio D'iseo (cai-provaglio-d-iseo-9116123) | unsupported | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |
| CAI Santicolo (cai-santicolo-9116029) | unsupported | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |
| CAI Lentate Sul Seveso (cai-lentate-sul-seveso-9116061) | unsupported | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |
| CAI Meda (cai-meda-9216042) | partial | 1 | shared-attribution-skipped: Shared Meda municipal event leaflet omitted; CAI Meda official calendars remain in scope.; Image OCR yielded insufficient text; manual verification required. |
| CAI Premana (cai-premana-9216089) | partial | 1 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; discovery-limit: Discovery budget reached; 10 candidate documents remain. |
| CAI Casorate Sempione (cai-casorate-sempione-9116045) | partial | 6 | Request failed with status code 404; Request failed with status code 404; Request failed with status code 404; Request failed with status code 404; Request failed with status code 404; Request failed with status code 404; Request failed with status code 404; Request failed with status code 503; Request failed with status code 404; Request failed with status code 404; Request failed with status code 404; Request faile |
| CAI Albiate (cai-albiate-9216107) | partial | 5 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. |
| CAI Boffalora Sopra Ticino (cai-boffalora-sopra-ticino-9216114) | partial | 4 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. |
| CAI Borno (cai-borno-9216113) | partial | 1 | Failed to establish tunnel to dc5376ba-bda4-41fa-a3e0-1252e8c95b77.filesusr.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden; Failed to establish tunnel to dc5376ba-bda4-41fa-a3e0-1252e8c95b77.filesusr.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden; Failed to establish tunnel to dc5376ba-bda4-41fa-a3e0-1252e8c95b77.filesusr.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden; Failed to establish tunnel  |
| CAI Carate Brianza (cai-carate-brianza-9216030) | partial | 6 | timeout of 2423ms exceeded; discovery-limit: Discovery budget reached; 344 candidate documents remain. |
| CAI Castiglione Stiviere (cai-castiglione-stiviere-9216096) | unsupported | 2 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; Failed to establish tunnel to accounts.google.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden |
| CAI Cedegolo (cai-cedegolo-9216062) | partial | 5 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. |
| CAI Cernusco Sul Naviglio (cai-cernusco-sul-naviglio-9216051) | partial | 2 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; timeout of 1000ms exceeded; discovery-limit: Discovery budget reached; 9 candidate documents remain. |
| CAI Codogno (cai-codogno-9216071) | partial | 11 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; discovery-limit: Discovery budget reached; 62 candidate documents remain.; ambiguous-date-skipped: Excluded event “Domenica 15 o Sabato 21 – Pranzo o Cena Sociale, da definire”: the official calendar gives two alternative dates and co |
| CAI Colico (cai-colico-9216123) | unsupported | 0 | PDF OCR unavailable or failed: Command failed: tesseract /tmp/cai-pdf-ocr-bYPiTa/page-12.png stdout -l ita+eng --psm 6  |
| CAI Dongo (cai-dongo-9216131) | partial | 13 | discovery-limit: Discovery budget reached; 75 candidate documents remain. |
| CAI Gazzada Schianno (cai-gazzada-schianno-9216148) | partial | 11 | previous-404-skipped: Skipped URL previously confirmed unavailable: Request failed with status code 404; previous-404-skipped: Skipped URL previously confirmed unavailable: Request failed with status code 404; previous-404-skipped: Skipped URL previously confirmed unavailable: Request failed with status code 404; previous-404-skipped: Skipped URL previously confirmed unavailable: Request failed with status code 404;  |
| CAI Germignaga (cai-germignaga-9216031) | partial | 3 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. |
| CAI Inveruno (cai-inveruno-9216128) | partial | 10 | Request failed with status code 503; discovery-limit: Discovery budget reached; 43 candidate documents remain. |
| CAI Iseo (cai-iseo-9216157) | partial | 4 | Request failed with status code 404; discovery-limit: Discovery budget reached; 41 candidate documents remain. |
| CAI Livigno (cai-livigno-9216120) | partial | 2 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. |
| CAI Malnate (cai-malnate-9216067) | partial | 2 | timeout of 8000ms exceeded |
| CAI Nerviano (cai-nerviano-9216100) | partial | 4 | previous-404-skipped: Skipped URL previously confirmed unavailable: Request failed with status code 404 |
| CAI Rovagnate (cai-rovagnate-9216068) | unsupported | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |
| CAI S.e.m. (cai-s-e-m-9216028) | partial | 14 | discovery-limit: Discovery budget reached; 12 candidate documents remain. |
| CAI Sesto Calende (cai-sesto-calende-9216044) | partial | 1 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; maxContentLength size of 33554432 exceeded; Command failed: tesseract /tmp/cai-image-ocr-BFj0t2/source-image stdout -l ita+eng --psm 4 Estimating resolution as 330 ; discovery-limit: Discovery budget reached; 87 candidate documents re |
| CAI Sesto S.giovanni (cai-sesto-s-giovanni-9216020) | partial | 6 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, |
| CAI Somma Lombardo (cai-somma-lombardo-9216065) | unsupported | 0 | maxContentLength size of 33554432 exceeded; maxContentLength size of 33554432 exceeded; discovery-limit: Discovery budget reached; 42 candidate documents remain. |
| CAI Valmadrera (cai-valmadrera-9216081) | partial | 7 | discovery-limit: Discovery budget reached; 24 candidate documents remain. |
| CAI Varese (cai-varese-9216009) | partial | 58 | discovery-limit: Discovery budget reached; 93 candidate documents remain. |
| CAI Veduggio (cai-veduggio-9216147) | partial | 13 | discovery-limit: Discovery budget reached; 25 candidate documents remain. |
| CAI Abbiategrasso (cai-abbiategrasso-9216049) | partial | 1 | previous-404-skipped: Skipped URL previously confirmed unavailable: Request failed with status code 404; previous-404-skipped: Skipped URL previously confirmed unavailable: Request failed with status code 404; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skippe |
| CAI Aldo Mantovani (cai-aldo-mantovani-9116111) | unsupported | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |
| CAI Alta Valle Seriana (cai-alta-valle-seriana-9116133) | unsupported | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |
| CAI Barzano' (cai-barzano-9216117) | partial | 4 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; previous-404-skipped: Skipped URL previously con |
| CAI Bergamo (cai-bergamo-9216002) | unsupported | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |
| CAI Bovisio Masciago (cai-bovisio-masciago-9216082) | unsupported | 0 | Request failed with status code 503; Request failed with status code 503; Request failed with status code 503; Request failed with status code 503; Request failed with status code 503 |
| CAI Busto Arsizio (cai-busto-arsizio-9216014) | unsupported | 1 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. |
| CAI Calco (cai-calco-9216079) | partial | 4 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; Failed to establish tunnel to x.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden; Failed to establish tunnel to x.com:443 via http://pro |
| CAI Como (cai-como-9216006) | partial | 1 | Request failed with status code 500; Request failed with status code 500 |
| CAI Cremona (cai-cremona-9216007) | partial | 6 | Request failed with status code 503; discovery-limit: Discovery budget reached; 97 candidate documents remain. |
| CAI Desio (cai-desio-9216011) | unsupported | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |
| CAI Erba (cai-erba-9216099) | partial | 3 | PDF OCR unavailable or failed: OCR failed for page-06.png: psm 6: Command failed: tesseract /tmp/cai-pdf-ocr-yl0r3L/page-06.png stdout -l ita+eng --psm 6 ; psm 4: PDF OCR exceeded its 85055 ms time limit; discovery-limit: Discovery budget reached; 6 candidate documents remain. |
| CAI Gavirate (cai-gavirate-9216059) | unsupported | 0 | discovery-limit: Discovery budget reached; 258 candidate documents remain. |
| CAI Laveno Mombello (cai-laveno-mombello-9216032) | partial | 9 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. |
| CAI Legnano (cai-legnano-9216022) | partial | 3 | discovery-limit: Discovery budget reached; 175 candidate documents remain. |
| CAI Lissone (cai-lissone-9216040) | partial | 7 | discovery-limit: Discovery budget reached; 65 candidate documents remain. |
| CAI Lodi (cai-lodi-9216017) | partial | 4 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL. |
| CAI Magenta (cai-magenta-9216041) | unsupported | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |
| CAI Milano (cai-milano-9216003) | partial | 9 | discovery-limit: Discovery budget reached; 54 candidate documents remain. |
| CAI Missaglia (cai-missaglia-9216150) | unsupported | 0 | discovery-limit: Discovery budget reached; 42 candidate documents remain. |
| CAI Muggio' (cai-muggio-9216142) | unsupported | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |
| CAI Novate Milanese (cai-novate-milanese-9216043) | unsupported | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |
| CAI Seregno (cai-seregno-9216016) | partial | 7 | discovery-limit: Discovery budget reached; 21 candidate documents remain. |
| CAI Strada Storta (cai-strada-storta-9116052) | partial | 6 | non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; non-calendar-link-skipped: Skipped social, feed, metadata, sharing, or unrelated image URL.; Failed to establish tunnel to accounts.google.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden |
| CAI Trezzo Sull'adda (cai-trezzo-sull-adda-9216156) | unsupported | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |
| CAI Varano Borghi (cai-varano-borghi-9116118) | unsupported | 0 | shared-attribution-skipped: Shared CAI Gavirate calendar omitted; this source is the dedicated Varano Borghi subsection.; shared-attribution-skipped: Shared CAI Gavirate calendar omitted; this source is the dedicated Varano Borghi subsection.; shared-attribution-skipped: Shared CAI Gavirate calendar omitted; this source is the dedicated Varano Borghi subsection.; shared-attribution-skipped: Shared CAI Gavirate calend |
| CAI Vestone (cai-vestone-9216155) | unsupported | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |
| CAI Villa Carcina (cai-villa-carcina-9216146) | unsupported | 0 | previous-404-skipped: Skipped URL previously confirmed unavailable: Request failed with status code 404 |
| CAI Villasanta (cai-villasanta-9216126) | partial | 1 | Failed to establish tunnel to se146653a1f3ce618.jimcontent.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden; Failed to establish tunnel to se146653a1f3ce618.jimcontent.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden; Failed to establish tunnel to se146653a1f3ce618.jimcontent.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden; Failed to establish tunnel to se146653a1f3ce618.jimcontent.com:443 via http:// |
| CAI Voghera (cai-voghera-9216024) | unsupported | 0 | Nessun documento ufficiale calendario parsabile trovato nel passaggio. |

11 fonti escluse per ambiguità di attribuzione dal rapporto deep-02 restano non attribuibili al branch locale: Bagolino, Cidneo O.M., Collebeato, Iseo (diventata sezione), Manerbio, Marone, Nave, Odolo, Provaglio d’Iseo, Santicolo e Lentate sul Seveso. Le prime dieci condividono il PDF CAI Brescia senza separazione certa per sottosezione; Lentate condivide una locandina comunale CAI Meda.

## Manifest post revisione locale

Il manifest è stato rigenerato dopo la rimozione del singolo record; i file frontend `excursions.json` e `scrape-status.json` corrispondono byte per byte ai rispettivi file backend.

| File | SHA-256 |
|---|---|
| `backend/data/excursions.json` | `cb3a6be67b214ffb13cdab6346e639b959db3af7efd56b6cfbd1fe4782a4ddd5` |
| `backend/data/cai-sections.json` | `f0245e11e429ef27913c56d91f37a71e1430f7398592da3e442fa27dff2fa48b` |
| `backend/data/scrape-status.json` | `3f198cd95b8b2adabb2b37bb91b96735fa3b85a777412942602f7e41701c40aa` |
