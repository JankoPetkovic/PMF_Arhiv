import axios from "axios";
import { prikaziToastNotifikaciju } from "../ToastNotifikacijaServis";
import TipToastNotifikacije from "../TipToastNotifikacije";

export default class ServisAnkete {
    // payload: { naslov, rok_trajanja, pitanja: [{ tekst, tip, obavezno, dozvoli_drugo, opcije: [{tekst}] }] }
    static async sacuvaj(objavaId, payload) {
        try {
            const odgovor = await axios.post(`/parlament/${objavaId}/anketa`, payload);
            return odgovor.data;
        } catch (greska) {
            const poruka = greska.response?.data?.message || "Greška pri čuvanju ankete";
            prikaziToastNotifikaciju(poruka, TipToastNotifikacije.Greska);
            throw greska;
        }
    }

    static async obrisi(objavaId) {
        try {
            const odgovor = await axios.delete(`/parlament/${objavaId}/anketa`);
            return odgovor.data;
        } catch (greska) {
            const poruka = greska.response?.data?.message || "Greška pri brisanju ankete";
            prikaziToastNotifikaciju(poruka, TipToastNotifikacije.Greska);
            throw greska;
        }
    }

    static async rezime(anketaId) {
        const odgovor = await axios.get(`/anketa/${anketaId}/rezime`);
        return odgovor.data;
    }

    // payload: { ime, prezime, email, broj_indeksa, odgovori: [{ pitanje_id, opcija_ids, slobodan_tekst }] }
    static async posaljiOdgovor(anketaId, payload) {
        try {
            const odgovor = await axios.post(`/anketa/${anketaId}/odgovor`, payload);
            prikaziToastNotifikaciju(odgovor.data?.message || "Odgovor zabeležen", TipToastNotifikacije.Uspesno);
            return odgovor.data;
        } catch (greska) {
            const poruka = greska.response?.data?.message || "Greška pri slanju odgovora";
            prikaziToastNotifikaciju(poruka, TipToastNotifikacije.Greska);
            throw greska;
        }
    }
}
