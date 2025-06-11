import React, { useState } from "react";
import SearchBox from "./SearchBox";
import Logo from "./Logo";
import BurgerMenu from "./BurgerMenu";


export default function Navbar()
{   

    return(
        <div className="bg-zinc-200 flex justify-between items-center">
            <Logo/>
            {/* <SearchBox value={query} onChange={setQuery} placeholder="Pretraži materijale..."  /> */}


            <div className="pl-40 w-60">
                <BurgerMenu/>
            </div>
        </div>
    )
}