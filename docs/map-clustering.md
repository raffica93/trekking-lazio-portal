# Raggruppamento degli eventi in mappa

La mappa usa Leaflet.markercluster sulle coordinate originali degli eventi filtrati.
Non sposta le mete per separarle e non elimina eventi per ridurre il numero di icone.
Le uscite senza coordinate valide restano consultabili nell'elenco.

## Regole di visualizzazione

- Il raggio di raggruppamento è misurato sullo schermo: 80 px fino allo zoom 7,
  64 px fino allo zoom 11 e 48 px negli zoom successivi. La vista nazionale è
  più compatta; avvicinandosi emergono gruppi più piccoli e singoli eventi.
- Ogni gruppo mostra il numero effettivo di eventi filtrati che contiene.
  Le icone misurano 44, 48 o 54 px secondo il conteggio, con numeri bianchi
  su fondo verde. Il contatore distingue gli eventi, non le località.
- Un clic o Invio sul gruppo avvicina la mappa. Allo zoom massimo i punti
  sovrapposti si aprono a ventaglio: ogni evento rimane selezionabile.
- La selezione dall'elenco rivela e mette in evidenza anche un evento nascosto
  in un gruppo. I colori dei singoli eventi continuano a indicare la difficoltà.

## Regole di prestazione

Leaflet viene importato tramite il suo export predefinito mutabile, lo stesso
oggetto esteso dal plugin. Una copia del namespace può non esporre le proprietà
aggiunte dal plugin: il vecchio fallback silenzioso a LayerGroup mostrava quindi
tutti i marker. Il componente richiede ora il raggruppamento, verificato nei test.

Il plugin mantiene sulla mappa solo gli elementi nella zona visibile e nelle sue
vicinanze. Le animazioni dei gruppi sono disattivate per limitare il lavoro durante
zoom e aggiornamenti. Le icone per difficoltà/selezione vengono riutilizzate.

Gli aggiornamenti conservano i marker degli eventi ancora presenti nelle stesse
coordinate, rimuovono quelli esclusi e aggiungono quelli nuovi. Le aggiunte sono
suddivise in lotti di massimo 200 nuovi marker; la preparazione di ciascun lotto
cede il controllo dopo 8 ms. L'inserimento del lotto nel plugin richiede tempo
aggiuntivo: non è una garanzia di frame entro 8 ms su ogni dispositivo.

Ogni aggiornamento annulla i lotti ancora in attesa della versione precedente;
anche la distruzione del componente li annulla. Questo evita che un filtro rapido
lasci eventi obsoleti o lavoro in background. I dettagli emessi al clic provengono
sempre dai dati più recenti, anche quando il marker viene riutilizzato.

I test con il plugin reale verificano contatori, riutilizzo, selezione di eventi
sovrapposti, coordinate non valide, annullamento dopo un cambio filtro e smontaggio.
Le prestazioni sui singoli dispositivi dipendono comunque da quantità e distribuzione
dei dati; questa modifica non introduce richieste o modifiche al database.
