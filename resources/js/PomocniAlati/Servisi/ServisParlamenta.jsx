import axios from "axios";
import { prikaziToastNotifikaciju } from "../ToastNotifikacijaServis";
import TipToastNotifikacije from "../TipToastNotifikacije";

export default class ServisParlamenta {
    // formData: FormData sa poljima naslov, sadrzaj, link, slika
    static async kreiraj(formData) {
        try {
            const odgovor = await axios.post("/parlament", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            prikaziToastNotifikaciju("Objava je kreirana", TipToastNotifikacije.Uspesno);
            return odgovor.data;
        } catch (greska) {
            const poruka = greska.response?.data?.message || "Greška pri kreiranju objave";
            prikaziToastNotifikaciju(poruka, TipToastNotifikacije.Greska);
            throw greska;
        }
    }

    static async izmeni(id, formData) {
        try {
            // POST (ne PUT) zbog multipart/form-data upload-a slike
            const odgovor = await axios.post(`/parlament/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            prikaziToastNotifikaciju("Objava je ažurirana", TipToastNotifikacije.Uspesno);
            return odgovor.data;
        } catch (greska) {
            const poruka = greska.response?.data?.message || "Greška pri izmeni objave";
            prikaziToastNotifikaciju(poruka, TipToastNotifikacije.Greska);
            throw greska;
        }
    }

    static async obrisi(id) {
        try {
            const odgovor = await axios.delete(`/parlament/${id}`);
            prikaziToastNotifikaciju("Objava je obrisana", TipToastNotifikacije.Uspesno);
            return odgovor.data;
        } catch (greska) {
            const poruka = greska.response?.data?.message || "Greška pri brisanju objave";
            prikaziToastNotifikaciju(poruka, TipToastNotifikacije.Greska);
            throw greska;
        }
    }
}
