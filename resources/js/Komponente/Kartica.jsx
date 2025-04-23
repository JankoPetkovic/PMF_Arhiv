import { router } from "@inertiajs/react";
import { useState } from "react";
import { FaRegFilePdf, FaDownload  } from "react-icons/fa6";

export default function Kartica({tipFajla, putanja, naziv})
{

    const preuzmiMaterijal = (putanjaFajla, nazivFajla) => {
        const link = document.createElement('a');
        link.href = `/storage/${putanjaFajla}`;
        link.download = putanjaFajla;
        link.click();
    }
  
    return(
        <div className="border-1 rounded-xl p-2 flex-col h-32">
            <div className="p-5 pl-8">
                {tipFajla === 'pdf' && <a href= {`/storage/${putanja}`} target="_blank"><FaRegFilePdf size={50} color="red" className="cursor-pointer"/></a>}
                {tipFajla === 'png' && <a href= {`/storage/${putanja}`} target="_blank"><img src={`/storage/${putanja}`} alt="slika"/></a>}
            </div>
            {/* <FaDownload size={20} onClick={()=>preuzmiMaterijal(putanja, naziv)} className="cursor-pointer"/> */}
        </div>
    );
}