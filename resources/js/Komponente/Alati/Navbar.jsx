import React, { useState } from "react";
import SearchBox from "./SearchBox";
import Logo from "./Logo";
import { MdVerified } from "react-icons/md";
import Dialog from "../Dialog";
import ObjavaMaterijala from "../../Stranice/ObjavaMaterijala";
import { FaUpload } from "react-icons/fa";
import { Tooltip } from "@mui/material";
import VerifikacijaDialog from "../VerifikacijaDialog"


export default function Navbar()
{   
    const [prikaziDialogDodavanja, podesiPrikazDialogaDodavanja] = useState(false);
    const [prikazDialogaVerifikacije, podesiPrikazDialogaVerifikacije] = useState(false)

    return(
        <div className="bg-zinc-200 flex justify-between items-center">
            <Logo/>
            {/* <SearchBox value={query} onChange={setQuery} placeholder="Pretraži materijale..."  /> */}


            

            <div className='flex gap-2 pl-30 w-60'>
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
            </div>

            <Dialog naslov={'Objavi Materijal'} prikaziDialog={prikaziDialogDodavanja} podesiPrikaziDialog={podesiPrikazDialogaDodavanja} sadrzaj={<ObjavaMaterijala podesiPrikazDialoga={podesiPrikazDialogaDodavanja}/>}/>
            <Dialog naslov={'Verifikacija'} prikaziDialog={prikazDialogaVerifikacije} podesiPrikaziDialog={podesiPrikazDialogaVerifikacije} sadrzaj={<VerifikacijaDialog podesiPrikazDialoga={podesiPrikazDialogaVerifikacije}/>}/>
        </div>
    )
}