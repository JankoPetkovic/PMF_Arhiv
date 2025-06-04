import { generisiSkolskeGodine } from "../PomocniAlati/SkolskeGodine";
import CustomSelect from "../Komponente/Alati/CustomSelect";
import FajlUploader from "../Komponente/Alati/FajlUploader";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Tooltip } from "@mui/material";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoCloudUpload } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { CiCircleInfo } from "react-icons/ci";
export default function ObjavaMaterijala() {
    const dostupneSkolskeGodine = generisiSkolskeGodine();

    const zaustaviPrviRender = useRef(false);

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
    const [validnaMejlAdresa, podesiValidnuMejlAdresu] = useState("");

    const [zakljucaniSelectPredmeta, podesiZakljucaniSelectPredmeta] =
        useState(true);
    const [zakljucaniSelectSmerova, podesiZakljucaniSelectSmerova] =
        useState(true);
    const [
        zakljucaniSelectPodTipaMaterijala,
        podesiZakljucaniSelectPodTipaMaterijala,
    ] = useState(true);

    const [korak, podesiKorak] = useState(1);
    const ukupanBrKoraka = 4;

    const azurirajPoljeDostupneInformacije = (nazivPolja, vrednost) => {
        podesiDostupneInformacije((prosli) => ({
            ...prosli,
            [nazivPolja]: vrednost,
        }));
    };

    const azurirajPoljeIzabraneInformacije = (nazivPolja, vrednost) => {
        podesiIzabraneInformacije((prosli) => ({
            ...prosli,
            [nazivPolja]: vrednost,
        }));
    };

    useEffect(() => {
        const getPocetneInformacije = async () => {
            const response = await axios
                .get("/objavi-materijal")
                .then((response) => {
                    azurirajPoljeDostupneInformacije(
                        "dostupniDepartmani",
                        response.data.dostupniDepartmani
                    );
                    azurirajPoljeDostupneInformacije(
                        "dostupniNivoiStudija",
                        response.data.dostupniNivoiStudija
                    );
                    azurirajPoljeDostupneInformacije(
                        "dostupniTipoviMaterijala",
                        response.data.dostupniTipoviMaterijala
                    );
                });
        };
        getPocetneInformacije();
    }, []);

    useEffect(() => {
        azurirajPoljeDostupneInformacije("dostupniSmerovi", '');
        azurirajPoljeDostupneInformacije("dostupneGodine", '');

        azurirajPoljeIzabraneInformacije("izabraniSmer", '')
        azurirajPoljeIzabraneInformacije("izabranaGodina", '')
        if (
            izabraneInformacije.izabraniDepartman &&
            izabraneInformacije.izabraniNivoStudija
        ) {
            podesiZakljucaniSelectSmerova(false);
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

            const response = axios
                .post("/get-smerovi", {
                    departman: izabraneInformacije.izabraniDepartman,
                    nivoStudija: izabraneInformacije.izabraniNivoStudija,
                })
                .then((response) => {
                    azurirajPoljeDostupneInformacije(
                        "dostupniSmerovi",
                        response.data
                    );
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
        if (
            izabraneInformacije.izabraniSmer &&
            izabraneInformacije.izabranaGodina
        ) {
            const response = axios
                .post("/get-predmeti", {
                    smerID: izabraneInformacije.izabraniSmer,
                    godina: izabraneInformacije.izabranaGodina,
                })
                .then((response) => {
                    azurirajPoljeDostupneInformacije(
                        "dostupniPredmeti",
                        response.data
                    );
                    podesiZakljucaniSelectPredmeta(false);
                });
        }
    }, [izabraneInformacije.izabraniSmer, izabraneInformacije.izabranaGodina]);

    useEffect(() => {
        azurirajPoljeDostupneInformacije("dostupniPodTipoviMaterijala", '');
        if (izabraneInformacije.izabraniTipMaterijala) {
            const response = axios
                .post("/get-podTipovi", {
                    tipMaterijala: izabraneInformacije.izabraniTipMaterijala,
                })
                .then((response) => {
                    azurirajPoljeDostupneInformacije(
                        "dostupniPodTipoviMaterijala",
                        response.data
                    );
                    podesiZakljucaniSelectPodTipaMaterijala(false);
                });
        }
    }, [izabraneInformacije.izabraniTipMaterijala]);

    const obradiMejlAdresu = () => {
        const validanMejl = /^[\w.-]+@pmf\.edu\.rs$/i.test(unetaMailAdresa);
        if (!validanMejl) {
            alert("Mejl nije validan");
            podesiValidnuMejlAdresu(false);
        } else {
            podesiValidnuMejlAdresu(unetaMailAdresa);
        }
    };

    const obradiKrajForme = () => {
        console.log(izabraneInformacije);
        obradiMejlAdresu();
        if (
            validnaMejlAdresa &&
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
            podaciForme.append("podTipMaterijala",JSON.stringify(izabraneInformacije.izabraniPodTipMaterijala));
            podaciForme.append("akademskaGodina", izabraneInformacije.izabranaAkademskaGodina.naziv);
            podaciForme.append("korisnickiMejl", validnaMejlAdresa);
            podaciForme.append("fajl", izabraneInformacije.izabraniFajl);

            
            
            const response = axios.post("/kreiraj-materijal", podaciForme);
        }
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
                                obaveznoPolje={true}
                                labela={"Izaberi Departman"}
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
                                zakljucana={zakljucaniSelectSmerova}
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
                                zakljucana={zakljucaniSelectSmerova}
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
                                zakljucana={zakljucaniSelectPredmeta}
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
                                zakljucana={zakljucaniSelectPodTipaMaterijala}
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
                                <label htmlFor="email">
                                    Unesite PMF mail adresu:
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={unetaMailAdresa}
                                    onChange={(e) => {
                                        podesiUnetuMailAdresu(e.target.value);
                                    }}
                                    className="border border-gray-400 rounded p-2 w-60"
                                    placeholder="ime.prezime@pmf.edu.rs"
                                />
                                <Tooltip
                                    title={
                                        "Objavljivanje materijala je moguće samo nakon verifikacije"
                                    }
                                >
                                    <CiCircleInfo size={28} />
                                </Tooltip>
                            </div>
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
                                    <label htmlFor=""> Ime fajla:</label>
                                    <Tooltip
                                        title={"Izmeni ime materijala"}
                                        arrow
                                    >
                                        <input
                                            type="text"
                                            value={
                                                izabraneInformacije.izabraniFajl
                                                    .name
                                            }
                                            className="border border-gray-400 p-2 rounded-sm"
                                            onChange={(e) =>
                                                azurirajPoljeIzabraneInformacije(
                                                    "izabraniFajl",
                                                    (prosli) => ({
                                                        ...prosli,
                                                        name: e.target.value,
                                                    })
                                                )
                                            }
                                        />
                                    </Tooltip>
                                    {/* <p>Izabrani fajl: <strong>{izabraniFajl.name}</strong></p>
                                    <p>Veličina: {formatirajVelicinu(izabraniFajl.size)}</p> */}
                                </div>
                            )}
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
