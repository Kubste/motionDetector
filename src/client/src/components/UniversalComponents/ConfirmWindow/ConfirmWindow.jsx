import styles from './ConfirmWindow.module.css'

function ConfirmWindow({message, onClose, onConfirm}) {

    return(
        <div className={styles.ConfirmWindow}>
            <div className={styles.ConfirmContent}>
                <p>Are you sure you want to {message}?</p>
                <div className={styles.ButtonsContainer}>
                    <button className={styles.ConfirmButton} onClick={onConfirm}>Confirm</button>
                    <button className={styles.CancelButton} onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmWindow