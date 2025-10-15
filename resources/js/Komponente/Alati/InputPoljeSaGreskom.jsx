import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

export default function InputPoljeSaGreskom({labela, vrednost, obradiPromenu, greska, tipPolja = 'text'}){
    const [prikaziSifru, podesiPrikazivanjeSifre] = useState(false);

    const obradiChange = (e) => {
        if (tipPolja === 'number') {
            const value = e.target.value.replace(/[^0-9]/g, '');
            e.target.value = value;
        }
        obradiPromenu(e);
    }

    const proveraJacineSifre = (sifra) => {
        const imaVelikoSlovo = /[A-Z]/.test(sifra);
        const imaMaloSlovo = /[a-z]/.test(sifra);
        const imaBroj = /[0-9]/.test(sifra);
        const imaZnak = /[!@#$%^&*(),.?":{}|<>]/.test(sifra);
        const dovoljnaDuzina = sifra.length >= 8;

        return {
            dovoljnaDuzina,
            imaVelikoSlovo,
            imaMaloSlovo,
            imaBroj,
            imaZnak,
            validna: dovoljnaDuzina && imaVelikoSlovo && imaMaloSlovo && imaBroj && imaZnak
        };
    }

    if (tipPolja === 'sifra' || tipPolja === 'potvrda_sifre') {
        const jacinaSifre = tipPolja === 'sifra' ? proveraJacineSifre(vrednost) : null;
        
        return (
            <div className="mb-6">
                <label className="block mb-1">{labela}</label>
                <div className="relative">
                    <input
                        type={prikaziSifru ? "text" : "password"}
                        value={vrednost}
                        onChange={obradiChange}
                        className="w-full px-3 py-2 border rounded pr-10"
                    />
                    <div
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                        onClick={() => podesiPrikazivanjeSifre(!prikaziSifru)}
                        title={prikaziSifru ? "Sakrij šifru" : "Prikaži šifru"}
                    >
                        {prikaziSifru ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
                    </div>
                </div>
                
                {tipPolja === 'sifra' && vrednost && jacinaSifre && (
                    <div className="mt-2 text-sm">
                        <div className={`${jacinaSifre.dovoljnaDuzina ? 'text-green-600' : 'text-red-600'}`}>
                            ✓ Minimum 8 karaktera
                        </div>
                        <div className={`${jacinaSifre.imaVelikoSlovo ? 'text-green-600' : 'text-red-600'}`}>
                            ✓ Veliko slovo (A-Z)
                        </div>
                        <div className={`${jacinaSifre.imaMaloSlovo ? 'text-green-600' : 'text-red-600'}`}>
                            ✓ Malo slovo (a-z)
                        </div>
                        <div className={`${jacinaSifre.imaBroj ? 'text-green-600' : 'text-red-600'}`}>
                            ✓ Broj (0-9)
                        </div>
                        <div className={`${jacinaSifre.imaZnak ? 'text-green-600' : 'text-red-600'}`}>
                            ✓ Specijalni znak (!@#$%^&*)
                        </div>
                    </div>
                )}
                
                {greska && <p className="text-red-600 text-sm mt-1">{greska}</p>}
            </div>
        );
    }

    return (
        <div>
            <label className="block mb-1">{labela}</label>
            <input
                type={tipPolja === 'number' ? 'text' : tipPolja}
                value={vrednost}
                onChange={obradiChange}
                inputMode={tipPolja === 'number' ? 'numeric' : 'text'}
                pattern={tipPolja === 'number' ? '[0-9]*' : undefined}
                className="w-full border px-3 py-2 rounded"
            />
            {greska && <p className="text-red-600 text-sm">{greska}</p>}
        </div>
    )
}