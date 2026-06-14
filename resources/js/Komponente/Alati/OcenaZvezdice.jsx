import { useState } from "react";
import { FaStar } from "react-icons/fa";

// Jedna zvezdica sa delimičnim popunjavanjem (popunjenost 0..1).
function Zvezda({ popunjenost, velicina }) {
    return (
        <span className="relative inline-block" style={{ width: velicina, height: velicina, lineHeight: 0 }}>
            <FaStar size={velicina} className="text-gray-300" />
            <span
                className="absolute top-0 left-0 overflow-hidden"
                style={{ width: `${Math.max(0, Math.min(1, popunjenost)) * 100}%`, height: velicina, lineHeight: 0 }}
            >
                <FaStar size={velicina} className="text-amber-400" />
            </span>
        </span>
    );
}

// Prikaz prosečne ocene (delimično popunjavanje) + klik za ocenu (1..5) kad je mozeOceniti.
export default function OcenaZvezdice({ prosek = 0, broj = 0, moja = null, naOceni, mozeOceniti = false, velicina = 18 }) {
    const [hover, setHover] = useState(0);

    const vrednost = hover || moja || prosek || 0;

    return (
        <div className="flex items-center gap-1.5">
            <div className="inline-flex items-center" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((i) => {
                    const popunjenost = vrednost - (i - 1); // 0..1 deo za ovu zvezdicu
                    const zvezda = <Zvezda popunjenost={popunjenost} velicina={velicina} />;

                    return mozeOceniti ? (
                        <button
                            key={i}
                            type="button"
                            onMouseEnter={() => setHover(i)}
                            onClick={() => naOceni(i)}
                            title={`Oceni ${i}`}
                            aria-label={`Oceni ${i}`}
                            className="cursor-pointer transition-transform hover:scale-125 px-px"
                            style={{ lineHeight: 0 }}
                        >
                            {zvezda}
                        </button>
                    ) : (
                        <span key={i} className="px-px">{zvezda}</span>
                    );
                })}
            </div>
            <span className="text-[11px] text-gray-500 whitespace-nowrap">
                {broj > 0 ? `${Number(prosek).toFixed(1)} (${broj})` : "Nema ocena"}
            </span>
        </div>
    );
}
