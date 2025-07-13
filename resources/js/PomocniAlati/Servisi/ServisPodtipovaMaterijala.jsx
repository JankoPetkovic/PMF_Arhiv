import axios from "axios";
import { prikaziToastNotifikaciju } from "../ToastNotifikacijaServis";
import TipToastNotifikacije from "../TipToastNotifikacije";

export default class ServisPodtipovaMaterijala{

    static async vratiPodTipoveMaterijala(filteri){
        try{
            const odgovor = await axios.get('/podtipovi-materijala', {
                params: filteri
            });
            return odgovor.data
        } catch (greska) {
            prikaziToastNotifikaciju('Greska pri preuzimanju podtipova materijala', TipToastNotifikacije.Greska);
            throw greska
        }
    }
}