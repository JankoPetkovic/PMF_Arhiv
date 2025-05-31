import React, { useState, useRef } from 'react';

export default function FajlUploader({podesiFajl}){
  const inputRef = useRef();

  const obradiPromenuFajla = (e) => {
    if (e.target.files.length > 0) {
      podesiFajl(e.target.files[0]);
    }
  };

  const obradiKlik = () => {
    inputRef.current.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        onChange={obradiPromenuFajla}
        style={{ display: 'none' }}
      />

      <button
        type="button"
        onClick={obradiKlik}
        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Pretraži fajl
      </button>

      
    </div>
  );
};


