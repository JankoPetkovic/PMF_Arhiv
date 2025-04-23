import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Checkbox from "../Komponente/Alati/Checkbox";
import Navbar from "../Komponente/Alati/Navbar";
import Radio from "../Komponente/Alati/Radio";
import Kartica from '../Komponente/Kartica';


export default function Materijal({predmeti, smer, tipovi_materijala})
{
    const [selektovanaGodina, setSelektovanuGodinu] = useState(1); 
    const [selektovaniPredmeti, setSelektovaniPredmeti] = useState([]);
    const [selektovaniTipovi, setSelektovaniTipovi] = useState([]);
    const [materijali, setMaterijali] = useState([]);

    console.log(materijali);
    

    useEffect(() => {
        setSelektovaniPredmeti([]);
    }, [selektovanaGodina]);

    useEffect(()=>{
        getMaterijal(selektovaniPredmeti, selektovaniTipovi)
    }, [selektovaniPredmeti, selektovaniTipovi])

    const checkboxPredmetPromena = (checked, id)=>
    {
        setSelektovaniPredmeti(prev=> {
            if(checked)
            {
                return [...prev, id];
            }
            else 
            {
                return prev.filter(postojeciId => postojeciId !== id)
            }
        })
    }
    
    const checkboxTipPromena = (checked, id)=>
        {
            setSelektovaniTipovi(prev=> {
                if(checked)
                {
                    return [...prev, id];
                }
                else 
                {
                    return prev.filter(postojeciId => postojeciId !== id)
                }
            })
        }


    async function getMaterijal(selektovaniPredmeti, selektovaniTipovi)
    {
        try {
            const response = await axios.post('/materijali', {
                predmeti: selektovaniPredmeti,
                tipovi: selektovaniTipovi
            });

            setMaterijali(response.data);
        } catch (error) {
            console.error('Greška prilikom slanja zahteva:', error);
        }
        
    }

    

    return(
        <>
            <div>
                <Navbar/>
                <div className="flex justify-center mt-5">
                    <p>Izaberite godinu i tip materijala</p>
                </div>
                <div className="flex gap-2 mt-2 justify-center">
                   <div className="flex gap-2 mt-2 justify-center">
                        <Radio id={"prva_godina"} 
                        naziv={"1.godina"} 
                        radioGrupa={"izbor_godine"}
                        cekiran={selektovanaGodina === 1}
                        onChange={() => setSelektovanuGodinu(1)}
                        />
                        <Radio id={"druga_godina"} 
                        naziv={"2.godina"} 
                        radioGrupa={"izbor_godine"}
                        cekiran={selektovanaGodina === 2}
                        onChange={() => setSelektovanuGodinu(2)}
                        />
                        <Radio id={"treca_godina"} 
                        naziv={"3.godina"} 
                        radioGrupa={"izbor_godine"}
                        cekiran={selektovanaGodina === 3}
                        onChange={() => setSelektovanuGodinu(3)}
                        />
                   </div>
                   <div className="flex gap-2 mt-2 justify-center p-3 border-1 rounded-xl">
                        {tipovi_materijala.map(tip => (
                           <div key={tip.tip_materijala_id}>
                            <Checkbox 
                                key={tip.tip_materijala_id}
                                id={tip.tip_materijala_id}
                                naziv={tip.naziv}
                                onChange={checkboxTipPromena}
                            />
                           </div>
                        ))}
                   </div>
                </div>
                <div className='flex'>
                    <ul className="ml-10 mt-10">
                        {predmeti.map(predmet => (
                            predmet.godina === selektovanaGodina && 
                            <li className="p-2" key={predmet.predmet_id}>
                            <Checkbox 
                                key={predmet.predmet_id} 
                                id={predmet.predmet_id} 
                                naziv={predmet.naziv} 
                                onChange={checkboxPredmetPromena}
                            />
                            </li>
                        ))}
                    </ul>
{/* 
                    <Kartica tipFajla={'pdf'} putanja={'Test1.pdf'}/>
                    <Kartica tipFajla={'png'} putanja={'Test2.png'}/> */}
                    {/* <div>
                    {materijali && Object.values(materijali).map(materijal => (
                    <div key={materijal.materijal_id}>
                                <img src="pmf_logo.svg" alt={materijal.naziv} />
                                <p>{materijal.naziv}</p>
                                <p>{materijal.tip_fajla}</p>
                                <p>{materijal.email}</p>
                            </div>
                        ))}
                    </div> */}
                </div>
            </div>
        </>
    )
}