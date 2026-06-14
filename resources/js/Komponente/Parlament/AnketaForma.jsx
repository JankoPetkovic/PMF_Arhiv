import { useState } from "react";
import { usePage } from "@inertiajs/react";
import { FaCheckCircle } from "react-icons/fa";
import ServisAnkete from "../../PomocniAlati/Servisi/ServisAnkete";
import { prikaziToastNotifikaciju } from "../../PomocniAlati/ToastNotifikacijaServis";
import TipToastNotifikacije from "../../PomocniAlati/TipToastNotifikacije";

export default function AnketaForma({ anketa }) {
    const { ulogovanKorisnik } = usePage().props;

    const [identitet, podesiIdentitet] = useState({
        ime: ulogovanKorisnik?.ime ?? "",
        prezime: ulogovanKorisnik?.prezime ?? "",
        email: ulogovanKorisnik?.korisnicki_email ?? "",
        broj_indeksa: ulogovanKorisnik?.broj_indeksa ?? "",
    });

    // odgovori[pitanje_id] = { opcija_ids: number[], slobodan_tekst: string, drugo: string }
    const [odgovori, podesiOdgovore] = useState(() => {
        const init = {};
        (anketa.pitanja ?? []).forEach((p) => {
            init[p.pitanje_id] = { opcija_ids: [], slobodan_tekst: "", drugo: "" };
        });
        return init;
    });

    const kljucPopunjeno = `anketa_popunjena_${anketa.anketa_id}`;
    const [salje, podesiSalje] = useState(false);
    // Već popunjeno = backend zna za ulogovanog, ili lokalno zapamćeno (gosti),
    // ali samo ako anketa NE dozvoljava više popunjavanja.
    const [poslato, podesiPoslato] = useState(() =>
        !anketa.dozvoli_vise &&
        (anketa.vec_popunjeno || (typeof window !== "undefined" && !!localStorage.getItem(kljucPopunjeno)))
    );

    const azurirajOdgovor = (pid, izmene) =>
        podesiOdgovore((prev) => ({ ...prev, [pid]: { ...prev[pid], ...izmene } }));

    const izaberiJedan = (pid, opcijaId) => azurirajOdgovor(pid, { opcija_ids: [opcijaId] });
    const prebaciVise = (pid, opcijaId) => {
        const trenutni = odgovori[pid].opcija_ids;
        const novi = trenutni.includes(opcijaId)
            ? trenutni.filter((x) => x !== opcijaId)
            : [...trenutni, opcijaId];
        azurirajOdgovor(pid, { opcija_ids: novi });
    };

    const posalji = async () => {
        if (!identitet.ime.trim() || !identitet.prezime.trim() || !identitet.email.trim() || !identitet.broj_indeksa.trim()) {
            prikaziToastNotifikaciju("Popunite ime, prezime, email i broj indeksa.", TipToastNotifikacije.Info);
            return;
        }
        podesiSalje(true);
        try {
            const payload = {
                ...identitet,
                odgovori: (anketa.pitanja ?? []).map((p) => {
                    const o = odgovori[p.pitanje_id];
                    // Za choice: slobodan_tekst nosi "Drugo"; za slobodan tip nosi sam unos.
                    const slobodan = p.tip === "slobodan" ? o.slobodan_tekst : (p.dozvoli_drugo ? o.drugo : "");
                    return {
                        pitanje_id: p.pitanje_id,
                        opcija_ids: p.tip === "slobodan" ? [] : o.opcija_ids,
                        slobodan_tekst: slobodan,
                    };
                }),
            };
            await ServisAnkete.posaljiOdgovor(anketa.anketa_id, payload);
            if (!anketa.dozvoli_vise && typeof window !== "undefined") {
                localStorage.setItem(kljucPopunjeno, "1");
            }
            podesiPoslato(true);
        } catch (_) {
        } finally {
            podesiSalje(false);
        }
    };

    if (poslato) {
        return (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
                <FaCheckCircle size={16} /> Popunili ste ovu anketu. Hvala!
            </div>
        );
    }

    if (anketa.istekla) {
        return (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm">
                Rok za popunjavanje ankete je istekao.
            </div>
        );
    }

    return (
        <div className="mt-4 p-4 bg-blue-50/40 border border-blue-100 rounded-lg">
            <p className="font-semibold text-gray-800 mb-3">
                {anketa.naslov || "Anketa"}
                {anketa.rok_trajanja && (
                    <span className="ml-2 text-xs font-normal text-gray-400">
                        (rok: {new Date(anketa.rok_trajanja).toLocaleString("sr-RS")})
                    </span>
                )}
            </p>

            {/* Pitanja */}
            <div className="flex flex-col gap-4">
                {(anketa.pitanja ?? []).map((p) => (
                    <div key={p.pitanje_id}>
                        <p className="text-sm font-medium text-gray-700 mb-1.5">
                            {p.tekst} {p.obavezno && <span className="text-red-500">*</span>}
                        </p>

                        {p.tip === "slobodan" ? (
                            <textarea
                                rows={2}
                                value={odgovori[p.pitanje_id].slobodan_tekst}
                                onChange={(e) => azurirajOdgovor(p.pitanje_id, { slobodan_tekst: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-y"
                                placeholder="Vaš odgovor"
                            />
                        ) : (
                            <div className="flex flex-col gap-1.5">
                                {p.opcije.map((o) => (
                                    <label key={o.opcija_id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                        <input
                                            type={p.tip === "visestruki" ? "checkbox" : "radio"}
                                            name={`pitanje_${p.pitanje_id}`}
                                            checked={odgovori[p.pitanje_id].opcija_ids.includes(o.opcija_id)}
                                            onChange={() =>
                                                p.tip === "visestruki"
                                                    ? prebaciVise(p.pitanje_id, o.opcija_id)
                                                    : izaberiJedan(p.pitanje_id, o.opcija_id)
                                            }
                                            className="cursor-pointer"
                                        />
                                        {o.tekst}
                                    </label>
                                ))}
                                {p.dozvoli_drugo && (
                                    <input
                                        type="text"
                                        value={odgovori[p.pitanje_id].drugo}
                                        onChange={(e) => azurirajOdgovor(p.pitanje_id, { drugo: e.target.value })}
                                        placeholder="Drugo..."
                                        className="mt-1 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Identitet */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-3 border-t border-blue-100">
                <input type="text" value={identitet.ime} onChange={(e) => podesiIdentitet({ ...identitet, ime: e.target.value })} placeholder="Ime *" className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400" />
                <input type="text" value={identitet.prezime} onChange={(e) => podesiIdentitet({ ...identitet, prezime: e.target.value })} placeholder="Prezime *" className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400" />
                <input type="email" value={identitet.email} onChange={(e) => podesiIdentitet({ ...identitet, email: e.target.value })} placeholder="Email *" className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400" />
                <input type="text" value={identitet.broj_indeksa} onChange={(e) => podesiIdentitet({ ...identitet, broj_indeksa: e.target.value })} placeholder="Broj indeksa *" className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400" />
            </div>

            <button
                onClick={posalji}
                disabled={salje}
                className={`mt-3 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${salje ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'}`}
            >
                {salje ? "Slanje..." : "Pošalji odgovor"}
            </button>
        </div>
    );
}
