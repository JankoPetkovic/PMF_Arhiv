export default function PrijaviMaterijal({podesiPrijavu}){

    const prijavi = () => {
        console.log("prijavljen materijal");
        
    }

    return(
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30">
            <div className="bg-white p-8 rounded-lg shadow-lg flex-col gap-2 ">
                Zbog čega prijavljuješ materijal?
                <div className="flex justify-between">
                    <button 
                        onClick={()=>prijavi}
                        className="block mt-4 px-4 py-2 bg-orange-500 text-white rounded-md cursor-pointer">
                        Prijavi
                    </button>
                    <button 
                        onClick={podesiPrijavu}
                        className="block mt-4 px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer"
                        >
                        Zatvori
                    </button>
                </div>
            </div>
        </div>
    )
}