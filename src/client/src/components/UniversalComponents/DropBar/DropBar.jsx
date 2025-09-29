import styles from "./DropBar.module.css";
import {useState} from "react";

function DropBar({label, options, onChange, selectedOption}) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
    }

    return(
        <div className={styles.Container}>
            <button type="button" onClick={() => setIsOpen(!isOpen)}>{selectedOption?.name || label}</button>
            {isOpen &&
                <ul className={styles.List}>
                    {options.map((item, index) => (
                        <li key={index} onClick={() => handleSelect(item)}>{item.name}</li>
                    ))}
                </ul>
            }
        </div>
    );
}

export default DropBar;