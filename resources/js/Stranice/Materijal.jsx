import { useState, useEffect, useRef } from 'react';
import Navbar from "../Komponente/Alati/Navbar";
import CustomSelect from '../Komponente/Alati/CustomSelect';
import ServisMaterijala from '../PomocniAlati/Servisi/ServisMaterijala';
import { generisiSkolskeGodine } from '../PomocniAlati/SkolskeGodine';
import ServisPodtipovaMaterijala from '../PomocniAlati/Servisi/ServisPodtipovaMaterijala';
import PrikazMaterijala from '../Komponente/PrikazMaterijala';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Drawer from '@mui/material/Drawer';
import { IoMdOptions } from "react-icons/io";
import { Tooltip, CircularProgress  } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { UploadCloudIcon } from 'lucide-react';

export default function Materijal({predmeti, smer, tipoviMaterijala}) {

    const dostupneSkolskeGodine = generisiSkolskeGodine();

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

    useEffect(() => {
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

        if (zaustaviPrviRenderMaterijal.current) {
            zaustaviPrviRenderMaterijal.current = false;
            return;
        }

        preuzmiMaterijale();
    }, [izabraneInformacije]);

    return(
        <div>
            <div className="absolute inset-0 bg-cover bg-center blur-sm opacity-60 z-0" style={{
                    backgroundImage: `url('/storage/images/${smer.departman.toLowerCase().replace(/\s+/g, '_')}.jpg')`,
                }}
                ></div>
            <div  className="relative z-10">
                <Navbar/>
                <div className='flex-col flex ml-5 mt-10 gap-6'>
                    <h1 className='font-bold text-xl'>    
                        {smer.naziv_smera}
                    </h1>
                    <div className="w-[90vw] flex items-center gap-2 overflow-hidden">
                        <div className="flex-1 min-w-0 ">
                            <Tabs
                                value={izabraneInformacije.izabranPredmet}
                                onChange={(dogadjaj, predmet) =>
                                    azurirajPoljeIzabraneInformacije('izabranPredmet', predmet)
                                }
                                textColor="secondary"
                                indicatorColor="secondary"
                                variant="scrollable"
                                scrollButtons="auto"
                                allowScrollButtonsMobile
                                sx={{
                                    minHeight: 5,
                                    '& .MuiTabs-scroller': {
                                    paddingLeft: '12px',
                                    },
                                    '& .MuiTabs-indicator': {
                                    backgroundColor: '#ff0000',
                                    height: '2px',
                                    },
                                }}
                            >
                            <Tab
                                label="Svi predmeti"
                                value={0}
                                sx={{
                                color: 'black',
                                '&.Mui-selected': {
                                    color: '#ff0000',
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
                            {dostupneInformacije.dostupniPredmeti.map((p) => (
                                <Tab
                                key={p.predmet_id}
                                value={p.predmet_id}
                                label={p.naziv}
                                sx={{
                                    color: 'black',
                                    '&.Mui-selected': {
                                    color: '#ff0000',
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
                            ))}
                            </Tabs>
                        </div>
                        <div className="flex-shrink-0 pl-1 hover:scale-105 transition-transform duration-200 ">
                            <Tooltip title={'Filteri i sortiranje'}>
                                <IoMdOptions size={24} onClick={()=>{podesiFIltere(true)}} />
                            </Tooltip>
                        </div>
                    </div>
                    {ucitavanje ? (
                        <div className="flex justify-center items-center w-full mt-30">
                            <CircularProgress color="error" size={80}/>
                        </div>
                        ) : (
                        <div className="flex">
                            <div className="p-4 w-full">
                            <PrikazMaterijala
                                key={izabraneInformacije.izabranPredmet.predmet_id}
                                materijali={dostupneInformacije.dostupniMaterijali}
                                predmeti={true}
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
                        </div>
                    )}
                </div>
                <Drawer open={filteri} onClose={()=>{podesiFIltere(false)}} anchor='right'>
                    <div className="flex flex-col gap-6 m-5 rounded-sm p-4 w-68">
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