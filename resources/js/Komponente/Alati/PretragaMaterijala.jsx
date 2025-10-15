import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

export default function PretragaMaterijala({ podesiRezultate, inicijalniMaterijali }) {
    const [pretraga, podesiPretragu] = useState("");
    const [timer, podesiTimer] = useState(null);
    const prviRender = useRef(true);

    useEffect(() => {
        if (prviRender.current) {
            prviRender.current = false;
            return;
        }

        if (pretraga.length < 3) {
            podesiRezultate(inicijalniMaterijali);
            return;
        }

        if (timer) clearTimeout(timer);

        const noviTimer = setTimeout(() => {
            axios
                .get(`/materijali`, { params: { pretraga: pretraga } })
                .then((res) => {
                    podesiRezultate(res.data.data ?? []);
                })
                .catch((err) => {
                    console.error("Greška pri pretrazi:", err);
                    podesiRezultate(inicijalniMaterijali);
                });
        }, 500); 

        podesiTimer(noviTimer);
    }, [pretraga]);

    return (
        <div className="relative w-full max-w-md mx-auto mb-6">
            <input
                type="text"
                value={pretraga}
                onChange={(e) => podesiPretragu(e.target.value)}
                placeholder="Pretraži materijale..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-500 focus:ring-2 focus:ring-emerald-400 focus:outline-none shadow-sm"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
    );
}
