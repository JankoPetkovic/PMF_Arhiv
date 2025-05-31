export function generisiSkolskeGodine(pocetnaGodina = 2014) {
    const danas = new Date();
    const trenutnaGodina = danas.getFullYear();
    const mesec = danas.getMonth();
    const godine = [];

    const poslednjaAkademskaGodina =
        mesec >= 9 ? trenutnaGodina : trenutnaGodina - 1;

    for (
        let godina = pocetnaGodina;
        godina <= poslednjaAkademskaGodina;
        godina++
    ) {
        const sledecaGodinaKratko = (godina + 1).toString().slice(-2);
        const naziv = `${godina}/${sledecaGodinaKratko}`;
        godine.push({ naziv });
    }

    return godine;
}
