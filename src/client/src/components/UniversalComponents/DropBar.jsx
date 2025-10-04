import {useState} from "react";

function DropBar({label, options, onChange, selectedOption}) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
    }

    return (
        <div className="relative w-full">
            <button
                className="w-full px-3 py-1 rounded-3xl bg-cyan-100 text-sm text-start text-gray-500 placeholder-gray-500 border border-cyan-700 hover:cursor-pointer"
                type="button"
                onClick={() => setIsOpen(!isOpen)}
            >{selectedOption?.name || label}</button>

            {isOpen &&
                <ul className="absolute z-100 w-full mt-1 bg-cyan-100 border-cyan-700 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
                    {options.map((item, index) => (
                        <li className="px-4 py-2 cursor-pointer border-b border-cyan-700 hover:bg-cyan-100 hover:text-cyan-900 transition"
                            key={index}
                            onClick={() => handleSelect(item)}
                        >{item.name}</li>))}
                </ul>
            }
        </div>
    );
}

export default DropBar;