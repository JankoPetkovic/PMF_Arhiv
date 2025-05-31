import React, { useState } from "react";
import SearchBox from "./SearchBox";
import Logo from "./Logo";
import UploadForma from "./UploadForma";
import BurgerMenu from "./BurgerMenu";


export default function Navbar()
{   
    const [query, setQuery] = useState('');
    // const [forma, otvoriFormu] = useState(false)

    // function zatvoriFormu() {
    //     otvoriFormu(false);
    // }


    return(
        <div className="bg-zinc-200 flex justify-between items-center">
            <Logo/>
            <SearchBox value={query} onChange={setQuery} placeholder="Pretraži materijale..."  />
            <div className="pl-40 w-60">
                <BurgerMenu/>
                {/* <RxHamburgerMenu onClick={otvoriFormu} size={30}/> */}
            </div>
            {/* {forma && <UploadForma  zatvoriFormu={zatvoriFormu}/>} */}
        </div>
    )
}