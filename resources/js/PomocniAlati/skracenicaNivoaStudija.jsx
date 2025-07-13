export default function skracenicaNivoaStudija(nivoStudija){
    switch (nivoStudija){
        case "Osnovne akademske studije":
            return "OAS";
            break;
        case "Master akademske studije":
            return "MAS";
            break;
        case "Doktorkse Akademske studije":
            return "DAS";
            break;
        default:
            return "Nivo Studija";
    }
}