import { FaRegFilePdf, FaDownload  } from "react-icons/fa6";
import { PiWarningCircleBold } from "react-icons/pi";
import { Tooltip } from '@mui/material';
import { useState } from "react";
import PrijaviMaterijal from "./Alati/PrijaviMaterijal";
import { FaRegUserCircle } from "react-icons/fa";

export default function Kartica({materijalId, putanja, naziv, uploudovao})
{
    const [prijava, podesiPrijavu] = useState(false)
    const [selektovanMaterijal, selektujMaterijal] = useState(null)

    function zatvoriPrijavu() {
        podesiPrijavu(false);
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
        pdf: <FaRegFilePdf size={50} color="red" className="cursor-pointer w-14 h-14 object-contain" />,
        png: <img src={`/storage/${putanja}`} alt="PNG fajl" className="w-14 h-14 object-contain" />,
        jpg: <img src={`/storage/${putanja}`} alt="JPG fajl" className="w-14 h-14 object-contain" />
      };
    
  
    return(
        <div className="border rounded-xl p-2 flex flex-col items-center justify-center h-32 w-32 text-center">
            <div className="flex justify-between w-full">
                <Tooltip title="Prijavi">
                    <PiWarningCircleBold size={20} className="text-red-800 cursor-pointer" onClick={()=>{
                        podesiPrijavu(true)
                        selektujMaterijal(materijalId)
                    }}/>
                </Tooltip>
                <Tooltip title={uploudovao}>
                    <FaRegUserCircle size={20}/>
                </Tooltip>
            </div>
            <div className="flex items-center justify-center mb-2 h-16 w-16">
                <a href={`/storage/${putanja}`} target="_blank" rel="noopener noreferrer">
                <Tooltip title="Otvori">
                    {fileIcons[vratiTipFajla(naziv)] || <span>Unsupported</span>}
                </Tooltip>
                </a>
            </div>
            <div className="flex items-center gap-2">
                <h1 className="text-xs truncate max-w-[80px] cursor-pointer" title={naziv}>{naziv}</h1>
                <Tooltip title="Preuzmi">
                    <FaDownload
                    size={16}
                    onClick={() => preuzmiMaterijal(putanja, naziv)}
                    className="cursor-pointer"
                    />
                </Tooltip>
            </div>
            {prijava && <PrijaviMaterijal podesiPrijavu={zatvoriPrijavu} materijalId={selektovanMaterijal}/>}
        </div>
    );
}