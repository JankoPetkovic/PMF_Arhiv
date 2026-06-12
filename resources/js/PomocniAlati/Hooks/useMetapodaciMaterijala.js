import { useEffect, useRef, useState } from "react";
import { generisiSkolskeGodine } from "../SkolskeGodine";
import { koristiGlobalniKontekst } from "../../Konteksti";
import ServisPredmeta from "../Servisi/ServisPredmeta";
import ServisPodtipovaMaterijala from "../Servisi/ServisPodtipovaMaterijala";

/**
 * Extracts shared cascading-select logic used when creating or editing a material:
 *  - godina → predmeti fetch
 *  - tip → podtipovi fetch (with initial pre-fill support)
 *  - skolska godina selection
 *
 * @param {object|null} smer  The active smer (must have smer_id, nivo_studija_id).
 * @param {object} [options]
 * @param {object|null} [options.initialGodina]             Pre-selected { naziv, vrednost } year.
 * @param {number|null}  [options.initialPredmetId]         Pre-select predmet by ID after fetch.
 * @param {string|null}  [options.initialTipNaziv]          Pre-fill tip by name (upgrades to full object once podaci loads).
 * @param {string|null}  [options.initialPodtipNaziv]       Pre-fill podtip by name after podtip fetch.
 * @param {string|null}  [options.initialSkolskaGodinaNaziv] Pre-select skolska godina by name.
 */
export function useMetapodaciMaterijala(smer, {
    initialGodina = null,
    initialPredmetId = null,
    initialTipNaziv = null,
    initialPodtipNaziv = null,
    initialSkolskaGodinaNaziv = null,
} = {}) {
    const { podaci } = koristiGlobalniKontekst();
    const dostupneSkolskeGodine = generisiSkolskeGodine();

    const dostupneGodine = smer?.nivo_studija_id === 2
        ? [{ naziv: '1. Godina', vrednost: 1 }, { naziv: '2. Godina', vrednost: 2 }]
        : [{ naziv: '1. Godina', vrednost: 1 }, { naziv: '2. Godina', vrednost: 2 }, { naziv: '3. Godina', vrednost: 3 }];

    const [izabranaGodina, podesiIzabranugodinu] = useState(initialGodina);

    const [izabraniPredmet, podesiIzabraniPredmet] = useState(null);
    const [dostupniPredmeti, podesiDostupnePredmete] = useState([]);
    const [ucitavaPredmete, podesiUcitavaPredmete] = useState(false);

    const [izabraniTip, podesiIzabraniTip] = useState(
        initialTipNaziv ? { naziv: initialTipNaziv } : null
    );
    const [izabraniPodtip, podesiIzabraniPodtip] = useState(
        initialPodtipNaziv ? { naziv: initialPodtipNaziv } : null
    );
    const [dostupniPodtipovi, podesiDostupnePodtipove] = useState([]);
    const [ucitavaPodtipove, podesiUcitavaPodtipove] = useState(false);
    const jeInitijalnoPodtip = useRef(!!initialPodtipNaziv);

    const [izabranaSkolskaGodina, podesiIzabranaSkolskaGodinu] = useState(() => {
        if (initialSkolskaGodinaNaziv) {
            return dostupneSkolskeGodine.find(g => g.naziv === initialSkolskaGodinaNaziv)
                ?? dostupneSkolskeGodine[dostupneSkolskeGodine.length - 1];
        }
        return dostupneSkolskeGodine[dostupneSkolskeGodine.length - 1];
    });

    // Fetch predmete when year changes (smer is read from closure — always fresh).
    // Using full object reference so a caller can force re-fetch by setting a new object
    // even when the year value hasn't changed (used in ObjavaMaterijala's smer-change effect).
    useEffect(() => {
        podesiIzabraniPredmet(null);
        podesiDostupnePredmete([]);
        if (!smer?.smer_id || !izabranaGodina) return;
        podesiUcitavaPredmete(true);
        ServisPredmeta.vratiPredmete({ smer_id: smer.smer_id, godina: izabranaGodina.vrednost })
            .then(lista => {
                const predmeti = Array.isArray(lista) ? lista : [];
                podesiDostupnePredmete(predmeti);
                if (initialPredmetId) {
                    const match = predmeti.find(p => p.predmet_id === initialPredmetId);
                    if (match) podesiIzabraniPredmet(match);
                }
            })
            .catch(() => podesiDostupnePredmete([]))
            .finally(() => podesiUcitavaPredmete(false));
    }, [izabranaGodina]); // eslint-disable-line react-hooks/exhaustive-deps

    // Upgrade tip from name-stub to full object once global podaci loads.
    useEffect(() => {
        if (!initialTipNaziv || izabraniTip?.tip_materijala_id) return;
        const match = (podaci.dostupniTipoviMaterijala || []).find(t => t.naziv === initialTipNaziv);
        if (match) podesiIzabraniTip(match);
    }, [podaci.dostupniTipoviMaterijala]); // eslint-disable-line react-hooks/exhaustive-deps

    // Fetch podtipove when a tip with a real ID is selected.
    useEffect(() => {
        if (!izabraniTip?.tip_materijala_id) return;
        podesiDostupnePodtipove([]);
        if (!jeInitijalnoPodtip.current) {
            podesiIzabraniPodtip(null);
        }
        podesiUcitavaPodtipove(true);
        ServisPodtipovaMaterijala.vratiPodTipoveMaterijala({ tip_materijala_id: izabraniTip.tip_materijala_id })
            .then(lista => {
                const podtipovi = Array.isArray(lista) ? lista : [];
                podesiDostupnePodtipove(podtipovi);
                if (jeInitijalnoPodtip.current) {
                    jeInitijalnoPodtip.current = false;
                    const match = podtipovi.find(p => p.naziv === initialPodtipNaziv);
                    if (match) podesiIzabraniPodtip(match);
                }
            })
            .catch(() => podesiDostupnePodtipove([]))
            .finally(() => podesiUcitavaPodtipove(false));
    }, [izabraniTip?.tip_materijala_id]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        dostupneSkolskeGodine,
        dostupneGodine,
        izabranaGodina, podesiIzabranugodinu,
        dostupniPredmeti, izabraniPredmet, podesiIzabraniPredmet, ucitavaPredmete,
        izabraniTip, podesiIzabraniTip,
        dostupniPodtipovi, izabraniPodtip, podesiIzabraniPodtip, ucitavaPodtipove,
        izabranaSkolskaGodina, podesiIzabranaSkolskaGodinu,
    };
}
