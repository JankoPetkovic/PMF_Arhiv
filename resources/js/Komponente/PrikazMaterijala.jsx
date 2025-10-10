import { useEffect, useState } from 'react';
import KarticaMaterijala from './KarticaMaterijala';
import { usePage } from '@inertiajs/react';

export default function PrikazMaterijala({predmeti = false, materijali}){
    const { ulogovanKorisnik } = usePage().props;
    const [tekst, podesiTekst] = useState("Najnoviji materijali:")

    useEffect(()=>{
        if(ulogovanKorisnik && ulogovanKorisnik?.smerovi_korisnika?.length > 0){
            podesiTekst("Najnoviji materijali sa vaših smerova:")
        }
    }, [])

    return(
        <div className='flex flex-col gap-4 w-screen max-w-[90vw] mx-auto h-[66.6667vh] mb-10 rounded-xl shadow-[12px_12px_14px_-1px_rgba(0,_0,_0,_0.1)] p-4'>
            {!predmeti && <div className="font-semibold p-2 rounded-lg bg-white/70 backdrop-blur-sm w-[20vh]">{tekst}</div>}
            <div className="flex flex-wrap gap-4 p-4 h-[80vh] overflow-auto justify-center lg:justify-start">
                {Array.isArray(materijali) && materijali.length !== 0 && (
                    materijali.map((m) => (
                    <KarticaMaterijala
                        materijal={m}
                        key={m.materijal_id}
                    />
                    ))
                )}
            </div>
        </div>
    )
}