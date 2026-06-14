import { useState } from "react";
import ServisAnkete from "../../PomocniAlati/Servisi/ServisAnkete";
import { prikaziToastNotifikaciju } from "../../PomocniAlati/ToastNotifikacijaServis";
import TipToastNotifikacije from "../../PomocniAlati/TipToastNotifikacije";

export default function RezimeAnkete({ anketaId }) {
    const [otvoren, podesiOtvoren] = useState(false);
    const [rezime, podesiRezime] = useState(null);
    const [ucitava, podesiUcitava] = useState(false);

    const prebaci = async () => {
        if (otvoren) { podesiOtvoren(false); return; }
        podesiOtvoren(true);
        if (rezime) return;
        podesiUcitava(true);
        try {
            podesiRezime(await ServisAnkete.rezime(anketaId));
        } catch (_) {
            prikaziToastNotifikaciju("Greška pri učitavanju rezultata", TipToastNotifikacije.Greska);
            podesiOtvoren(false);
        } finally {
            podesiUcitava(false);
        }
    };

    return (
        <div className="mt-2">
            <button
                onClick={prebaci}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
            >
                {otvoren ? "Sakrij rezultate" : "Prikaži rezultate"}
            </button>

            {otvoren && (
                <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg">
                    {ucitava ? (
                        <p className="text-xs text-gray-400">Učitavanje...</p>
                    ) : rezime ? (
                        <>
                            <p className="text-xs text-gray-500 mb-3">Ukupno odgovora: <strong>{rezime.broj_odgovora}</strong></p>
                            <div className="flex flex-col gap-3">
                                {rezime.pitanja.map((p) => (
                                    <div key={p.pitanje_id}>
                                        <p className="text-sm font-medium text-gray-700 mb-1">{p.tekst}</p>
                                        {p.opcije.map((o) => {
                                            const pct = rezime.broj_odgovora ? Math.round((o.broj / rezime.broj_odgovora) * 100) : 0;
                                            return (
                                                <div key={o.opcija_id} className="mb-1">
                                                    <div className="flex justify-between text-xs text-gray-600">
                                                        <span>{o.tekst}</span>
                                                        <span>{o.broj} ({pct}%)</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-400" style={{ width: `${pct}%` }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {p.slobodni && p.slobodni.length > 0 && (
                                            <ul className="mt-1 list-disc list-inside text-xs text-gray-600 space-y-0.5">
                                                {p.slobodni.map((s, i) => <li key={i}>{s}</li>)}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : null}
                </div>
            )}
        </div>
    );
}
