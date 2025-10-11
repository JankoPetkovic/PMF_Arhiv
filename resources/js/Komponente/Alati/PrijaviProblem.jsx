import axios from 'axios';
import { useState } from 'react';
export default function PrijaviProblem({podesiPrikazDialoga, materijalId=false}){

    const [opisPrijave, podesiOpisPrijave] = useState('');

    const prijavi = () => {
        if(opisPrijave){
            if(materijalId){
                axios.post('/materijal.prijavi', {
                materijalId: materijalId,
                opisPrijave: opisPrijave
            })} else {
                axios.post('/prijavi-problem', {
                    opisPrijave: opisPrijave
                })
            }
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
                onChange={(e) => podesiOpisPrijave(e.target.value)}/>
            <div className="flex self-end">
                <button 
                    onClick={()=>{
                        prijavi()
                    }}
                    className="block mt-4 px-4 py-2 bg-orange-500 text-white rounded-md cursor-pointer">
                    Pošalji prijavu
                </button>
            </div>
        </div>
    )
}