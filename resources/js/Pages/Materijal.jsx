import Checkbox from "../Componets/Tools/Checkbox";
import Navbar from "../Componets/Tools/Navbar";


export default function Materijal({predmeti, id})
{
    console.log(predmeti);



    return(
        <>
            <div>
                <Navbar/>
                <ul className="ml-10 mt-10">
                    {predmeti.map(predmet => (
                        <li className="p-2" key={predmet.predmet_id}>
                            <Checkbox 
                                // key={predmet.predmet_id} 
                                id={predmet.predmet_id} 
                                naziv={predmet.naziv} 
                                onChange={console.log("Janko")
                                }
                            />
                        </li>
                    ))}
                </ul>
                </div>
        </>
    )
}