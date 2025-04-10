import React, { useState } from "react";

import SearchBox from "./SearchBox";
import Button from "./Button";
import Logo from "./Logo";


export default function Navbar()
{   
    const [query, setQuery] = useState('');

    return(
        <div className="bg-zinc-200 flex justify-between items-center relative">
            <Logo/>
            <SearchBox value={query} onChange={setQuery} placeholder="Pretraži materijale..."  className="absolute left-1/2 transform -translate-x-1/2"/>
            <Button className="pr-5" tekst={"Posalji materijal"}/>
        </div>
    )
}