import React from "react";
import { MdVerified } from "react-icons/md";

export default function StatusVerifikacije({ statusVerifikacije, produziVerifikaciju }) {
    if (!statusVerifikacije?.statusVerifikacije) {
        return (
            <div className="flex justify-between gap-2 items-center">
                <div className="flex gap-2 items-center text-gray-600">
                    <MdVerified className="text-gray-500" size={30} />
                    Korisnik nije verifikovan
                </div>
                <button
                    className="bg-green-500 rounded-lg p-1 text-white cursor-pointer hover:scale-110 transition-transform duration-200"
                    onClick={produziVerifikaciju}
                >
                    Verifikuj se
                </button>
            </div>
        );
    }

    if (statusVerifikacije.verifikovan) {
        return (
            <div className="flex justify-between gap-2 items-center">
                <div className="flex gap-2 items-center text-green-600">
                    <MdVerified className="text-green-500" size={30} />
                    Verifikacija važi do: {statusVerifikacije.statusVerifikacije}
                </div>
                <button
                    className="bg-green-500 rounded-lg p-1 text-white cursor-pointer hover:scale-110 transition-transform duration-200"
                    onClick={produziVerifikaciju}
                >
                    Produži verifikaciju
                </button>
            </div>
        );
    }

    if (statusVerifikacije.statusVerifikacije === "Korisnik se ne nalazi u bazi podataka") {
        return (
            <div className="flex justify-between gap-2 items-center">
                <div className="flex gap-2 items-center text-gray-600">
                    <MdVerified className="text-gray-500" size={30} />
                    {statusVerifikacije.statusVerifikacije}
                </div>
                <button
                    className="bg-green-500 rounded-lg p-1 text-white cursor-pointer hover:scale-110 transition-transform duration-200"
                    onClick={produziVerifikaciju}
                >
                    Verifikuj se
                </button>
            </div>
        );
    }

    return (
        <div className="flex justify-between gap-2 items-center">
            <div className="flex gap-2 items-center text-red-600">
                <MdVerified className="text-red-500" size={30} />
                Verifikacija je istekla: {statusVerifikacije.statusVerifikacije}
            </div>
            <button
                className="bg-green-500 rounded-lg p-1 text-white cursor-pointer hover:scale-110 transition-transform duration-200"
                onClick={produziVerifikaciju}
            >
                Produži verifikaciju
            </button>
        </div>
    );
}
