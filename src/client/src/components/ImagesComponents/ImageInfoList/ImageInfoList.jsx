import {useState, useEffect} from "react";
import ErrorWindow from "../../UniversalComponents/ErrorWindow/ErrorWindow.jsx";
import ImageInfoDetails from "../ImageInfoDetails/ImageInfoDetails.jsx";
import ImageWindow from "../ImageWindow/ImageWindow.jsx";
import styles from "./ImageInfoList.module.css";
import api from "../../UniversalComponents/api.jsx";

function ImageInfoList() {
    const [imageInfo, setImageInfo] = useState([]);
    const [currentID, setCurrentID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showSelectedImage, setShowSelectedImage] = useState(false);

    const token = sessionStorage.getItem("token");

    // called once after render and each time after reload button is clicked
    useEffect(() => {
        const fetchImages = async () => {
            const token = sessionStorage.getItem("token");
            setLoading(true);
            try {
                const response = await api.get("/api/image-info/", {
                    headers: { 'Authorization': `Token ${token}` }
                });
                setImageInfo(response.data);

            } catch(error) {
                console.error(error);
                setError(error.message || "Failed to load images.");
                setShowError(true);

            } finally {
                setLoading(false);
            }
        };
        fetchImages();
        }, []);

    function deleteImageInfo(id, index) {
        api.delete(`/api/image-info/${id}/`, {
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

    const handleShowDetails = (id) => {
        setShowDetails(true);
        setCurrentID(id);
    }

    const handleCloseError = () => {
        setError(null);
        setShowError(false);
    }

    const handleCloseDetails = () => {
        setShowDetails(false);
        window.location.reload();
    }

    const handleShowImage = (item) => {
        setSelectedImage(item);
        setShowSelectedImage(true);
    }

    const handleCloseSelectedImage = () => {
        setSelectedImage(null);
        setShowSelectedImage(false);
    }

    return(
        <div className={styles.ImagesContainer}>
            <h1>Captured Images</h1>
            <button className={styles.ReloadButton} onClick={() => {window.location.reload()}}>{loading ? "Reloading images..." : "Reload images"}</button>
            <div className={styles.List}>
                {imageInfo.length > 0 ? (
                    <ol>
                        {imageInfo.map((item, index) => (
                            <li key={index}>
                                <span className={styles.Filename} onClick={() => handleShowImage(item)}>{item.filename}</span>
                                <button className={styles.ShowImageButton} onClick={() => handleShowImage(item)}>Show Image</button>
                                <button className={styles.DetailsButton} onClick={() => handleShowDetails(item.id)}>Details</button>
                                <button className={styles.DeleteButton} onClick={() => deleteImageInfo(item.id, index)}>Delete</button>
                            </li>
                        ))}
                    </ol>
                ) : (<h2>No images found</h2>)}
            </div>
            {showError && <ErrorWindow message={error} onClose={handleCloseError}></ErrorWindow>}
            {showDetails && <ImageInfoDetails id={currentID} onClose={handleCloseDetails}></ImageInfoDetails>}
            {showSelectedImage && <ImageWindow filename={selectedImage.filename} path={selectedImage.path} onClose={handleCloseSelectedImage}></ImageWindow>}
        </div>
    );
}

export default ImageInfoList;