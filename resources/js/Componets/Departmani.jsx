import React from "react";
import { useState, useEffect } from "react";


export default function Departmani()
{     
    const sviDepartmani = ["Biologija i Ekologija", "Geografija", "Matematika", "Fizika", "Racunarske nauke", "Hemija" ]

    return(
        <>
            
            <div className="flex border-1 justify-center h-24">
                <img src="/images/pmf_logo.svg"/>
                {sviDepartmani.map((ime,indeks)=>(
                    <button className="p-3 hover:bg-blue-100" key={indeks}>{ime}</button>
                ))}
            </div>
        </>
    )
}