import React, { useState, useRef } from 'react';
import { Tooltip } from "@mui/material";
import { FaUpload } from "react-icons/fa";


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
      <Tooltip title="Izaberi fajl" arrow>
        <div className='border-2 rounded-lg p-2 border-emerald-500 cursor-pointer' onClick={obradiKlik}>
          <FaUpload className='cursor-pointer text-emerald-500' size={30} />
        </div>
      </Tooltip>

      
    </div>
  );
};


