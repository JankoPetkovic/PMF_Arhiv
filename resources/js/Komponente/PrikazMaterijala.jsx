import { useState, useEffect } from "react";
import PretragaMaterijala from "./Alati/PretragaMaterijala";
import KarticaMaterijala from "./KarticaMaterijala";

export default function PrikazMaterijala({ materijali: inicijalniMaterijali, tekst = "", prikaziInternuPretragu = true }) {
    const [materijali, podesiMaterijale] = useState(inicijalniMaterijali);

    // Sinhronizuj lokalno stanje kad se prosleđena lista promeni (npr. posle
    // osvežavanja nakon dodavanja/izmene/brisanja materijala).
    useEffect(() => {
        podesiMaterijale(inicijalniMaterijali);
    }, [inicijalniMaterijali]);

    return (
        <div className="flex flex-col gap-4 w-full h-content-panel mb-10 rounded-xl shadow-card p-4">
            
            {(tekst || prikaziInternuPretragu) && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {tekst && (
                        <div className="font-semibold p-2 rounded-lg bg-white/70 backdrop-blur-sm w-max">
                            {tekst}
                        </div>
                    )}
                    {prikaziInternuPretragu && (
                        <PretragaMaterijala
                            klase="relative w-full sm:w-64 sm:ml-auto"
                            podesiRezultate={podesiMaterijale}
                            inicijalniMaterijali={inicijalniMaterijali}
                        />
                    )}
                </div>
            )}

            <div className="flex flex-wrap content-start items-start gap-4 p-4 h-[80vh] overflow-auto justify-center lg:justify-start">
                {Array.isArray(materijali) && materijali.length !== 0 ? (
                    materijali.map((m) => (
                        <KarticaMaterijala materijal={m} key={m.materijal_id} />
                    ))
                ) : (
                    <div className="text-gray-500 italic mt-10">Nema rezultata pretrage.</div>
                )}
            </div>
        </div>
    );
}
