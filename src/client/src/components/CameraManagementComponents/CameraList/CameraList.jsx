import styles from './CameraList.module.css';
import ErrorWindow from "../../UniversalComponents/ErrorWindow/ErrorWindow.jsx";
import {useEffect, useState} from "react";
import axios from "axios";

function CameraList() {
    const [cameras, setCameras] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);

    const token = sessionStorage.getItem("token");

    // called once after render and each time after reload button is clicked
    useEffect(() => {
        const fetchCameras = async () => {
            const token = sessionStorage.getItem("token");
            setLoading(true);
            try {
                const response = await axios.get("https://192.168.100.7/api/cameras/", {
                    headers: { 'Authorization': `Token ${token}` }
                });
                console.log(response.data);
                setCameras(response.data);

            } catch(error) {
                console.error(error);
                setError(error.message || "Failed to load cameras.");
                setShowError(true);

            } finally {
                setLoading(false);
            }
        };
        fetchCameras();
    }, []);

    const handleCloseError = () => {
        setShowError(false);
        setError(null);
    }

    return(
        <div className={styles.CameraContainer}>
            <h1>Your cameras</h1>
            <button className={styles.ReloadButton} onClick={() => {window.location.reload()}}>{loading ? "Reloading cameras..." : "Reload cameras"}</button>
            <div className={styles.List}>
                {cameras.length > 0 ? (
                    <ol>
                        {cameras.map((item, index) => (
                            <li key={index}>
                                <span className={styles.CameraName}>{item.camera_name}</span>
                                <button className={styles.DetailsButton}>Details</button>
                                <button className={styles.DeleteButton}>Delete</button>
                            </li>
                        ))}
                    </ol>
                ) : (<h2>No cameras found</h2>)}
            </div>
            {showError && <ErrorWindow message={error} onClose={handleCloseError}></ErrorWindow>}
        </div>
    );
}

export default CameraList;