import Departmani from "../Komponente/Departmani"
import Navbar from "../Komponente/Alati/Navbar";
import { useEffect } from "react";
import { prikaziToastNotifikaciju } from "../PomocniAlati/ToastNotifikacijaServis";
import TipToastNotifikacije from "../PomocniAlati/TipToastNotifikacije";
import { koristiGlobalniKontekst } from "../Konteksti";
import PrikazMaterijala from "../Komponente/PrikazMaterijala";

export default function Home({ smerovi, flash, dostupniDepartmani, dostupniNivoiStudija, dostupniTipoviMaterijala, dostupniMaterijali}){
  const {podesiPodatke} = koristiGlobalniKontekst();

  
  useEffect(()=>{
    if(flash.error){
      prikaziToastNotifikaciju(flash.error, TipToastNotifikacije.Greska);
    } else if (flash.success){
      prikaziToastNotifikaciju(flash.success, TipToastNotifikacije.Uspesno);
    }
    podesiPodatke({
      dostupniDepartmani: dostupniDepartmani,
      dostupniNivoiStudija: dostupniNivoiStudija,
      dostupniTipoviMaterijala: dostupniTipoviMaterijala
    })
  }, [])

  return (
   <>
    <Navbar/>
    <div className="flex justify-center items-center mt-20">
      <Departmani smerovi={smerovi}/>
    </div>

    <div className="w-screen max-w-[90vw] mx-auto h-[66.6667vh] my-10 flex flex-col">
      {dostupniMaterijali.length !== 0 && (
        <span className="font-semibold pl-4">Najnoviji materijali: </span>
      )}
      <PrikazMaterijala materijali={dostupniMaterijali}/>
    </div>
   </>
  );
}