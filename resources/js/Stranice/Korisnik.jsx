import Navbar from "../Komponente/Alati/Navbar"
import CustomSelect from "../Komponente/Alati/CustomSelect";
import { useEffect, useState } from "react";
import ServisSmerova from "../PomocniAlati/Servisi/ServisSmerova";
import { usePage } from "@inertiajs/react";
import ServisPredmeta from "../PomocniAlati/Servisi/ServisPredmeta";

export default function Korisnik(podaci){
    const [korisnik, podesiKorisnika] = useState(podaci.korisnik)
    const [dostupneInformacije, podesiDostupneInformacije] = useState({
        dostupniSmerovi: podaci.dostupniSmerovi,
        dostupniPredmeti: podaci.dostupniPredmeti,
        dostupneGodine: [
            {vrednost: 1, naziv: "1.godina"},
            {vrednost: 2, naziv: "2.godina"},
            {vrednost: 3, naziv: "3.godina"}
        ]
    })
    const [izabraneInformacije, podesiIzabraneInformacije] = useState({
        izabraniSmerovi: korisnik.smerovi_korisnika,
        izabraniPredmeti: korisnik.predmeti_korisnika,
        izabranaGodina: korisnik.godina,
    })
    const [zakljucavanjeSelecta, podesiZakljucavanjeSelecta] = useState({
        selectSmera: true,
        selectGodina: true,
        selectPredmeta: true, 
    });

    const azurirajPolje = (setter, nazivPolja, vrednost) => {
        setter((prosli) => ({
            ...prosli,
            [nazivPolja]: vrednost,
        }));
    };

    const azurirajPoljeDostupneInformacije = (polje, vrednost) =>
        azurirajPolje(podesiDostupneInformacije, polje, vrednost);

    const azurirajPoljeIzabraneInformacije = (polje, vrednost) =>
        azurirajPolje(podesiIzabraneInformacije, polje, vrednost);
    
    const azurirajZakljucavanjeSelecta = (polje, vrednost) =>
        azurirajPolje(podesiZakljucavanjeSelecta, polje, vrednost);

    useEffect(()=>{
        const vratiSmerove = async () => {
            const smerovi = await ServisSmerova.vratiSmerove({
                kolonaSortiranja: 'nivo_studija_id',
            });
            azurirajPoljeDostupneInformacije('dostupniSmerovi', smerovi);
        }
        vratiSmerove();
        azurirajZakljucavanjeSelecta('selectSmera', false)
    }, [])

    useEffect(()=>{
        console.log(izabraneInformacije.izabraniSmerovi)
        const azurirajPredmete = async () =>{
            const predmeti = await ServisPredmeta.vratiPredmete({
                smer_id: izabraneInformacije.izabraniSmerovi
            })
        }
    }, [izabraneInformacije.izabraniSmerovi])



    
    return(
       <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-[url('/storage/images/pozadina.jpg')] bg-cover bg-center blur-sm opacity-60 z-0"></div>
        
        <div className="relative z-10">
            <Navbar />
            <div className="flex justify-center items-center mt-20 px-4">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl z-20 max-w-3xl w-full p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Podaci o studentu
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Ime:</span>
                            <span className="text-gray-900">{korisnik.ime}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Prezime:</span>
                            <span className="text-gray-900">{korisnik.prezime}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Broj indeksa:</span>
                            <span className="text-gray-900">{korisnik.broj_indeksa}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Email:</span>
                            <span className="text-gray-900">{korisnik.korisnicki_email}</span>
                        </div>
                        <CustomSelect
                            klase={"w-80"}
                            viseOpcija = {true}
                            opcije={dostupneInformacije.dostupniSmerovi}
                            vrednost={izabraneInformacije.izabraniSmerovi}
                            podesiSelektovaneOpcije={(vrednost) => {
                                azurirajPoljeIzabraneInformacije(
                                    "izabraniSmerovi",
                                    vrednost
                                );
                            }}
                            labela={"Izaberi Smer"}
                            zakljucana={zakljucavanjeSelecta.selectSmera}
                            tooltipTekst={"Sačekaj"}
                            imeOpcije="naziv_smera"
                            nazivPlus="nivo_studija"
                        />
                    </div>
                </div> 
            </div>
        </div>
    </div>
    )
}