import { useEffect, useState } from "react";
import SearchBox from "./SearchBox";
import Logo from "./Logo";
import { FaRegUserCircle } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import Dialog from "../Dialog";
import ObjavaMaterijala from "../../Stranice/ObjavaMaterijala";
import { FaUpload } from "react-icons/fa";
import { Tooltip } from "@mui/material";
import { BiSupport } from "react-icons/bi";
import VerifikacijaDialog from "../VerifikacijaDialog"
import PrijaviProblem from "./PrijaviProblem";
import PrijaviSe from "../PrijaviSe";
import { router, usePage } from '@inertiajs/react';
import Registracija from "../../Stranice/Registracija";


export default function Navbar()
{   
    const [prikaziDialogDodavanja, podesiPrikazDialogaDodavanja] = useState(false);
    const [prikazDialogaVerifikacije, podesiPrikazDialogaVerifikacije] = useState(false);
    const [prikazDialogaPodrske, podesiPrikazDialogaPodrske] = useState(false);
    const [prikazDialogaPrijave, podesiPrikazDialogaPrijave] = useState(false);
    const [prikazDialogaRegistracije, podesiPrikazDialogaRegistracije] = useState(false);
    const { ulogovanKorisnik } = usePage().props;

    const obradiKlikProfila = () =>{
        if(ulogovanKorisnik){
            router.visit("korisnik/" + ulogovanKorisnik.id)
        } else {
            podesiPrikazDialogaPrijave(true)
        }
    }

    const otvoriRegistraciju = () => {
        podesiPrikazDialogaPrijave(false);     
        podesiPrikazDialogaRegistracije(true);   
    };

    return(
        <div className="bg-zinc-200 flex justify-between items-center">
            <div className="w-30 ml-5">
                <Logo/>
            </div>

            {/* <SearchBox value={query} onChange={setQuery} placeholder="Pretraži materijale..."  /> */}

            <div className='flex gap-2 pl-15 w-74'>
                <Tooltip title="Objavi materijal" arrow>
                    <div className='border-2 rounded-lg p-2 border-emerald-500 cursor-pointer hover:scale-110 transition-transform duration-200' onClick={()=>{podesiPrikazDialogaDodavanja(true)}}>
                        <FaUpload className='cursor-pointer text-emerald-500' size={30} />
                    </div>
                </Tooltip>
                <Tooltip title="Verifikacija" arrow>
                    <div className='border-2 rounded-lg p-2 border-yellow-500 cursor-pointer hover:scale-110 transition-transform duration-200' onClick={()=>{podesiPrikazDialogaVerifikacije(true)}}>
                        <MdVerified className='cursor-pointer text-yellow-500' size={30} />
                    </div>
                </Tooltip>
                <Tooltip title="Podrška" arrow>
                    <div className='border-2 rounded-lg p-2 border-red-500 cursor-pointer hover:scale-110 transition-transform duration-200' onClick={()=>{podesiPrikazDialogaPodrske(true)}}>
                        <BiSupport className='cursor-pointer text-red-500' size={30} />
                    </div>
                </Tooltip>
                <Tooltip title={ulogovanKorisnik ? "Korisnički profil" : "Prijavi se"}>
                    <div className='border-2 rounded-lg p-2 border-blue-500 cursor-pointer hover:scale-110 transition-transform duration-200' onClick={obradiKlikProfila}>
                        <FaRegUserCircle className='cursor-pointer text-blue-500' size={30} />
                    </div>
                </Tooltip>
            </div>

            <Dialog naslov={'Objavi Materijal'} prikaziDialog={prikaziDialogDodavanja} podesiPrikaziDialog={podesiPrikazDialogaDodavanja} sadrzaj={<ObjavaMaterijala podesiPrikazDialoga={podesiPrikazDialogaDodavanja}/>}/>
            <Dialog naslov={'Verifikacija'} prikaziDialog={prikazDialogaVerifikacije} podesiPrikaziDialog={podesiPrikazDialogaVerifikacije} sadrzaj={<VerifikacijaDialog podesiPrikazDialoga={podesiPrikazDialogaVerifikacije}/>}/>
            <Dialog naslov={'Podrška'} prikaziDialog={prikazDialogaPodrske} podesiPrikaziDialog={podesiPrikazDialogaPodrske} sadrzaj={<PrijaviProblem podesiPrikazDialoga={podesiPrikazDialogaPodrske}/>}/>
            <Dialog naslov={"Prijavi se"} prikaziDialog={prikazDialogaPrijave} podesiPrikaziDialog={podesiPrikazDialogaPrijave} sadrzaj={
                <PrijaviSe
                    prikaziDialog={prikazDialogaPrijave}
                    podesiPrikaziDialog={podesiPrikazDialogaPrijave}
                    otvoriRegistraciju={otvoriRegistraciju} 
                />
                }
            />
            <Dialog naslov="Registracija" prikaziDialog={prikazDialogaRegistracije} podesiPrikaziDialog={podesiPrikazDialogaRegistracije} sadrzaj={<Registracija />}/>
        </div>
    )
}