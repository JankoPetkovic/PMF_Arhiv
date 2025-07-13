import axios from "axios";
import { prikaziToastNotifikaciju } from "../ToastNotifikacijaServis";
import TipToastNotifikacije from "../TipToastNotifikacije";

export default class ServisNivoaStudija{

    static async vratiNivoeStudija(){
        try{
            const odgovor = await axios.get('/nivo-studija');
            return odgovor.data
        } catch (greska) {
            prikaziToastNotifikaciju('Greska pri preuzimanju nivoa studija', TipToastNotifikacije.Greska);
            throw greska
        }
    }
}