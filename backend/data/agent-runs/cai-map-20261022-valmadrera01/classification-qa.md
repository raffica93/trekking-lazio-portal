# QA classificazione delta Valmadrera

Run `cai-map-20261022-valmadrera01`, collegato alla raccolta `cai-20261022-lombardia-valmadrera07`. Input/output 10/10, `ready`, zero errori. Decisioni Mercury attestate: richiesto `inception/mercury-decide`, risposta `inception/mercury-decide-20260930`; confidence e probability restano valori separati.

La revisione indipendente del collector ha confrontato ogni titolo/data con il PDF ufficiale CAI Valmadrera, SHA-256 `f3939cb69b55824e4db4026d989acea993a58e7fa81671d8c7a3093d3b4103e9`, e fixture pdf.js. Le 8 voci `non_trekking` sono: 6 corsi di arrampicata PIACCO, una gita culturale enogastronomica, una cena sociale. Le due `Alp. Giovanile Uscita corso` risultano nel PDF alle date corrette ma la fonte non chiarisce l'attività: restano `da_verificare`; nessun trekking confermato. Non sono state inventate località o coordinate.

Quattro dei 14 record nuovi sono fuori dal manifest di import indipendente: due duplicati confermati vengono esclusi preservando gli eventi esistenti; due probabili duplicati sono trattenuti per revisione, senza fusione o sovrascrittura. Dettagli/evidenze: `duplicate-review.json`. I restanti 10 nuovi source ID sono nel manifest sigillato.

| source_id | data | titolo | decisione | categoria | confidence / probability |
|---|---|---|---|---|---|
| cai-valmadrera-9216081-f703dad1d860 | 2026-10-04 | Scuola PIACCO CORSO ARRAMPICATA | non_trekking | alpinismo/ferrata | 0.996138373153311 / 0.9974255821022074 |
| cai-valmadrera-9216081-7ee9657bb99a | 2026-10-10 | Scuola PIACCO CORSO ARRAMPICATA | non_trekking | alpinismo/ferrata | 0.9956639455075965 / 0.9971092970050645 |
| cai-valmadrera-9216081-a3ea38de9baf | 2026-10-17 | Alp. Giovanile Uscita corso | da_verificare | corso/riunione | 0.3198240928176827 / 0.5465493952117885 |
| cai-valmadrera-9216081-c6ae7cf56593 | 2026-10-18 | Alp. Giovanile Uscita corso | da_verificare | corso/riunione | 0.24715037546875931 / 0.49810025031250615 |
| cai-valmadrera-9216081-4d26b7d6c929 | 2026-10-25 | Scuola PIACCO CORSO ARRAMPICATA | non_trekking | alpinismo/ferrata | 0.9965823998705455 / 0.9977215999136971 |
| cai-valmadrera-9216081-d13c059bceac | 2026-11-08 | Scuola PIACCO CORSO ARRAMPICATA | non_trekking | alpinismo/ferrata | 0.996147623902153 / 0.9974317492681021 |
| cai-valmadrera-9216081-6975b0f54bff | 2026-11-14 | Scuola PIACCO CORSO ARRAMPICATA | non_trekking | alpinismo/ferrata | 0.995663945958356 / 0.9971092973055706 |
| cai-valmadrera-9216081-7df15329595b | 2026-11-15 | Scuola PIACCO CORSO ARRAMPICATA | non_trekking | alpinismo/ferrata | 0.9956552619613418 / 0.9971035079742279 |
| cai-valmadrera-9216081-d55106a9ebce | 2026-11-22 | GITA CULTURALE Enogastronomica | non_trekking | sociale/culturale | 0.903174922320947 / 0.9354499482139648 |
| cai-valmadrera-9216081-10a7c964644a | 2026-12-04 | CENA SOCIALE | non_trekking | sociale/culturale | 0.9974797427974146 / 0.9983198285316098 |

QA semantica di fonte: PASS per gli 8 esclusi e presenza/data dei 2 dubbi. QA di integrità e schema importer: PASS, 10 righe valide e allineate. Esito non significa che siano trekking confermati: 2 restano dubbi. Nessuna scrittura DB effettuata alla data del checkpoint file.
