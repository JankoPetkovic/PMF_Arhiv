import axios from "axios";
import { prikaziToastNotifikaciju } from "../ToastNotifikacijaServis";
import TipToastNotifikacije from "../TipToastNotifikacije";

export default class ServisMaterijala {

    static async vratiMaterijale(filteri){
        try{
            const odgovor = await axios.get('/materijali', {
                params:  filteri 
            });
            if(odgovor.data.data.length === 0){
                prikaziToastNotifikaciju('Trenutno nema materijala za ovaj predmet', TipToastNotifikacije.Info);
                return false
            }
            else{
                return odgovor.data;    
            }
            
        } catch (greska) {
            prikaziToastNotifikaciju('Greska pri preuzimanju materijala', TipToastNotifikacije.Greska);
            throw greska
        }
    }

    static async sacuvajMaterijal(podaci){
        try{
            const odgovor = await axios.post('/materijali', podaci);
            if (odgovor.status === 200) {
                return true;
            }
            return false;
        } catch (greska) {
            prikaziToastNotifikaciju("Greska prilikom objavljivanja materijala", TipToastNotifikacije.Greska);
            throw greska
        }
    }
}