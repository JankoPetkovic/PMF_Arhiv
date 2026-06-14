import { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import axios from "axios";
import Navbar from "../Komponente/Alati/Navbar";
import { prikaziToastNotifikaciju } from "../PomocniAlati/ToastNotifikacijaServis";
import TipToastNotifikacije from "../PomocniAlati/TipToastNotifikacije";
import { FaSearch } from "react-icons/fa";

export default function AdminKorisnici() {
    const { korisnici = [], uloge = [], pretraga = "" } = usePage().props;

    const [unosPretrage, podesiUnosPretrage] = useState(pretraga);
    const [redovi, podesiRedove] = useState(korisnici);
    const [cuvaId, podesiCuvaId] = useState(null);

    const pretrazi = () => {
        router.get('/admin/korisnici', { pretraga: unosPretrage }, { preserveState: false, replace: true });
    };

    const promeniUlogu = async (korisnikId, novaUlogaId) => {
        const idBroj = parseInt(novaUlogaId, 10);
        podesiCuvaId(korisnikId);
        try {
            const odgovor = await axios.patch(`/admin/korisnici/${korisnikId}/uloga`, {
                tip_uloge_korisnika_id: idBroj,
            });
            podesiRedove((prev) => prev.map((k) =>
                k.korisnik_id === korisnikId
                    ? { ...k, uloga_id: idBroj, uloga: odgovor.data?.uloga ?? k.uloga }
                    : k
            ));
            prikaziToastNotifikaciju("Uloga ažurirana", TipToastNotifikacije.Uspesno);
        } catch (greska) {
            const poruka = greska.response?.data?.message || "Greška pri promeni uloge";
            prikaziToastNotifikaciju(poruka, TipToastNotifikacije.Greska);
        } finally {
            podesiCuvaId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 pt-10 pb-16">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Administracija korisnika</h1>
                <p className="text-sm text-gray-500 mb-6">Dodela uloga korisnicima</p>

                <div className="flex gap-2 mb-5 max-w-md">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={unosPretrage}
                            onChange={(e) => podesiUnosPretrage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && pretrazi()}
                            placeholder="Pretraži po imenu, emailu ili indeksu..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-400"
                        />
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    </div>
                    <button
                        onClick={pretrazi}
                        className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium cursor-pointer"
                    >
                        Pretraži
                    </button>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                                <th className="px-4 py-3 text-left">Ime i prezime</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Indeks</th>
                                <th className="px-4 py-3 text-left w-56">Uloga</th>
                            </tr>
                        </thead>
                        <tbody>
                            {redovi.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-10 text-center text-gray-400 italic">
                                        Nema korisnika za prikaz.
                                    </td>
                                </tr>
                            ) : redovi.map((k) => (
                                <tr key={k.korisnik_id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                    <td className="px-4 py-3 font-medium text-gray-800">{k.ime} {k.prezime}</td>
                                    <td className="px-4 py-3 text-gray-600">{k.email}</td>
                                    <td className="px-4 py-3 text-gray-600">{k.broj_indeksa}</td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={k.uloga_id}
                                            disabled={cuvaId === k.korisnik_id}
                                            onChange={(e) => promeniUlogu(k.korisnik_id, e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm bg-white cursor-pointer focus:outline-none focus:border-blue-400 disabled:opacity-50"
                                        >
                                            {uloge.map((u) => (
                                                <option key={u.id} value={u.id}>{u.naziv}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
