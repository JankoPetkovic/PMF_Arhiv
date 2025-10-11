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
                prikaziToastNotifikaciju('Trenutno nema materijala za aktivne filtere', TipToastNotifikacije.Info);
                return false
            }
            else{
                return odgovor.data;    
            }
            
        } catch (greska) {
            prikaziToastNotifikaciju('Greška pri preuzimanju materijala', TipToastNotifikacije.Greska);
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
            prikaziToastNotifikaciju("Greška prilikom objavljivanja materijala", TipToastNotifikacije.Greska);
            throw greska
        }
    }

    static async obrisiMaterijal(id){
        try{
            const odgovor = await axios.delete(`/materijali/${id}`);
            if(odgovor.status === 204){
                prikaziToastNotifikaciju("Uspešno uklonjen materijal", TipToastNotifikacije.Uspesno)
                return true;
            }
        } catch(greska){
            prikaziToastNotifikaciju("Greška prilikom uklanjanja materijala", TipToastNotifikacije.Greska)
            throw greska
        }
    }
}