import { generisiSkolskeGodine } from "../PomocniAlati/SkolskeGodine";
import CustomSelect from "../Komponente/Alati/CustomSelect";
import FajlUploader from "../Komponente/Alati/FajlUploader";
import { prikaziToastNotifikaciju } from "../PomocniAlati/ToastNotifikacijaServis";
import TipToastNotifikacije from "../PomocniAlati/TipToastNotifikacije";
import ServisKorisnika from "../PomocniAlati/Servisi/ServisKorisnika"
import ServisMaterijala from "../PomocniAlati/Servisi/ServisMaterijala";
import ServisSmerova from "../PomocniAlati/Servisi/ServisSmerova";
import ServisPredmeta from "../PomocniAlati/Servisi/ServisPredmeta";
import ServisPodtipovaMaterijala from "../PomocniAlati/Servisi/ServisPodtipovaMaterijala";
import { koristiGlobalniKontekst } from "../Konteksti";
import { useState, useEffect, useRef } from "react";
import { Tooltip } from "@mui/material";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoCloudUpload } from "react-icons/io5";
import { MdVerified } from "react-icons/md"

export default function ObjavaMaterijala({podesiPrikazDialoga}) {
    const {podaci} = koristiGlobalniKontekst();
    const dostupneSkolskeGodine = generisiSkolskeGodine();

    const zaustaviPrviRender = useRef(false);
    const zaustaviPrviRenderVerifikacija = useRef(false);
    const zaustaviPrviRenderStatusaVerifikacije = useRef(false);

    const [dostupneInformacije, podesiDostupneInformacije] = useState({
        dostupniDepartmani: podaci.dostupniDepartmani,
        dostupniNivoiStudija: podaci.dostupniNivoiStudija,
        dostupniTipoviMaterijala: podaci.dostupniTipoviMaterijala,
        dostupniSmerovi: '',
        dostupniPredmeti: '',
        dostupneGodine: '',
        dostupniPodTipoviMaterijala: '',
    });

    const [izabraneInformacije, podesiIzabraneInformacije] = useState({
        izabraniDepartman: '',
        izabraniNivoStudija: '',
        izabraniSmer: '',
        izabraniPredmet: '',
        izabranaGodina: '',
        izabraniTipMaterijala: '',
        izabraniPodTipMaterijala: '',
        izabranaSkolskaGodina:
            dostupneSkolskeGodine[dostupneSkolskeGodine.length - 1],
        izabraniFajl: '',
    });

    const [unetaMailAdresa, podesiUnetuMailAdresu] = useState("");

    const [statusVerifikacije, podesiStatusVerifikacije] = useState({
        verifikovan: false,
        statusVerifikacije: undefined
    });

    const [opisVerifikacije, podesiOpisVerifikacije] = useState({
        klase: "text-gray-500",
        tekst: "Materijal će biti vidljiv nakon verifikacije"
    })

    const [zakljucavanjeSelecta, podesiZakljucavanjeSelecta] = useState({
        selectDepartmana: true,
        selectNivoaStudija: true,
        selectSmera: true,
        selectGodina: true,
        selectPredmeta: true, 
        selectTipaMaterijala: true,
        selectPodTipaMaterijala: true
    });

    const [korak, podesiKorak] = useState(1);
    const ukupanBrKoraka = 4;

    const azurirajPolje = (setter, nazivPolja, vrednost) => {
        setter((prosli) => ({
            ...prosli,
            [nazivPolja]: vrednost,
        }));
    };

    const azurirajZakljucavanjeSelecta = (polje, vrednost) =>
        azurirajPolje(podesiZakljucavanjeSelecta, polje, vrednost);

    const azurirajPoljeDostupneInformacije = (polje, vrednost) =>
        azurirajPolje(podesiDostupneInformacije, polje, vrednost);

    const azurirajPoljeIzabraneInformacije = (polje, vrednost) =>
        azurirajPolje(podesiIzabraneInformacije, polje, vrednost);


    useEffect(() => {
        if(dostupneInformacije.dostupniDepartmani){
            azurirajZakljucavanjeSelecta('selectDepartmana', false)
        }

        if(dostupneInformacije.dostupniNivoiStudija){
            azurirajZakljucavanjeSelecta('selectNivoaStudija', false)
        }

        if(dostupneInformacije.dostupniTipoviMaterijala){
            azurirajZakljucavanjeSelecta('selectTipaMaterijala', false)
        }
    }, []);

    useEffect(() => {
        azurirajPoljeDostupneInformacije("dostupniSmerovi", '');
        azurirajPoljeDostupneInformacije("dostupneGodine", '');

        azurirajPoljeIzabraneInformacije("izabraniSmer", '')
        azurirajPoljeIzabraneInformacije("izabranaGodina", '')

        azurirajZakljucavanjeSelecta('selectSmera', true)
        azurirajZakljucavanjeSelecta('selectGodina', true)
        if (
            izabraneInformacije.izabraniDepartman &&
            izabraneInformacije.izabraniNivoStudija
        ) {
            if (izabraneInformacije.izabraniNivoStudija.nivo_studija_id === 2) {
                azurirajPoljeDostupneInformacije("dostupneGodine", [
                    { naziv: "1. Godina", vrednost: 1 },
                    { naziv: "2. Godina", vrednost: 2 },
                ]);
            } else {
                azurirajPoljeDostupneInformacije("dostupneGodine", [
                    { naziv: "1. Godina", vrednost: 1 },
                    { naziv: "2. Godina", vrednost: 2 },
                    { naziv: "3. Godina", vrednost: 3 },
                ]);
            }
            azurirajZakljucavanjeSelecta('selectGodina', false)

            const uzmiDostupneSmerove = async () => {
                let filteri = {
                    departman_id: izabraneInformacije.izabraniDepartman.departman_id,
                    nivo_studija_id: izabraneInformacije.izabraniNivoStudija.nivo_studija_id,
                }
                const dostupniSmerovi = await ServisSmerova.vratiSmerove(filteri);
                azurirajPoljeDostupneInformacije(
                    "dostupniSmerovi",
                    dostupniSmerovi
                );
                azurirajZakljucavanjeSelecta('selectSmera', false)
           }
           uzmiDostupneSmerove();
        }
    }, [
        izabraneInformacije.izabraniDepartman,
        izabraneInformacije.izabraniNivoStudija,
    ]);

    useEffect(() => {

        const preuzimiPredmete = async () => {
            const filteri = {
                smer_id: izabraneInformacije.izabraniSmer.smer_id,
                godina: izabraneInformacije.izabranaGodina.vrednost
            }

            const dostupniPredmeti = await ServisPredmeta.vratiPredmete(filteri);
            
            azurirajPoljeDostupneInformacije(
                "dostupniPredmeti",
                dostupniPredmeti
            );
            azurirajZakljucavanjeSelecta('selectPredmeta', false)
        }
        if (!zaustaviPrviRender.current) {
            zaustaviPrviRender.current = true;
            return;
        }
        azurirajPoljeDostupneInformacije("dostupniPredmeti", '');
        azurirajPoljeDostupneInformacije("izabraniSmer", '');

        azurirajPoljeIzabraneInformacije('izabraniPredmet', '')

        azurirajZakljucavanjeSelecta('selectPredmeta', true) 
        if (
            izabraneInformacije.izabraniSmer &&
            izabraneInformacije.izabranaGodina
        ) {
            preuzimiPredmete()
        }
    }, [izabraneInformacije.izabraniSmer, izabraneInformacije.izabranaGodina]);

    useEffect(() => {
        azurirajPoljeDostupneInformacije("dostupniPodTipoviMaterijala", '');
        azurirajPoljeIzabraneInformacije("izabraniPodTipMaterijala", '');
        azurirajZakljucavanjeSelecta('selectPodTipaMaterijala', true)

        const vratiPodtipoveMaterijala = async () =>{
            const filteri = {
                tip_materijala_id: izabraneInformacije.izabraniTipMaterijala.tip_materijala_id
            }
            const dostupniPodTipoviMaterijala = await ServisPodtipovaMaterijala.vratiPodTipoveMaterijala(filteri);
            azurirajPoljeDostupneInformacije(
                "dostupniPodTipoviMaterijala",
                dostupniPodTipoviMaterijala
            );
            azurirajZakljucavanjeSelecta('selectPodTipaMaterijala', false)
        }
        if (izabraneInformacije.izabraniTipMaterijala) {
            vratiPodtipoveMaterijala()
        }
    }, [izabraneInformacije.izabraniTipMaterijala]);

    useEffect(()=>{
        if (!zaustaviPrviRenderVerifikacija.current) {
            zaustaviPrviRenderVerifikacija.current = true;
            return;
        }
        const proveriVerifikaciju = async () => {
            podesiStatusVerifikacije(await ServisKorisnika.statusVerifikacije(unetaMailAdresa));
        };

        const validanMejl = /^[\w.-]+@pmf\.edu\.rs$/i.test(unetaMailAdresa);
        if(validanMejl){
            proveriVerifikaciju();
        } else {
            podesiStatusVerifikacije({
                verifikovan: undefined,
                statusVerifikacije: false
            })
        }
    }, [unetaMailAdresa])

    useEffect(()=>{
        if (!zaustaviPrviRenderStatusaVerifikacije.current) {
            zaustaviPrviRenderStatusaVerifikacije.current = true;
            return;
        }
        if (statusVerifikacije.verifikovan === undefined){
            podesiOpisVerifikacije({
                klase: "text-gray-500",
                tekst: "Materijal će biti vidljiv nakon verifikacije"
            })
        }
        else if(statusVerifikacije.verifikovan){
            podesiOpisVerifikacije({
                klase: "text-green-500",
                tekst: "Verifikovani ste"
            })
        } else {
            podesiOpisVerifikacije({
                klase: "text-red-500",
                tekst: "Očekuj te mejl za verifikaciju"
            })
        }
    }, [statusVerifikacije])

    const obradiKrajForme = () => {
        const validanMejl = /^[\w.-]+@pmf\.edu\.rs$/i.test(unetaMailAdresa);

        if (!validanMejl) {
            prikaziToastNotifikaciju("Mejl nije validan", TipToastNotifikacije.Greska)
            return;
        }

        if (
            izabraneInformacije.izabraniPredmet &&
            izabraneInformacije.izabraniPodTipMaterijala &&
            izabraneInformacije.izabranaSkolskaGodina &&
            izabraneInformacije.izabraniFajl
        ) {
            const podaciForme = new FormData();
            podaciForme.append("departman", JSON.stringify(izabraneInformacije.izabraniDepartman));
            podaciForme.append("nivoStudija", JSON.stringify(izabraneInformacije.izabraniNivoStudija));
            podaciForme.append("smer", JSON.stringify(izabraneInformacije.izabraniSmer));
            podaciForme.append("godina", JSON.stringify(izabraneInformacije.izabranaGodina));
            podaciForme.append("predmet", JSON.stringify(izabraneInformacije.izabraniPredmet));
            podaciForme.append("tipMaterijala", JSON.stringify(izabraneInformacije.izabraniTipMaterijala));
            podaciForme.append("podtipMaterijala", JSON.stringify(izabraneInformacije.izabraniPodTipMaterijala));
            podaciForme.append("akademskaGodina", izabraneInformacije.izabranaSkolskaGodina.naziv);
            podaciForme.append("korisnickiMejl", unetaMailAdresa); 
            podaciForme.append("fajl", izabraneInformacije.izabraniFajl);

            const uspesnaObjava = ServisMaterijala.sacuvajMaterijal(podaciForme);
                
            if(uspesnaObjava) {
                if(statusVerifikacije.verifikovan){
                    prikaziToastNotifikaciju("Materijal je uspešno objavljen", TipToastNotifikacije.Uspesno);
                } else {
                    prikaziToastNotifikaciju("Mejl za verifikaciju je poslat. Materijal će biti vidljiv nakon verifikacije.", TipToastNotifikacije.Info);
                }
            }
            podesiPrikazDialoga(false);
        }
    };

    const imaNedozvoljeneKaraktere = (naziv) => {
        const zabranjeniZnakovi = /[\\\/:*?"<>|]/;
        const rezervisanaImena = ['CON', 'PRN', 'AUX', 'NUL', ...Array.from({length: 9}, (_, i) => `COM${i+1}`), ...Array.from({length: 9}, (_, i) => `LPT${i+1}`)];
        
        const nazivBezEkstenzije = naziv.split('.').slice(0, -1).join('.');

        return (
            zabranjeniZnakovi.test(naziv) ||
            rezervisanaImena.includes(nazivBezEkstenzije.toUpperCase()) ||
            naziv.trim() === '' ||
            naziv.endsWith(' ') ||
            naziv.endsWith('.')
        );
    };

    const preimenujFajl = (stariFajl, novoIme) => {
        if (imaNedozvoljeneKaraktere(novoIme)) {
            throw new Error("Naziv fajla sadrži nedozvoljene karaktere ili rezervisano ime.");
        }

        return new File([stariFajl], novoIme, {
            type: stariFajl.type,
            lastModified: stariFajl.lastModified,
        });
    };

    const sledeciKorak = () =>
        podesiKorak((prethodniKorak) =>
            Math.min(prethodniKorak + 1, ukupanBrKoraka)
        );
    const prosliKorak = () =>
        podesiKorak((prethodniKorak) => Math.max(prethodniKorak - 1, 1));
    const krajForme = () => {
        obradiKrajForme();
    };

    return (
        <div className="flex items-center justify-center">
            <div className="w-[600px] border border-gray-400 rounded-lg p-4">
                <div className="flex justify-center">
                    {korak === 1 && (
                        <div className="flex flex-col justify-center gap-6">
                            <CustomSelect
                                klase={"w-80"}
                                opcije={dostupneInformacije.dostupniDepartmani}
                                vrednost={izabraneInformacije.izabraniDepartman}
                                podesiSelektovaneOpcije={(vrednost) => {
                                    azurirajPoljeIzabraneInformacije(
                                        "izabraniDepartman",
                                        vrednost
                                    );
                                }}
                                zakljucana = {zakljucavanjeSelecta.selectDepartmana}
                                obaveznoPolje={true}
                                labela={"Izaberi Departman"}
                                tooltipTekst={"Inforamacije o departmanima se preuzimaju"}
                            />
                            <CustomSelect
                                klase={"w-80"}
                                opcije={
                                    dostupneInformacije.dostupniNivoiStudija
                                }
                                vrednost={
                                    izabraneInformacije.izabraniNivoStudija
                                }
                                podesiSelektovaneOpcije={(vrednost) => {
                                    azurirajPoljeIzabraneInformacije(
                                        "izabraniNivoStudija",
                                        vrednost
                                    );
                                }}
                                zakljucana = {zakljucavanjeSelecta.selectNivoaStudija}
                                tooltipTekst={"Inforamacije o nivoima studija se preuzimaju"}
                                obaveznoPolje={true}
                                labela={"Izaberi Nivo Studija"}
                                imeOpcije="nivo_studija"
                            />
                        </div>
                    )}
                    {korak === 2 && (
                        <div className="flex flex-col justify-center gap-6">
                            <CustomSelect
                                klase={"w-80"}
                                opcije={dostupneInformacije.dostupniSmerovi}
                                vrednost={izabraneInformacije.izabraniSmer}
                                podesiSelektovaneOpcije={(vrednost) => {
                                    azurirajPoljeIzabraneInformacije(
                                        "izabraniSmer",
                                        vrednost
                                    );
                                }}
                                obaveznoPolje={true}
                                labela={"Izaberi Smer"}
                                zakljucana={zakljucavanjeSelecta.selectSmera}
                                tooltipTekst={
                                    "Izaberi departman i nivo studija!"
                                }
                                imeOpcije="naziv_smera"
                            />
                            <CustomSelect
                                klase={"w-80"}
                                opcije={dostupneInformacije.dostupneGodine}
                                vrednost={izabraneInformacije.izabranaGodina}
                                podesiSelektovaneOpcije={(vrednost) => {
                                    azurirajPoljeIzabraneInformacije(
                                        "izabranaGodina",
                                        vrednost
                                    );
                                }}
                                obaveznoPolje={true}
                                labela={"Izaberi Godinu"}
                                zakljucana={zakljucavanjeSelecta.selectGodina}
                                tooltipTekst={
                                    "Izaberi departman i nivo studija!"
                                }
                            />
                            <CustomSelect
                                klase={"w-80"}
                                opcije={dostupneInformacije.dostupniPredmeti}
                                vrednost={izabraneInformacije.izabraniPredmet}
                                podesiSelektovaneOpcije={(vrednost) => {
                                    azurirajPoljeIzabraneInformacije(
                                        "izabraniPredmet",
                                        vrednost
                                    );
                                }}
                                obaveznoPolje={true}
                                labela={"Izaberi Predmet"}
                                zakljucana={zakljucavanjeSelecta.selectPredmeta}
                                tooltipTekst={"Izaberi smer i godinu!"}
                            />
                        </div>
                    )}
                    {korak === 3 && (
                        <div className="flex flex-col justify-center gap-6">
                            <CustomSelect
                                klase={"w-80"}
                                opcije={
                                    dostupneInformacije.dostupniTipoviMaterijala
                                }
                                vrednost={
                                    izabraneInformacije.izabraniTipMaterijala
                                }
                                podesiSelektovaneOpcije={(vrednost) => {
                                    azurirajPoljeIzabraneInformacije(
                                        "izabraniTipMaterijala",
                                        vrednost
                                    );
                                }}
                                obaveznoPolje={true}
                                labela={"Izaberi Tip Materijala"}
                                zakljucana={zakljucavanjeSelecta.selectTipaMaterijala}
                                tooltipTekst={"Informacije o tipovima materijala se preuzimaju"}
                            />
                            <CustomSelect
                                klase={"w-80"}
                                opcije={
                                    dostupneInformacije.dostupniPodTipoviMaterijala
                                }
                                vrednost={
                                    izabraneInformacije.izabraniPodTipMaterijala
                                }
                                podesiSelektovaneOpcije={(vrednost) => {
                                    azurirajPoljeIzabraneInformacije(
                                        "izabraniPodTipMaterijala",
                                        vrednost
                                    );
                                }}
                                obaveznoPolje={true}
                                labela={"Izaberi Podtip Materijala"}
                                zakljucana={zakljucavanjeSelecta.selectPodTipaMaterijala}
                                tooltipTekst={"Izaberi tip materijala!"}
                            />
                            <CustomSelect
                                klase={"w-80"}
                                opcije={dostupneSkolskeGodine}
                                vrednost={
                                    izabraneInformacije.izabranaSkolskaGodina
                                }
                                podesiSelektovaneOpcije={(vrednost) => {
                                    azurirajPoljeIzabraneInformacije(
                                        "izabranaSkolskaGodina",
                                        vrednost
                                    );
                                }}
                                obaveznoPolje={true}
                                labela={"Izaberi Akademsku Godinu"}
                            />
                        </div>
                    )}
                    {korak === 4 && (
                        <div className="flex flex-col justify-center gap-6 items-center">
                            <div className="flex items-center gap-2">
                                {/* <label htmlFor="email">
                                    Unesite PMF mail adresu:
                                </label> */}
                                <Tooltip
                                    title={opisVerifikacije.tekst}
                                >
                                    <MdVerified className={opisVerifikacije.klase} size={40} />
                                </Tooltip>
                                <input
                                    type="email"
                                    id="email"
                                    value={unetaMailAdresa} // ""
                                    onChange={(e) => {
                                        podesiUnetuMailAdresu(e.target.value);
                                    }}
                                    className="border border-gray-400 rounded-lg p-2 w-60"
                                    placeholder="ime.prezime@pmf.edu.rs"
                                />
                            </div>
                            <div className="flex gap-4 justify-center">
                                <FajlUploader
                                    podesiFajl={(vrednost) => {
                                        azurirajPoljeIzabraneInformacije(
                                            "izabraniFajl",
                                            vrednost
                                        );
                                    }}
                                />
                                {izabraneInformacije.izabraniFajl && (
                                    <div className="text-sm flex items-center gap-2">
                                        {/* <label htmlFor=""> Ime materijala:</label> */}
                                        <Tooltip
                                            title={"Izmeni ime materijala"}
                                            arrow
                                        >
                                            <input
                                                type="text"
                                                value={
                                                    izabraneInformacije.izabraniFajl.name
                                                }
                                                className="border border-gray-400 p-2 rounded-sm"
                                                onChange={(e) => {
                                                    const noviNaziv = e.target.value;
                                                    const noviFajl = preimenujFajl(izabraneInformacije.izabraniFajl, noviNaziv);
                                                    azurirajPoljeIzabraneInformacije("izabraniFajl", noviFajl);
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-end mt-5">
                    {korak > 1 && (
                        <button
                            onClick={prosliKorak}
                            className="cursor-pointer mr-auto"
                        >
                            <Tooltip title={"Nazad"} arrow>
                                <FaArrowLeft size={25} />
                            </Tooltip>
                        </button>
                    )}
                    {korak === ukupanBrKoraka ? (
                        <button
                            className="cursor-pointer flex justify-end"
                            onClick={krajForme}
                        >
                            <Tooltip arrow title="Objavi materijal">
                                <IoCloudUpload
                                    size={35}
                                    className="text-blue-400"
                                />
                            </Tooltip>
                        </button>
                    ) : (
                        <button
                            onClick={sledeciKorak}
                            className="cursor-pointer flex justify-end"
                        >
                            <Tooltip title={"Dalje"} arrow>
                                <FaArrowRight size={25} />
                            </Tooltip>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
