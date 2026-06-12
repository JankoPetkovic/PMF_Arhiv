import { useState } from "react";
import PretragaMaterijala from "./Alati/PretragaMaterijala";
import KarticaMaterijala from "./KarticaMaterijala";

export default function PrikazMaterijala({ materijali: inicijalniMaterijali, tekst = "" }) {
    const [materijali, podesiMaterijale] = useState(inicijalniMaterijali);

    return (
        <div className="flex flex-col gap-4 w-full h-content-panel mb-10 rounded-xl shadow-card p-4">
            
            {tekst && (
                <div className="font-semibold p-2 rounded-lg bg-white/70 backdrop-blur-sm w-max">
                    {tekst}
                </div>
            )}

            <PretragaMaterijala podesiRezultate={podesiMaterijale} inicijalniMaterijali={inicijalniMaterijali}/>

            <div className="flex flex-wrap gap-4 p-4 h-[80vh] overflow-auto justify-center lg:justify-start">
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
