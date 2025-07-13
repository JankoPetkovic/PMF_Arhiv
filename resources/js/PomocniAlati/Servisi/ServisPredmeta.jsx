import axios from "axios";
import { prikaziToastNotifikaciju } from "../ToastNotifikacijaServis";
import TipToastNotifikacije from "../TipToastNotifikacije";

export default class ServisPredmeta{

    static async vratiPredmete(filteri){
        try{
            const odgovor = await axios.get('/predmeti', {
                params: filteri
            });
            return odgovor.data
        } catch (greska) {
            prikaziToastNotifikaciju('Greska pri preuzimanju predmeta', TipToastNotifikacije.Greska);
            throw greska
        }
    }
}