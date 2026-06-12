import { useEffect, useRef, useState } from "react";
import { Link } from '@inertiajs/react';
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

export default function Departmani({ smerovi }) {
    const [activeDepartman, setActiveDepartman] = useState(null);
    const [openNivoi, setOpenNivoi] = useState({});
    const containerRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setActiveDepartman(null);
                setOpenNivoi({});
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const toggleDepartman = (id) => {
        setActiveDepartman(prev => prev === id ? null : id);
        setOpenNivoi({});
    };

    const toggleNivo = (nivo) => {
        setOpenNivoi(prev => ({ ...prev, [nivo]: !prev[nivo] }));
    };

    return (
        <div ref={containerRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-4">
            {smerovi.map(departman => (
                <div key={departman.departman_id} className="relative">
                    <button
                        onClick={() => toggleDepartman(departman.departman_id)}
                        className={`w-full h-full flex items-center px-4 py-3 rounded-xl transition-all duration-150 cursor-pointer select-none ${
                            activeDepartman === departman.departman_id
                                ? 'bg-blue-500 text-white shadow-sm'
                                : 'hover:bg-blue-50 text-gray-700'
                        }`}
                    >
                        <div className="flex items-center gap-2.5 flex-1 justify-center">
                            <img
                                src={`/storage/ikonice/${departman.departman_naziv.toLowerCase().replace(/ /g, "_")}.svg`}
                                className="w-7 h-7 shrink-0"
                                alt=""
                            />
                            <span className="text-base font-medium">{departman.departman_naziv}</span>
                        </div>
                        <FaChevronDown
                            size={13}
                            className={`shrink-0 transition-transform duration-150 ${activeDepartman === departman.departman_id ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {activeDepartman === departman.departman_id && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 min-w-[220px] bg-white border border-gray-100 rounded-xl shadow-xl z-[9999] overflow-hidden">
                            {Object.entries(departman.nivo_studija).map(([nivo, nivoSmerovi]) => (
                                <div key={nivo} className="border-b border-gray-50 last:border-0">
                                    <button
                                        onClick={() => toggleNivo(nivo)}
                                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wide cursor-pointer"
                                    >
                                        {nivo}
                                        <FaChevronRight
                                            size={10}
                                            className={`transition-transform duration-150 ${openNivoi[nivo] ? 'rotate-90' : ''}`}
                                        />
                                    </button>
                                    {openNivoi[nivo] && (
                                        <ul className="px-2 pb-2">
                                            {nivoSmerovi.map(smer => (
                                                <li key={smer.id}>
                                                    <Link
                                                        href={`/smerovi/${smer.id}`}
                                                        className="block px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                                                        onClick={() => setActiveDepartman(null)}
                                                    >
                                                        {smer.naziv}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
