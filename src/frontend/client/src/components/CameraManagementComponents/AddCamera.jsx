import ErrorWindow from '../UniversalComponents/ErrorWindow.jsx';
import DropBar from "../UniversalComponents/DropBar.jsx";
import {useEffect, useState} from "react";
import api from "../UniversalComponents/api.jsx";

function AddCamera({onClose, onCameraAdd}) {

    const [cameraName, setCameraName] = useState('');
    const [boardName, setBoardName] = useState('');
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [confidence, setConfidence] = useState('');
    const [process, setProcess] = useState(null);
    const [model, setModel] = useState(null);
    const [models, setModels] = useState([]);
    const [resolution, setResolution] = useState(null);

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
            "user": localStorage.getItem('user_id'),
            "model_id": model.value,
            "process_image": process.value,
            "resolution": resolution.value
        }).then(() => {
            onCameraAdd();
        }).catch(error => {
            console.log(error);
            // setError(error.response?.data?.error || "Failed to add camera.");
            // setShowError(true);
            const errorData = error.response?.data;

            if(errorData.non_field_errors?.[0]) setError(errorData.non_field_errors?.[0]);
            else {
                // finding the right key in errorData - finding sublist with length is greater than 0
                const fieldKey = Object.keys(errorData).find(key => Array.isArray(errorData[key]) && errorData[key].length > 0);
                if(fieldKey) setError(errorData[fieldKey][0] || "Failed to change field");
            }
            setShowError(true);
        }).finally(() => setLoading(false));
    }

    useEffect(() => {
        api.get(`/api/tensor-flow-models/`,  {
        }).then((response) => {
            setModels(response.data.results);
        }).catch(error => {
            setError(error.response?.data?.error || "Failed to load tensor flow models.");
        })
    },[cameraName, boardName, location, address, confidence, model, process, resolution])

    const handleProcessChange = (option) => {
        setProcess(option);
    }

    const handleModelChange = (option) => {
        setModel(option);
    }

    const handleResolutionChange = (option) => {
        setResolution(option);
    }

    const handleCloseError = () => {
        setError('');
        setShowError(false);
    }

    return(
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-100">
            <div className="bg-cyan-50 dark:bg-slate-700 flex flex-col justify-center items-center rounded-3xl p-6 min-w-[500px] max-w-[90%] shadow-3xl gap-4">
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

                        <DropBar label={"Resolution"}
                                 options={[{name: "1600x1200", value: "1600x1200"}, {name: "1280x1024", value: "1280x1024"}, {name: "1024x768", value: "1024x768"},
                                 {name: "800x600", value: "800x600"}, {name: "640x480", value: "640x480"}, {name: "320x240", value: "320x240"}, {name: "176x144", value: "176x144"}]}
                                 onChange={handleResolutionChange}
                                 selectedOption={resolution}/>

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