import axios from "axios";
import { prikaziToastNotifikaciju } from "../ToastNotifikacijaServis";
import TipToastNotifikacije from "../TipToastNotifikacije";

export default class ServisTipovaMaterijala{

    static async vratiTipoveMaterijala(){
        try{
            const odgovor = await axios.get('/tipovi-materijala');
            return odgovor.data
        } catch (greska) {
            prikaziToastNotifikaciju('Greska pri preuzimanju tipova materijala', TipToastNotifikacije.Greska);
            throw greska
        }
    }
}