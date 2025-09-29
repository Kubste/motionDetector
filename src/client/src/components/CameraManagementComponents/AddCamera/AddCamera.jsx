import styles from './AddCamera.module.css'
import ErrorWindow from '../../UniversalComponents/ErrorWindow/ErrorWindow.jsx';
import DropBar from "../../UniversalComponents/DropBar/DropBar.jsx";
import {useEffect, useState} from "react";
import api from "../../UniversalComponents/api.jsx";

function AddCamera({onClose}) {

    const [cameraName, setCameraName] = useState('');
    const [boardName, setBoardName] = useState('');
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [confidence, setConfidence] = useState('');
    const [process, setProcess] = useState(null);
    const [model, setModel] = useState(null);
    const [models, setModels] = useState([]);

    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        await api.post(`/api/cameras/`, {
            "camera_name": cameraName,
            "board_name": boardName,
            "location": location,
            "address": address,
            "confidence_threshold": parseFloat(confidence),
            "user": sessionStorage.getItem('user_id'),
            "model_id": model.value,
            "process_image": process.value
        }).then(() => {
            window.location.reload();
        }).catch(error => {
            setError(error.response?.data?.error || "Failed to add camera.");
            setShowError(true);
        }).finally(() => setLoading(false));
    }

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        api.get(`/api/tensor-flow-models/`,  {
            headers: {
                Authorization: `Token ${token}`
            }
        }).then((response) => {
            setModels(response.data);
        }).catch(error => {
            setError(error.response?.data?.error || "Failed to load tensor flow models.");
        })
    },[])

    const handleProcessChange = (option) => {
        setProcess(option);
    }

    const handleModelChange = (option) => {
        setModel(option);
    }

    const handleCloseError = () => {
        setError('');
        setShowError(false);
    }

    return(
        <div className={styles.Window}>
            <div className={styles.FormContainer}>
                <h2>Input new camera parameters</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.Inputs}>
                        <input type="text" placeholder="Enter camera name" value={cameraName} onChange={(event) => setCameraName(event.target.value)} required={true}/>
                        <input type="text" placeholder="Enter board name" value={boardName} onChange={(event) => setBoardName(event.target.value)} required={true}/>
                        <input type="text" placeholder="Enter lcation" value={location} onChange={(event) => setLocation(event.target.value)} required={true}/>
                        <input type="text" placeholder="Enter camera address" value={address} onChange={(event) => setAddress(event.target.value)} required={true}/>
                        <input type="number" placeholder="Enter confidence threshold" value={confidence} onChange={(event) => setConfidence(event.target.value)}
                               required={true} min="0" max="1" step="0.01"/>
                        <DropBar label={"Process image"} options={[{name: "Enabled", value: true}, {name: "Disabled", value: false}]}
                                 onChange={handleProcessChange} selectedOption={process}></DropBar>
                        <DropBar label={"TensorFlowModel"} options={models.map(m => ({name: m.model_name + " " + m.model_version, value: m.id}))}
                                 onChange={handleModelChange} selectedOption={model}></DropBar>
                        <button className={styles.SubmitButton} type="submit" disabled={loading}>{loading ? "Creating new camera ..." : "Create camera"}</button>
                    </div>
                </form>
                <button className={styles.CloseButton} onClick={onClose}>Close</button>
            </div>
            {showError && <ErrorWindow message={error} onClose={handleCloseError}></ErrorWindow>}
        </div>
    );
}

export default AddCamera;