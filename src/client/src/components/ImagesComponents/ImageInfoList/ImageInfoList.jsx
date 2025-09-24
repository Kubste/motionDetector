import {useState, useEffect} from "react";
import ErrorWindow from "../../UniversalComponents/ErrorWindow/ErrorWindow.jsx";
import styles from "./ImageInfoList.module.css";
import axios from "axios";

function ImageInfoList() {
    const [imageInfo, setImageInfo] = useState([{}]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);

    const token = sessionStorage.getItem("token");

    // called once after render and each time after reload button is clicked
    useEffect(() => {
        const fetchImages = async () => {
            const token = sessionStorage.getItem("token");
            setLoading(true);
            try {
                const response = await axios.get("https://192.168.100.7/api/image-info/", {
                    headers: { 'Authorization': `Token ${token}` }
                });
                setImageInfo(response.data);

            } catch (err) {
                console.error(err);
                setError("Failed to load images.");

            } finally {
                setLoading(false);
            }
        };
        fetchImages();
        }, []);

    function deleteImageInfo(id, index) {
        axios.delete(`https://192.168.100.7/api/image-info/${id}/`, {
            headers: {
                Authorization: `Token ${token}`
            }
        }).then(() => {
            const updatedImageInfo = imageInfo.filter((_, i) => i !== index);
            setImageInfo(updatedImageInfo);
        }).catch(error => {
            console.log(error);
            if(error.response) setError(error.response.data.detail || "Internal Server Error");
             else if(error.request) setError("Cannot connect to the server.");
             else setError(error.message);
            setShowError(true);
        })
    }

    const handleCloseError = () => {
        setError(null);
        setShowError(false);
    }

    return(
        <div className={styles.ImagesContainer}>
            <h1>Captured Images</h1>
            <button className={styles.ReloadButton} onClick={() => {window.location.reload()}}>{loading ? "Reloading images..." : "Reload images"}</button>
            <div className={styles.List}>
                <ol>
                    {imageInfo.map((item, index) =>
                    <li key={index}>
                        <span className={styles.Filename}>{item.filename}</span>
                        <button className={styles.DetailsButton}>Details</button>
                        <button className={styles.DeleteButton} onClick={() => deleteImageInfo(item.id, index)}>Delete</button>
                    </li>)}
                </ol>
            </div>
            {showError && <ErrorWindow message={error} onClose={handleCloseError}></ErrorWindow>}
        </div>
    );
}

export default ImageInfoList;