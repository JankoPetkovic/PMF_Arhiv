import { useState } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";
import Navbar from "../Komponente/Alati/Navbar";
import { prikaziToastNotifikaciju } from "../PomocniAlati/ToastNotifikacijaServis";
import TipToastNotifikacije from "../PomocniAlati/TipToastNotifikacije";
import InputPoljeSaGreskom from "../Komponente/Alati/InputPoljeSaGreskom";

export default function ResetSifre({ token, email }) {
  const [podaci, podesiPodatke] = useState({
    sifra: "",
    sifra_potvrda: "",
  });
  const [greske, podesiGreske] = useState({});
  const [ucitava, podesiUcitava] = useState(false);
  const [uspeh, podesiUspeh] = useState(false);

  const proveraJacineSifre = (sifra) => ({
    dovoljnaDuzina: sifra.length >= 8,
    imaVelikoSlovo: /[A-Z]/.test(sifra),
    imaMaloSlovo: /[a-z]/.test(sifra),
    imaBroj: /[0-9]/.test(sifra),
    imaZnak: /[!@#$%^&*(),.?":{}|<>]/.test(sifra),
  });

  const obradiReset = async (e) => {
    e.preventDefault();

    const jacina = proveraJacineSifre(podaci.sifra);
    if (!jacina.dovoljnaDuzina) {
      prikaziToastNotifikaciju("Šifra mora imati najmanje 8 karaktera.", TipToastNotifikacije.Greska);
      return;
    }
    if (!jacina.imaVelikoSlovo) {
      prikaziToastNotifikaciju("Šifra mora sadržati najmanje jedno veliko slovo.", TipToastNotifikacije.Greska);
      return;
    }
    if (!jacina.imaMaloSlovo) {
      prikaziToastNotifikaciju("Šifra mora sadržati najmanje jedno malo slovo.", TipToastNotifikacije.Greska);
      return;
    }
    if (!jacina.imaBroj) {
      prikaziToastNotifikaciju("Šifra mora sadržati najmanje jedan broj.", TipToastNotifikacije.Greska);
      return;
    }
    if (!jacina.imaZnak) {
      prikaziToastNotifikaciju("Šifra mora sadržati najmanje jedan specijalni znak.", TipToastNotifikacije.Greska);
      return;
    }
    if (podaci.sifra !== podaci.sifra_potvrda) {
      prikaziToastNotifikaciju("Šifre se ne podudaraju.", TipToastNotifikacije.Greska);
      podesiGreske({ sifra_potvrda: ["Šifre se ne podudaraju."] });
      return;
    }
    podesiGreske({});
    podesiUcitava(true);
    try {
      await axios.post("/reset-sifre", {
        email,
        token,
        sifra: podaci.sifra,
        sifra_potvrda: podaci.sifra_potvrda,
      }, { withCredentials: true });

      podesiUspeh(true);
      prikaziToastNotifikaciju("Šifra je uspešno promenjena.", TipToastNotifikacije.Uspesno);
    } catch (err) {
      if (err.response?.status === 422) {
        podesiGreske(err.response.data.errors ?? {});
      } else {
        podesiGreske({ sifra: [err.response?.data?.message ?? "Greška pri resetovanju šifre."] });
      }
    } finally {
      podesiUcitava(false);
    }
  };

  if (uspeh) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Šifra je promenjena</h2>
            <p className="text-gray-600 mb-6">Možete se prijaviti sa novom šifrom.</p>
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
              onClick={() => router.visit("/")}
            >
              Idi na početnu
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-1 text-gray-800">Nova šifra</h2>
          <p className="text-gray-500 text-sm mb-5">
            Unesite novu šifru za nalog <strong>{email}</strong>.
          </p>
          <form onSubmit={obradiReset}>
            <InputPoljeSaGreskom
              labela="Nova šifra"
              vrednost={podaci.sifra}
              obradiPromenu={(e) => podesiPodatke({ ...podaci, sifra: e.target.value })}
              greska={greske.sifra?.[0]}
              tipPolja="sifra"
            />

            <InputPoljeSaGreskom
              labela="Potvrda šifre"
              vrednost={podaci.sifra_potvrda}
              obradiPromenu={(e) => podesiPodatke({ ...podaci, sifra_potvrda: e.target.value })}
              greska={greske.sifra_potvrda?.[0]}
              tipPolja="potvrda_sifre"
            />

            <button
              type="submit"
              disabled={ucitava}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-60"
            >
              {ucitava ? "Čuvanje..." : "Sačuvaj šifru"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
