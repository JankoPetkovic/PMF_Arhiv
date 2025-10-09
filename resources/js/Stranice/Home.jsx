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
   <div className="relative min-h-screen">
    <div className="absolute inset-0 bg-[url('/storage/images/pozadina.jpg')] bg-cover bg-center blur-sm opacity-60 z-0"></div>

    
    <div className="relative z-10">
      <Navbar />
      <div className="flex justify-center items-center mt-20">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg z-20 max-w-5xl w-full">
          <Departmani smerovi={smerovi} />
        </div>
      </div>
      <PrikazMaterijala materijali={dostupniMaterijali.data} />
    </div>
  </div>

  );
}