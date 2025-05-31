import { useState } from 'react';
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { FaUpload, FaInfoCircle  } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import Dialog from '../Dialog';
import ObjavaMaterijala from '../../Stranice/ObjavaMaterijala';
export default function BurgerMenu() {
  const [meniOtvoren, podesiMeni] = useState(false);
  const [objaviMaterijal, podesiObjaviMaterijal] = useState(false);
  const [prikaziDialog, podesiPrikazDialoga] = useState(false);

  return (
    <>
      <button
        onClick={() => podesiMeni(true)}
        className="text-3xl p-2 focus:outline-none"
      >
        <RxHamburgerMenu size={30}  className="cursor-pointer"/>
      </button>

      {meniOtvoren && (
        <div
          className="fixed inset-0 bg-opacity-40 z-40"
          onClick={() => podesiMeni(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg p-6 transform transition-transform duration-300 z-50 ${
          meniOtvoren ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={() => podesiMeni(false)}
          className="text-2xl mb-6 focus:outline-none"
        >
          <IoMdClose size={30}  className="cursor-pointer"/>
        </button>
        <div className='flex flex-col gap-2'>
            <div className='flex gap-2 items-center text-lg hover:text-gray-600 cursor-pointer' onClick={()=>{podesiPrikazDialoga(true)}}>
              <FaUpload size={25}/> Objavi Materijal
            </div>
            <div className='flex gap-2 items-center text-lg hover:text-gray-600 cursor-pointer'><FaInfoCircle size={25}/> Informacije</div>
            <div className='flex gap-2 items-center text-lg hover:text-gray-600 cursor-pointer'><BiSupport size={25}/>Prijavi problem</div>
        </div>
      </div>
      <Dialog naslov={'Objavi Materijal'} prikaziDialog={prikaziDialog} podesiPrikaziDialog={podesiPrikazDialoga} sadrzaj={<ObjavaMaterijala/>}/>
    </>
  );
}
