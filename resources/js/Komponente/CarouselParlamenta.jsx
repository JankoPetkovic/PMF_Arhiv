import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { FaChevronLeft, FaChevronRight, FaExternalLinkAlt } from "react-icons/fa";

export default function CarouselParlamenta({ objave = [] }) {
    const [aktivni, podesiAktivni] = useState(0);

    const broj = objave.length;

    useEffect(() => {
        if (broj <= 1) return;
        const timer = setInterval(() => {
            podesiAktivni((p) => (p + 1) % broj);
        }, 6000);
        return () => clearInterval(timer);
    }, [broj]);

    if (broj === 0) return null;

    const objava = objave[Math.min(aktivni, broj - 1)];

    const idiNa = (delta) => podesiAktivni((p) => (p + delta + broj) % broj);

    return (
        <div className="w-full mb-8">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-800 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    Objave parlamenta
                </h2>
                <button
                    onClick={() => router.visit('/parlament')}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-lg cursor-pointer"
                >
                    Pogledaj sve →
                </button>
            </div>

            <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden">
                <div
                    onClick={() => router.visit('/parlament')}
                    className="flex flex-col sm:flex-row cursor-pointer"
                >
                    {objava.slika && (
                        <img
                            src={objava.slika}
                            alt={objava.naslov}
                            className="w-full sm:w-72 h-48 sm:h-56 object-cover shrink-0"
                        />
                    )}
                    <div className="p-5 flex flex-col justify-center min-w-0">
                        <h3 className="text-xl font-semibold text-gray-800">{objava.naslov}</h3>
                        {objava.sadrzaj && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-3 whitespace-pre-line">
                                {objava.sadrzaj}
                            </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-3">
                            <span>{objava.autor || 'Parlament'}</span>
                            {objava.datum_objave && <span>· {objava.datum_objave}</span>}
                            {objava.link && (
                                <a
                                    href={objava.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                >
                                    <FaExternalLinkAlt size={10} /> Link
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {broj > 1 && (
                    <>
                        <button
                            onClick={() => idiNa(-1)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow cursor-pointer"
                            aria-label="Prethodna"
                        >
                            <FaChevronLeft size={14} />
                        </button>
                        <button
                            onClick={() => idiNa(1)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow cursor-pointer"
                            aria-label="Sledeća"
                        >
                            <FaChevronRight size={14} />
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {objave.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => podesiAktivni(i)}
                                    className={`h-2 rounded-full transition-all cursor-pointer ${i === aktivni ? 'w-5 bg-blue-500' : 'w-2 bg-gray-300'}`}
                                    aria-label={`Objava ${i + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
