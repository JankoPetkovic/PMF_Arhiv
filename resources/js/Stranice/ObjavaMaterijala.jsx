import { generisiSkolskeGodine } from "../PomocniAlati/SkolskeGodine";
import CustomSelect from "../Komponente/Alati/CustomSelect";
import FajlUploader from "../Komponente/Alati/FajlUploader";
import { prikaziToastNotifikaciju } from "../PomocniAlati/ToastNotifikacijaServis";
import TipToastNotifikacije from "../PomocniAlati/TipToastNotifikacije";
import ServisKorisnika from "../PomocniAlati/ServisKorisnika"
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Tooltip } from "@mui/material";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoCloudUpload } from "react-icons/io5";
import { CiCircleInfo } from "react-icons/ci";
import { MdVerified } from "react-icons/md"

export default function ObjavaMaterijala({podesiPrikazDialoga}) {
    const dostupneSkolskeGodine = generisiSkolskeGodine();

    const zaustaviPrviRender = useRef(false);
    const zaustaviPrviRenderVerifikacija = useRef(false);
    const zaustaviPrviRenderStatusaVerifikacije = useRef(false);

    const [dostupneInformacije, podesiDostupneInformacije] = useState({
        dostupniDepartmani: '',
        dostupniNivoiStudija: '',
        dostupniTipoviMaterijala: '',
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
        izabranaAkademskaGodina:
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
        const getPocetneInformacije = async () => {
            const odgovor = await axios
                .get("/objavi-materijal")
                .then((odgovor) => {
                    azurirajPoljeDostupneInformacije(
                        "dostupniDepartmani",
                        odgovor.data.dostupniDepartmani
                    );
                    azurirajPoljeDostupneInformacije(
                        "dostupniNivoiStudija",
                        odgovor.data.dostupniNivoiStudija
                    );
                    azurirajPoljeDostupneInformacije(
                        "dostupniTipoviMaterijala",
                        odgovor.data.dostupniTipoviMaterijala
                    );
                    azurirajZakljucavanjeSelecta('selectDepartmana', false)
                    azurirajZakljucavanjeSelecta('selectNivoaStudija', false)
                    azurirajZakljucavanjeSelecta('selectTipaMaterijala', false)
                });
        };
        getPocetneInformacije();
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

            const odgovor = axios
                .post("/get-smerovi", {
                    departman: izabraneInformacije.izabraniDepartman,
                    nivoStudija: izabraneInformacije.izabraniNivoStudija,
                })
                .then((odgovor) => {
                    azurirajPoljeDostupneInformacije(
                        "dostupniSmerovi",
                        odgovor.data
                    );
                    azurirajZakljucavanjeSelecta('selectSmera', false)
                });
        }
    }, [
        izabraneInformacije.izabraniDepartman,
        izabraneInformacije.izabraniNivoStudija,
    ]);

    useEffect(() => {
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
            const odgovor = axios
                .post("/get-predmeti", {
                    smerID: izabraneInformacije.izabraniSmer,
                    godina: izabraneInformacije.izabranaGodina,
                })
                .then((odgovor) => {
                    azurirajPoljeDostupneInformacije(
                        "dostupniPredmeti",
                        odgovor.data
                    );
                    azurirajZakljucavanjeSelecta('selectPredmeta', false)
                });
        }
    }, [izabraneInformacije.izabraniSmer, izabraneInformacije.izabranaGodina]);

    useEffect(() => {
        azurirajPoljeDostupneInformacije("dostupniPodTipoviMaterijala", '');
        azurirajPoljeIzabraneInformacije("izabraniPodTipMaterijala", '');
        azurirajZakljucavanjeSelecta('selectPodTipaMaterijala', true)
        if (izabraneInformacije.izabraniTipMaterijala) {
            const odgovor = axios
                .post("/get-podTipovi", {
                    tipMaterijala: izabraneInformacije.izabraniTipMaterijala,
                })
                .then((odgovor) => {
                    azurirajPoljeDostupneInformacije(
                        "dostupniPodTipoviMaterijala",
                        odgovor.data
                    );
                    azurirajZakljucavanjeSelecta('selectPodTipaMaterijala', false)
                });
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
            izabraneInformacije.izabranaAkademskaGodina &&
            izabraneInformacije.izabraniFajl
        ) {
            const podaciForme = new FormData();
            podaciForme.append("departman", JSON.stringify(izabraneInformacije.izabraniDepartman));
            podaciForme.append("nivoStudija", JSON.stringify(izabraneInformacije.izabraniNivoStudija));
            podaciForme.append("smer", JSON.stringify(izabraneInformacije.izabraniSmer));
            podaciForme.append("godina", JSON.stringify(izabraneInformacije.izabranaGodina));
            podaciForme.append("predmet", JSON.stringify(izabraneInformacije.izabraniPredmet));
            podaciForme.append("tipMaterijala", JSON.stringify(izabraneInformacije.izabraniTipMaterijala));
            podaciForme.append("podTipMaterijala", JSON.stringify(izabraneInformacije.izabraniPodTipMaterijala));
            podaciForme.append("akademskaGodina", izabraneInformacije.izabranaAkademskaGodina.naziv);
            podaciForme.append("korisnickiMejl", unetaMailAdresa); 
            podaciForme.append("fajl", izabraneInformacije.izabraniFajl);

            try{
                axios.post("/kreiraj-materijal", podaciForme);
            } catch (greska) {
                prikaziToastNotifikaciju("Greska prilikom objavljivanja materijala", TipToastNotifikacije.Greska);
            } finally {
                if(statusVerifikacije.verifikovan){
                    prikaziToastNotifikaciju("Materijal je uspešno objavljen", TipToastNotifikacije.Info);
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
                                    izabraneInformacije.izabranaAkademskaGodina
                                }
                                podesiSelektovaneOpcije={(vrednost) => {
                                    azurirajPoljeIzabraneInformacije(
                                        "izabranaAkademskaGodina",
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
                                    value={unetaMailAdresa}
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
                <div className="flex justify-end">
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
