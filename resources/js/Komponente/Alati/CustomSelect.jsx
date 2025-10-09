import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Tooltip } from "@mui/material";
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
                limitTags={1}
                getOptionLabel={(opcija) =>
                    opcija.naziv ||
                    opcija.nivo_studija ||
                    opcija.naziv_smera ||
                    ""
                }
                isOptionEqualToValue={(opcija, vrednost) =>
                    (opcija.id ?? opcija.smer_id) === (vrednost.id ?? vrednost.smer_id)
                }
                value={vrednost || null}
                multiple={viseOpcija}
                onChange={selektujHandle}
                size={velicina}
                renderOption={(props, opcija) => (
                    <li {...props} key={opcija.id ?? opcija.smer_id}>
                        {opcija[imeOpcije] + (spojiNaziv ? opcija[nazivPlus] : '')}
                    </li>
                )}
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
                limitTags={1}
                getOptionLabel={(opcija) =>
                    opcija[imeOpcije] + (nazivPlus ?" - " + opcija[nazivPlus] : '')
                }
                isOptionEqualToValue={(opcija, vrednost) =>
                    (opcija.id ?? opcija.smer_id) === (vrednost.id ?? vrednost.smer_id)
                }
                value={vrednost || null}
                multiple={viseOpcija}
                onChange={selektujHandle}
                size={velicina}
                renderOption={(props, opcija) => (
                    <li {...props} key={opcija.id ?? opcija.smer_id}>
                        {opcija[imeOpcije] + (nazivPlus ?" - " + opcija[nazivPlus] : '')}
                    </li>
                )}
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
