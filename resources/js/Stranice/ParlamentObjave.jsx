import { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import Navbar from "../Komponente/Alati/Navbar";
import Dialog from "../Komponente/Dialog";
import ServisParlamenta from "../PomocniAlati/Servisi/ServisParlamenta";
import { prikaziToastNotifikaciju } from "../PomocniAlati/ToastNotifikacijaServis";
import TipToastNotifikacije from "../PomocniAlati/TipToastNotifikacije";
import { FaPlus, FaRegEdit, FaRegTrashAlt, FaExternalLinkAlt, FaRegUserCircle } from "react-icons/fa";

export default function ParlamentObjave() {
    const { objave = [], mozeUpravljati = false } = usePage().props;

    const [dialogForme, podesiDialogForme] = useState(false);
    const [objavaZaIzmenu, podesiObjavuZaIzmenu] = useState(null);
    const [dialogBrisanja, podesiDialogBrisanja] = useState(null);
    const [brise, podesiBrise] = useState(false);

    const otvoriKreiranje = () => {
        podesiObjavuZaIzmenu(null);
        podesiDialogForme(true);
    };

    const otvoriIzmenu = (objava) => {
        podesiObjavuZaIzmenu(objava);
        podesiDialogForme(true);
    };

    const obradiBrisanje = async () => {
        if (!dialogBrisanja) return;
        podesiBrise(true);
        try {
            await ServisParlamenta.obrisi(dialogBrisanja.parlament_objava_id);
            podesiDialogBrisanja(null);
            router.reload();
        } finally {
            podesiBrise(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 pt-10 pb-16">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Objave parlamenta</h1>
                        <p className="text-sm text-gray-500">Najnovije informacije studentskog parlamenta</p>
                    </div>
                    {mozeUpravljati && (
                        <button
                            onClick={otvoriKreiranje}
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer transition-colors"
                        >
                            <FaPlus size={13} /> Nova objava
                        </button>
                    )}
                </div>

                {objave.length === 0 ? (
                    <div className="text-center text-gray-400 italic py-20 bg-white rounded-xl border border-gray-200">
                        Još uvek nema objava.
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {objave.map((o) => (
                            <KarticaObjave
                                key={o.parlament_objava_id}
                                objava={o}
                                mozeUpravljati={mozeUpravljati}
                                onIzmeni={() => otvoriIzmenu(o)}
                                onObrisi={() => podesiDialogBrisanja(o)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Dialog
                naslov={objavaZaIzmenu ? "Izmena objave" : "Nova objava"}
                prikaziDialog={dialogForme}
                podesiPrikaziDialog={podesiDialogForme}
                sadrzaj={
                    <FormaObjave
                        objava={objavaZaIzmenu}
                        zatvori={() => podesiDialogForme(false)}
                    />
                }
            />

            <Dialog
                naslov={"Brisanje objave"}
                prikaziDialog={!!dialogBrisanja}
                podesiPrikaziDialog={() => podesiDialogBrisanja(null)}
                sadrzaj={
                    <div className="bg-white p-6 rounded-lg flex flex-col gap-3 w-full sm:w-80">
                        <span>Obrisati objavu <span className="font-bold">{dialogBrisanja?.naslov}</span>?</span>
                        <button
                            onClick={obradiBrisanje}
                            disabled={brise}
                            className={`self-end mt-2 px-4 py-2 rounded-md text-white transition-colors ${brise ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 cursor-pointer'}`}
                        >
                            {brise ? 'Brisanje...' : 'Obriši'}
                        </button>
                    </div>
                }
            />
        </div>
    );
}

function KarticaObjave({ objava, mozeUpravljati, onIzmeni, onObrisi }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {objava.slika && (
                <img src={objava.slika} alt={objava.naslov} className="w-full max-h-80 object-cover" />
            )}
            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold text-gray-800">{objava.naslov}</h2>
                    {mozeUpravljati && (
                        <div className="flex items-center gap-3 shrink-0">
                            <FaRegEdit
                                size={18}
                                onClick={onIzmeni}
                                className="text-yellow-500 cursor-pointer hover:scale-110 transition-transform"
                            />
                            <FaRegTrashAlt
                                size={17}
                                onClick={onObrisi}
                                className="text-red-400 cursor-pointer hover:scale-110 transition-transform"
                            />
                        </div>
                    )}
                </div>

                {objava.sadrzaj && (
                    <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{objava.sadrzaj}</p>
                )}

                {objava.link && (
                    <a
                        href={objava.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-sm text-blue-600 hover:text-blue-800"
                    >
                        <FaExternalLinkAlt size={11} /> Otvori link
                    </a>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-400 mt-4">
                    <FaRegUserCircle size={14} />
                    <span>{objava.autor || 'Nepoznat autor'}</span>
                    {objava.datum_objave && <span>· {objava.datum_objave}</span>}
                </div>
            </div>
        </div>
    );
}

function FormaObjave({ objava, zatvori }) {
    const [naslov, podesiNaslov] = useState(objava?.naslov ?? "");
    const [sadrzaj, podesiSadrzaj] = useState(objava?.sadrzaj ?? "");
    const [link, podesiLink] = useState(objava?.link ?? "");
    const [slika, podesiSliku] = useState(null);
    const [ukloniSliku, podesiUkloniSliku] = useState(false);
    const [cuva, podesiCuva] = useState(false);

    const imaPostojecuSliku = !!objava?.slika && !ukloniSliku && !slika;

    const obradiSlanje = async () => {
        if (!naslov.trim() || cuva) {
            if (!naslov.trim()) prikaziToastNotifikaciju("Naslov je obavezan", TipToastNotifikacije.Info);
            return;
        }
        podesiCuva(true);
        try {
            const fd = new FormData();
            fd.append("naslov", naslov.trim());
            fd.append("sadrzaj", sadrzaj ?? "");
            if (link.trim()) fd.append("link", link.trim());
            if (slika) fd.append("slika", slika);
            if (objava && ukloniSliku) fd.append("ukloni_sliku", "1");

            if (objava) {
                await ServisParlamenta.izmeni(objava.parlament_objava_id, fd);
            } else {
                await ServisParlamenta.kreiraj(fd);
            }
            zatvori();
            router.reload();
        } catch (_) {
        } finally {
            podesiCuva(false);
        }
    };

    return (
        <div className="w-full sm:w-[460px] flex flex-col gap-4">
            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Naslov</label>
                <input
                    type="text"
                    value={naslov}
                    onChange={(e) => podesiNaslov(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Naslov objave"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Tekst</label>
                <textarea
                    value={sadrzaj}
                    onChange={(e) => podesiSadrzaj(e.target.value)}
                    rows={5}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-y"
                    placeholder="Sadržaj objave (opciono)"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Link (opciono)</label>
                <input
                    type="url"
                    value={link}
                    onChange={(e) => podesiLink(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                    placeholder="https://..."
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Slika (opciono)</label>
                {imaPostojecuSliku && (
                    <div className="flex items-center gap-3 mb-2">
                        <img src={objava.slika} alt="" className="h-14 w-14 object-cover rounded-lg" />
                        <button
                            type="button"
                            onClick={() => podesiUkloniSliku(true)}
                            className="text-xs text-red-500 hover:text-red-700 cursor-pointer underline"
                        >
                            Ukloni postojeću sliku
                        </button>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => { podesiSliku(e.target.files?.[0] ?? null); podesiUkloniSliku(false); }}
                    className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 file:cursor-pointer"
                />
            </div>

            <div className="flex justify-end pt-1">
                <button
                    onClick={obradiSlanje}
                    disabled={!naslov.trim() || cuva}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        naslov.trim() && !cuva
                            ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {cuva ? 'Čuvanje...' : (objava ? 'Sačuvaj izmene' : 'Objavi')}
                </button>
            </div>
        </div>
    );
}
