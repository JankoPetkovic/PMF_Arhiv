import { useState, useEffect, useRef } from "react";
import { usePage, router } from "@inertiajs/react";
import Navbar from "../Komponente/Alati/Navbar";
import CustomSelect from "../Komponente/Alati/CustomSelect";
import ServisDriveImporta from "../PomocniAlati/Servisi/ServisDriveImporta";
import ServisPodtipovaMaterijala from "../PomocniAlati/Servisi/ServisPodtipovaMaterijala";
import { generisiSkolskeGodine } from "../PomocniAlati/SkolskeGodine";
import { prikaziToastNotifikaciju } from "../PomocniAlati/ToastNotifikacijaServis";
import TipToastNotifikacije from "../PomocniAlati/TipToastNotifikacije";
import { Tooltip, CircularProgress, LinearProgress } from "@mui/material";
import { FaArrowLeft, FaGoogleDrive, FaCheck, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { IoCloudDownload } from "react-icons/io5";

const PO_STRANICI = 20;
const BATCH_VELICINA = 10;
const skolskeGodine = generisiSkolskeGodine();

function formatirajVelicinu(bytes) {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extractFolderId(input) {
    const match = input.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : input.trim();
}

function stavkaJeSpremna(s) {
    return s.izabrana && s.predmet && s.podtip && s.skolskaGodina;
}

export default function ImportDrive() {
    const { tipoviMaterijala } = usePage().props;

    const [korak, setKorak] = useState(1);
    const [folderInput, setFolderInput] = useState('');
    const [ucitava, setUcitava] = useState(false);
    const [stavke, setStavke] = useState([]);
    const [predmeti, setPredmeti] = useState([]);
    const [stranica, setStranica] = useState(0);

    // bulk akcije
    const [bulkPredmet, setBulkPredmet] = useState(null);
    const [bulkTip, setBulkTip] = useState(null);
    const [bulkPodtip, setBulkPodtip] = useState(null);
    const [bulkSkolskaGodina, setBulkSkolskaGodina] = useState(null);
    const [bulkPodtipovi, setBulkPodtipovi] = useState([]);

    // import progress
    const [uvoziPodatke, setUvoziPodatke] = useState(false);
    const [uvozBrojac, setUvozBrojac] = useState({ obradjeno: 0, ukupno: 0 });
    const [rezultati, setRezultati] = useState(null);

    const podtipoviCache = useRef({});

    const uzmiPodtipove = async (tipId) => {
        if (podtipoviCache.current[tipId]) return podtipoviCache.current[tipId];
        const data = await ServisPodtipovaMaterijala.vratiPodTipoveMaterijala({ tip_materijala_id: tipId });
        const lista = Array.isArray(data) ? data : [];
        podtipoviCache.current[tipId] = lista;
        return lista;
    };

    useEffect(() => {
        if (!bulkTip) { setBulkPodtip(null); setBulkPodtipovi([]); return; }
        uzmiPodtipove(bulkTip.tip_materijala_id).then(setBulkPodtipovi);
    }, [bulkTip]);

    const ucitajFajlove = async () => {
        const id = extractFolderId(folderInput);
        if (!id) return;
        setUcitava(true);
        try {
            const data = await ServisDriveImporta.vratiFajlove(id);
            setPredmeti(data.predmeti.map(p => ({ ...p, id: p.predmet_id })));
            setStavke(data.fajlovi.map((f) => ({
                id: crypto.randomUUID(),
                drive_id: f.drive_id,
                naziv: f.naziv,
                velicina: f.velicina,
                putanja: f.putanja,
                predlozena_godina: f.predlozena_godina,
                predmet: f.predlozen_predmet || null,
                tip: null,
                podtip: null,
                podtipovi: [],
                skolskaGodina: null,
                izabrana: true,
                vecPostoji: f.vec_postoji || false,
            })));
            setStranica(0);
            setKorak(2);
        } catch (_) {
        } finally {
            setUcitava(false);
        }
    };

    const azurirajStavku = (id, izmene) => {
        setStavke(prev => prev.map(s => s.id === id ? { ...s, ...izmene } : s));
    };

    const azurirajTip = async (id, noviTip) => {
        const podtipovi = noviTip ? await uzmiPodtipove(noviTip.tip_materijala_id) : [];
        azurirajStavku(id, { tip: noviTip, podtip: null, podtipovi });
    };

    const primeniBulk = () => {
        if (!bulkPredmet && !bulkTip && !bulkPodtip && !bulkSkolskaGodina) return;
        setStavke(prev => prev.map(s => {
            if (!s.izabrana) return s;
            const izmene = {};
            if (bulkPredmet) izmene.predmet = bulkPredmet;
            if (bulkTip) { izmene.tip = bulkTip; izmene.podtipovi = bulkPodtipovi; if (s.tip?.tip_materijala_id !== bulkTip.tip_materijala_id) izmene.podtip = null; }
            if (bulkPodtip) izmene.podtip = bulkPodtip;
            if (bulkSkolskaGodina) izmene.skolskaGodina = bulkSkolskaGodina;
            return { ...s, ...izmene };
        }));
        prikaziToastNotifikaciju('Primenjeno na izabrane fajlove', TipToastNotifikacije.Uspesno);
    };

    const obradiUvoz = async () => {
        const stavkeZaUvoz = stavke.filter(stavkaJeSpremna);
        if (stavkeZaUvoz.length === 0) return;

        setUvoziPodatke(true);
        setUvozBrojac({ obradjeno: 0, ukupno: stavkeZaUvoz.length });

        let ukupnoUspesnih = 0;
        let sveGreske = [];

        for (let i = 0; i < stavkeZaUvoz.length; i += BATCH_VELICINA) {
            const batch = stavkeZaUvoz.slice(i, i + BATCH_VELICINA);
            try {
                const rez = await ServisDriveImporta.uvezi(batch.map(s => ({
                    drive_id: s.drive_id,
                    naziv: s.naziv,
                    predmet_id: s.predmet.predmet_id,
                    podtip_materijala_id: s.podtip.podtip_materijala_id,
                    skolska_godina: s.skolskaGodina.naziv,
                })));
                ukupnoUspesnih += rez.uspesnih;
                sveGreske = [...sveGreske, ...rez.gresaka];
            } catch (_) {}
            setUvozBrojac({ obradjeno: Math.min(i + BATCH_VELICINA, stavkeZaUvoz.length), ukupno: stavkeZaUvoz.length });
        }

        setRezultati({ uspesnih: ukupnoUspesnih, gresaka: sveGreske });
        setUvoziPodatke(false);
        setKorak(3);
    };

    const spremnihZaUvoz = stavke.filter(stavkaJeSpremna).length;
    const preskocenih = stavke.filter(s => !s.izabrana).length;
    const nedostajuPodaci = stavke.filter(s => s.izabrana && !stavkaJeSpremna(s)).length;

    const straniceFajlovi = stavke.slice(stranica * PO_STRANICI, (stranica + 1) * PO_STRANICI);
    const ukupnoStranica = Math.ceil(stavke.length / PO_STRANICI);

    // ── Korak 1: Unos folder ID ──────────────────────────────────────────────
    if (korak === 1) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-2xl mx-auto px-4 pt-16">
                    <button onClick={() => router.visit('/')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8 cursor-pointer">
                        <FaArrowLeft size={12} /> Na početnu
                    </button>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <FaGoogleDrive className="text-blue-500" size={28} />
                            <div>
                                <h1 className="text-xl font-semibold text-gray-800">Uvoz sa Google Drive-a</h1>
                                <p className="text-sm text-gray-500">Admin alat — preuzima fajlove i objavljuje ih u arhiv</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Link ili ID Google Drive foldera
                                </label>
                                <input
                                    type="text"
                                    value={folderInput}
                                    onChange={e => setFolderInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && folderInput.trim() && ucitajFajlove()}
                                    placeholder="https://drive.google.com/drive/folders/..."
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                                />
                                <p className="text-xs text-gray-400 mt-1">Nalepite ceo link ili samo ID foldera</p>
                            </div>

                            <button
                                onClick={ucitajFajlove}
                                disabled={!folderInput.trim() || ucitava}
                                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    folderInput.trim() && !ucitava
                                        ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {ucitava ? <><CircularProgress size={16} color="inherit" /> Učitavam fajlove...</> : 'Učitaj fajlove'}
                            </button>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-xs text-blue-700 space-y-1">
                            <p className="font-medium">Pre nego što nastaviš:</p>
                            <p>• Folder mora biti podeljen sa service account email adresom</p>
                            <p>• Fajlovi tipa Google Docs/Sheets/Slides se automatski preskačaju</p>
                            <p>• Kredenšijal fajl treba biti na: <code className="bg-blue-100 px-1 rounded">storage/app/google-credentials.json</code></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Korak 3: Rezultati ───────────────────────────────────────────────────
    if (korak === 3) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-2xl mx-auto px-4 pt-16">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Rezultati importa</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                                <FaCheck className="text-green-500" size={20} />
                                <div>
                                    <p className="font-medium text-green-800">Uspešno uvezeno</p>
                                    <p className="text-2xl font-bold text-green-600">{rezultati.uspesnih} fajlova</p>
                                </div>
                            </div>

                            {rezultati.gresaka.length > 0 && (
                                <div className="p-4 bg-red-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FaExclamationTriangle className="text-red-500" size={16} />
                                        <p className="font-medium text-red-800">Greške ({rezultati.gresaka.length})</p>
                                    </div>
                                    <div className="space-y-1 max-h-48 overflow-y-auto">
                                        {rezultati.gresaka.map((g, i) => (
                                            <div key={i} className="text-xs text-red-700 p-2 bg-red-100 rounded">
                                                <span className="font-medium">{g.naziv}</span>: {g.greska}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => { setKorak(1); setStavke([]); setFolderInput(''); setRezultati(null); }}
                                className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                            >
                                Uvezi još
                            </button>
                            <button
                                onClick={() => router.visit('/')}
                                className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                            >
                                Na početnu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Korak 2: Pregled fajlova ─────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Progress overlay */}
            {uvoziPodatke && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-8 shadow-xl w-80">
                        <div className="flex items-center gap-3 mb-4">
                            <IoCloudDownload className="text-blue-500" size={24} />
                            <div>
                                <p className="font-medium text-gray-800">Uvoz u toku...</p>
                                <p className="text-sm text-gray-500">{uvozBrojac.obradjeno} / {uvozBrojac.ukupno} fajlova</p>
                            </div>
                        </div>
                        <LinearProgress
                            variant="determinate"
                            value={uvozBrojac.ukupno ? (uvozBrojac.obradjeno / uvozBrojac.ukupno) * 100 : 0}
                        />
                    </div>
                </div>
            )}

            <div className="max-w-screen-xl mx-auto px-4 pt-6 pb-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setKorak(1)}
                            className="text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            <FaArrowLeft size={14} />
                        </button>
                        <div>
                            <h1 className="text-lg font-semibold text-gray-800">Pregled fajlova</h1>
                            <p className="text-xs text-gray-500">
                                Ukupno: <strong>{stavke.length}</strong> ·
                                Spremnо: <strong className="text-green-600">{spremnihZaUvoz}</strong> ·
                                Nedostaju podaci: <strong className="text-yellow-600">{nedostajuPodaci}</strong> ·
                                Preskočeno: <strong className="text-gray-400">{preskocenih}</strong>
                            </p>
                            <div className="flex gap-3 mt-1">
                                <button
                                    onClick={() => setStavke(prev => prev.map(s => ({ ...s, izabrana: true })))}
                                    className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer"
                                >
                                    Čekiraj sve
                                </button>
                                <button
                                    onClick={() => setStavke(prev => prev.map(s => ({ ...s, izabrana: false })))}
                                    className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    Odčekiraj sve
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={obradiUvoz}
                        disabled={spremnihZaUvoz === 0 || uvoziPodatke}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            spremnihZaUvoz > 0 && !uvoziPodatke
                                ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <IoCloudDownload size={16} />
                        Uvezi {spremnihZaUvoz > 0 ? spremnihZaUvoz : ''} fajlova
                    </button>
                </div>

                {/* Bulk akcije */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Primeni na izabrane fajlove</p>
                    <div className="flex flex-wrap gap-3 items-end">
                        <div className="w-52">
                            <CustomSelect
                                klase="w-full"
                                opcije={predmeti}
                                vrednost={bulkPredmet}
                                podesiSelektovaneOpcije={setBulkPredmet}
                                labela="Predmet"
                                imeOpcije="naziv"
                                nazivPlus="smer"
                                velicina="small"
                            />
                        </div>
                        <div className="w-44">
                            <CustomSelect
                                klase="w-full"
                                opcije={tipoviMaterijala}
                                vrednost={bulkTip}
                                podesiSelektovaneOpcije={setBulkTip}
                                labela="Tip materijala"
                                velicina="small"
                            />
                        </div>
                        <div className="w-44">
                            <CustomSelect
                                klase="w-full"
                                opcije={bulkPodtipovi}
                                vrednost={bulkPodtip}
                                podesiSelektovaneOpcije={setBulkPodtip}
                                labela="Podtip"
                                zakljucana={!bulkTip}
                                tooltipTekst="Izaberi tip materijala!"
                                velicina="small"
                            />
                        </div>
                        <div className="w-36">
                            <CustomSelect
                                klase="w-full"
                                opcije={skolskeGodine}
                                vrednost={bulkSkolskaGodina}
                                podesiSelektovaneOpcije={setBulkSkolskaGodina}
                                labela="Školska godina"
                                velicina="small"
                            />
                        </div>
                        <button
                            onClick={primeniBulk}
                            disabled={!bulkPredmet && !bulkTip && !bulkPodtip && !bulkSkolskaGodina}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                (bulkPredmet || bulkTip || bulkPodtip || bulkSkolskaGodina)
                                    ? 'bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            Primeni na izabrane
                        </button>
                    </div>
                </div>

                {/* Tabela */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                                <th className="px-3 py-3 text-left w-8">Uvezi</th>
                                <th className="px-3 py-3 text-left">Naziv fajla</th>
                                <th className="px-3 py-3 text-left w-48">Predmet</th>
                                <th className="px-3 py-3 text-left w-40">Tip</th>
                                <th className="px-3 py-3 text-left w-40">Podtip</th>
                                <th className="px-3 py-3 text-left w-36">Školska godina</th>
                                <th className="px-3 py-3 text-left w-8">OK</th>
                            </tr>
                        </thead>
                        <tbody>
                            {straniceFajlovi.map((stavka) => (
                                <RedTabele
                                    key={stavka.id}
                                    stavka={stavka}
                                    predmeti={predmeti}
                                    tipoviMaterijala={tipoviMaterijala}
                                    skolskeGodine={skolskeGodine}
                                    onAzurirajTip={azurirajTip}
                                    onAzuriraj={azurirajStavku}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Paginacija */}
                {ukupnoStranica > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <button
                            onClick={() => setStranica(p => Math.max(0, p - 1))}
                            disabled={stranica === 0}
                            className="px-3 py-1.5 rounded text-sm border border-gray-300 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            ←
                        </button>
                        <span className="text-sm text-gray-600">
                            {stranica + 1} / {ukupnoStranica}
                        </span>
                        <button
                            onClick={() => setStranica(p => Math.min(ukupnoStranica - 1, p + 1))}
                            disabled={stranica === ukupnoStranica - 1}
                            className="px-3 py-1.5 rounded text-sm border border-gray-300 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function RedTabele({ stavka, predmeti, tipoviMaterijala, skolskeGodine, onAzurirajTip, onAzuriraj }) {
    const spreman = stavkaJeSpremna(stavka);

    return (
        <tr className={`border-b border-gray-50 ${!stavka.izabrana ? 'opacity-40' : spreman ? 'bg-green-50/30' : 'bg-yellow-50/30'}`}>
            <td className="px-3 py-2 text-center">
                <input
                    type="checkbox"
                    checked={stavka.izabrana}
                    onChange={e => onAzuriraj(stavka.id, { izabrana: e.target.checked })}
                    className="cursor-pointer"
                />
            </td>
            <td className="px-3 py-2">
                <div className="flex items-center gap-1.5">
                    <p className="font-medium text-gray-800 text-xs leading-tight max-w-[220px] truncate" title={stavka.naziv}>
                        {stavka.naziv}
                    </p>
                    {stavka.vecPostoji && (
                        <Tooltip title="Fajl sa ovim imenom već postoji u arhivu" arrow placement="top">
                            <span>
                                <FaExclamationTriangle className="text-red-500 shrink-0" size={12} />
                            </span>
                        </Tooltip>
                    )}
                </div>
                <p className="text-gray-400 text-xs truncate max-w-[220px]" title={stavka.putanja}>
                    {stavka.putanja || '/'} {stavka.velicina ? `· ${formatirajVelicinu(stavka.velicina)}` : ''}
                </p>
            </td>
            <td className="px-2 py-1.5">
                <CustomSelect
                    klase="w-full"
                    opcije={predmeti}
                    vrednost={stavka.predmet}
                    podesiSelektovaneOpcije={val => onAzuriraj(stavka.id, { predmet: val })}
                    labela="Predmet"
                    imeOpcije="naziv"
                    nazivPlus="smer"
                    velicina="small"
                    zakljucana={!stavka.izabrana}
                />
            </td>
            <td className="px-2 py-1.5">
                <CustomSelect
                    klase="w-full"
                    opcije={tipoviMaterijala}
                    vrednost={stavka.tip}
                    podesiSelektovaneOpcije={val => onAzurirajTip(stavka.id, val)}
                    labela="Tip"
                    velicina="small"
                    zakljucana={!stavka.izabrana}
                />
            </td>
            <td className="px-2 py-1.5">
                <CustomSelect
                    klase="w-full"
                    opcije={stavka.podtipovi}
                    vrednost={stavka.podtip}
                    podesiSelektovaneOpcije={val => onAzuriraj(stavka.id, { podtip: val })}
                    labela="Podtip"
                    zakljucana={!stavka.tip || !stavka.izabrana}
                    tooltipTekst="Izaberi tip!"
                    velicina="small"
                />
            </td>
            <td className="px-2 py-1.5">
                <CustomSelect
                    klase="w-full"
                    opcije={skolskeGodine}
                    vrednost={stavka.skolskaGodina}
                    podesiSelektovaneOpcije={val => onAzuriraj(stavka.id, { skolskaGodina: val })}
                    labela="Školska"
                    velicina="small"
                    zakljucana={!stavka.izabrana}
                />
            </td>
            <td className="px-3 py-2 text-center">
                {!stavka.izabrana ? (
                    <FaTimes className="text-gray-300 mx-auto" size={14} />
                ) : spreman ? (
                    <FaCheck className="text-green-500 mx-auto" size={14} />
                ) : (
                    <FaExclamationTriangle className="text-yellow-400 mx-auto" size={14} />
                )}
            </td>
        </tr>
    );
}
