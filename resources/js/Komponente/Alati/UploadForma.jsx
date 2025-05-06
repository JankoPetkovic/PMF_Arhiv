export default function UploadForma({zatvoriFormu}){


    return(
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30">
        <div className="bg-white p-8 rounded-lg shadow-lg flex-col gap-2">

            <h1>Pošalji svoj materijal:</h1>
            <input type="file" name="materijal" id="materijal" className="border-1 rounded-xl p-2"/>
            {/* Ovde idu selektovi za departmane, nivo studija, smer, godinu i predmet  */}
            <div className="flex justify-between">
            <button 
                className="block mt-4 px-4 py-2 bg-orange-500 text-white rounded-md cursor-pointer">
                    Posalji
                </button>
                <button 
                    onClick={zatvoriFormu}
                    className="block mt-4 px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer"
                    >
                    Zatvori
                </button>
           </div>
        </div>
    </div>
    )
}