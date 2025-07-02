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
      <div className="flex border-2 rounded-xl h-20 gap-7 items-center justify-center">
        {smerovi.map(departman => (
          <div key={departman.departman_id} className="relative">
            <button 
              className="p-5 hover:bg-blue-100 relative rounded-md cursor-pointer"  
              onClick={() => toggleDropdown(departman.departman_id)}
              onMouseEnter={() => setActiveDropdown(departman.departman_id)}
            >
              <img src={`/storage/ikonice/${departman.departman_naziv.toLowerCase().replace(/ /g, "_")}` + ".svg"} className="inline-block w-10 h-10 mr-2 align-middle"/>
              {departman.departman_naziv}
            </button>
            
            {activeDropdown === departman.departman_id && (
              <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <ul className="py-1" onMouseLeave={() => setActiveDropdown(null)}>
                {Object.entries(departman.nivo_studija).map(([nivo, smerovi]) => (
                <li key={nivo}>
                    <button className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => toggleNivo(nivo)}>
                    {nivo}
                    </button>
                    {openNivoi[nivo] && (
                    <ul className="ml-4 mt-2 list-disc text-gray-700 p-2 ">
                        {smerovi.map((smer) => (
                        <li key={smer.id} className="hover:bg-gray-200">
                            <Link
                                href={`/smer-${smer.id}`}
                                className="text-blue-500 hover:underline"
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

