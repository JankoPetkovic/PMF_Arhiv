import React, { useState } from "react";
import SearchBox from "./SearchBox";
import Logo from "./Logo";
import BurgerMenu from "./BurgerMenu";
import Dialog from "../Dialog";
import ObjavaMaterijala from "../../Stranice/ObjavaMaterijala";
import { FaUpload } from "react-icons/fa";
import { Tooltip } from "@mui/material";


export default function Navbar()
{   
    const [prikaziDialog, podesiPrikazDialoga] = useState(false);

    return(
        <div className="bg-zinc-200 flex justify-between items-center">
            <Logo/>
            {/* <SearchBox value={query} onChange={setQuery} placeholder="Pretraži materijale..."  /> */}


            

            <div className='flex gap-2 pl-40 w-60'>
                <Tooltip title="Objavi materijal" arrow>
                    <div className='border-2 rounded-lg p-2 border-emerald-500 cursor-pointer' onClick={()=>{podesiPrikazDialoga(true)}}>
                        <FaUpload className='cursor-pointer text-emerald-500' size={30} />
                    </div>
                </Tooltip>
            </div>

            <Dialog naslov={'Objavi Materijal'} prikaziDialog={prikaziDialog} podesiPrikaziDialog={podesiPrikazDialoga} sadrzaj={<ObjavaMaterijala podesiPrikazDialoga={podesiPrikazDialoga}/>}/>
        </div>
    )
}