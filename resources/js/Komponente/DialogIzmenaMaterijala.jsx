import { useState } from "react";
import CustomSelect from "./Alati/CustomSelect";
import { koristiGlobalniKontekst } from "../Konteksti";
import { useMetapodaciMaterijala } from "../PomocniAlati/Hooks/useMetapodaciMaterijala";
import ServisMaterijala from "../PomocniAlati/Servisi/ServisMaterijala";
import { prikaziToastNotifikaciju } from "../PomocniAlati/ToastNotifikacijaServis";
import TipToastNotifikacije from "../PomocniAlati/TipToastNotifikacije";
import { router } from "@inertiajs/react";
import { objaviPromenuMaterijala } from "../PomocniAlati/dogadjajiMaterijala";

export default function DialogIzmenaMaterijala({ materijal, podesiPrikazDialoga }) {
    const { podaci } = koristiGlobalniKontekst();
    const smer = materijal.smer;

    // Compute initial year before the hook so we can pass it as an option
    const initialGodina = (() => {
        const year = materijal.godina;
        const maxYear = smer?.nivo_studija_id === 2 ? 2 : 3;
        if (!year || year < 1 || year > maxYear) return null;
        return { naziv: `${year}. Godina`, vrednost: year };
    })();

    const {
        dostupneSkolskeGodine,
        dostupneGodine,
        izabranaGodina, podesiIzabranugodinu,
        dostupniPredmeti, izabraniPredmet, podesiIzabraniPredmet, ucitavaPredmete,
        izabraniTip, podesiIzabraniTip,
        dostupniPodtipovi, izabraniPodtip, podesiIzabraniPodtip, ucitavaPodtipove,
        izabranaSkolskaGodina, podesiIzabranaSkolskaGodinu,
    } = useMetapodaciMaterijala(smer, {
        initialGodina,
        initialPredmetId: materijal.predmet_id,
        initialTipNaziv: materijal.tip,
        initialPodtipNaziv: materijal.podtip,
        initialSkolskaGodinaNaziv: materijal.skolska_godina,
    });

    const [naziv, podesiNaziv] = useState(materijal.naziv);
    const [sacuvavanje, podesiSacuvavanje] = useState(false);

    const mozeSnimiti = () =>
        naziv.trim() && izabranaGodina && izabraniPredmet?.predmet_id &&
        izabraniTip?.tip_materijala_id && izabraniPodtip?.podtip_materijala_id &&
        izabranaSkolskaGodina;

    const obradiIzmenu = async () => {
        if (!mozeSnimiti() || sacuvavanje) return;
        podesiSacuvavanje(true);
        try {
            const ok = await ServisMaterijala.azurirajMaterijal(materijal.materijal_id, {
                naziv: naziv.trim(),
                predmet_id: izabraniPredmet.predmet_id,
                podtipMaterijala: izabraniPodtip,
                skolskaGodina: izabranaSkolskaGodina.naziv,
            });
            if (ok) {
                prikaziToastNotifikaciju("Materijal uspešno ažuriran", TipToastNotifikacije.Uspesno);
                objaviPromenuMaterijala();
                router.reload();
                podesiPrikazDialoga(false);
            }
        } finally {
            podesiSacuvavanje(false);
        }
    };

    return (
        <div className="w-full sm:w-[480px] space-y-4">
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Smer</p>
                <p className="font-medium text-gray-800">{smer?.naziv_smera}</p>
                <p className="text-sm text-gray-500 mt-0.5">{materijal.departman} · {materijal.nivo_studija}</p>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                    Naziv materijala
                </label>
                <input
                    type="text"
                    value={naziv}
                    onChange={e => podesiNaziv(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-44 sm:shrink-0">
                    <CustomSelect
                        klase="w-full"
                        opcije={dostupneGodine}
                        vrednost={izabranaGodina}
                        podesiSelektovaneOpcije={podesiIzabranugodinu}
                        labela="Godina studija"
                        obaveznoPolje
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <CustomSelect
                        klase="w-full"
                        opcije={dostupniPredmeti}
                        vrednost={izabraniPredmet}
                        podesiSelektovaneOpcije={podesiIzabraniPredmet}
                        labela="Predmet"
                        zakljucana={!izabranaGodina || ucitavaPredmete}
                        tooltipTekst="Izaberi godinu studija!"
                        obaveznoPolje
                    />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 min-w-0">
                    <CustomSelect
                        klase="w-full"
                        opcije={podaci.dostupniTipoviMaterijala || []}
                        vrednost={izabraniTip}
                        podesiSelektovaneOpcije={podesiIzabraniTip}
                        labela="Tip materijala"
                        obaveznoPolje
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <CustomSelect
                        klase="w-full"
                        opcije={dostupniPodtipovi}
                        vrednost={izabraniPodtip}
                        podesiSelektovaneOpcije={podesiIzabraniPodtip}
                        labela="Podtip materijala"
                        zakljucana={!izabraniTip || ucitavaPodtipove}
                        tooltipTekst="Izaberi tip materijala!"
                        obaveznoPolje
                    />
                </div>
            </div>

            <CustomSelect
                klase="w-full"
                opcije={dostupneSkolskeGodine}
                vrednost={izabranaSkolskaGodina}
                podesiSelektovaneOpcije={podesiIzabranaSkolskaGodinu}
                labela="Akademska godina"
                obaveznoPolje
            />

            <div className="flex justify-end pt-1">
                <button
                    onClick={obradiIzmenu}
                    disabled={!mozeSnimiti() || sacuvavanje}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        mozeSnimiti() && !sacuvavanje
                            ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {sacuvavanje ? 'Čuvanje...' : 'Sačuvaj izmene'}
                </button>
            </div>
        </div>
    );
}
