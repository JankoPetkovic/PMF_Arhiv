import { useState } from "react";
import axios from "axios"; // Importuj axios

export default function VerifikacijaForm() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerification = async () => {
        if (!email) {
            setMessage("Molimo unesite email adresu.");
            return;
        }
        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post("/verifikacija", {
                email
            });          
            setMessage(response.data.message);
        } catch (error) {
            setMessage("Došlo je do greške. Pokušajte ponovo.");
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-xl w-96">
            <h2 className="text-lg font-semibold mb-4">Verifikacija e-maila</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Unesite vaš e-mail"
                className="border p-2 w-full rounded mb-4"
            />
            <button
                id="VerifikujDugme"
                onClick={handleVerification}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            >
                {loading ? "Proveravam..." : "Verifikuj"}
            </button>
            {message && <p className="mt-4 text-gray-700">{message}</p>}
        </div>
    );
}