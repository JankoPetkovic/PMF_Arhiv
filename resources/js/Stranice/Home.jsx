import Departmani from "../Komponente/Departmani"
import Navbar from "../Komponente/Alati/Navbar";
import { useEffect, useState } from "react";
import { prikaziToastNotifikaciju } from "../PomocniAlati/ToastNotifikacijaServis";
import TipToastNotifikacije from "../PomocniAlati/TipToastNotifikacije";
import { koristiGlobalniKontekst } from "../Konteksti";
import PrikazMaterijala from "../Komponente/PrikazMaterijala";
import CarouselParlamenta from "../Komponente/CarouselParlamenta";
import { usePage } from '@inertiajs/react';

export default function Home({ smerovi, flash, dostupniDepartmani, dostupniNivoiStudija, dostupniTipoviMaterijala, dostupniMaterijali, najnovijeObjave = []}){
  const {podesiPodatke} = koristiGlobalniKontekst();
  const { ulogovanKorisnik, prikaziParlament } = usePage().props;
  const [tekstMaterijala, podesiTekstMaterijal] = useState('Najnoviji materijali: ')

  
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

    if(ulogovanKorisnik && ulogovanKorisnik?.smerovi_korisnika?.length > 0){
      podesiTekstMaterijal("Najnoviji materijali sa vaših smerova:")
    }
  }, [])

  return (
   <div className="relative min-h-screen">
    <div className="absolute inset-0 bg-[url('/storage/images/pozadina.jpg')] bg-cover bg-center blur-sm opacity-60 z-0"></div>

    
    <div className="relative z-10">
      <Navbar />
      <div className="max-w-7xl w-full mx-auto px-4">
        <div className="relative z-50 mt-20 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg">
          <Departmani smerovi={smerovi} />
        </div>
      </div>
      <div className="mt-6 max-w-[90vw] mx-auto">
        {prikaziParlament && <CarouselParlamenta objave={najnovijeObjave} />}
        <PrikazMaterijala materijali={dostupniMaterijali.data} tekst={tekstMaterijala} />
      </div>
    </div>
  </div>

  );
}