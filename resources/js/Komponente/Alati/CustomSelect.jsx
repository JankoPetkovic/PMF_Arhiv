import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Tooltip } from "@mui/material";
import { useEffect } from "react";
export default function CustomSelect({
    klase,
    opcije,
    imeOpcije = 'naziv',
    viseOpcija = false,
    vrednost,
    podesiSelektovaneOpcije,
    obaveznoPolje = false,
    velicina = "medium",
    labela,
    zakljucana = false,
    tooltipTekst ='',
    nazivPlus = false,
    brojIzabranihOpcija = 1
}) {
    const selektujHandle = (event, vrednosti) => {
        if (vrednosti === null) {
            vrednosti = "";
        }
        podesiSelektovaneOpcije(vrednosti);
    };

    return zakljucana ? (
        <Tooltip 
            title={tooltipTekst}
            placement="top"
            slotProps={{
                tooltip: {
                    sx: {
                        fontSize: "1.1rem",
                        padding: "12px 16px",
                        maxWidth: "300px",
                        backgroundColor: "#333",
                    },
                },
            }}
        >
        <span className={klase}>
            <Autocomplete
                options={opcije}
                limitTags={brojIzabranihOpcija}
                getOptionLabel={(opcija) =>
                    opcija[imeOpcije] + (nazivPlus ?" - " + opcija[nazivPlus] : '')
                }
                isOptionEqualToValue={(opcija, vrednost) => {
                    if (!opcija || !vrednost) return false;

                    const oId = opcija.id ?? opcija.smer_id;
                    const vId = vrednost.id ?? vrednost.smer_id;

                    if (oId !== undefined && vId !== undefined) {
                        return oId === vId;
                    }

                    return opcija.naziv === vrednost.naziv;
                }}
                value={vrednost || null}
                multiple={viseOpcija}
                onChange={selektujHandle}
                size={velicina}
                renderOption={(props, opcija) => {
                    // MUI-jev key je garantovano jedinstven (uključuje indeks),
                    // za razliku od npr. smer_id koji je isti za sve predmete istog smera.
                    const { key: muiKey, ...ostalo } = props;
                    return (
                        <li {...ostalo} key={muiKey}>
                            {opcija[imeOpcije] + (nazivPlus ?" - " + opcija[nazivPlus] : '')}
                        </li>
                    );
                }}
                renderInput={(parametri) => (
                    <TextField
                    {...parametri}
                    label={labela}
                    required={obaveznoPolje}
                    />
                )}
                disabled={zakljucana}
            />
        </span>
        </Tooltip>
    ) : (
        <div className={klase}>
            <Autocomplete
                options={opcije}
                limitTags={brojIzabranihOpcija}
                getOptionLabel={(opcija) =>
                    opcija[imeOpcije] + (nazivPlus ?" - " + opcija[nazivPlus] : '')
                }
                isOptionEqualToValue={(opcija, vrednost) => {
                    if (!opcija || !vrednost) return false;

                    const oId = opcija.id ?? opcija.smer_id;
                    const vId = vrednost.id ?? vrednost.smer_id;

                    if (oId !== undefined && vId !== undefined) {
                        return oId === vId;
                    }

                    return opcija.naziv === vrednost.naziv;
                }}
                value={vrednost || null}
                multiple={viseOpcija}
                onChange={selektujHandle}
                size={velicina}
                renderOption={(props, opcija) => {
                    // MUI-jev key je garantovano jedinstven (uključuje indeks),
                    // za razliku od npr. smer_id koji je isti za sve predmete istog smera.
                    const { key: muiKey, ...ostalo } = props;
                    return (
                        <li {...ostalo} key={muiKey}>
                            {opcija[imeOpcije] + (nazivPlus ?" - " + opcija[nazivPlus] : '')}
                        </li>
                    );
                }}
                renderInput={(parametri) => (
                    <TextField
                    {...parametri}
                    label={labela}
                    required={obaveznoPolje}
                    />
                )}
                disabled={zakljucana}
            />
        </div>
    );
}
