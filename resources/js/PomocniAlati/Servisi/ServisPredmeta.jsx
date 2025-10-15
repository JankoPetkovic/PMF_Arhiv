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

    static async dodajPredmet(opcije) {
        try {
            const odgovor = await axios.post('/predmeti', {
                naziv: opcije.nazivPredmeta,
                smer: opcije.smer,     
                godina: opcije.godina,   
            });

            prikaziToastNotifikaciju(
                `Predmet "${opcije.nazivPredmeta}" je uspešno kreiran.`,
                TipToastNotifikacije.Uspesno
            );

            return odgovor.data;
        } catch (greska) {
            prikaziToastNotifikaciju(
                'Greška pri dodavanju predmeta.',
                TipToastNotifikacije.Greska
            );
            throw greska;
        }
    }
}