import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { prikaziToastNotifikaciju } from "../PomocniAlati/ToastNotifikacijaServis";
import TipToastNotifikacije from "../PomocniAlati/TipToastNotifikacije";
import { router } from "@inertiajs/react";


export default function PrijaviSe({otvoriRegistraciju, podesiPrikaziDialog}) {
  const [podaci, podesiPodatke] = useState({
    email: "",
    sifra: ""
  })
  const [prikaziSifru, podesiPrikazivanjeSifre] = useState(false);

  const obradiPrijavljivanje = async (e) => {
    e.preventDefault();
    try{
      const odgovor = await axios.post('/prijava',{
        email: podaci.email,
        sifra: podaci.sifra,
      }, { withCredentials: true })
      podesiPrikaziDialog(false)
      prikaziToastNotifikaciju("Dobrodošao/la - " + odgovor.data.ime, TipToastNotifikacije.Uspesno)
      router.reload();
    } catch(greska){
      if (greska.response?.status === 401) {
        prikaziToastNotifikaciju("Neispravan email ili lozinka", TipToastNotifikacije.Greska)
      } else {
        console.error(greska);
        prikaziToastNotifikaciju("Greska pri prijavi", TipToastNotifikacije.Greska)
      }
    }
  };


  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <form onSubmit={obradiPrijavljivanje}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={podaci.email}
              onChange={(e) =>
                podesiPodatke({
                  ...podaci,
                  email: e.target.value
                })
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          <div className="mb-6 relative">
            <label className="block text-gray-700 mb-2">Šifra</label>
            <input
                type={prikaziSifru ? "text" : "password"}
                value={podaci.sifra}
                onChange={(e) =>
                  podesiPodatke({ ...podaci, sifra: e.target.value })
                }
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 pr-10"
                required
            />
            <div
              className="absolute right-3 top-[70%] transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => podesiPrikazivanjeSifre(!prikaziSifru)}
              title={prikaziSifru ? "Sakrij šifru" : "Prikaži šifru"}
            >
              {prikaziSifru ? <Tooltip title="Sakrij šifru"><FaRegEye size={20} /> </Tooltip> : <Tooltip title={"Prikaži šifru"}><FaRegEyeSlash size={22}/></Tooltip>}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors mb-3 cursor-pointer"
          >
            Prijavi se
          </button>
        </form>

        <button
          className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors mb-3 cursor-pointer"
          onClick={() => {
            otvoriRegistraciju(); 
          }}
        >
          Registruj se
        </button>
    </div>
  );
}
