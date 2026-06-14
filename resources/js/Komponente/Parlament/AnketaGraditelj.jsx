import { FaPlus, FaTrash } from "react-icons/fa";

export const PRAZNO_PITANJE = () => ({ tekst: "", tip: "jednostruki", obavezno: true, dozvoli_drugo: false, opcije: ["", ""] });

export const PRAZNA_ANKETA = () => ({ imaAnketu: false, naslov: "", rok_trajanja: "", dozvoli_vise: false, pitanja: [PRAZNO_PITANJE()] });

// Pretvori postojeću anketu (iz objava.anketa) u stanje graditelja.
export function anketaUStanje(anketa) {
    if (!anketa) return PRAZNA_ANKETA();
    return {
        imaAnketu: true,
        naslov: anketa.naslov ?? "",
        rok_trajanja: anketa.rok_trajanja ? anketa.rok_trajanja.slice(0, 16) : "", // za datetime-local
        dozvoli_vise: !!anketa.dozvoli_vise,
        pitanja: (anketa.pitanja ?? []).map((p) => ({
            tekst: p.tekst,
            tip: p.tip,
            obavezno: p.obavezno,
            dozvoli_drugo: p.dozvoli_drugo,
            opcije: (p.opcije ?? []).map((o) => o.tekst),
        })),
    };
}

export default function AnketaGraditelj({ stanje, podesiStanje }) {
    const azuriraj = (izmene) => podesiStanje({ ...stanje, ...izmene });

    const azurirajPitanje = (i, izmene) => {
        const pitanja = stanje.pitanja.map((p, idx) => (idx === i ? { ...p, ...izmene } : p));
        azuriraj({ pitanja });
    };

    const dodajPitanje = () => azuriraj({ pitanja: [...stanje.pitanja, PRAZNO_PITANJE()] });
    const ukloniPitanje = (i) => azuriraj({ pitanja: stanje.pitanja.filter((_, idx) => idx !== i) });

    const dodajOpciju = (i) => azurirajPitanje(i, { opcije: [...stanje.pitanja[i].opcije, ""] });
    const azurirajOpciju = (i, j, vr) =>
        azurirajPitanje(i, { opcije: stanje.pitanja[i].opcije.map((o, idx) => (idx === j ? vr : o)) });
    const ukloniOpciju = (i, j) =>
        azurirajPitanje(i, { opcije: stanje.pitanja[i].opcije.filter((_, idx) => idx !== j) });

    return (
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <input
                    type="checkbox"
                    checked={stanje.imaAnketu}
                    onChange={(e) => azuriraj({ imaAnketu: e.target.checked })}
                />
                Dodaj anketu (poll) uz objavu
            </label>

            {stanje.imaAnketu && (
                <div className="mt-3 flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            value={stanje.naslov}
                            onChange={(e) => azuriraj({ naslov: e.target.value })}
                            placeholder="Naslov ankete (opciono)"
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400"
                        />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase">Rok trajanja</span>
                            <input
                                type="datetime-local"
                                value={stanje.rok_trajanja}
                                onChange={(e) => azuriraj({ rok_trajanja: e.target.value })}
                                className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-blue-400"
                            />
                        </div>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={stanje.dozvoli_vise}
                            onChange={(e) => azuriraj({ dozvoli_vise: e.target.checked })}
                        />
                        Dozvoli da isti korisnik popuni više puta
                    </label>

                    {stanje.pitanja.map((p, i) => (
                        <div key={i} className="border border-gray-200 rounded-lg p-3 bg-white">
                            <div className="flex items-start gap-2">
                                <input
                                    type="text"
                                    value={p.tekst}
                                    onChange={(e) => azurirajPitanje(i, { tekst: e.target.value })}
                                    placeholder={`Pitanje ${i + 1}`}
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400"
                                />
                                <select
                                    value={p.tip}
                                    onChange={(e) => azurirajPitanje(i, { tip: e.target.value })}
                                    className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm bg-white cursor-pointer"
                                >
                                    <option value="jednostruki">Jedan izbor</option>
                                    <option value="visestruki">Više izbora</option>
                                    <option value="slobodan">Slobodan unos</option>
                                </select>
                                {stanje.pitanja.length > 1 && (
                                    <button type="button" onClick={() => ukloniPitanje(i)} className="text-red-400 hover:text-red-600 p-1.5 cursor-pointer">
                                        <FaTrash size={13} />
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-600">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input type="checkbox" checked={p.obavezno} onChange={(e) => azurirajPitanje(i, { obavezno: e.target.checked })} />
                                    Obavezno
                                </label>
                                {p.tip !== "slobodan" && (
                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                        <input type="checkbox" checked={p.dozvoli_drugo} onChange={(e) => azurirajPitanje(i, { dozvoli_drugo: e.target.checked })} />
                                        Dozvoli „Drugo"
                                    </label>
                                )}
                            </div>

                            {p.tip !== "slobodan" && (
                                <div className="mt-2 flex flex-col gap-1.5 pl-1">
                                    {p.opcije.map((o, j) => (
                                        <div key={j} className="flex items-center gap-2">
                                            <span className="text-gray-300 text-xs">{j + 1}.</span>
                                            <input
                                                type="text"
                                                value={o}
                                                onChange={(e) => azurirajOpciju(i, j, e.target.value)}
                                                placeholder={`Opcija ${j + 1}`}
                                                className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400"
                                            />
                                            {p.opcije.length > 1 && (
                                                <button type="button" onClick={() => ukloniOpciju(i, j)} className="text-gray-300 hover:text-red-500 cursor-pointer">
                                                    <FaTrash size={11} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => dodajOpciju(i)} className="self-start text-xs text-blue-500 hover:text-blue-700 cursor-pointer mt-0.5">
                                        + Dodaj opciju
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={dodajPitanje}
                        className="self-start flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                        <FaPlus size={11} /> Dodaj pitanje
                    </button>
                </div>
            )}
        </div>
    );
}
