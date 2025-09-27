import styles from "./ChangeBox.module.css";

function ChangeBox({nameStr, nameValue, show, onShowClick, showChange, value, onConfirmClick, onCancelClick, showConfirmation, onInputChange}) {

    return(
        <div className={styles.Window}>
            <div className={styles.NameContainer}>
                <p>{nameStr}: {nameValue || "N/A"}</p>
                {!show && <button onClick={onShowClick}>Change</button>}
            </div>
            {showChange && (
                <div className={styles.ChangeBox}>
                    <input type="text" value={value} placeholder={`Enter new ${nameStr}`} onChange={onInputChange}/>
                    <button className={styles.ConfirmButton} onClick={onConfirmClick}>Confirm</button>
                    <button className={styles.CancelButton} onClick={onCancelClick}>Cancel</button>
                </div>
            )}
            {showConfirmation && <p className={styles.Confirmation}>{nameStr} was changed</p>}
        </div>
    );
}

export default ChangeBox;