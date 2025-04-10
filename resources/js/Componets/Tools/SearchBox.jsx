import React from "react";
import { Search, X } from "lucide-react";

export default function SearchBox({ value, onChange, placeholder = "Pretraži..." })
{
  return (
    <div className="relative w-full max-w-md border-2 rounded-xl px-3 py-3.5 flex items-center gap-2">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search size={18} />
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10 focus:outline-none "
      />

      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X size={18} strokeWidth={3}/>
        </button>
      )}
    </div>
  );
};