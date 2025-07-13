import axios from "axios";
import { prikaziToastNotifikaciju } from "../ToastNotifikacijaServis";
import TipToastNotifikacije from "../TipToastNotifikacije";

export default class ServisSmerova{

    static async vratiSmerove(filteri){
        try{
            const odgovor = await axios.get('/smerovi', {
                params: filteri
            });
            return odgovor.data
        } catch (greska) {
            prikaziToastNotifikaciju('Greska pri preuzimanju smerova', TipToastNotifikacije.Greska);
            throw greska
        }
    }
}