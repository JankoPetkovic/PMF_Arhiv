import axios from "axios";
import { prikaziToastNotifikaciju } from "./ToastNotifikacijaServis";
import TipToastNotifikacije from "./TipToastNotifikacije";

export default class ServisKorisnika {

    static async statusVerifikacije(mejl){
        try{
            const odgovor = await axios.get('/status-verifikacije', {
                params: { mejl }
            });
            return odgovor.data;
        } catch (greska) {
            prikaziToastNotifikaciju('Greska pri preuzimanju statusa verifikacije', TipToastNotifikacije.Greska);
            console.error('Greska pri preuzimanju statusa verifikacije', greska);
            throw greska
        }
    }

    static async verifikujKorisnika(korisnickiMejl){
        try{
            const odgovor = await axios.post('/verifikuj-korisnika', {
                mejl:korisnickiMejl});
            prikaziToastNotifikaciju('Poslat mejl za verifikaciju', TipToastNotifikacije.Info);
        } catch (greska) {
            prikaziToastNotifikaciju('Greska pri slanju mejla za verifikacije', TipToastNotifikacije.Greska);
            console.error('Greska pri slanju mejla za verifikacije', greska);
        }
    }
}