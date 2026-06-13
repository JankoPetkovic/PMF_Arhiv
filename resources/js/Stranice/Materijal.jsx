import { useState, useEffect, useRef, useMemo } from 'react';
import Navbar from "../Komponente/Alati/Navbar";
import CustomSelect from '../Komponente/Alati/CustomSelect';
import ServisMaterijala from '../PomocniAlati/Servisi/ServisMaterijala';
import { generisiSkolskeGodine } from '../PomocniAlati/SkolskeGodine';
import ServisPodtipovaMaterijala from '../PomocniAlati/Servisi/ServisPodtipovaMaterijala';
import PrikazMaterijala from '../Komponente/PrikazMaterijala';
import { koristiGlobalniKontekst } from '../Konteksti';
import { pretplatiSeNaPromenuMaterijala } from '../PomocniAlati/dogadjajiMaterijala';
import Drawer from '@mui/material/Drawer';
import { IoMdOptions } from "react-icons/io";
import { Tooltip, CircularProgress, Badge } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { FaTimes } from "react-icons/fa";

// Sentinel opcija za "Svi predmeti" – koristi se u pretraživom selectu predmeta.
const SVI_PREDMETI = { predmet_id: 0, naziv: 'Svi predmeti' };

export default function Materijal({predmeti, smer, tipoviMaterijala}) {

    const { podesiPodatke } = koristiGlobalniKontekst();

    const dostupneSkolskeGodine = generisiSkolskeGodine();

    // Napuni globalni kontekst tipovima materijala da dijalog izmene
    // (DialogIzmenaMaterijala) ima opcije za tip/podtip i kad se uđe direktno
    // na stranicu smera (bez prethodne posete početnoj strani).
    useEffect(() => {
        podesiPodatke(prethodni => ({
            ...prethodni,
            dostupniTipoviMaterijala: tipoviMaterijala,
        }));
    }, [tipoviMaterijala]);

    const[filteri, podesiFIltere] = useState(false)

    const [izabraneInformacije, podesiIzabraneInformacije] = useState({
        izabranPredmet: 0,
        izabranaGodina: {naziv: "1.godina", vrednost: 1},
        izabraniTipMaterijala: '',
        izabraniPodTipMaterijala: '',
        izabranaSkolskaGodina: '',
        izabranaOpcijaSortiranja: {naziv: 'Datum opadajuće', vrednost: 'Datum opadajuće', kolonaSortiranja:'datum_dodavanja', pravacSortiranja:'desc'},
        izabranaStranica: 0,
        izabranBrMaterijalaPoStranici: 10,
    })

    const [dostupneInformacije, podesiDostupneInformacije] = useState({
        dostupniPredmeti: predmeti.filter(objekat => objekat.godina === izabraneInformacije.izabranaGodina.vrednost),
        dostupanSmer: smer,
        dostupniTipoviMaterijala: tipoviMaterijala,
        dostupniPodTipoviMaterijala: '',
        dostupniMaterijali: '',
        dostupneGodine: '',
        dostupneSkolskeGodine: dostupneSkolskeGodine,
        dostupneOpcijeSortiranja: [
            {naziv: 'Datum rastuće', vrednost: 1, kolonaSortiranja:'datum_dodavanja', pravacSortiranja:'asc'},
            {naziv: 'Datum opadajuće', vrednost: 2, kolonaSortiranja:'datum_dodavanja', pravacSortiranja:'desc'},
            {naziv: 'Naziv rastuće', vrednost: 3, kolonaSortiranja:'naziv', pravacSortiranja:'asc'},
            {naziv: 'Naziv opadajuće', vrednost: 4, kolonaSortiranja:'naziv', pravacSortiranja:'desc'}],
        brDostupnihMaterijala: 10,
    })

    const [zakljucajPodTipoveMaterijala, podesiZakljucavanjePodMaterijala] = useState(true)
    const [ucitavanje, podesiUcitavanje] = useState(false);

    const zaustaviPrviRenderTipovi = useRef(true);
    const zaustaviPrviRenderPodTipovi = useRef(true);
    const zaustaviPrviRenderMaterijal = useRef(true);

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

    const obradiPromenuBrMaterijalaPoStranici = (dogadjaj) => {
        azurirajPoljeIzabraneInformacije("izabranBrMaterijalaPoStranici", parseInt(dogadjaj.target.value, 10));
        azurirajPoljeIzabraneInformacije("izabranaStranica", 0);
    }

    useEffect(()=>{
        if(smer.nivo_studija_id === 2){
            azurirajPoljeDostupneInformacije("dostupneGodine",[
                {naziv: "1.godina", vrednost: 1},
                {naziv: "2.godina", vrednost: 2}
            ])
        }else{
           azurirajPoljeDostupneInformacije("dostupneGodine",[
                {naziv: "1.godina", vrednost: 1},
                {naziv: "2.godina", vrednost: 2},
                {naziv: "3.godina", vrednost: 3}
            ])
        }
    }, [])

    useEffect(()=>{
        azurirajPoljeIzabraneInformacije('izabranPredmet', 0);
        azurirajPoljeDostupneInformacije('dostupniPredmeti',predmeti.filter(objekat => objekat.godina === izabraneInformacije.izabranaGodina.vrednost))
    }, [izabraneInformacije.izabranaGodina])

    useEffect(()=>{
        if(zaustaviPrviRenderTipovi.current){
            zaustaviPrviRenderTipovi.current = false
            return
        }
        if(!izabraneInformacije.izabraniPodTipMaterijala){
            podesiZakljucavanjePodMaterijala(true)
        }
        async function prezumiPodTipoveMaterijala(){
            const filteri = {
                tip_materijala_id: izabraneInformacije.izabraniTipMaterijala.tip_materijala_id
            }

            const dostupniPodTipoviMaterijala = await ServisPodtipovaMaterijala.vratiPodTipoveMaterijala(filteri);
            azurirajPoljeDostupneInformacije('dostupniPodTipoviMaterijala', dostupniPodTipoviMaterijala)
        }
        prezumiPodTipoveMaterijala()
        azurirajPoljeIzabraneInformacije('izabraniPodTipMaterijala', '')
    }, [izabraneInformacije.izabraniTipMaterijala])

    useEffect(()=>{
        if(zaustaviPrviRenderPodTipovi.current){
            zaustaviPrviRenderPodTipovi.current = false
            return
        }
        if(dostupneInformacije.dostupniPodTipoviMaterijala && dostupneInformacije.dostupniPodTipoviMaterijala.length > 0){
            podesiZakljucavanjePodMaterijala(false)
        }
    }, [dostupneInformacije.dostupniPodTipoviMaterijala])

    async function preuzmiMaterijale() {
        const url = window.location.pathname.split('/');

        let filteri = {
            predmet_id: izabraneInformacije.izabranPredmet,
            podtip_materijala_id: izabraneInformacije.izabraniPodTipMaterijala,
            smer_id: url[url.length - 1],
            godina: izabraneInformacije.izabranaGodina.vrednost,
            tip_materijala_id: izabraneInformacije.izabraniTipMaterijala.tip_materijala_id,
            skolska_godina: izabraneInformacije.izabranaSkolskaGodina.naziv,
            kolonaSortiranja: izabraneInformacije.izabranaOpcijaSortiranja.kolonaSortiranja,
            pravacSortiranja: izabraneInformacije.izabranaOpcijaSortiranja.pravacSortiranja,
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

    useEffect(() => {
        if (zaustaviPrviRenderMaterijal.current) {
            zaustaviPrviRenderMaterijal.current = false;
            return;
        }

        preuzmiMaterijale();
    }, [izabraneInformacije]);

    // Osveži listu kad se materijal doda/izmeni/obriše bilo gde u aplikaciji.
    useEffect(() => {
        return pretplatiSeNaPromenuMaterijala(() => preuzmiMaterijale());
    }, [izabraneInformacije]);

    // Osveži listu kad se materijal doda/izmeni/obriše bilo gde u aplikaciji.
    useEffect(() => {
        return pretplatiSeNaPromenuMaterijala(() => preuzmiMaterijale());
    }, [izabraneInformacije]);

    // Opcije za pretraživi select predmeta (uvek sa "Svi predmeti" na vrhu).
    const opcijePredmeta = useMemo(() => {
        const lista = Array.isArray(dostupneInformacije.dostupniPredmeti)
            ? dostupneInformacije.dostupniPredmeti
            : [];
        return [SVI_PREDMETI, ...lista];
    }, [dostupneInformacije.dostupniPredmeti]);

    // Trenutno izabrani predmet kao objekat (za kontrolu CustomSelect-a).
    const izabranPredmetObjekat = useMemo(() => {
        if (!izabraneInformacije.izabranPredmet) return SVI_PREDMETI;
        return (
            opcijePredmeta.find(
                (p) => p.predmet_id === izabraneInformacije.izabranPredmet
            ) || SVI_PREDMETI
        );
    }, [opcijePredmeta, izabraneInformacije.izabranPredmet]);

    // Broj aktivnih filtera (za indikator na ikonici i dugme za reset).
    const brojAktivnihFiltera = useMemo(() => {
        let broj = 0;
        if (izabraneInformacije.izabranaSkolskaGodina) broj++;
        if (izabraneInformacije.izabraniTipMaterijala) broj++;
        if (izabraneInformacije.izabraniPodTipMaterijala) broj++;
        if (izabraneInformacije.izabranaOpcijaSortiranja?.kolonaSortiranja !== 'datum_dodavanja'
            || izabraneInformacije.izabranaOpcijaSortiranja?.pravacSortiranja !== 'desc') broj++;
        return broj;
    }, [
        izabraneInformacije.izabranaSkolskaGodina,
        izabraneInformacije.izabraniTipMaterijala,
        izabraneInformacije.izabraniPodTipMaterijala,
        izabraneInformacije.izabranaOpcijaSortiranja,
    ]);

    const resetujFiltere = () => {
        podesiIzabraneInformacije((prosli) => ({
            ...prosli,
            izabraniTipMaterijala: '',
            izabraniPodTipMaterijala: '',
            izabranaSkolskaGodina: '',
            izabranaOpcijaSortiranja: {naziv: 'Datum opadajuće', vrednost: 'Datum opadajuće', kolonaSortiranja:'datum_dodavanja', pravacSortiranja:'desc'},
            izabranaStranica: 0,
        }));
        podesiZakljucavanjePodMaterijala(true);
    };

    const izaberiPredmet = (vrednost) => {
        const predmetId = vrednost && vrednost.predmet_id ? vrednost.predmet_id : 0;
        azurirajPoljeIzabraneInformacije('izabranPredmet', predmetId);
        azurirajPoljeIzabraneInformacije('izabranaStranica', 0);
    };

    const nemaMaterijala =
        !ucitavanje &&
        Array.isArray(dostupneInformacije.dostupniMaterijali) &&
        dostupneInformacije.dostupniMaterijali.length === 0;

    return(
        <div>
            <div className="absolute inset-0 bg-cover bg-center blur-sm opacity-60 z-0" style={{
                    backgroundImage: `url('/storage/images/${smer.departman.toLowerCase().replace(/\s+/g, '_')}.jpg')`,
                }}
                ></div>
            <div  className="relative z-10">
                <Navbar/>
                <div className='flex-col flex px-4 sm:px-5 mt-10 gap-6'>
                    <h1 className='font-bold text-lg sm:text-xl'>
                        {smer.naziv_smera}
                    </h1>

                    {/* Traka za izbor predmeta: pretraživi select + godina + filteri */}
                    <div className="w-full max-w-[90vw] flex flex-col lg:flex-row lg:items-center gap-3 bg-white/70 backdrop-blur-sm rounded-xl shadow-card p-3">
                        <div className="flex-1 min-w-0 flex flex-col sm:flex-row gap-3">
                            <CustomSelect
                                klase={"w-full sm:w-80"}
                                labela={"Pretraži / izaberi predmet"}
                                opcije={opcijePredmeta}
                                vrednost={izabranPredmetObjekat}
                                podesiSelektovaneOpcije={izaberiPredmet}
                            />
                            <CustomSelect
                                klase={"w-full sm:w-44"}
                                labela={"Godina studija"}
                                opcije={dostupneInformacije.dostupneGodine || []}
                                vrednost={izabraneInformacije.izabranaGodina}
                                podesiSelektovaneOpcije={(vrednost) => {
                                    if (!vrednost) return;
                                    azurirajPoljeIzabraneInformacije("izabranaGodina", vrednost);
                                }}
                            />
                        </div>

                        <div className="flex items-center gap-3 self-start lg:self-auto">
                            {izabraneInformacije.izabranPredmet !== 0 && (
                                <button
                                    type="button"
                                    onClick={() => izaberiPredmet(SVI_PREDMETI)}
                                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                                >
                                    <FaTimes size={12} /> Svi predmeti
                                </button>
                            )}
                            <Tooltip title={'Filteri i sortiranje'}>
                                <span className="flex-shrink-0 p-1.5 rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer">
                                    <Badge
                                        badgeContent={brojAktivnihFiltera}
                                        color="error"
                                        overlap="circular"
                                    >
                                        <IoMdOptions size={24} onClick={()=>{podesiFIltere(true)}} />
                                    </Badge>
                                </span>
                            </Tooltip>
                        </div>
                    </div>

                    {ucitavanje ? (
                        <div className="flex flex-col justify-center items-center w-full mt-20 gap-4">
                            <CircularProgress color="error" size={70}/>
                            <span className="text-sm text-gray-600 font-medium bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full">
                                Učitavanje materijala...
                            </span>
                        </div>
                        ) : (
                        <div className="flex">
                            <div className="p-2 sm:p-4 w-full">
                            {nemaMaterijala ? (
                                <div className="flex flex-col items-center justify-center gap-4 w-full mt-16 mb-16 text-center">
                                    <span className="text-gray-600 italic bg-white/70 backdrop-blur-sm px-4 py-2 rounded-lg">
                                        Nema materijala za izabrane filtere.
                                    </span>
                                    {(brojAktivnihFiltera > 0 || izabraneInformacije.izabranPredmet !== 0) && (
                                        <button
                                            type="button"
                                            onClick={() => { resetujFiltere(); izaberiPredmet(SVI_PREDMETI); }}
                                            className="text-sm font-semibold px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors cursor-pointer"
                                        >
                                            Poništi filtere
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <PrikazMaterijala
                                        key={izabraneInformacije.izabranPredmet}
                                        materijali={dostupneInformacije.dostupniMaterijali}
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
                                </>
                            )}
                            </div>
                        </div>
                    )}
                </div>
                <Drawer open={filteri} onClose={()=>{podesiFIltere(false)}} anchor='right'>
                    <div className="flex flex-col gap-6 m-5 rounded-sm p-4 w-68">
                        <div className="flex items-center justify-between">
                            <span className="font-bold">Filteri i sortiranje</span>
                            {brojAktivnihFiltera > 0 && (
                                <button
                                    type="button"
                                    onClick={resetujFiltere}
                                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                                >
                                    <FaTimes size={12} /> Poništi ({brojAktivnihFiltera})
                                </button>
                            )}
                        </div>
                        Sortiranje:
                        <div className='flex gap-6 items-center'>
                            <CustomSelect
                                klase={"w-64"}
                                labela={"Izaberite kolonu za sortiranje"}
                                opcije={dostupneInformacije.dostupneOpcijeSortiranja}
                                vrednost={izabraneInformacije.izabranaOpcijaSortiranja}
                                podesiSelektovaneOpcije = {(vrednost)=>{
                                    azurirajPoljeIzabraneInformacije("izabranaOpcijaSortiranja", vrednost)
                                }}
                            />
                        </div>
                        Filteri:
                        <CustomSelect
                            klase={"w-64"}
                            labela={"Izaberite školsku godinu"}
                            opcije={dostupneInformacije.dostupneSkolskeGodine}
                            vrednost={izabraneInformacije.izabranaSkolskaGodina}
                            podesiSelektovaneOpcije = {(vrednost)=>{
                                azurirajPoljeIzabraneInformacije("izabranaSkolskaGodina", vrednost)
                            }}
                        />
                        <CustomSelect
                            klase={"w-64"}
                            labela={"Izaberite godinu"}
                            opcije={dostupneInformacije.dostupneGodine}
                            vrednost={izabraneInformacije.izabranaGodina}
                            podesiSelektovaneOpcije = {(vrednost)=>{
                                azurirajPoljeIzabraneInformacije("izabranaGodina", vrednost)
                            }}
                        />
                        <CustomSelect
                            klase={"w-64"}
                            labela={"Izaberite tip materijala"}
                            opcije={dostupneInformacije.dostupniTipoviMaterijala}
                            vrednost={izabraneInformacije.izabraniTipMaterijala}
                            podesiSelektovaneOpcije = {(vrednost)=>{
                                azurirajPoljeIzabraneInformacije("izabraniTipMaterijala", vrednost)
                            }}
                            viseOpcija={false}
                        />
                        <CustomSelect
                            klase={"w-64"}
                            labela={"Izaberite podtip materijala"}
                            opcije={dostupneInformacije.dostupniPodTipoviMaterijala}
                            vrednost={izabraneInformacije.izabraniPodTipMaterijala}
                            podesiSelektovaneOpcije = {(vrednost)=>{
                                azurirajPoljeIzabraneInformacije("izabraniPodTipMaterijala", vrednost)
                            }}
                            zakljucana ={zakljucajPodTipoveMaterijala}
                            tooltipTekst='Izaberite podtip materijala'
                        />
                    </div>
                </Drawer>
            </div>
        </div>
    )
}
