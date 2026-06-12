import { useState } from "react";
import axios from "axios";
import { prikaziToastNotifikaciju } from "../PomocniAlati/ToastNotifikacijaServis";
import TipToastNotifikacije from "../PomocniAlati/TipToastNotifikacije";

export default function ZaboravljenaSifra({ nazad, podesiPrikaziDialog }) {
  const [email, podesiEmail] = useState("");
  const [poslato, podesiPoslato] = useState(false);
  const [ucitava, podesiUcitava] = useState(false);

  const obradiSlanje = async (e) => {
    e.preventDefault();
    podesiUcitava(true);
    try {
      await axios.post("/zatrazi-reset-sifre", { email }, { withCredentials: true });
      podesiPoslato(true);
    } catch (greska) {
      prikaziToastNotifikaciju("Greška pri slanju emaila.", TipToastNotifikacije.Greska);
    } finally {
      podesiUcitava(false);
    }
  };

  if (poslato) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Email je poslat</h2>
        <p className="text-gray-600 mb-6">
          Ako nalog sa adresom <strong>{email}</strong> postoji, poslaćemo vam link za
          resetovanje šifre. Link važi 60 minuta.
        </p>
        <button
          className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
          onClick={() => podesiPrikaziDialog(false)}
        >
          Zatvori
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
      <h2 className="text-xl font-semibold mb-1 text-gray-800">Zaboravili ste šifru?</h2>
      <p className="text-gray-500 text-sm mb-5">
        Unesite vaš email i poslaćemo vam link za resetovanje šifre.
      </p>
      <form onSubmit={obradiSlanje}>
        <div className="mb-5">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => podesiEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
            disabled={ucitava}
          />
        </div>
        <button
          type="submit"
          disabled={ucitava}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors mb-3 cursor-pointer disabled:opacity-60"
        >
          {ucitava ? "Slanje..." : "Pošalji link"}
        </button>
      </form>
      <button
        className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
        onClick={nazad}
      >
        Nazad
      </button>
    </div>
  );
}
