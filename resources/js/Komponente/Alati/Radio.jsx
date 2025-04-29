

export default function Radio({id, naziv, radioGrupa, cekiran, onChange})
{
    return(
    <>
        <div className="border-1 rounded-xl p-3">
            <input 
                type="radio" 
                id={id} 
                name={radioGrupa}
                value={naziv}
                className="godinaRadio outline-none"
                checked={cekiran}
                onChange={onChange}
            />
            <label htmlFor={id} className="ml-2 cursor-pointer">{naziv}</label>
        </div>
    </>
    )
}