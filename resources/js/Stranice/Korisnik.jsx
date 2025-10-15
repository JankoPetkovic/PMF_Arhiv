import Navbar from "../Komponente/Alati/Navbar"
import CustomSelect from "../Komponente/Alati/CustomSelect";
import { useEffect, useState, useRef } from "react";
import ServisSmerova from "../PomocniAlati/Servisi/ServisSmerova";
import ServisKorisnika from "../PomocniAlati/Servisi/ServisKorisnika";
import StatusVerifikacije from "../PomocniAlati/StatusVerifikacije";
import PrikazMaterijala from "../Komponente/PrikazMaterijala";
import ServisMaterijala from "../PomocniAlati/Servisi/ServisMaterijala";
import TablePagination from '@mui/material/TablePagination';
import { CircularProgress, Tooltip  } from '@mui/material';
import InputPoljeSaGreskom from "../Komponente/Alati/InputPoljeSaGreskom";
import { router } from "@inertiajs/react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ServisDepartmana from "../PomocniAlati/Servisi/ServisDepartmana";
import { prikaziToastNotifikaciju } from "../PomocniAlati/ToastNotifikacijaServis";
import TipToastNotifikacije from "../PomocniAlati/TipToastNotifikacije";
import ServisPredmeta from "../PomocniAlati/Servisi/ServisPredmeta";
import ServisNivoaStudija from "../PomocniAlati/Servisi/ServisNivoaStudija";


