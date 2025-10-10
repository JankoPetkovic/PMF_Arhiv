import { useState } from "react";
import axios from "axios";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Tooltip } from "@mui/material";
import InputPoljeSaGreskom from "../Komponente/Alati/InputPoljeSaGreskom";
import { prikaziToastNotifikaciju } from "../PomocniAlati/ToastNotifikacijaServis";
import TipToastNotifikacije from "../PomocniAlati/TipToastNotifikacije";
import { router } from "@inertiajs/react";

export default function Registracija({podesiPrikaziDialog}) {
  const [podaci, podesiPodatke] = useState({
    ime: "",
    prezime: "",
    email: "",
    broj_indeksa: "",
    sifra: "",
    sifra_potvrda: "",
  });

  const [greske, podesiGreske] = useState({});
  const [procesuiranje, podesiProcesuiranje] = useState(false);

  const obradiRegistraciju = async (e) => {
    e.preventDefault();
    podesiProcesuiranje(true);
    podesiGreske({});

    if (podaci.sifra !== podaci.sifra_potvrda) {
      podesiGreske({
      sifra_potvrda: "Šifre se ne podudaraju.",
      });
      podesiProcesuiranje(false);
      return;
    }

    if(!podaci.email.endsWith("@" + import.meta.env.VITE_STUDENTSKI_EMAIL)){
      alert("Email mora biti studentski (" + import.meta.env.VITE_STUDENTSKI_EMAIL + ")");
      return;
    }

    
    try {
      const odgovor = await axios.post("/korisnik", {
        ime: podaci.ime,
        prezime: podaci.prezime,
        broj_indeksa: podaci.broj_indeksa,
        email: podaci.email,
        sifra: podaci.sifra,
        sifra_potvrda: podaci.sifra_potvrda,
      });


      podesiPodatke({
        ime: "",
        prezime: "",
        broj_indeksa: "", 
        email: "",
        sifra: "",
        sifra_potvrda: "",
      });

      podesiPrikaziDialog(false)
      prikaziToastNotifikaciju('Korisnik uspešno registrovan', TipToastNotifikacije.Info);
      router.visit('korisnik/' + odgovor.data.korisnik_id)
    } catch (error) {
      podesiProcesuiranje(false);
      if (error.response && error.response.status === 422) {
        podesiGreske(error.response.data.errors);
      } else {
        console.error(error);
        prikaziToastNotifikaciju('Greška pri registraciji korisnika', TipToastNotifikacije.Greska);
      }
    } finally {
      podesiProcesuiranje(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-96">
      <InputPoljeSaGreskom 
        labela="Ime"
        vrednost={podaci.ime}
        obradiPromenu={(e) => podesiPodatke({ ...podaci, ime: e.target.value })}
        greska={greske.ime}
      />

      <InputPoljeSaGreskom 
        labela="Prezime"
        vrednost={podaci.prezime}
        obradiPromenu={(e) => podesiPodatke({ ...podaci, prezime: e.target.value })}
        greska={greske.prezime}
      />

      <InputPoljeSaGreskom 
        labela="Broj indeksa"
        vrednost={podaci.broj_indeksa}
        obradiPromenu={(e) => podesiPodatke({ ...podaci, broj_indeksa: e.target.value })}
        greska={greske.broj_indeksa}
        tipPolja="number"
      />

      <InputPoljeSaGreskom 
        labela="Email"
        vrednost={podaci.email}
        obradiPromenu={(e) => podesiPodatke({ ...podaci, email: e.target.value })}
        greska={greske.email}
        tipPolja="studentski_email"
      />

      <InputPoljeSaGreskom 
        labela="Šifra"
        vrednost={podaci.sifra}
        obradiPromenu={(e) => podesiPodatke({ ...podaci, sifra: e.target.value })}
        greska={greske.sifra}
        tipPolja="sifra"
      />

      <InputPoljeSaGreskom 
        labela="Potvrdi lozinku"
        vrednost={podaci.sifra_potvrda}
        obradiPromenu={(e) => podesiPodatke({ ...podaci, sifra_potvrda: e.target.value })}
        greska={greske.sifra_potvrda}
        tipPolja="potvrda_sifre"
      />

      <button
        type="submit"
        disabled={procesuiranje}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={obradiRegistraciju}
      >
        {procesuiranje ? "Registrujem..." : "Registruj se"}
      </button>
    </div>
  );
}
