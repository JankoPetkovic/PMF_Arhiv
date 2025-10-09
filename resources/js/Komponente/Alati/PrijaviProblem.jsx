import axios from 'axios';
import { useState } from 'react';
export default function PrijaviProblem({podesiPrikazDialoga, materijalId=false}){

    const [posiljaoc, podesiPosiljaoca] = useState('');
    const [opisPrijave, podesiopisPrijave] = useState('');

    const prijavi = () => {
        if(materijalId){
            axios.post('/materijal.prijavi', {
            posiljaoc: posiljaoc,
            materijalId: materijalId,
            opisPrijave: opisPrijave
        })} else {
            axios.post('/prijavi-problem', {
                posiljaoc: posiljaoc,
                opisPrijave: opisPrijave
            })
        }
        podesiPrikazDialoga(false)     
    }

    return(
       <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-2">
            <textarea 
                className='border-1 rounded-xl p-1'
                placeholder='Opiši problem' 
                id='opisPrijave' 
                name='opisPrijave' 
                rows="4" cols="50"
                onChange={(e) => podesiopisPrijave(e.target.value)}/>
            <div className='flex items-center gap-2 self-end'>
                <label htmlFor="posiljaoc" className='items-center flex'>Vaša PMF email adresa: </label>
                <input 
                    type="email" 
                    name="posiljaoc" 
                    id="posiljaoc" 
                    placeholder={'ime.prezime@' + import.meta.env.VITE_STUDENTSKI_EMAIL}
                    className='border-1 rounded-xl p-2' 
                    onChange={(e) => podesiPosiljaoca(e.target.value)}/>
            </div>
            <div className="flex self-end">
                <button 
                    onClick={()=>{
                        prijavi()
                    }}
                    className="block mt-4 px-4 py-2 bg-orange-500 text-white rounded-md cursor-pointer">
                    Prijavi
                </button>
            </div>
        </div>
    )
}