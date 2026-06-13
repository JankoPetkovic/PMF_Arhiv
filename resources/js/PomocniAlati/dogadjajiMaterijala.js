// Jednostavan globalni signal da su se materijali promenili (dodavanje,
// izmena ili brisanje). Stranica smera učitava materijale klijentski u
// lokalno stanje, pa router.reload() ne osvežava taj prikaz — umesto toga
// se osloni na ovaj event da ponovo povuče listu.

export const DOGADJAJ_PROMENA_MATERIJALA = 'materijali:promena';

export function objaviPromenuMaterijala() {
    window.dispatchEvent(new CustomEvent(DOGADJAJ_PROMENA_MATERIJALA));
}

export function pretplatiSeNaPromenuMaterijala(rukovalac) {
    window.addEventListener(DOGADJAJ_PROMENA_MATERIJALA, rukovalac);
    return () => window.removeEventListener(DOGADJAJ_PROMENA_MATERIJALA, rukovalac);
}
