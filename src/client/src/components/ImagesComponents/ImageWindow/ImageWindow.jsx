import styles from './ImageWindow.module.css';
import ErrorWindow from "../../UniversalComponents/ErrorWindow/ErrorWindow.jsx";
import {useState} from "react";
import { Rnd } from "react-rnd";

function ImageWindow({path, filename, onClose}) {
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);

    const imageURL = `https://192.168.100.7/${path}`;

    const handleCloseError = () => {
        setError(null);
        setShowError(false);
    }

    return(
        <div className={styles.ImageWindow}>
                <div className={styles.ImageContainer}>
                    <h2>{filename}</h2>
                    <img src={imageURL} alt={filename} onLoad={handleCloseError} onError={() => { setError(`Failed to load ${filename}`); setShowError(true);}} style={{ maxHeight: "calc(100% - 60px)" }}/>
                    <button className={styles.CloseButton} onClick={onClose}>Close</button>
                </div>
            {showError && <ErrorWindow message={error} onClose={handleCloseError}></ErrorWindow>}
        </div>
    );
}

export default ImageWindow;