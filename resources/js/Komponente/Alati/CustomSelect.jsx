import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Fragment from "react";
import { Tooltip } from "@mui/material";
export default function CustomSelect({
    klase,
    opcije,
    multiSelect = false,
    vrednost,
    podesiSelektovaneOpcije,
    obaveznoPolje = false,
    velicina = "medium",
    labela,
    zakljucana = false,
    tooltipTekst =''
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
                value={vrednost || null}
                multiple={multiSelect}
                onChange={selektujHandle}
                size={velicina}
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
                    opcija.naziv ||
                    opcija.nivo_studija ||
                    opcija.naziv_smera ||
                    ""
                }
                value={vrednost || null}
                multiple={multiSelect}
                onChange={selektujHandle}
                size={velicina}
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
