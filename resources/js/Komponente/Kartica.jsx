import { FaRegFilePdf, FaDownload  } from "react-icons/fa6";

export default function Kartica({tipFajla, putanja, naziv=null})
{

    const preuzmiMaterijal = (putanjaFajla, nazivFajla) => {
        const link = document.createElement('a');
        link.href = `/storage/${putanjaFajla}`;
        link.download = putanjaFajla;
        link.click();
    }   

    const fileIcons = {
        pdf: <FaRegFilePdf size={50} color="red" className="cursor-pointer w-14 h-14 object-contain" />,
        png: <img src={`/storage/${putanja}`} alt="PNG fajl" className="w-14 h-14 object-contain" />
      };
    
  
    return(
        <div className="border rounded-xl p-2 flex flex-col items-center justify-center h-32 w-32 text-center">
            <div className="flex items-center justify-center mb-2 h-16 w-16">
                <a href={`/storage/${putanja}`} target="_blank" rel="noopener noreferrer">
                {fileIcons[tipFajla] || <span>Unsupported</span>}
                </a>
            </div>
            <div className="flex items-center gap-2">
                <h1 className="text-xs truncate max-w-[80px] cursor-pointer" title={naziv}>{putanja}</h1>
                <FaDownload
                size={16}
                onClick={() => preuzmiMaterijal(putanja, naziv)}
                className="cursor-pointer"
                />
            </div>
        </div>
    );
}