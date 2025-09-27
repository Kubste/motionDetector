import styles from './ImageInfoDetails.module.css';
import {useState, useEffect} from "react";
import axios from "axios";
import ErrorWindow from "../../UniversalComponents/ErrorWindow/ErrorWindow.jsx";

function ImageInfoDetails({id, onClose}) {
    const [details, setDetails] = useState(null);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [filename, setFilename] = useState("");
    const [newFilename, setNewFilename] = useState("");
    const [showFilenameChange, setShowFilenameChange] = useState(false);
    const [showFilenameChangeConfirmation, setShowFilenameChangeConfirmation] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        axios.get(`https://192.168.100.7/api/image-info/${id}/`, {
            headers: {
                Authorization: `Token ${token}`,
            },
        }).then(response => {
            setDetails(response.data);
        }).catch(error => {
            setError(error.message || "Failed to load image details.");
            setShowError(true);
        })
    }, [id, filename])

    const handleFilenameChange = () => {
        const token = sessionStorage.getItem('token');

        axios.patch(`https://192.168.100.7/api/image-info/${id}/change-filename/`, {
            filename: newFilename
        }, {headers: {
                Authorization: `Token ${token}`
            }
        }).then(() => {
            //window.location.reload();
            setFilename(newFilename);
            setShowFilenameChangeConfirmation(true);
        }).catch(error => {
            setError(error.response?.data?.error || "Failed to change filename.");
            setShowError(true);
        })
    }

    const handleCloseError = () => {
        setShowError(false);
        setError(null);
    }

    return(
        <div className={styles.Window}>
            <div className={styles.DetailsContainer}>
                <div className={styles.FilenameContainer}>
                    <p>Filename: {details?.filename || "N/A"}</p>
                    {!showFilenameChange && <button onClick={() => setShowFilenameChange(true)}>Change filename</button>}
                </div>
                <div className={styles.FilenameContainer}>
                    {showFilenameChange && (
                        <div className={styles.FilenameChangeBox}>
                            <input type="text" value={newFilename} onChange={(e) => setNewFilename(e.target.value)} placeholder="Enter new filename"/>
                            <button className={styles.ConfirmButton} onClick={handleFilenameChange}>Confirm</button>
                            <button className={styles.CancelButton} onClick={() => {setShowFilenameChange(false); setShowFilenameChangeConfirmation(false)}}>Cancel</button>
                        </div>
                    )}
                </div>
                {showFilenameChangeConfirmation && <p className={styles.Confirmation}>Filename was changed</p>}
                <p>File size: {details ? details.file_size + " kB" : "N/A"}</p>
                <p>File type: {details?.file_type || "N/A"}</p>
                <p>Resolution: {details?.resolution || "N/A"}</p>
                <p>Timestamp: {details?.timestamp || "N/A"}</p>
                <p>Camera: {details?.camera || "N/A"}</p>
                <p>Model: {details ? details.model.model_name + " " + details.model.model_version : "N/A"}</p>
                <p>Confidence: {details?.output?.confidence || "N/A"}</p>
                <p>Person Count: {details?.output?.person_count || "N/A"}</p>
                <button className={styles.CloseButton} onClick={onClose}>Close</button>
            </div>
            {showError && <ErrorWindow message={error} onClose={handleCloseError}></ErrorWindow>}
        </div>
    );
}

export default ImageInfoDetails;