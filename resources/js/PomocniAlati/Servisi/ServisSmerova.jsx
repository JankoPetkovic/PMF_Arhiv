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
    
    static async dodajSmer(opcije) {
        try {
            const odgovor = await axios.post('/smerovi', {
                naziv: opcije.nazivSmera,
                departman: opcije.departman,     
                nivo_studija: opcije.nivoStudija,   
            });

            prikaziToastNotifikaciju(
                `Smer "${opcije.nazivSmera}" je uspešno kreiran.`,
                TipToastNotifikacije.Uspesno
            );

            return odgovor.data;
        } catch (greska) {
            prikaziToastNotifikaciju(
                'Greška pri dodavanju smera.',
                TipToastNotifikacije.Greska
            );
            throw greska;
        }
    }

}