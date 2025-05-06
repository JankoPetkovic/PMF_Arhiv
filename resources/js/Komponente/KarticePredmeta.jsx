import Kartica from '../Komponente/Kartica';


export default function KarticePredmeta({predmet, materijali, smer})
{   
    let putanja = (
        smer.departman +
        '/' + smer.nivo_studija +
        '/' + smer.naziv_smera +
        '/' + predmet
    )
    .toLowerCase()
    .replaceAll(' ', '_');

    console.log(materijali);
    
    return(
        <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">{predmet}</h2>
            <div className='flex flex-wrap gap-4'>
            {Array.isArray(materijali) && materijali.length === 0 ? (
                <h2>Nema materijala za ovaj predmet</h2>
                ) : (
                materijali.map((m) => (
                    <Kartica 
                    key={m.materijal_id} 
                    tipFajla={m.tip_fajla} 
                    putanja={putanja + '/' + m.naziv + '.' + m.tip_fajla}
                    naziv={m.naziv + '.' + m.tip_fajla}
                    uploudovao={materijali.email}
                    />
                ))
                )}
            </div>
        </div>
    );
}