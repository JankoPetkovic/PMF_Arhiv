import { FaDownload } from "react-icons/fa6";
import { PiWarningCircleBold } from "react-icons/pi";
import { Tooltip } from '@mui/material';
import { useEffect, useState } from "react";
import PrijaviProblem from "./Alati/PrijaviProblem";
import { FaRegUserCircle } from "react-icons/fa";
import { FaShareAlt, FaRegTrashAlt  } from "react-icons/fa";
import skracenicaNivoaStudija from '../PomocniAlati/skracenicaNivoaStudija';
import {prikaziToastNotifikaciju} from'../PomocniAlati/ToastNotifikacijaServis';
import TipToastNotifikacije from'../PomocniAlati/TipToastNotifikacije';
import Dialog from "../Komponente/Dialog";
import { FaFileAlt, FaRegEdit} from "react-icons/fa";
import { router, usePage } from "@inertiajs/react";
import ServisMaterijala from "../PomocniAlati/Servisi/ServisMaterijala";
import DialogIzmenaMaterijala from "./DialogIzmenaMaterijala";
import { objaviPromenuMaterijala } from "../PomocniAlati/dogadjajiMaterijala";

export default function KarticaMaterijala({materijal}){

    const { ulogovanKorisnik } = usePage().props;
    const [dialogPrijave, podesDialogPrijave] = useState(false)
    const [izabraniMaterijal, podesiIzabraniMaterijal] = useState(false);
    const [visiPristup, podesiVisiPristup] = useState(false)
    const [dialogBrisanja, podesiDialogBrisanja] = useState(false);
    const [dialogIzmene, podesiDialogIzmene] = useState(false);
    const [ucitavaBrisanje, podesiUcitavaBrisanje] = useState(false);

    const klaseIkonica = "cursor-pointer hover:scale-110 transition-transform duration-200";

    useEffect(()=>{
        const dozvoljeno = !!ulogovanKorisnik &&
            (ulogovanKorisnik?.uloga != "Gost" || ulogovanKorisnik?.korisnicki_email == materijal.korisnik);
        podesiVisiPristup(dozvoljeno);
    }, [ulogovanKorisnik])

    const preuzmiMaterijal = (putanjaFajla, nazivFajla) => {
        const link = document.createElement('a');
        link.href = `/storage/${putanjaFajla}`;
        link.download = nazivFajla;
        link.click();
    }

    const vratiTipFajla = (nazivFajla) => {
        if (!nazivFajla || typeof nazivFajla !== 'string') return null;

        const delovi = nazivFajla.split('.');
        if (delovi.length < 2) return null; 

        return delovi.pop().toLowerCase();
    }

    const obradiBrisanje = async () => {
        if (!ulogovanKorisnik || !visiPristup) {
            prikaziToastNotifikaciju("Korisnik mora biti menadžer ili admin da bi izvršio ovu akciju", TipToastNotifikacije.Info);
            return;
        }
        if (!ulogovanKorisnik.status_verifikacije.verifikovan) {
            prikaziToastNotifikaciju("Korisnik mora biti verifikovan da bi izvršio ovu akciju", TipToastNotifikacije.Info);
            return;
        }
        podesiUcitavaBrisanje(true);
        try {
            await ServisMaterijala.obrisiMaterijal(materijal.materijal_id);
            podesiDialogBrisanja(false);
            objaviPromenuMaterijala();
            router.reload();
        } finally {
            podesiUcitavaBrisanje(false);
        }
    }


    // Mapiranje ekstenzije -> naziv SVG ikonice u /public/file-icons.
    const tipUIkonicu = {
        pdf: 'pdf',
        doc: 'doc', docx: 'docx',
        ppt: 'ppt', pptx: 'pptx',
        txt: 'txt',
        odt: 'odt',
        zip: 'zip', rar: 'zip',
        png: 'png',
        jpg: 'jpg', jpeg: 'jpg',
    };

    const ikonicaFajla = tipUIkonicu[vratiTipFajla(materijal.naziv)] ?? null;

    const napraviSlug = (tekst) =>
        (tekst || 'materijal')
            .toString()
            .toLowerCase()
            .replace(/č|ć/g, 'c').replace(/š/g, 's').replace(/ž/g, 'z').replace(/đ/g, 'dj')
            .normalize('NFD').replace(/[̀-ͯ]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

    const obradiDeljenje = () => {
        const kratakLink =
            `${window.location.origin}/m/${materijal.materijal_id}/${napraviSlug(materijal.predmet)}`;

        if (navigator.share) {
            navigator.share({
            title: 'Materijal',
            text: 'Pogledaj ovaj materijal:',
            url: kratakLink,
            })
        } else {
            navigator.clipboard.writeText(kratakLink);
            prikaziToastNotifikaciju("Link do materijala je kopiran u privremenu memoriju", TipToastNotifikacije.Info)
        }
    }

    return(
        <div className="hover:scale-110 transition-transform duration-200 shadow-card rounded-xl p-4 w-[210px] h-[300px] flex flex-col gap-6 bg-white/70 backdrop-blur-sm">
            <div className="text-xs font-semibold mb-1">
                <p>{skracenicaNivoaStudija(materijal.nivo_studija)} / {materijal.smer.naziv_smera} / {materijal.predmet} / {materijal.skolska_godina}</p> 
            </div>

         <div className="flex items-center justify-center">
                <a
                    href={`/storage/${materijal.putanja_fajla}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 w-full text-center"
                >
                    <Tooltip title="Otvori">
                    {ikonicaFajla
                        ? <img src={`/file-icons/${ikonicaFajla}.svg`} alt={`${ikonicaFajla} fajl`} className="cursor-pointer w-[74px] h-[74px] object-contain" />
                        : <FaFileAlt size={60} className='cursor-pointer w-14 h-14 object-contain text-gray-500' />}
                    </Tooltip>
                    
                    <p className="text-sm break-all whitespace-normal leading-tight">
                    {materijal.naziv}
                    </p>
                </a>
            </div>

            <div className="flex justify-center items-center gap-4 mt-auto mb-2">
                <Tooltip title="Preuzmi">
                    <FaDownload
                    size={25}
                    onClick={() => preuzmiMaterijal(materijal.putanja_fajla, materijal.naziv)}
                    className={`${klaseIkonica} text-emerald-500`}
                    />
                </Tooltip>

                <Tooltip title="Podeli">
                    <FaShareAlt
                    size={25}
                    onClick={obradiDeljenje}
                    className={`${klaseIkonica} text-blue-500`}
                    />
                </Tooltip>

                <Tooltip title="Prijavi">
                    <PiWarningCircleBold
                    size={25}
                    onClick={() => {
                        podesDialogPrijave(true);
                        podesiIzabraniMaterijal(materijal.materijal_id);
                    }}
                    className={`${klaseIkonica} text-red-800`}
                    />
                </Tooltip>

                {visiPristup && (
                    <>
                    <Tooltip title="Obriši">
                        <FaRegTrashAlt
                        size={25}
                        onClick={() => podesiDialogBrisanja(true)}
                        className={`${klaseIkonica} text-red-400`}
                        />
                    </Tooltip>

                    <Tooltip title="Izmeni">
                        <FaRegEdit
                        size={25}
                        onClick={() => podesiDialogIzmene(true)} // verovatno ovo želiš umesto brisanja
                        className={`${klaseIkonica} text-yellow-500`}
                        />
                    </Tooltip>
                    </>
                )}
                </div>

            {visiPristup ? 
            (
                <div className="flex justify-between items-center text-xs font-semibold">
                    <Tooltip title={materijal.korisnik}>
                        <FaRegUserCircle size={18} className="hover:scale-110 transition-transform duration-200" />
                    </Tooltip>
                    <span>{materijal.datum_dodavanja}</span>
                </div>
            ) : (
                <div className="flex justify-center items-center text-xs font-semibold">
                    <span>{materijal.datum_dodavanja}</span>
                </div>
            )}
            <Dialog
                naslov={"Prijava materijala"}
                sadrzaj={<PrijaviProblem podesiPrijavu={podesDialogPrijave} materijalId={izabraniMaterijal}/>}
                prikaziDialog={dialogPrijave}
                podesiPrikaziDialog={podesDialogPrijave}
            />
            <Dialog 
                naslov={"Brisanje materijala"}
                sadrzaj={
                        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-2">
                            <span>Da li ste sigurni da želite da obrišete materijal <span className="font-bold">{materijal.naziv}</span> ?</span>
                            <div className="flex self-end">
                                <button
                                    onClick={obradiBrisanje}
                                    disabled={ucitavaBrisanje}
                                    className={`block mt-4 px-4 py-2 rounded-md text-white transition-colors ${ucitavaBrisanje ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 cursor-pointer'}`}>
                                    {ucitavaBrisanje ? 'Brisanje...' : 'Obriši materijal'}
                                </button>
                            </div>
                        </div>
                    }
                prikaziDialog={dialogBrisanja}
                podesiPrikaziDialog={podesiDialogBrisanja}
            />
            <Dialog
                naslov={"Izmena materijala: " + materijal.naziv}
                sadrzaj={<DialogIzmenaMaterijala materijal={materijal} podesiPrikazDialoga={podesiDialogIzmene}/>}
                prikaziDialog={dialogIzmene}
                podesiPrikaziDialog={podesiDialogIzmene}
            />
        </div>
    )
}