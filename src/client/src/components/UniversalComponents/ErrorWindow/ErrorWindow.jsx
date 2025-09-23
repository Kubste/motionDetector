import styles from "./ErrorWindow.module.css";

function ErrorWindow({message, onClose}) {

    return(
        <div className={styles.ErrorWindow}>
            <div className={styles.ErrorContent}>
                <p>{message}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default ErrorWindow;