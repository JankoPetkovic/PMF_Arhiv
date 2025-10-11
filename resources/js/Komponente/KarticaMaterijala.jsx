import { FaRegFilePdf, FaDownload  } from "react-icons/fa6";
import { PiWarningCircleBold } from "react-icons/pi";
import { Tooltip } from '@mui/material';
import { useEffect, useState } from "react";
import PrijaviProblem from "./Alati/PrijaviProblem";
import { FaRegUserCircle } from "react-icons/fa";
import { FaShareAlt, FaRegTrashAlt  } from "react-icons/fa";
import { GrDocumentZip } from "react-icons/gr";
import skracenicaNivoaStudija from '../PomocniAlati/skracenicaNivoaStudija';
import {prikaziToastNotifikaciju} from'../PomocniAlati/ToastNotifikacijaServis';
import TipToastNotifikacije from'../PomocniAlati/TipToastNotifikacije';
import Dialog from "../Komponente/Dialog";
import { TbFileTypeDocx } from "react-icons/tb";
import { FaFileAlt } from "react-icons/fa";
import { router, usePage } from "@inertiajs/react";
import ServisMaterijala from "../PomocniAlati/Servisi/ServisMaterijala";

export default function KarticaMaterijala({materijal}){

    const { ulogovanKorisnik } = usePage().props;
    const [dialogPrijave, podesDialogPrijave] = useState(false)
    const [izabraniMaterijal, podesiIzabraniMaterijal] = useState(false);
    const [visiPristup, podesiVisiPristup] = useState(false)
    const [dialogBrisanja, podesiDialogBrisanja] = useState(false);

    useEffect(()=>{
        if(ulogovanKorisnik && (ulogovanKorisnik?.uloga != "Gost" || ulogovanKorisnik?.korisnicki_email == materijal.korisnik))
            podesiVisiPristup(true);
    }, [])

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

    const obradiBrisanje = () =>{
        if(ulogovanKorisnik && visiPristup){
            if(ulogovanKorisnik.status_verifikacije.verifikovan){
                ServisMaterijala.obrisiMaterijal(materijal.materijal_id)
            } else{
                prikaziToastNotifikaciju("Korisnik mora biti verifikovan da bi izvršio ovu akciju", TipToastNotifikacije.Info)
            }
        } else {
            prikaziToastNotifikaciju("Korisnik mora biti menadžer ili admin da bi izvršio ovu akciju", TipToastNotifikacije.Info)
        }
        router.reload()
        podesiDialogBrisanja(false);
    }


    const fileIcons = {
        pdf: <FaRegFilePdf size={60} color="red" className="cursor-pointer w-14 h-14 object-contain" />,
        png: <img src={`/storage/${materijal.putanja_fajla}`} alt="PNG fajl" className="w-14 h-14 object-contain" />,
        jpg: <img src={`/storage/${materijal.putanja_fajla}`} alt="JPG fajl" className="w-14 h-14 object-contain" />,
        zip: <GrDocumentZip size={60} color='red' className="cursor-pointer w-14 h-14 object-contain" />,
        doc: <TbFileTypeDocx size={60} className='cursor-pointer w-14 h-14 object-contain text-blue-500' />,
        docx: <TbFileTypeDocx size={60} className='cursor-pointer w-14 h-14 object-contain text-blue-500' />,
    };

    const obradiDeljenje = () => {
        if (navigator.share) {
            navigator.share({
            title: 'Materijal',
            text: 'Pogledaj ovaj materijal:',
            url: window.location.origin + `/storage/${materijal.putanja_fajla}`,
            })
        } else {
            navigator.clipboard.writeText(window.location.origin + `/storage/${materijal.putanja_fajla}`);
            prikaziToastNotifikaciju("Link do materijala je kopiran u privremenu memoriju", TipToastNotifikacije.Info)
        }
    }

    return(
        <div className="hover:scale-110 transition-transform duration-200 shadow-[12px_12px_14px_-1px_rgba(0,_0,_0,_0.1)] rounded-xl p-4 w-[210px] h-[300px] flex flex-col gap-6 bg-white/70 backdrop-blur-sm">
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
                    {fileIcons[vratiTipFajla(materijal.naziv)] || <FaFileAlt size={60}  className='cursor-pointer w-14 h-14 object-contain text-gray-500' />}
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
                        className="cursor-pointer text-emerald-500 hover:scale-110 transition-transform duration-200"
                    />
                </Tooltip>
                <Tooltip title="Podeli">
                    <FaShareAlt
                        size={25}
                        className="cursor-pointer text-blue-500 hover:scale-110 transition-transform duration-200"
                        onClick={() => obradiDeljenje()}
                    />
                </Tooltip>
                <Tooltip title="Prijavi">
                    <PiWarningCircleBold
                        size={25}
                        onClick={() => {
                            podesDialogPrijave(true)
                            podesiIzabraniMaterijal(materijal.materijal_id)
                        }}
                        className="text-red-800 cursor-pointer hover:scale-110 transition-transform duration-200"
                    />
                </Tooltip>
                {visiPristup && 
                    <Tooltip title={"Obriši"}>
                        <FaRegTrashAlt 
                            size={25}
                            className="cursor-pointer text-red-400 hover:scale-110 transition-transform duration-200"
                            onClick={() => podesiDialogBrisanja(true)}
                        />
                    </Tooltip>
                }
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
                                    onClick={()=>{
                                        obradiBrisanje()
                                    }}
                                    className="block mt-4 px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer">
                                    Obriši materijal
                                </button>
                            </div>
                        </div>
                    }
                prikaziDialog={dialogBrisanja}
                podesiPrikaziDialog={podesiDialogBrisanja}
            />
        </div>
    )
}