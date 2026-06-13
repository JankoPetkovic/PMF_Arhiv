import axios from "axios";
import { prikaziToastNotifikaciju } from "../ToastNotifikacijaServis";
import TipToastNotifikacije from "../TipToastNotifikacije";

export default class ServisDriveImporta {
    static async vratiFajlove(folderId, smerId = null) {
        try {
            const params = { folder_id: folderId };
            if (smerId) params.smer_id = smerId;
            const odgovor = await axios.get('/admin/drive/fajlovi', { params });
            return odgovor.data;
        } catch (greska) {
            const poruka = greska.response?.data?.message || 'Greška pri učitavanju Drive foldera';
            prikaziToastNotifikaciju(poruka, TipToastNotifikacije.Greska);
            throw greska;
        }
    }

    static async uvezi(stavke) {
        try {
            const odgovor = await axios.post('/admin/drive/uvezi', { stavke });
            return odgovor.data;
        } catch (greska) {
            const poruka = greska.response?.data?.message || 'Greška pri uvozu fajlova';
            prikaziToastNotifikaciju(poruka, TipToastNotifikacije.Greska);
            throw greska;
        }
    }
}
