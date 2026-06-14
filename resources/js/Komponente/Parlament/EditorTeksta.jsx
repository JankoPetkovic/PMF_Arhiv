import { useRef } from "react";
import { FaBold, FaItalic, FaUnderline } from "react-icons/fa";

export default function EditorTeksta({ vrednost, podesiVrednost, placeholder = "", rows = 5 }) {
    const ref = useRef(null);

    // Omota selektovani tekst markerima (ili ubaci markere oko kursora).
    const omotaj = (marker) => {
        const ta = ref.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const sel = vrednost.slice(start, end);
        const novo = vrednost.slice(0, start) + marker + sel + marker + vrednost.slice(end);
        podesiVrednost(novo);

        // Vrati fokus i selekciju (oko ubačenog teksta).
        requestAnimationFrame(() => {
            ta.focus();
            ta.selectionStart = start + marker.length;
            ta.selectionEnd = end + marker.length;
        });
    };

    const dugme = (onClick, naslov, deca) => (
        <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // ne gubi selekciju u textarea
            onClick={onClick}
            title={naslov}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-600 hover:bg-gray-200 cursor-pointer"
        >
            {deca}
        </button>
    );

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-400">
            <div className="flex items-center gap-1 bg-gray-50 border-b border-gray-200 px-2 py-1">
                {dugme(() => omotaj("**"), "Masno (**tekst**)", <FaBold size={12} />)}
                {dugme(() => omotaj("*"), "Kurziv (*tekst*)", <FaItalic size={12} />)}
                {dugme(() => omotaj("__"), "Podvučeno (__tekst__)", <FaUnderline size={12} />)}
                <span className="ml-auto text-[10px] text-gray-400">**masno** · *kurziv* · __podvučeno__</span>
            </div>
            <textarea
                ref={ref}
                value={vrednost}
                onChange={(e) => podesiVrednost(e.target.value)}
                rows={rows}
                placeholder={placeholder}
                className="w-full px-3 py-2 text-sm focus:outline-none resize-y"
            />
        </div>
    );
}
