import axios from "axios";
import { prikaziToastNotifikaciju } from "../ToastNotifikacijaServis";
import TipToastNotifikacije from "../TipToastNotifikacije";

export default class ServisDepartmana{

    static async vratiDepartmane(){
        try{
            const odgovor = await axios.get('/departmani');
            return odgovor.data
        } catch (greska) {
            prikaziToastNotifikaciju('Greska pri preuzimanju departmana', TipToastNotifikacije.Greska);
            throw greska
        }
    }
}