import styles from './CameraDetails.module.css';
import {useState, useEffect} from "react";
import axios from "axios";
import ErrorWindow from "../../UniversalComponents/ErrorWindow/ErrorWindow.jsx";
import ChangeBox from "../ChangeBox/ChangeBox.jsx";

function ImageInfoDetails({id, onClose}) {
    const [details, setDetails] = useState(null);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);

    const [cameraName, setCameraName] = useState("");
    const [newCameraName, setNewCameraName] = useState("");
    const [showCameraNameChange, setShowCameraNameChange] = useState(false);
    const [showCameraNameChangeConfirmation, setShowCameraNameChangeConfirmation] = useState(false);

    const [boardName, setBoardName] = useState("");
    const [newBoardName, setNewBoardName] = useState("");
    const [showBoardNameChange, setShowBoardNameChange] = useState(false);
    const [showBoardNameChangeConfirmation, setShowBoardNameChangeConfirmation] = useState(false);

    const [location, setLocation] = useState("");
    const [newLocation, setNewLocation] = useState("");
    const [showLocationChange, setShowLocationChange] = useState(false);
    const [showLocationChangeConfirmation, setShowLocationChangeConfirmation] = useState(false);

    const [address, setAddress] = useState("");
    const [newAddress, setNewAddress] = useState("");
    const [showAddressChange, setShowAddressChange] = useState(false);
    const [showAddressChangeConfirmation, setShowAddressChangeConfirmation] = useState(false);

    const [confidence, setConfidence] = useState("");
    const [newConfidence, setNewConfidence] = useState("");
    const [showConfidenceChange, setShowConfidenceChange] = useState(false);
    const [showConfidenceChangeConfirmation, setShowConfidenceChangeConfirmation] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        axios.get(`https://192.168.100.7/api/cameras/${id}/`, {
            headers: {
                Authorization: `Token ${token}`,
            },
        }).then(response => {
            setDetails(response.data);
        }).catch(error => {
            setError(error.message || "Failed to load cameras details.");
            setShowError(true);
        })
    }, [id, cameraName, boardName, location, address, confidence])

    const handlePatch = (field, fieldValue, valueSetter, confirmationSetter) => {
        const token = sessionStorage.getItem('token');

        axios.patch(`https://192.168.100.7/api/cameras/${id}/`, {
            [field]: fieldValue
        }, {headers: {
                Authorization: `Token ${token}`
            }
        }).then(() => {
            //window.location.reload();
            valueSetter(fieldValue);
            confirmationSetter(true);
        }).catch(error => {
            setError(error.response?.data?.error || "Failed to change field");
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
                <ChangeBox nameStr="Camera Name" nameValue={details?.camera_name} show={showCameraNameChange} onShowClick={() => setShowCameraNameChange(true)}
                           showChange={showCameraNameChange} value={newCameraName}
                           onConfirmClick={() => handlePatch("camera_name", newCameraName, setCameraName, setShowCameraNameChangeConfirmation)}
                           onCancelClick={() => {setShowCameraNameChange(false); setShowCameraNameChangeConfirmation(false)}}
                           showConfirmation={showCameraNameChangeConfirmation} onInputChange={(e) => setNewCameraName(e.target.value)}></ChangeBox>

                <ChangeBox nameStr="Board Name" nameValue={details?.board_name} show={showBoardNameChange} onShowClick={() => setShowBoardNameChange(true)}
                           showChange={showBoardNameChange} value={newBoardName}
                           onConfirmClick={() => handlePatch("board_name", newBoardName, setBoardName, setShowBoardNameChangeConfirmation)}
                           onCancelClick={() => {setShowBoardNameChange(false); setShowBoardNameChangeConfirmation(false)}}
                           showConfirmation={showBoardNameChangeConfirmation} onInputChange={(e) => setNewBoardName(e.target.value)}></ChangeBox>

                <ChangeBox nameStr="Location" nameValue={details?.location} show={showLocationChange} onShowClick={() => setShowLocationChange(true)}
                           showChange={showLocationChange} value={newLocation}
                           onConfirmClick={() => handlePatch("location", newLocation, setLocation, setShowLocationChangeConfirmation)}
                           onCancelClick={() => {setShowLocationChange(false); setShowLocationChangeConfirmation(false)}}
                           showConfirmation={showLocationChangeConfirmation} onInputChange={(e) => setNewLocation(e.target.value)}></ChangeBox>

                <ChangeBox nameStr="Address" nameValue={details?.address} show={showAddressChange} onShowClick={() => setShowAddressChange(true)}
                           showChange={showAddressChange} value={newAddress}
                           onConfirmClick={() => handlePatch("address", newAddress, setAddress, setShowAddressChangeConfirmation)}
                           onCancelClick={() => {setShowAddressChange(false); setShowAddressChangeConfirmation(false)}}
                           showConfirmation={showAddressChangeConfirmation} onInputChange={(e) => setNewAddress(e.target.value)}></ChangeBox>

                <ChangeBox nameStr="Confidence Threshold" nameValue={details?.confidence_threshold} show={showConfidenceChange} onShowClick={() => setShowConfidenceChange(true)}
                           showChange={showConfidenceChange} value={newConfidence}
                           onConfirmClick={() => handlePatch("confidence_threshold", newConfidence, setConfidence, setShowConfidenceChangeConfirmation)}
                           onCancelClick={() => {setShowConfidenceChange(false); setShowConfidenceChangeConfirmation(false)}}
                           showConfirmation={showConfidenceChangeConfirmation} onInputChange={(e) => setNewConfidence(e.target.value)}></ChangeBox>

                <button className={styles.CloseButton} onClick={onClose}>Close</button>
            </div>
            {showError && <ErrorWindow message={error} onClose={handleCloseError}></ErrorWindow>}
        </div>
    );
}

export default ImageInfoDetails;