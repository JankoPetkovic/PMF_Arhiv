import { createContext, useContext, useState } from "react";

const GlobalniKontekst = createContext();

export const GlobalniProvider = ({ children }) => { 
    const [podaci, podesiPodatke] = useState({
        dostupniDepartmani: '',
        dostupniNivoiStudija: '',
        dostupniTipoviMaterijala: ''
    });

    const upravljajKlikomVanElemenata = (
        referenceElemenata,
        dogadjaj,
        dodatnaKlase = []
    ) => {
        let kliknutoVan = true;

        referenceElemenata.forEach((ref) => {
            if (ref.current && ref.current.contains(dogadjaj.target)) {
                kliknutoVan = false;
            }
        });

        if (
            Array.isArray(dodatnaKlase) &&
            dodatnaKlase.some((klasa) =>
                dogadjaj.target.classList.contains(klasa) ||
                dogadjaj.target.closest('.' + klasa)
            )
        ) {
            kliknutoVan = false;
        }

        return kliknutoVan;
    };


    return (
        <GlobalniKontekst.Provider value={{ podaci, podesiPodatke, upravljajKlikomVanElemenata }}>
            {children} 
        </GlobalniKontekst.Provider>
    );
};

export const koristiGlobalniKontekst = () => useContext(GlobalniKontekst);
