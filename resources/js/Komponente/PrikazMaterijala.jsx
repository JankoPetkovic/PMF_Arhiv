import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useEffect } from 'react';
import KarticaMaterijala from './KarticaMaterijala';

export default function PrikazMaterijala({predmeti = false, materijali}){
    return(
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
    )
}