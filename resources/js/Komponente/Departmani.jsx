import { useState } from "react";
import { Link } from '@inertiajs/react';
export default function Departmani({smerovi})
{
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  const [openNivoi, setOpenNivoi] = useState({});

  const toggleNivo = (nivo) => {
    setOpenNivoi((prev) => ({
      ...prev,
      [nivo]: !prev[nivo],
    }));
  };

    
  return (
    <>
      <div className="flex border-2 rounded-xl h-20 gap-7 items-center justify-center shadow-[12px_12px_14px_-1px_rgba(0,_0,_0,_0.1)]">
        {smerovi.map(departman => (
          <div key={departman.departman_id} className="relative">
            <button 
              className="p-5 hover:bg-blue-100 relative rounded-md cursor-pointer hover:scale-110 transition-transform duration-200"  
              onClick={() => toggleDropdown(departman.departman_id)}
              onMouseEnter={() => setActiveDropdown(departman.departman_id)}
            >
              <img src={`/storage/ikonice/${departman.departman_naziv.toLowerCase().replace(/ /g, "_")}` + ".svg"} className="inline-block w-10 h-10 mr-2 align-middle"/>
              {departman.departman_naziv}
            </button>
            
            {activeDropdown === departman.departman_id && (
              <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-[12px_12px_14px_-1px_rgba(0,_0,_0,_0.1)] z-10 ">
                <ul className="" onMouseLeave={() => setActiveDropdown(null)}>
                {Object.entries(departman.nivo_studija).map(([nivo, smerovi]) => (
                <li key={nivo}>
                    <button className="p-2 hover:bg-blue-100 cursor-pointer rounded-lg"
                    onClick={() => toggleNivo(nivo)}>
                    {nivo}
                    </button>
                    {openNivoi[nivo] && (
                    <ul className="ml-4 mt-2 list-disc text-gray-700 p-2 ">
                        {smerovi.map((smer) => (
                        <li key={smer.id} className="hover:bg-blue-100 rounded-lg p-1">
                            <Link
                                href={`/smerovi/${smer.id}`}
                                className="text-blue-500"
                                >{smer.naziv}
                            </Link>
                        </li>
                        ))}
                    </ul>
                    )}
                </li>
                ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

