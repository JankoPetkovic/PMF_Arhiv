import { useEffect, useState } from "react";
import Logo from "./Logo";
import { FaRegUserCircle } from "react-icons/fa";
import { MdVerified, MdLogout  } from "react-icons/md";
import Dialog from "../Dialog";
import ObjavaMaterijala from "../../Stranice/ObjavaMaterijala";
import { FaUpload, FaGoogleDrive } from "react-icons/fa";
import { Tooltip } from "@mui/material";
import { BiSupport } from "react-icons/bi";
import VerifikacijaDialog from "../VerifikacijaDialog"
import PrijaviProblem from "./PrijaviProblem";
import PrijaviSe from "../PrijaviSe";
import ZaboravljenaSifra from "../ZaboravljenaSifra";
import { router, usePage } from '@inertiajs/react';
import Registracija from "../../Stranice/Registracija";
import { prikaziToastNotifikaciju } from "../../PomocniAlati/ToastNotifikacijaServis";
import TipToastNotifikacije from "../../PomocniAlati/TipToastNotifikacije";


export default function Navbar()
{   
    const [prikaziDialogDodavanja, podesiPrikazDialogaDodavanja] = useState(false);
    const [prikazDialogaVerifikacije, podesiPrikazDialogaVerifikacije] = useState(false);
    const [prikazDialogaPodrske, podesiPrikazDialogaPodrske] = useState(false);
    const [prikazDialogaPrijave, podesiPrikazDialogaPrijave] = useState(false);
    const [prikazDialogaRegistracije, podesiPrikazDialogaRegistracije] = useState(false);
    const [ekranPrijave, podesiEkranPrijave] = useState('prijava'); // 'prijava' | 'reset-sifre'
    const { ulogovanKorisnik } = usePage().props;
    const { url } = usePage();
    const naKorisnickojStranici = /^\/korisnik\/\d+$/.test(url);

    const obradiKlikProfila = () => {
        if(ulogovanKorisnik){
            router.visit("/korisnik/" + ulogovanKorisnik.korisnik_id)
        } else {
            podesiPrikazDialogaPrijave(true)
        }
    }

    const odjaviKorisnika = async() => {
        try {
            await axios.post("/odjava", {}, { withCredentials: true });
            prikaziToastNotifikaciju("Uspešno ste se odjavili", TipToastNotifikacije.Uspesno);
            router.visit("/");
        } catch (error) {
            console.error(error);
            prikaziToastNotifikaciju("Greška pri odjavi", TipToastNotifikacije.Greska);
        }
    }

    const otvoriRegistraciju = () => {
        podesiPrikazDialogaPrijave(false);
        podesiPrikazDialogaRegistracije(true);
    };

    const otvoriResetSifre = () => {
        podesiEkranPrijave('reset-sifre');
    };

    const vratiNaPrijavu = () => {
        podesiEkranPrijave('prijava');
    };

    const zatvoriDialogPrijave = (vrednost) => {
        podesiPrikazDialogaPrijave(vrednost);
        if (!vrednost) podesiEkranPrijave('prijava');
    };

    return(
        <div className="bg-zinc-200 flex justify-between items-center">
            <div className="w-30 ml-5">
                <Logo/>
            </div>

            <div className="flex flex-row justify-end items-center gap-2 mr-5">
                {ulogovanKorisnik && (
                    ulogovanKorisnik?.status_verifikacije?.verifikovan ?
                    (
                        <Tooltip title="Objavi materijal" arrow>
                            <div
                                className='border-2 rounded-lg p-2 border-emerald-500 cursor-pointer hover:scale-110 transition-transform duration-200'
                                onClick={() => podesiPrikazDialogaDodavanja(true)}
                            >
                                <FaUpload className='text-emerald-500' size={30} />
                            </div>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Verifikacija potrebna" arrow>
                            <div
                                className='border-2 rounded-lg p-2 border-gray-500 cursor-pointer hover:scale-110 transition-transform duration-200'
                                onClick={() => prikaziToastNotifikaciju("Za objavu materijala je potrebana verifikacija. Posetite Vaš profil.", TipToastNotifikacije.Info)}
                            >
                                <FaUpload className='text-gray-500' size={30} />
                            </div>
                        </Tooltip>
                        )
                )}

                {ulogovanKorisnik?.uloga === 'Admin' && (
                    <Tooltip title="Drive import" arrow>
                        <div
                            className='border-2 rounded-lg p-2 border-purple-500 cursor-pointer hover:scale-110 transition-transform duration-200'
                            onClick={() => router.visit('/admin/import-drive')}
                        >
                            <FaGoogleDrive className='text-purple-500' size={30} />
                        </div>
                    </Tooltip>
                )}

                <Tooltip title="Podrška" arrow>
                    <div
                        className='border-2 rounded-lg p-2 border-red-500 cursor-pointer hover:scale-110 transition-transform duration-200'
                        onClick={() => podesiPrikazDialogaPodrske(true)}
                    >
                        <BiSupport className='text-red-500' size={30} />
                    </div>
                </Tooltip>

                {/* <Tooltip title="Verifikacija" arrow>
                    <div
                        className='border-2 rounded-lg p-2 border-yellow-500 cursor-pointer hover:scale-110 transition-transform duration-200'
                        onClick={() => podesiPrikazDialogaVerifikacije(true)}
                    >
                        <MdVerified className='text-yellow-500' size={30} />
                    </div>
                </Tooltip> */}

                {!naKorisnickojStranici && (
                    <Tooltip title={ulogovanKorisnik ? "Korisnički profil" : "Prijavi se"} arrow>
                        <div
                            className='border-2 rounded-lg p-2 border-blue-500 cursor-pointer hover:scale-110 transition-transform duration-200'
                            onClick={obradiKlikProfila}
                        >
                            <FaRegUserCircle className='text-blue-500' size={30} />
                        </div>
                    </Tooltip>
                )}

                {naKorisnickojStranici && ulogovanKorisnik && (
                    <Tooltip title="Odjavi se" arrow>
                        <div
                            className='border-2 rounded-lg p-2 border-blue-500 cursor-pointer hover:scale-110 transition-transform duration-200'
                            onClick={odjaviKorisnika}
                        >
                            <MdLogout className='text-blue-500' size={30} />
                        </div>
                    </Tooltip>
                )}
            </div>

            <Dialog naslov={'Objavi Materijal'} prikaziDialog={prikaziDialogDodavanja} podesiPrikaziDialog={podesiPrikazDialogaDodavanja} sadrzaj={<ObjavaMaterijala podesiPrikazDialoga={podesiPrikazDialogaDodavanja}/>}/>
            <Dialog naslov={'Verifikacija'} prikaziDialog={prikazDialogaVerifikacije} podesiPrikaziDialog={podesiPrikazDialogaVerifikacije} sadrzaj={<VerifikacijaDialog podesiPrikazDialoga={podesiPrikazDialogaVerifikacije}/>}/>
            <Dialog naslov={'Podrška'} prikaziDialog={prikazDialogaPodrske} podesiPrikaziDialog={podesiPrikazDialogaPodrske} sadrzaj={<PrijaviProblem podesiPrikazDialoga={podesiPrikazDialogaPodrske}/>}/>
            <Dialog
                naslov={ekranPrijave === 'reset-sifre' ? 'Zaboravljena šifra' : 'Prijavi se'}
                prikaziDialog={prikazDialogaPrijave}
                podesiPrikaziDialog={zatvoriDialogPrijave}
                sadrzaj={
                    ekranPrijave === 'reset-sifre'
                        ? <ZaboravljenaSifra nazad={vratiNaPrijavu} podesiPrikaziDialog={zatvoriDialogPrijave} />
                        : <PrijaviSe
                            prikaziDialog={prikazDialogaPrijave}
                            podesiPrikaziDialog={zatvoriDialogPrijave}
                            otvoriRegistraciju={otvoriRegistraciju}
                            otvoriResetSifre={otvoriResetSifre}
                          />
                }
            />
            <Dialog naslov="Registracija" prikaziDialog={prikazDialogaRegistracije} podesiPrikaziDialog={podesiPrikazDialogaRegistracije} sadrzaj={<Registracija podesiPrikaziDialog={podesiPrikazDialogaRegistracije}/>}/>
        </div>
    )
}