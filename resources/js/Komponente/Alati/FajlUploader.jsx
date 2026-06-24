import { useRef, useState } from 'react';
import { FaUpload } from "react-icons/fa";

export default function FajlUploader({ onFajloviDodati }) {
  const inputRef = useRef();
  const [prevuceno, podesiPrevuceno] = useState(false);

  const obradiPromenu = (e) => {
    const fajlovi = Array.from(e.target.files);
    if (fajlovi.length > 0) onFajloviDodati(fajlovi);
    e.target.value = '';
  };

  const obradiDrop = (e) => {
    e.preventDefault();
    podesiPrevuceno(false);
    const fajlovi = Array.from(e.dataTransfer.files);
    if (fajlovi.length > 0) onFajloviDodati(fajlovi);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-10 m-4 text-center cursor-pointer transition-colors duration-200 ${
        prevuceno
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
      }`}
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); podesiPrevuceno(true); }}
      onDragLeave={() => podesiPrevuceno(false)}
      onDrop={obradiDrop}
    >
      <input
        type="file"
        multiple
        ref={inputRef}
        onChange={obradiPromenu}
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.txt,.odt,.png,.jpg,.jpeg"
        style={{ display: 'none' }}
      />
      <FaUpload size={36} className="mx-auto mb-3 text-gray-400" />
      <p className="text-gray-600 font-medium">Prevuci fajlove ovde</p>
      <p className="text-gray-400 text-sm mt-1">
        ili <span className="text-blue-500 underline">klikni da odabereš</span>
      </p>
      <p className="text-xs text-gray-400 mt-3">
        PDF, DOC, PPT, XLS, ZIP, TXT, ODT, PNG, JPG · maks. 50MB po fajlu
      </p>
    </div>
  );
}
