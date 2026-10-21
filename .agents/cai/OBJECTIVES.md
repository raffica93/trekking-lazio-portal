# Obiettivi principali

| ID | Obiettivo | Quando è raggiunto |
|---|---|---|
| O1 | Riprendere dal solo repository remoto | Una sessione nuova trova codice, piano, baseline, prove e prossima azione dal commit indicato; nessun file indispensabile esiste soltanto sul PC o in una vecchia chat. |
| O2 | Preparare un runtime cloud riproducibile | Percorso del checkout rilevato, versione Node compatibile verificata, proxy/TLS funzionanti, Poppler e Tesseract `ita`/`eng` disponibili anche senza `sudo`. |
| O3 | Conservare raccolte verificabili | Ogni lotto conserva input e output recuperabili, hash, evidenze minime per fonte e distinzione tra eventi validi e fonti da riprendere. |
| O4 | Importare e recuperare senza perdita o duplicati | L'import usa file verificati già salvati remotamente; ricevuta con metodo, commit, hash e query. Riprendere dopo un'interruzione non duplica dati né sovrascrive contenuti amministrati. |
| O5 | Coordinare esattamente due agenti Luna | Collector e importer hanno ownership distinte; l'orchestratore pubblica avanzamento e passaggi. L'importer scrive soltanto dopo la consegna verificata. |
| O6 | Separare dati, codice e pubblicazione del sito | Stato distinto per raccolta, file, checkpoint Git, import DB e distribuzione del sito. Nessun cron; merge e deploy restano azioni separate. |

La prova finale è una ripartenza in **due sessioni cloud nuove**: la prima produce
e pubblica un piccolo lotto; la seconda recupera quei file ed esegue la verifica
e l'import previsto. Il PC e il vecchio checkout non fanno parte della procedura.

La copertura nazionale completa è un obiettivo successivo: il passaggio full cloud
non si considera riuscito soltanto perché aumenta il numero di eventi.
