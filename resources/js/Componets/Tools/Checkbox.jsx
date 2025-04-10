import { useState } from 'react';

export default function Checkbox({id, naziv, onChange}) {
    const [isChecked, setIsChecked] = useState(false);
    
    const handleChange = (event) => {
        setIsChecked(event.target.checked);
        if (onChange) {
            onChange(event.target.checked, id);
        }
    };
    
    return(
        <>
            <input 
                type="checkbox" 
                id={id} 
                checked={isChecked}
                onChange={handleChange}
                className="predmetCheckbox"
            />
            <label htmlFor={id} className="ml-2">{naziv}</label>
        </>
    )
}