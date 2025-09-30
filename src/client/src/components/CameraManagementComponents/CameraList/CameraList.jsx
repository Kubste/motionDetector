import styles from './CameraList.module.css';
import ErrorWindow from "../../UniversalComponents/ErrorWindow/ErrorWindow.jsx";
import ConfirmWindow from "../../UniversalComponents/ConfirmWindow/ConfirmWindow.jsx";
import CameraDetails from "../CameraDetails/CameraDetails.jsx";
import AddCamera from "../AddCamera/AddCamera.jsx";
import {useEffect, useState} from "react";
import api from "../../UniversalComponents/api.jsx";

function CameraList() {
    const [cameras, setCameras] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showAddCamera, setShowAddCamera] = useState(false);
    const [currentID, setCurrentID] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [selectedIndex, setSelectedIndex] = useState(null);

    const token = sessionStorage.getItem("token");

    // called once after render and each time after reload button is clicked
    useEffect(() => {
        const fetchCameras = async () => {
            setLoading(true);

            try {
                const response = await api.get("/api/cameras/");
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

    function deleteCamera(id, index) {
        api.delete(`/api/cameras/${id}/`, {
            headers: {
                Authorization: `Token ${token}`
            }
        }).then(() => {
            const updatedCameras = cameras.filter((_, i) => i !== index);
            setCameras(updatedCameras);
        }).catch(error => {
            console.log(error);
            if(error.response) setError(error.response.data.detail || "Internal Server Error");
            else if(error.request) setError("Cannot connect to the server.");
            else setError(error.message);
            setShowError(true);
        })
    }

    const handleShowCameraDetails = (id) => {
        setShowDetails(true);
        setCurrentID(id);
    }

    const handleCloseCameraDetails = () => {
        setShowDetails(false);
        window.location.reload();
    }

    const handleShowAddCamera = () => {
        setShowAddCamera(true);
    }

    const handleCloseAddCamera = () => {
        setShowAddCamera(false);
    }

    const handleCloseError = () => {
        setShowError(false);
        setError(null);
    }

    const handleCancelConfirmation = () => {
        setShowConfirmation(false);
        setSelectedItem({});
        setSelectedIndex(null);
    }

    const handleConfirmConfirmation = () => {
        deleteCamera(selectedItem.id, selectedIndex);
        setShowConfirmation(false);
        setSelectedItem({});
        setSelectedIndex(null);
    }

    return(
        <div className={styles.CameraContainer}>
            <h1>Your cameras</h1>
            <button className={styles.ReloadButton} onClick={() => {window.location.reload()}}>{loading ? "Reloading cameras..." : "Reload cameras"}</button>
            <button className={styles.AddButton} onClick={handleShowAddCamera}>Add new camera</button>
            <div className={styles.List}>
                {cameras.length > 0 ? (
                    <ol>
                        {cameras.map((item, index) => (
                            <li key={index}>
                                <span className={styles.CameraName}>{item.camera_name}</span>
                                <button className={styles.DetailsButton} onClick={() => handleShowCameraDetails(item.id)}>Details</button>
                                <button className={styles.DeleteButton} onClick={() => {setSelectedItem(item); setSelectedIndex(index); setShowConfirmation(true);}}>Delete</button>
                            </li>
                        ))}
                    </ol>
                ) : (<h2>No cameras found</h2>)}
            </div>
            {showError && <ErrorWindow message={error} onClose={handleCloseError}></ErrorWindow>}
            {showDetails && <CameraDetails id={currentID} onClose={handleCloseCameraDetails}></CameraDetails>}
            {showAddCamera && <AddCamera onClose={handleCloseAddCamera}></AddCamera>}
            {showConfirmation && <ConfirmWindow message={`delete ${selectedItem.camera_name}`} onClose={handleCancelConfirmation} onConfirm={handleConfirmConfirmation}></ConfirmWindow>}
        </div>
    );
}

export default CameraList;