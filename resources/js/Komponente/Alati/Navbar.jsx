import React, { useState } from "react";

import SearchBox from "./SearchBox";
import Button from "./Button";
import Logo from "./Logo";
import UploadForma from "./UploadForma";


export default function Navbar()
{   
    const [query, setQuery] = useState('');
    const [forma, otvoriFormu] = useState(false)

    function zatvoriFormu() {
        otvoriFormu(false);
    }


    return(
        <div className="bg-zinc-200 flex justify-between items-center relative">
            <Logo/>
            <SearchBox value={query} onChange={setQuery} placeholder="Pretraži materijale..."  className="absolute left-1/2 transform -translate-x-1/2"/>
            <button className="mr-5 border-2 border-black rounded-xl p-2 bg-green-400 text-black-500 hover:bg-green-300 cursor-pointer" onClick={otvoriFormu}> Posalji materijal </button>
            {forma && <UploadForma  zatvoriFormu={zatvoriFormu}/>}
        </div>
    )
}