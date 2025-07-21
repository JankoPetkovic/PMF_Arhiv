import Breadcrumbs from '@mui/material/Breadcrumbs';
import { FaRegFilePdf, FaDownload  } from "react-icons/fa6";
import { PiWarningCircleBold } from "react-icons/pi";
import { Tooltip } from '@mui/material';
import { useState } from "react";
import PrijaviMaterijal from "./Alati/PrijaviMaterijal";
import { FaRegUserCircle } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import { FaShareAlt } from "react-icons/fa";
import { GrDocumentZip } from "react-icons/gr";
import skracenicaNivoaStudija from '../PomocniAlati/skracenicaNivoaStudija';
import {prikaziToastNotifikaciju} from'../PomocniAlati/ToastNotifikacijaServis';
import TipToastNotifikacije from'../PomocniAlati/TipToastNotifikacije';

export default function KarticaMaterijala({materijal}){

    const [prijava, podesiPrijavu] = useState(false)
    const [izabraniMaterijal, podesiIzabraniMaterijal] = useState(false);

    const zatvoriPrijavu = () => {
        podesiPrijavu(false)
    }

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


    const fileIcons = {
        pdf: <FaRegFilePdf size={60} color="red" className="cursor-pointer w-14 h-14 object-contain" />,
        png: <img src={`/storage/${materijal.putanja_fajla}`} alt="PNG fajl" className="w-14 h-14 object-contain" />,
        jpg: <img src={`/storage/${materijal.putanja_fajla}`} alt="JPG fajl" className="w-14 h-14 object-contain" />,
        zip: <GrDocumentZip size={60} color='red' className="cursor-pointer w-14 h-14 object-contain" />,
    };

    const obradiDeljenje = () => {
        if (navigator.share) {
            navigator.share({
            title: 'Materijal',
            text: 'Pogledaj ovaj materijal:',
            url: window.location.origin + `/storage/${materijal.putanja_fajla}`,
            })
            .then(() => console.log('Deljenje uspešno'))
            .catch((error) => console.log('Greška pri deljenju:', error));
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
                    {fileIcons[vratiTipFajla(materijal.naziv)] || <span>Unsupported</span>}
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
                    podesiPrijavu(true)
                    podesiIzabraniMaterijal(materijal.materijal_id)
                    }}
                    className="text-red-800 cursor-pointer hover:scale-110 transition-transform duration-200"
                />
                </Tooltip>
            </div>

            <div className="flex justify-between items-center text-xs font-semibold">
                <Tooltip title={materijal.korisnik}>
                <FaRegUserCircle size={18} className="hover:scale-110 transition-transform duration-200" />
                </Tooltip>
                <span>{materijal.datum_dodavanja}</span>
            </div>

            {prijava && (
                <PrijaviMaterijal
                podesiPrijavu={zatvoriPrijavu}
                materijalId={izabraniMaterijal}
                />
            )}
        </div>
    )
}