import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Checkbox from "../Komponente/Alati/Checkbox";
import Navbar from "../Komponente/Alati/Navbar";
import Radio from "../Komponente/Alati/Radio";
import KarticePredmeta from '../Komponente/KarticePredmeta';
import CustomSelect from '../Komponente/Alati/CustomSelect';


export default function Materijal({predmeti, smer, tipovi_materijala})
{
    const [dostupneGodine, podesiDostupneGodine] = useState('');
    const [dostupniPodTipoviMaterijala, podesiDostupnePodTipoveMaterijala] = useState('');
    
    const [dostupniMaterijali, podesiDostupneMaterijale] = useState([]);

    const [izabranaGodina, podesiIzabranuGodinu] = useState({naziv: "1.godina", vrednost: 1});
    const [dostupniPredmeti, podesiDostupnePredmete] = useState(predmeti.filter(objekat => objekat.godina === izabranaGodina.vrednost))

    const [izabraniPredmeti, podesiIzabranePredmete] = useState('');
    const [izabraniTipoviMaterijala, podesiIzabraneTipoveMaterijala] = useState('');
    const [izabraniPodTipoviMaterijala, podesiIzabranePodTipoveMaterijala] = useState('');

    const [zakljucajPodTipoveMaterijala, podesiZakljucavanjePodMaterijala] = useState(true)

    const zaustaviPrviRenderTipovi = useRef(true);
    const zaustaviPrviRenderPodTipovi = useRef(true);
    const zaustaviPrviRenderMaterijal = useRef(true);

    useEffect(()=>{
        if(smer.nivo_studija_id === 2){
            podesiDostupneGodine([
                {naziv: "1.godina", vrednost: 1},
                {naziv: "2.godina", vrednost: 2}
            ])
        }else{
           podesiDostupneGodine([
                {naziv: "1.godina", vrednost: 1},
                {naziv: "2.godina", vrednost: 2},
                {naziv: "3.godina", vrednost: 3}
            ]) 
        }
    }, [])

    useEffect(()=>{
        podesiIzabranePredmete('');
        podesiDostupnePredmete(predmeti.filter(objekat => objekat.godina === izabranaGodina.vrednost))
    }, [izabranaGodina])

    useEffect(()=>{
        if(zaustaviPrviRenderTipovi.current){
            zaustaviPrviRenderTipovi.current = false
            return
        }
        if(!izabraniPodTipoviMaterijala){
            podesiZakljucavanjePodMaterijala(true)
        }
        async function prezumiPodTipoveMaterijala(){
            try{
                const odgovor = await axios.post('/get-podTipovi',{
                    tipMaterijala: izabraniTipoviMaterijala
                }).then((odgovor)=>{
                    podesiDostupnePodTipoveMaterijala(odgovor.data)
                })
            } catch(greska){
                console.error('Greška prilikom slanja zahteva:', greska);
            }
        }
        prezumiPodTipoveMaterijala()
        podesiIzabranePodTipoveMaterijala('');
    }, [izabraniTipoviMaterijala])

    useEffect(()=>{
        if(zaustaviPrviRenderPodTipovi.current){
            zaustaviPrviRenderPodTipovi.current = false
            return
        }
        if(dostupniPodTipoviMaterijala && dostupniPodTipoviMaterijala.length > 0){
            podesiZakljucavanjePodMaterijala(false)
        }
    }, [dostupniPodTipoviMaterijala])


    useEffect(()=>{
        async function preuzmiMaterijale() {
            try {
                const odgovor = await axios.post('/materijali', {
                    predmeti: izabraniPredmeti,
                    podTipovi: izabraniPodTipoviMaterijala
                });
                podesiDostupneMaterijale(odgovor.data);                   
            } catch (error) {
                console.error('Greška prilikom slanja zahteva:', error);
            }
        }
        if(zaustaviPrviRenderMaterijal.current){
            zaustaviPrviRenderMaterijal.current = false
            return
        }
        
        if(izabraniPredmeti && izabraniPodTipoviMaterijala){
            preuzmiMaterijale();
        }
    }, [izabraniPredmeti, izabraniPodTipoviMaterijala])

    return(
        <div>
            <Navbar/>
            <div className='flex gap-6'>
                <div className="flex flex-col gap-6 mt-5 ml-5 border rounded-sm p-4 w-68">
                <p className='border-gray-300 border p-2 rounded-sm'>Izaberite Filtere:</p>
                <div className="flex gap-2">
                    <CustomSelect 
                        klase={"w-60"}
                        labela={"Izaberite godinu"}
                        opcije={dostupneGodine}
                        vrednost={izabranaGodina}
                        podesiSelektovaneOpcije = {podesiIzabranuGodinu}
                    />
                </div>
                <div className="flex gap-2">
                    <CustomSelect
                        klase={"w-60"}
                        labela={"Izaberite tip materijala"}
                        opcije={tipovi_materijala}
                        vrednost={izabraniTipoviMaterijala}
                        podesiSelektovaneOpcije={podesiIzabraneTipoveMaterijala}
                        viseOpcija={false}
                    />
                </div>
                <div className="flex gap-2">
                    <CustomSelect
                        klase={"w-60"}
                        labela={"Izaberite podtip materijala"}
                        opcije={dostupniPodTipoviMaterijala}
                        vrednost={izabraniPodTipoviMaterijala}
                        podesiSelektovaneOpcije={podesiIzabranePodTipoveMaterijala}
                        zakljucana ={zakljucajPodTipoveMaterijala}
                        tooltipTekst='Izaberite tip materijala'
                        />
                </div>
                <div className="flex gap-2">
                    <CustomSelect
                        klase={"w-60"}
                        labela={"Izaberite predmet"}
                        opcije={dostupniPredmeti}
                        vrednost={izabraniPredmeti}
                        podesiSelektovaneOpcije={podesiIzabranePredmete}
                    />
                </div>
            </div>
                <div className='flex'>
                    <div className="p-4 w-full">
                    {izabraniPredmeti &&  <KarticePredmeta
                            key={izabraniPredmeti.predmet_id}
                            predmet={izabraniPredmeti.naziv}
                            materijali={dostupniMaterijali}
                            smer={smer}
                        />}
                    </div>
                </div>
            </div>
        </div>
    )
}