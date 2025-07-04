import { toast } from 'react-toastify';
import TipToastNotifikacije from './TipToastNotifikacije';
export const prikaziToastNotifikaciju = (poruka, tip = TipToastNotifikacije.Podrazumevano, options = {}) => {
    switch(tip) {
      case TipToastNotifikacije.Uspesno:
        toast.success(poruka, 
          {
            style: 
            {
              background: '#059669', 
              color: '#FFFFFF',       
              border: '1px solid #3A9E3D',
              fontSize: '14px'
            },
            progressStyle: 
            {
              background: '#2F9C35' 
            }
          }
      );
        break;
      case TipToastNotifikacije.Greska:
        toast.error(poruka, options);
        break;
      case TipToastNotifikacije.Upozorenje:
        toast.warning(poruka, {
          style: 
            {
              background: '#ff7700', 
            }
          });
        break;
      case TipToastNotifikacije.Info:
        toast.info(poruka, options);
        break;
      default:
        toast(poruka, options);
    }
};