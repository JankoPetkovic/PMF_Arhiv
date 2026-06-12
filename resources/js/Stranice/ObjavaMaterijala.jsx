import CustomSelect from "../Komponente/Alati/CustomSelect";
import FajlUploader from "../Komponente/Alati/FajlUploader";
import { prikaziToastNotifikaciju } from "../PomocniAlati/ToastNotifikacijaServis";
import TipToastNotifikacije from "../PomocniAlati/TipToastNotifikacije";
import ServisMaterijala from "../PomocniAlati/Servisi/ServisMaterijala";
import ServisSmerova from "../PomocniAlati/Servisi/ServisSmerova";
import { koristiGlobalniKontekst } from "../Konteksti";
import { useMetapodaciMaterijala } from "../PomocniAlati/Hooks/useMetapodaciMaterijala";
import { useState, useEffect } from "react";
import { Tooltip } from "@mui/material";
import { FaArrowLeft, FaFileAlt, FaTimes, FaEdit } from "react-icons/fa";
import { IoCloudUpload } from "react-icons/io5";
import { router, usePage } from "@inertiajs/react";

const ZABRANJENI_ZNAKOVI = /[\\\/:*?"<>|]/;
const REZERVISANA_IMENA = [
    'CON', 'PRN', 'AUX', 'NUL',
    ...Array.from({ length: 9 }, (_, i) => `COM${i + 1}`),
    ...Array.from({ length: 9 }, (_, i) => `LPT${i + 1}`),
];

function imaNedozvoljeneKaraktere(naziv) {
    const nazivBezEkstenzije = naziv.split('.').slice(0, -1).join('.');
    return (
        ZABRANJENI_ZNAKOVI.test(naziv) ||
        REZERVISANA_IMENA.includes(nazivBezEkstenzije.toUpperCase()) ||
        naziv.trim() === '' ||
        naziv.endsWith(' ') ||
        naziv.endsWith('.')
    );
}

function formatirajVelicinu(bytes) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ObjavaMaterijala({ podesiPrikazDialoga }) {
    const { ulogovanKorisnik } = usePage().props;
    const { podaci } = koristiGlobalniKontekst();

    const korisnikSmerovi = ulogovanKorisnik?.smerovi_korisnika ?? [];

    const [korak, podesiKorak] = useState(1);

    // ── Fajlovi ──────────────────────────────────────────────────
    const [stavkeFajlova, podesiStavkeFajlova] = useState([]);

    const dodajFajlove = (noviFajlovi) => {
        const novaStavke = noviFajlovi.map(f => ({
            id: crypto.randomUUID(),
            fajl: f,
            naziv: f.name,
        }));
        podesiStavkeFajlova(prev => [...prev, ...novaStavke]);
    };

    const ukloniFajl = (id) =>
        podesiStavkeFajlova(prev => prev.filter(s => s.id !== id));

    const azurirajNaziv = (id, noviNaziv) =>
        podesiStavkeFajlova(prev =>
            prev.map(s => s.id === id ? { ...s, naziv: noviNaziv } : s)
        );

    // ── Smer (pre-fill iz profila korisnika) ─────────────────────
    const [aktivniSmer, podesiAktivniSmer] = useState(
        korisnikSmerovi.length > 0 ? korisnikSmerovi[0] : null
    );
    // Ako korisnik nema smer u profilu, odmah otvori editovanje
    const [urediSmer, podesiUrediSmer] = useState(korisnikSmerovi.length === 0);
    const [editDepartman, podesiEditDepartman] = useState('');
    const [editNivoStudija, podesiEditNivoStudija] = useState('');
    const [editSmer, podesiEditSmer] = useState('');
    const [dostupniEditSmerovi, podesiDostupneEditSmerove] = useState([]);
    const [ucitavaSmerove, podesiUcitavaSmerove] = useState(false);

    // ── Metapodaci materijala (hook) ─────────────────────────────
    const {
        dostupneSkolskeGodine,
        dostupneGodine,
        izabranaGodina, podesiIzabranugodinu,
        dostupniPredmeti, izabraniPredmet, podesiIzabraniPredmet, ucitavaPredmete,
        izabraniTip: izabraniTipMaterijala,
        podesiIzabraniTip: podesiIzabraniTipMaterijala,
        dostupniPodtipovi,
        izabraniPodtip: izabraniPodTipMaterijala,
        podesiIzabraniPodtip: podesiIzabraniPodTipMaterijala,
        ucitavaPodtipove,
        izabranaSkolskaGodina, podesiIzabranaSkolskaGodinu,
    } = useMetapodaciMaterijala(aktivniSmer);

    // ── Upload ───────────────────────────────────────────────────
    const [uploading, podesiUploading] = useState(false);
    const [uploadBrojac, podesiUploadBrojac] = useState(0);

    // Kada se promeni smer — postavi godinu iz profila korisnika (hook resetuje predmete)
    useEffect(() => {
        if (!aktivniSmer) { podesiIzabranugodinu(null); return; }
        const maxGodina = aktivniSmer.nivo_studija_id === 2 ? 2 : 3;
        const godinaVrednost = Math.min(ulogovanKorisnik?.godina ?? 1, maxGodina);
        podesiIzabranugodinu({ naziv: `${godinaVrednost}. Godina`, vrednost: godinaVrednost });
    }, [aktivniSmer]); // eslint-disable-line react-hooks/exhaustive-deps

    // U edit kaskadi — učitaj smerove na osnovu departmana i nivoa
    useEffect(() => {
        podesiEditSmer('');
        podesiDostupneEditSmerove([]);
        if (!editDepartman || !editNivoStudija) return;
        podesiUcitavaSmerove(true);
        ServisSmerova.vratiSmerove({
            departman_id: editDepartman.departman_id,
            nivo_studija_id: editNivoStudija.nivo_studija_id,
        })
            .then(s => podesiDostupneEditSmerove(Array.isArray(s) ? s : []))
            .catch(() => podesiDostupneEditSmerove([]))
            .finally(() => podesiUcitavaSmerove(false));
    }, [editDepartman, editNivoStudija]);

    const primenIzaborSmera = () => {
        if (!editSmer || !editDepartman || !editNivoStudija) return;
        podesiAktivniSmer({
            smer_id: editSmer.smer_id,
            naziv_smera: editSmer.naziv_smera,
            departman_id: editDepartman.departman_id,
            departman: editDepartman.naziv,
            nivo_studija_id: editNivoStudija.nivo_studija_id,
            nivo_studija: editNivoStudija.nivo_studija,
        });
        podesiUrediSmer(false);
        podesiEditDepartman('');
        podesiEditNivoStudija('');
        podesiEditSmer('');
    };

    const otkaziIzmenuSmera = () => {
        podesiUrediSmer(false);
        podesiEditDepartman('');
        podesiEditNivoStudija('');
        podesiEditSmer('');
        podesiDostupneEditSmerove([]);
    };

    const sviFajloviValidni = () =>
        stavkeFajlova.length > 0 &&
        stavkeFajlova.every(s => !imaNedozvoljeneKaraktere(s.naziv));

    const mozePodaci = () =>
        !urediSmer && aktivniSmer && izabranaGodina && izabraniPredmet &&
        izabraniTipMaterijala && izabraniPodTipMaterijala && izabranaSkolskaGodina;

    const obradiObjavu = async () => {
        if (!mozePodaci() || !sviFajloviValidni() || uploading) return;
        podesiUploading(true);

        let uspesnih = 0;
        for (let i = 0; i < stavkeFajlova.length; i++) {
            podesiUploadBrojac(i + 1);
            const stavka = stavkeFajlova[i];

            const fajlZaUpload = stavka.naziv !== stavka.fajl.name
                ? new File([stavka.fajl], stavka.naziv, {
                    type: stavka.fajl.type,
                    lastModified: stavka.fajl.lastModified,
                  })
                : stavka.fajl;

            const podaciForme = new FormData();
            podaciForme.append('departman', JSON.stringify({ naziv: aktivniSmer.departman }));
            podaciForme.append('nivoStudija', JSON.stringify({
                nivo_studija_id: aktivniSmer.nivo_studija_id,
                nivo_studija: aktivniSmer.nivo_studija,
            }));
            podaciForme.append('smer', JSON.stringify({
                smer_id: aktivniSmer.smer_id,
                naziv_smera: aktivniSmer.naziv_smera,
            }));
            podaciForme.append('godina', JSON.stringify(izabranaGodina));
            podaciForme.append('predmet', JSON.stringify(izabraniPredmet));
            podaciForme.append('tipMaterijala', JSON.stringify(izabraniTipMaterijala));
            podaciForme.append('podtipMaterijala', JSON.stringify(izabraniPodTipMaterijala));
            podaciForme.append('akademskaGodina', izabranaSkolskaGodina.naziv);
            podaciForme.append('korisnickiMejl', ulogovanKorisnik.korisnicki_email);
            podaciForme.append('fajl', fajlZaUpload);

            try {
                const ok = await ServisMaterijala.sacuvajMaterijal(podaciForme);
                if (ok) uspesnih++;
            } catch (_) {}
        }

        if (uspesnih > 0) {
            prikaziToastNotifikaciju(
                uspesnih === 1
                    ? 'Materijal je uspešno objavljen'
                    : `${uspesnih} materijala su uspešno objavljena`,
                TipToastNotifikacije.Uspesno
            );
        }

        router.reload();
        podesiPrikazDialoga(false);
    };

    // ── Korak 1: Izbor fajlova ───────────────────────────────────
    if (korak === 1) {
        return (
            <div className="w-full sm:w-[520px]">
                <FajlUploader onFajloviDodati={dodajFajlove} />

                {stavkeFajlova.length > 0 && (
                    <div className="mt-4 max-h-[280px] overflow-y-auto space-y-2 m-4">
                        {stavkeFajlova.map(stavka => {
                            const nevalidan = imaNedozvoljeneKaraktere(stavka.naziv);
                            return (
                                <div
                                    key={stavka.id}
                                    className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg bg-gray-50"
                                >
                                    <FaFileAlt className="text-blue-400 shrink-0" size={16} />
                                    <Tooltip
                                        title={nevalidan ? 'Naziv sadrži nedozvoljene karaktere' : ''}
                                        arrow
                                    >
                                        <input
                                            type="text"
                                            value={stavka.naziv}
                                            onChange={e => azurirajNaziv(stavka.id, e.target.value)}
                                            className={`flex-1 min-w-0 text-sm border rounded px-2 py-1 focus:outline-none ${
                                                nevalidan
                                                    ? 'border-red-400 bg-red-50'
                                                    : 'border-gray-300 focus:border-blue-400'
                                            }`}
                                        />
                                    </Tooltip>
                                    <span className="text-xs text-gray-400 shrink-0 w-14 text-right">
                                        {formatirajVelicinu(stavka.fajl.size)}
                                    </span>
                                    <button
                                        onClick={() => ukloniFajl(stavka.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors shrink-0 cursor-pointer"
                                    >
                                        <FaTimes size={14} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="flex justify-end mt-4 mr-4 pb-4">
                    <button
                        onClick={() => podesiKorak(2)}
                        disabled={!sviFajloviValidni()}
                        className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                            sviFajloviValidni()
                                ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {`Nastavi${stavkeFajlova.length > 0 ? ` (${stavkeFajlova.length})` : ''} →`}
                    </button>
                </div>
            </div>
        );
    }

    // ── Korak 2: Metapodaci ──────────────────────────────────────
    return (
        <div className="w-full sm:w-[520px] space-y-4">
            {/* Zaglavlje */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => podesiKorak(1)}
                    disabled={uploading}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer disabled:cursor-not-allowed"
                >
                    <FaArrowLeft size={16} />
                </button>
                <span className="text-sm text-gray-500">
                    {stavkeFajlova.length === 1
                        ? '1 fajl odabran'
                        : `${stavkeFajlova.length} fajla/ova odabrano`}
                </span>
            </div>

            {/* Smer kartica */}
            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Smer
                    </span>
                    {!urediSmer && (
                        <button
                            onClick={() => podesiUrediSmer(true)}
                            className="text-xs text-blue-500 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                            <FaEdit size={11} /> Promeni
                        </button>
                    )}
                </div>

                {!urediSmer && aktivniSmer ? (
                    korisnikSmerovi.length > 1 ? (
                        <CustomSelect
                            klase="w-full"
                            opcije={korisnikSmerovi}
                            vrednost={aktivniSmer}
                            podesiSelektovaneOpcije={podesiAktivniSmer}
                            labela="Tvoji smerovi"
                            imeOpcije="naziv_smera"
                        />
                    ) : (
                        <div>
                            <p className="font-medium text-gray-800">{aktivniSmer.naziv_smera}</p>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {aktivniSmer.departman} · {aktivniSmer.nivo_studija}
                            </p>
                        </div>
                    )
                ) : (
                    /* Edit kaskada */
                    <div className="space-y-3">
                        <CustomSelect
                            klase="w-full"
                            opcije={podaci.dostupniDepartmani || []}
                            vrednost={editDepartman}
                            podesiSelektovaneOpcije={podesiEditDepartman}
                            labela="Departman"
                            obaveznoPolje
                        />
                        <CustomSelect
                            klase="w-full"
                            opcije={podaci.dostupniNivoiStudija || []}
                            vrednost={editNivoStudija}
                            podesiSelektovaneOpcije={podesiEditNivoStudija}
                            labela="Nivo studija"
                            imeOpcije="nivo_studija"
                            obaveznoPolje
                        />
                        <CustomSelect
                            klase="w-full"
                            opcije={dostupniEditSmerovi}
                            vrednost={editSmer}
                            podesiSelektovaneOpcije={podesiEditSmer}
                            labela="Smer"
                            imeOpcije="naziv_smera"
                            zakljucana={!editDepartman || !editNivoStudija || ucitavaSmerove}
                            tooltipTekst="Izaberi departman i nivo studija!"
                            obaveznoPolje
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={primenIzaborSmera}
                                disabled={!editSmer}
                                className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                                    editSmer
                                        ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                Primeni
                            </button>
                            {aktivniSmer && (
                                <button
                                    onClick={otkaziIzmenuSmera}
                                    className="text-sm px-3 py-1.5 text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    Otkaži
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Godina + Predmet */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-44 sm:shrink-0">
                    <CustomSelect
                        klase="w-full"
                        opcije={dostupneGodine}
                        vrednost={izabranaGodina}
                        podesiSelektovaneOpcije={podesiIzabranugodinu}
                        labela="Godina studija"
                        zakljucana={!aktivniSmer || urediSmer}
                        tooltipTekst="Izaberi smer!"
                        obaveznoPolje
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <CustomSelect
                        klase="w-full"
                        opcije={dostupniPredmeti}
                        vrednost={izabraniPredmet}
                        podesiSelektovaneOpcije={podesiIzabraniPredmet}
                        labela="Predmet"
                        zakljucana={!aktivniSmer || !izabranaGodina || ucitavaPredmete || urediSmer}
                        tooltipTekst="Izaberi godinu studija!"
                        obaveznoPolje
                    />
                </div>
            </div>

            {/* Tip + Podtip materijala */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 min-w-0">
                    <CustomSelect
                        klase="w-full"
                        opcije={podaci.dostupniTipoviMaterijala || []}
                        vrednost={izabraniTipMaterijala}
                        podesiSelektovaneOpcije={podesiIzabraniTipMaterijala}
                        labela="Tip materijala"
                        obaveznoPolje
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <CustomSelect
                        klase="w-full"
                        opcije={dostupniPodtipovi}
                        vrednost={izabraniPodTipMaterijala}
                        podesiSelektovaneOpcije={podesiIzabraniPodTipMaterijala}
                        labela="Podtip materijala"
                        zakljucana={!izabraniTipMaterijala || ucitavaPodtipove}
                        tooltipTekst="Izaberi tip materijala!"
                        obaveznoPolje
                    />
                </div>
            </div>

            {/* Akademska godina */}
            <CustomSelect
                klase="w-full"
                opcije={dostupneSkolskeGodine}
                vrednost={izabranaSkolskaGodina}
                podesiSelektovaneOpcije={podesiIzabranaSkolskaGodinu}
                labela="Akademska godina"
                obaveznoPolje
            />

            {/* Dugme za objavu */}
            <div className="flex justify-end pt-1">
                <button
                    onClick={obradiObjavu}
                    disabled={!mozePodaci() || uploading}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        mozePodaci() && !uploading
                            ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    <IoCloudUpload size={18} />
                    {uploading
                        ? `Učitavanje ${uploadBrojac}/${stavkeFajlova.length}...`
                        : `Objavi ${stavkeFajlova.length} ${stavkeFajlova.length === 1 ? 'materijal' : 'materijala'}`
                    }
                </button>
            </div>
        </div>
    );
}
