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
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:flex gap-4 rounded-xl p-4 shadow-[12px_12px_14px_-1px_rgba(0,_0,_0,_0.1)]">
      {smerovi.map(departman => (
        <div key={departman.departman_id} className="relative">
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-100 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => toggleDropdown(departman.departman_id)}
            onMouseEnter={() => setActiveDropdown(departman.departman_id)}
          >
            <img
              src={`/storage/ikonice/${departman.departman_naziv.toLowerCase().replace(/ /g, "_")}.svg`}
              className="w-8 h-8"
              alt={departman.departman_naziv}
            />
            <span className="whitespace-nowrap">{departman.departman_naziv}</span>
          </button>

          {activeDropdown === departman.departman_id && (
            <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-[12px_12px_14px_-1px_rgba(0,_0,_0,_0.1)] z-10">
              <ul onMouseLeave={() => setActiveDropdown(null)}>
                {Object.entries(departman.nivo_studija).map(([nivo, smerovi]) => (
                  <li key={nivo}>
                    <button
                      className="p-2 hover:bg-blue-100 cursor-pointer rounded-lg w-full text-left"
                      onClick={() => toggleNivo(nivo)}
                    >
                      {nivo}
                    </button>
                    {openNivoi[nivo] && (
                      <ul className="ml-4 mt-2 list-disc text-gray-700 p-2">
                        {smerovi.map((smer) => (
                          <li key={smer.id} className="hover:bg-blue-100 rounded-lg p-1">
                            <Link
                              href={`/smerovi/${smer.id}`}
                              className="text-blue-500"
                            >
                              {smer.naziv}
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
  );
};

