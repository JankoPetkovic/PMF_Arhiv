import { useEffect, useRef, useState } from "react";
import ServisKorisnika from "../PomocniAlati/Servisi/ServisKorisnika";
import { MdVerified } from "react-icons/md";
import { prikaziToastNotifikaciju } from "../PomocniAlati/ToastNotifikacijaServis";
import TipToastNotifikacije from "../PomocniAlati/TipToastNotifikacije";

export default function VerifikacijaDialog({podesiPrikazDialoga}) {

    const [unetaMailAdresa, podesiUnetuMailAdresu] = useState("");
    const [statusVerifikacije, podesiStatusVerifikacije] = useState({
        verifikovan: false,
        statusVerifikacije: undefined
    });
    const [ucitavaSe, podesiUcitaveSe] = useState(false);
    const zaustaviPrviRender = useRef(false);

    useEffect(()=>{
        if (!zaustaviPrviRender.current) {
            zaustaviPrviRender.current = true;
            return;
        }
        const proveriVerifikaciju = async () => {
            podesiUcitaveSe(true)
            try{
                podesiStatusVerifikacije(await ServisKorisnika.statusVerifikacije(unetaMailAdresa));
            } catch (greska) {

            } finally {
                podesiUcitaveSe(false)
            }
        };

        if(unetaMailAdresa.endsWith("@" + import.meta.env.VITE_STUDENTSKI_EMAIL)){
            proveriVerifikaciju();
        } else {
            prikaziToastNotifikaciju("Email mora biti studentski (" + import.meta.env.VITE_STUDENTSKI_EMAIL + ")", TipToastNotifikacije.Greska);
            podesiStatusVerifikacije({
                verifikovan: false,
                statusVerifikacije: undefined
            })
            return;
        }
    }, [unetaMailAdresa])

    const produziVerifikaciju = () => {
        ServisKorisnika.verifikujKorisnika(unetaMailAdresa)
    }

    return(
        <div className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <label htmlFor="email">
                    Unesite PMF mail adresu:
                </label>
                <input
                    type="email"
                    id="email"
                    value={unetaMailAdresa}
                    onChange={(e) => {
                        podesiUnetuMailAdresu(e.target.value);
                    }}
                    className="border border-gray-400 rounded-lg p-2 w-60"
                    placeholder={"ime.prezime@" + import.meta.env.VITE_STUDENTSKI_EMAIL}
                />
            </div>
            <div>
                {ucitavaSe ? (
                    <div className="flex justify-center items-center gap-2 text-blue-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500" />
                        Proveravam verifikaciju...
                    </div>
                ) : (
                    statusVerifikacije.statusVerifikacije !== undefined && (
                        statusVerifikacije.statusVerifikacije ? (
                            statusVerifikacije.verifikovan ? (
                                <div className="flex justify-between"> 
                                    <div className="flex gap-2 items-center text-green-600">
                                        <MdVerified className="text-green-500" size={30} />
                                        Verifikacija važi do: {statusVerifikacije.statusVerifikacije}
                                    </div>
                                    <button className="bg-green-500 rounded-lg p-1 text-white cursor-pointer hover:scale-110 transition-transform duration-200" onClick={()=>{produziVerifikaciju()}}>Produži verifikaciju</button>
                                </div>
                            ) : ( statusVerifikacije.statusVerifikacije == "Korisnik se ne nalazi u bazi podataka" ? 
                                <div className="flex justify-between gap-2 items-center"> 
                                    <div className="flex gap-2 items-center text-gray-600">
                                        <MdVerified className="text-gray-500" size={30} />
                                        {statusVerifikacije.statusVerifikacije}
                                    </div>
                                    <button className="bg-green-500 rounded-lg p-1 text-white cursor-pointer hover:scale-110 transition-transform duration-200" onClick={()=>{produziVerifikaciju()}}>Verifikuj se</button>
                                </div>
                                : 
                                <div className="flex justify-between gap-2 items-center">
                                    <div className="flex gap-2 items-center text-red-600">
                                        <MdVerified className="text-red-500" size={30} />
                                        Verifikacija je istekla: {statusVerifikacije.statusVerifikacije}
                                    </div>
                                    <button className="bg-green-500 rounded-lg p-1 text-white cursor-pointer hover:scale-110 transition-transform duration-200" onClick={()=>{produziVerifikaciju()}}>Produži verifikaciju</button>
                                </div>
                                
                            )
                        ) : (
                            <div className="flex justify-between gap-2 items-center"> 
                                <div className="flex gap-2 items-center text-gray-600">
                                    <MdVerified className="text-gray-500" size={30} />
                                    Korisnik nije verifikovan
                                </div>
                                <button className="bg-green-500 rounded-lg p-1 text-white cursor-pointer hover:scale-110 transition-transform duration-200" onClick={()=>{produziVerifikaciju()}}>Verifikuj se</button>
                            </div>
                        )
                    )
                )}
            </div>
        </div>
    )
}