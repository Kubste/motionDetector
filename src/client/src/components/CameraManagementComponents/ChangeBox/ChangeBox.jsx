import styles from "./ChangeBox.module.css";
import DropBar from "../../UniversalComponents/DropBar/DropBar.jsx";

function ChangeBox({nameStr, nameValue, show, onShowClick, showChange, value, onConfirmClick, onCancelClick,
                       showConfirmation, onInputChange, showDropdown, label, options, onChange}) {

    return(
        <div className={styles.Window}>
            <div className={styles.NameContainer}>
                <p>
                    {nameStr}:
                    {nameValue === true ? " enabled"
                    : nameValue === false ? " disabled"
                    : nameValue !== null ? " " + nameValue
                    : "N/A"}
                </p>
                {!show && <button onClick={onShowClick}>Change</button>}
            </div>
            {showChange && (
                <div className={styles.ChangeBox}>
                    {!showDropdown ? (
                        nameStr === "Confidence Threshold" ? <input type="number" value={value} placeholder={`Enter new ${nameStr}`} onChange={onInputChange} min="0" max="1" step="0.01"/> :
                            <input type="text" value={value} placeholder={`Enter new ${nameStr}`} onChange={onInputChange}/>) :
                        <DropBar label={label} options={options} onChange={onChange} selectedOption={value}></DropBar>
                    }
                    <button className={styles.ConfirmButton} onClick={onConfirmClick}>Confirm</button>
                    <button className={styles.CancelButton} onClick={onCancelClick}>Cancel</button>
                </div>
            )}
            {showConfirmation && <p className={styles.Confirmation}>{nameStr} was changed</p>}
        </div>
    );
}

export default ChangeBox;