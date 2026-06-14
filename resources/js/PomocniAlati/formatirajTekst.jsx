// Bezbedno formatiranje teksta objave: prvo escape HTML-a (sprečava XSS),
// pa se samo naši markeri pretvaraju u dozvoljene tagove.
//   **masno**  -> <strong>
//   *kurziv*   -> <em>
//   __podvuceno__ -> <u>
//   nove linije -> <br/>
export function formatirajSadrzaj(tekst) {
    if (!tekst) return "";

    let s = String(tekst)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Bold pre italica (da ** ne bude pogrešno protumačeno kao dva *).
    s = s.replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/\*([^*\n]+?)\*/g, "<em>$1</em>");
    s = s.replace(/__([^_\n]+?)__/g, "<u>$1</u>");
    s = s.replace(/\n/g, "<br/>");

    return s;
}