export default function Korisnik(podaci){
    const korisnik = podaci.korisnik

    const [ucitavanje, podesiUcitavanje] = useState(false);
    const [dostupneInformacije, podesiDostupneInformacije] = useState({
        dostupniDepartmani: {},
        dostupniSmerovi: podaci.dostupniSmerovi,
        dostupniNivoiStudija: {},
        dostupniMaterijali: {},
        brDostupnihMaterijala: 10,
        // dostupniPredmeti: podaci.dostupniPredmeti,
        dostupneGodine: [
            {vrednost: 1, naziv: "1.godina"},
            {vrednost: 2, naziv: "2.godina"},
            {vrednost: 3, naziv: "3.godina"}
        ]
    })
    const [izabraneInformacije, podesiIzabraneInformacije] = useState({
        izabraniSmerovi: korisnik.smerovi_korisnika,
        izabranBrMaterijalaPoStranici: 10,
        izabranaStranica: 0,
        izabranaOpcija: "departman"
        // izabraniPredmeti: korisnik.predmeti_korisnika,
        // izabranaGodina: korisnik.godina,
    })
    const [zakljucavanjeSelecta, podesiZakljucavanjeSelecta] = useState({
        selectSmera: true,
        // selectGodina: true,
        // selectPredmeta: true, 
    });
    const [noveInformacije, podesiNoveInformacije] = useState({
        noviDepartmanNaziv: "",
        noviSmerNaziv: "",
        noviSmerDepartman: "",
        noviSmerNivoStudija: "",
        noviPredmetNaziv: "",
        noviPredmetSmer: "",
        noviPredmetGodina: "",
    })

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

    const azurirajPoljeNoveInformacije = (polje, vrednost) =>
        azurirajPolje(podesiNoveInformacije, polje, vrednost);

    const obradiPromenuBrMaterijalaPoStranici = (dogadjaj) => {
        azurirajPoljeIzabraneInformacije("izabranBrMaterijalaPoStranici", parseInt(dogadjaj.target.value, 10));
        azurirajPoljeIzabraneInformacije("izabranaStranica", 0);
    }

    const obradiDodavanje = async (pojam) =>{
        if(pojam == 'departman'){
            if(noveInformacije.noviDepartmanNaziv){
                ServisDepartmana.dodajDepartman(noveInformacije.noviDepartmanNaziv);
            } else {
                prikaziToastNotifikaciju("Morate izabrati sve opcije", TipToastNotifikacije.Info)
                return
            }
        } else if(pojam == 'smer'){
            console.log(noveInformacije)
            if(noveInformacije.noviSmerNaziv && noveInformacije.noviSmerDepartman && noveInformacije.noviSmerNivoStudija){
                const opcije = {
                    nazivSmera: noveInformacije.noviSmerNaziv,
                    departman: noveInformacije.noviSmerDepartman,
                    nivoStudija: noveInformacije.noviSmerNivoStudija
                }
                ServisSmerova.dodajSmer(opcije)
            } else {
                prikaziToastNotifikaciju("Morate izabrati sve opcije", TipToastNotifikacije.Info)
                return
            }
        } else if(pojam == 'predmet'){
            if(noveInformacije.noviPredmetNaziv && noveInformacije.noviPredmetSmer && noveInformacije.noviPredmetGodina){
                const opcije = {
                    nazivPredmeta: noveInformacije.noviPredmetNaziv,
                    smer: noveInformacije.noviPredmetSmer,
                    godina: noveInformacije.noviPredmetGodina
                }
                ServisPredmeta.dodajPredmet(opcije)
            } else {
                prikaziToastNotifikaciju("Morate izabrati sve opcije", TipToastNotifikacije.Info)
                return
            }
        } else {
            prikaziToastNotifikaciju("Greska pri dodavanju", TipToastNotifikacije.Greska)
            return
        }
        router.reload()
    }

    const obradiCuvanjePromena = async () => {
        await ServisKorisnika.azurirajKorisnika(korisnik.korisnik_id, {
                izabraniSmerovi: izabraneInformacije.izabraniSmerovi.map(
                (smer) => smer.smer_id
                ),
            },
            { withCredentials: true }
        );
    }

    const produziVerifikaciju = () => {
        ServisKorisnika.verifikujKorisnika(korisnik.korisnicki_email)
    }

    useEffect(()=>{
        const vratiDepartmane = async () => {
            const departmani = await ServisDepartmana.vratiDepartmane();
            azurirajPoljeDostupneInformacije('dostupniDepartmani', departmani);
        }
        const vratiSmerove = async () => {
            const smerovi = await ServisSmerova.vratiSmerove({
                kolonaSortiranja: 'nivo_studija_id',
            });
            azurirajPoljeDostupneInformacije('dostupniSmerovi', smerovi);
        }
        const vratiNivoeStudija = async () => {
            const nivoiStudija = await ServisNivoaStudija.vratiNivoeStudija()
            azurirajPoljeDostupneInformacije('dostupniNivoiStudija', nivoiStudija);
        }

        vratiSmerove();
        vratiNivoeStudija();
        vratiDepartmane();
        azurirajZakljucavanjeSelecta('selectSmera', false)
    }, [])

    useEffect(() => {
        async function preuzmiMaterijale() {
            let filteri = {
                korisnik_id: korisnik.korisnik_id,
                stranica: izabraneInformacije.izabranaStranica + 1,
                poStranici: izabraneInformacije.izabranBrMaterijalaPoStranici,
            };

            try {
                podesiUcitavanje(true); 
                azurirajPoljeDostupneInformacije('dostupniMaterijali', '');

                const odgovor = await ServisMaterijala.vratiMaterijale(filteri);

                azurirajPoljeDostupneInformacije('dostupniMaterijali', odgovor.data);
                azurirajPoljeDostupneInformacije('brDostupnihMaterijala', odgovor.total);
            } catch (err) {
                return
            } finally {
                podesiUcitavanje(false); 
            }
        }

        preuzmiMaterijale();
    }, [izabraneInformacije.izabranaStranica, izabraneInformacije.izabranBrMaterijalaPoStranici]);

    return(
       <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-[url('/storage/images/pozadina.jpg')] bg-cover bg-center blur-sm opacity-60 z-0"></div>
        
        <div className="relative z-10">
            <Navbar />
            <div className="flex flex-col justify-center items-center mt-20 px-4">
                <div className="flex gap-6">
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
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Status verifikacije:</span>
                                <StatusVerifikacije statusVerifikacije={korisnik.status_verifikacije} produziVerifikaciju={produziVerifikaciju}/>
                            </div>
                            <CustomSelect
                                klase="w-full"
                                viseOpcija = {true}
                                brojIzabranihOpcija = {5}
                                opcije={dostupneInformacije.dostupniSmerovi}
                                vrednost={izabraneInformacije.izabraniSmerovi}
                                podesiSelektovaneOpcije={(vrednost) => {
                                    azurirajPoljeIzabraneInformacije(
                                        "izabraniSmerovi",
                                        vrednost
                                    );
                                }}
                                labela={"Vaši smerovi"}
                                zakljucana={zakljucavanjeSelecta.selectSmera}
                                tooltipTekst={"Sačekaj"}
                                imeOpcije="naziv_smera"
                                nazivPlus="nivo_studija"
                            />
                            <button
                                onClick={obradiCuvanjePromena}
                                className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                            >
                                Sačuvaj
                            </button>
                        </div>
                    </div>
                    {korisnik.uloga == "Admin" && 
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl z-20 max-w-3xl w-full p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                            Admin podešavanja
                        </h2>
                        <Tabs
                            value = {izabraneInformacije.izabranaOpcija}
                            onChange={(dogadjaj, opcija) => 
                                azurirajPoljeIzabraneInformacije('izabranaOpcija', opcija)
                            }
                            textColor="secondary"
                            indicatorColor="secondary"
                            variant="scrollable"
                            scrollButtons="off"
                            allowScrollButtonsMobile
                            sx={{
                                minHeight: 5,
                                '& .MuiTabs-scroller': {
                                paddingLeft: '12px',
                                },
                                '& .MuiTabs-indicator': {
                                backgroundColor: '#000000',
                                height: '2px',
                                },
                            }}
                        >
                            <Tab
                                label="Dodavanje departmana"
                                value={"departman"}
                                sx={{
                                color: 'black',
                                '&.Mui-selected': {
                                    color: '#000000',
                                },
                                minHeight: 5,
                                paddingTop: '4px',
                                paddingBottom: '4px',
                                fontSize: '0.7rem',
                                whiteSpace: 'nowrap',
                                transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                    transform: 'scale(1.1)',},
                                }}
                            />
                            <Tab
                                label="Dodavanje smera"
                                value={"smer"}
                                sx={{
                                color: 'black',
                                '&.Mui-selected': {
                                    color: '#000000',
                                },
                                minHeight: 5,
                                paddingTop: '4px',
                                paddingBottom: '4px',
                                fontSize: '0.7rem',
                                whiteSpace: 'nowrap',
                                transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                    transform: 'scale(1.1)',},
                                }}
                            />
                            <Tab
                                label="Dodavanje predmeta"
                                value={"predmet"}
                                sx={{
                                color: 'black',
                                '&.Mui-selected': {
                                    color: '#000000',
                                },
                                minHeight: 5,
                                paddingTop: '4px',
                                paddingBottom: '4px',
                                fontSize: '0.7rem',
                                whiteSpace: 'nowrap',
                                transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                    transform: 'scale(1.1)',},
                                }}
                            />
                            
                        </Tabs>

                        {izabraneInformacije.izabranaOpcija == "departman" &&
                            <div className="flex flex-col w-full mt-5">
                                <InputPoljeSaGreskom 
                                    labela = {"Dodaj Departman"}
                                    vrednost = {noveInformacije.noviDepartmanNaziv}
                                    obradiPromenu={(e) => azurirajPoljeNoveInformacije('noviDepartmanNaziv', e.target.value)} 
                                    greska = {false}    
                                />
                                <button
                                    onClick={()=>{obradiDodavanje('departman')}}
                                    className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                                >
                                    Sačuvaj
                                </button>
                            </div>
                        }

                        {izabraneInformacije.izabranaOpcija == "smer" &&
                            <div className="flex flex-col gap-2 w-full mt-5">
                                <InputPoljeSaGreskom 
                                    labela = {"Dodaj Smer"}
                                    vrednost = {noveInformacije.noviSmer}
                                    obradiPromenu={(e) => azurirajPoljeNoveInformacije('noviSmerNaziv', e.target.value)} 
                                    greska = {false}    
                                />
                                <CustomSelect
                                    klase={'w-full'}
                                    labela={'Izaberi departman novog smera'}
                                    opcije={dostupneInformacije.dostupniDepartmani}
                                    vrednost={noveInformacije.noviSmerDepartman}
                                    podesiSelektovaneOpcije={(vrednost) => {
                                        azurirajPoljeNoveInformacije('noviSmerDepartman',vrednost)}}
                                />
                                <CustomSelect
                                    klase={'w-full'}
                                    labela={'Izaberi nivo studija novog smera'}
                                    opcije={dostupneInformacije.dostupniNivoiStudija}
                                    vrednost={noveInformacije.noviSmerNivoStudija}
                                    podesiSelektovaneOpcije={(vrednost) => {
                                        azurirajPoljeNoveInformacije('noviSmerNivoStudija',vrednost)}}
                                    imeOpcije="nivo_studija"
                                />
                                <button
                                    onClick={()=>{obradiDodavanje('smer')}}
                                    className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                                >
                                    Sačuvaj
                                </button>
                            </div>
                        }

                        {izabraneInformacije.izabranaOpcija == "predmet" &&
                            <div className="flex flex-col gap-2 w-full mt-5">
                                <InputPoljeSaGreskom 
                                    labela = {"Dodaj Predmet"}
                                    vrednost = {noveInformacije.noviSmer}
                                    obradiPromenu={(e) => azurirajPoljeNoveInformacije('noviPredmetNaziv', e.target.value)} 
                                    greska = {false}    
                                />
                                <CustomSelect
                                    klase={'w-full'}
                                    labela={'Izaberi smer novog predmeta'}
                                    opcije={dostupneInformacije.dostupniSmerovi}
                                    vrednost={noveInformacije.noviPredmetSmer}
                                    podesiSelektovaneOpcije={(vrednost) => {
                                        azurirajPoljeNoveInformacije('noviPredmetSmer',vrednost)}}
                                    imeOpcije="naziv_smera"
                                    nazivPlus="nivo_studija"
                                />
                                <CustomSelect
                                    klase={'w-full'}
                                    labela={'Izaberi godinu novog predmet'}
                                    opcije={dostupneInformacije.dostupneGodine}
                                    vrednost={noveInformacije.noviPredmetGodina}
                                    podesiSelektovaneOpcije={(vrednost) => {
                                        azurirajPoljeNoveInformacije('noviPredmetGodina',vrednost)}}
                                />
                                <button
                                    onClick={()=>{obradiDodavanje('predmet')}}
                                    className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                                >
                                    Sačuvaj
                                </button>
                            </div>
                        }
                        <div className="flex gap-4 mt-4">
                            <a
                                href="/export-problema"
                                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                            >
                                Preuzmi listu problema 
                            </a>

                            <a
                                href="/export-korisnickih-akcija"
                                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                            >
                                Preuzmi listu korisničkih akcija
                            </a>

                            <a
                                href="/export-strukture-fakulteta"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                            >
                                Preuzmi strukture fakulteta
                            </a>
                        </div>
                    </div>}
                    {korisnik.uloga == "Menadzer" && 
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl z-20 max-w-3xl w-full p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                            Mendžerska podešavanja
                        </h2>
                        <div className="flex gap-4 mt-4">
                            <a
                                href="/export-problema"
                                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                            >
                                Preuzmi listu problema 
                            </a>

                            {/* <a
                                href="/export-korisnickih-akcija"
                                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                            >
                                Preuzmi listu korisničkih akcija
                            </a>*/}

                            <a
                                href="/export-strukture-fakulteta"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                            >
                                Preuzmi strukture fakulteta
                            </a> 
                        </div>
                    </div>}

                </div>
                <div className="flex">
                    {ucitavanje ? (
                        <div className="flex justify-center items-center w-full mt-30">
                            <CircularProgress color="error" size={80}/>
                        </div>
                    ) : (
                        <div className="p-4 w-full">
                            <PrikazMaterijala  
                                materijali={dostupneInformacije.dostupniMaterijali} 
                                tekst={"Materijali korisnika " + korisnik.ime +" "+ korisnik.prezime + ": "}
                            />
                            <TablePagination
                                component="div"
                                count={dostupneInformacije.brDostupnihMaterijala}
                                page={izabraneInformacije.izabranaStranica}
                                onPageChange={(dogadjaj, novaStranica) => {
                                    azurirajPoljeIzabraneInformacije('izabranaStranica', novaStranica);
                                }}
                                rowsPerPage={izabraneInformacije.izabranBrMaterijalaPoStranici}
                                onRowsPerPageChange={obradiPromenuBrMaterijalaPoStranici}
                                labelRowsPerPage="Materijala po stranici:"
                                rowsPerPageOptions={[5, 10, 20, 50]}
                            />
                        </div>
                    )}
                </div> 
                
            </div>
        </div>
    </div>
    )
}