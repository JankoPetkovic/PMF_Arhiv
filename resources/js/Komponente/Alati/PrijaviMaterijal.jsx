import axios from 'axios';
import { useState } from 'react';
export default function PrijaviMaterijal({podesiPrijavu, materijalId}){

    const [posiljaoc, podesiPosiljaoca] = useState('');
    const [opisPrijave, podesiopisPrijave] = useState('');

    const prijavi = () => {
        axios.post('materijal.prijavi', {
            posiljaoc: posiljaoc,
            materijalId: materijalId,
            opisPrijave: opisPrijave
        })        
    }

    return(
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30">
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col gap-2">
                <h1>Zbog čega prijavljujete ovaj materijal?</h1>
                <textarea 
                    className='border-1 rounded-xl p-1'
                    placeholder='Opiši problem sa ovim materijalom' 
                    id='opisPrijave' 
                    name='opisPrijave' 
                    rows="4" cols="50"
                    onChange={(e) => podesiopisPrijave(e.target.value)}/>
                <div>
                    <label htmlFor="posiljaoc">Unesite Vašu PMF email adresu: </label>
                    <input 
                        type="email" 
                        name="posiljaoc" 
                        id="posiljaoc" 
                        placeholder='petar.petrovic@pmf.edu.rs' 
                        className='border-1 rounded-xl p-1' 
                        onChange={(e) => podesiPosiljaoca(e.target.value)}/>
                </div>
                <div className="flex justify-between">
                    <button 
                        onClick={()=>{
                            prijavi()
                        }}
                        className="block mt-4 px-4 py-2 bg-orange-500 text-white rounded-md cursor-pointer">
                        Prijavi
                    </button>
                    <button 
                        onClick={podesiPrijavu}
                        className="block mt-4 px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer"
                        >
                        Zatvori
                    </button>
                </div>
            </div>
        </div>
    )
}