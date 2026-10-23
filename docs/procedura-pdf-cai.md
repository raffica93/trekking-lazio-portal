# Procedura limitata per PDF CAI

Questa procedura raccoglie testo da PDF ufficiali senza caricare documenti grandi in memoria né applicare OCR all'intero file. Conserva il PDF originale in cache e usa una copia temporanea solo per le prove di compressione.

## Limiti

- Download PDF massimo: 180 MiB; documenti non PDF: 32 MiB.
- Massimo 400 pagine per PDF.
- Il timeout usuale è 90 secondi per PDF. Per un URL grande già verificato si può impostare un timeout fino a 180 secondi e un budget finito fino a 240 secondi per fonte. L'estensione va limitata ai soli URL allowlistati del passaggio.
- OCR: massimo 8 pagine selezionate; render una pagina alla volta a 200 dpi in scala di grigi, Tesseract `ita+eng` con PSM 6, poi PSM 4 quando il testo è scarso. Solo se il risultato ha meno di 60 caratteri non-spazio prova 300 dpi. Ogni comando ha un limite di 20 secondi e l'intero OCR di un documento non supera il budget della fonte.
- PDF ed elaborati temporanei sono rilasciati al termine del passaggio. Non si ripete una fonte fallita all'infinito.

## Ordine di lavoro

1. Verificare URL ufficiale, `Content-Length` quando disponibile, e hash della cache. Scaricare in streaming su disco con limite di byte; rifiutare un documento che supera il limite.
2. Eseguire `pdfinfo` prima dell'estrazione e rifiutare il PDF se manca il numero di pagine o supera 400.
3. Provare `pdftotext -layout` sul documento originale. Se l'impaginazione confonde sezioni diverse, estrarre solo le pagine attribuibili alla sezione. Nei PDF a più colonne, verificare il rendering e isolare le colonne prima di interpretare le righe.
4. Applicare OCR soltanto alle pagine ufficiali pertinenti se l'estrazione testuale è assente o insufficiente. Salvare metodo, pagina, timeout ed errore nel registro fonte.
5. Verificare manualmente ogni nuovo titolo/data sull'immagine della pagina e sulla sezione CAI esplicitamente indicata. Escludere righe parziali, date ambigue e calendari intersezionali non attribuibili.
6. Sigillare i file solo dopo la deduplica `source_id`, controlli sui record e verifica SHA-256 del manifest.

## Prova Ghostscript su copia temporanea

Per valutare se un PDF enorme è trasferibile più rapidamente, creare una copia con Ghostscript senza sostituire né cancellare l'originale:

```sh
timeout 180s gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook \
  -dNOPAUSE -dBATCH -dSAFER \
  -sOutputFile=/tmp/cai-prova-ebook.pdf /tmp/cai-originale.pdf
wc -c /tmp/cai-originale.pdf /tmp/cai-prova-ebook.pdf
pdfinfo /tmp/cai-prova-ebook.pdf
pdftotext -layout /tmp/cai-originale.pdf /tmp/cai-originale.txt
pdftotext -layout /tmp/cai-prova-ebook.pdf /tmp/cai-prova-ebook.txt
diff -u /tmp/cai-originale.txt /tmp/cai-prova-ebook.txt
pdftoppm -f PAGINA -l PAGINA -r 120 -png -singlefile /tmp/cai-originale.pdf /tmp/cai-originale-pagina
pdftoppm -f PAGINA -l PAGINA -r 120 -png -singlefile /tmp/cai-prova-ebook.pdf /tmp/cai-prova-pagina
```

La prova del 20 ottobre 2026 sul PDF SIEL ufficiale di Gazzada (167,318,309 byte, 19 pagine) ha prodotto una copia `/ebook` di 3,897,565 byte, riduzione del 97.67%. Il testo estratto è passato da 217,010 a 212,686 byte e `diff` ha mostrato differenze; la pagina 10 era ancora leggibile nel rendering campione a 120 dpi, ma la copia compressa non è equivalente all'originale. Usare quindi la compressione solo come prova di trasferimento/leggibilità. Per estrazione, OCR e verifica conservare il PDF originale; preferire `pdftotext` su intervalli mirati o OCR pagina-per-pagina.

## Verifica dei casi campione

- PDF Gazzada SIEL: pagina 10 è esplicitamente intestata “Sezione di GAZZADA SCHIANNO”; pagine 11–14 sono intestate Sesto Calende e pagine 15–16 Somma Lombardo. Le pagine vanno associate solo alla rispettiva sezione. La pagina 10 presenta più colonne: il parser non deve importare titoli troncati o righe intercolonnari senza revisione.
- PDF Colico: pagina 12 è una scala delle difficoltà e istruzioni di sicurezza; il documento è una brochure 2023, non un calendario 2026. OCR riuscito non equivale a prova di un evento.
- PDF Missaglia “Andiamo in Montagna”: pagina 21 riguarda il primo soccorso in un manuale didattico, non un calendario. Non generare eventi da questa pagina.

La procedura ha recuperato testo dal PDF SIEL da 167 MB e ha permesso l'ispezione visiva di pagina e sezione. I casi Colico e Missaglia sono stati verificati come materiale informativo, quindi non hanno prodotto eventi. Un documento condiviso non costituisce copertura di una sezione finché titolo e data non sono leggibili e attribuibili in modo univoco.
