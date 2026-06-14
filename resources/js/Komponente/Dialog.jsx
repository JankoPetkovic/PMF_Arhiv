import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css'; 
import { IoMdClose } from "react-icons/io";
import { useRef, useEffect } from "react";
import { koristiGlobalniKontekst } from "../Konteksti";

export default function Dialog({naslov, slika = null, sadrzaj, prikaziDialog, podesiPrikaziDialog, sirina = "w-[95vw] sm:w-auto"}) {
    const { upravljajKlikomVanElemenata } = koristiGlobalniKontekst();

    const prozor = useRef(null)

    const zatvoriDialogHandler = () => {
        podesiPrikaziDialog(!prikaziDialog);
    }

    const upravljajVidljivoscuProzora = (event) => {
        const referenceElemenata = [prozor];
        const kliknutoVan = upravljajKlikomVanElemenata(referenceElemenata, event, ["MuiPopper-root", 'Toastify__toast ']);
        if (kliknutoVan) {
            podesiPrikaziDialog(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", upravljajVidljivoscuProzora);
        return () => {
            document.removeEventListener("mousedown", upravljajVidljivoscuProzora);
        };
    }, []);

    return (
        <Popup open={prikaziDialog}
            closeOnDocumentClick={false} 
            contentStyle={{
                padding: 0,
                borderRadius: '1rem',
                width: 'auto',
            }}
            overlayStyle={{
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(5px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div ref={prozor} className={`transform ${sirina} flex-col rounded-xl items-center justify-center shadow-[0px_-8px_12px_rgba(0,0,0,0.2),_0px_8px_20px_rgba(0,0,0,0.3)]`}>
                <div className="w-full h-12 bg-zinc-100 rounded-xl rounded-br-none flex">
                    {slika !== null &&
                        <div className="rounded-bl-xl rounded-tl-xl p-3 h-full flex justify-center bg-dmv-red w-11">
                            <img src={slika} className="self-center w-full" />
                        </div>
                    }
                    <div className="w-full min-w-0 flex items-center justify-between pl-4 pr-4">
                        <p className='font-bold uppercase truncate'>{naslov}</p>
                        <IoMdClose className="cursor-pointer shrink-0 ml-2" size={22} onClick={zatvoriDialogHandler}/>
                    </div>
                </div>
                <div className="p-4 overflow-y-auto max-h-[80vh]">
                    {sadrzaj}
                </div>
            </div>
        </Popup>
    )
}
