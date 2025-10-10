import KarticaMaterijala from './KarticaMaterijala';

export default function PrikazMaterijala({predmeti = false, materijali, tekst = ""}){
    return(
        <div className='flex flex-col gap-4 w-screen max-w-[90vw] mx-auto h-[66.6667vh] mb-10 rounded-xl shadow-[12px_12px_14px_-1px_rgba(0,_0,_0,_0.1)] p-4'>
            {tekst && <div className="font-semibold p-2 rounded-lg bg-white/70 backdrop-blur-sm w-max">{tekst}</div>}
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