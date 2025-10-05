import ErrorWindow from '../UniversalComponents/ErrorWindow.jsx';
import DropBar from "../UniversalComponents/DropBar.jsx";
import {useEffect, useState} from "react";
import api from "../UniversalComponents/api.jsx";

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
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-100">
            <div className="bg-cyan-50 flex flex-col justify-center items-center rounded-3xl p-6 min-w-[500px] max-w-[90%] shadow-3xl gap-4">
                <h2 className="text-2xl font-semibold">Input new camera parameters</h2>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="flex flex-col items-center gap-3 w-full">
                        <input className="input px-4 py-2"
                               type="text"
                               placeholder="Enter camera name"
                               value={cameraName}
                               onChange={(event) => setCameraName(event.target.value)} required/>

                        <input className="input px-4 py-2"
                               type="text" placeholder="Enter board name"
                               value={boardName}
                               onChange={(event) => setBoardName(event.target.value)} required/>

                        <input className="input px-4 py-2"
                               type="text"
                               placeholder="Enter location"
                               value={location}
                               onChange={(event) => setLocation(event.target.value)} required/>

                        <input className="input px-4 py-2"
                               type="text" placeholder="Enter camera address"
                               value={address}
                               onChange={(event) => setAddress(event.target.value)} required/>

                        <input className="input px-4 py-2"
                               type="number"
                               placeholder="Enter confidence threshold"
                               value={confidence}
                               onChange={(event) => setConfidence(event.target.value)}
                               required min="0" max="1" step="0.01"/>

                        <DropBar label={"Process image"}
                                 options={[{name: "Enabled", value: true}, {name: "Disabled", value: false}]}
                                 onChange={handleProcessChange}
                                 selectedOption={process}/>

                        <DropBar label={"TensorFlowModel"}
                                 options={models.map(m => ({name: m.model_name + " " + m.model_version, value: m.id}))}
                                 onChange={handleModelChange}
                                 selectedOption={model}/>

                        <button className="confirm-button px-3 py-2"
                                type="submit"
                                disabled={loading}>{loading ? "Creating new camera ..." : "Create camera"}</button>
                    </div>
                </form>
                <button className="close-button px-3 py-2"
                    onClick={onClose}>Close</button>
            </div>
            {showError && <ErrorWindow message={error} onClose={handleCloseError}></ErrorWindow>}
        </div>
    );
}

export default AddCamera;