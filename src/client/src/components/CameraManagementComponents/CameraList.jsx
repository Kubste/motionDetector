import ErrorWindow from "../UniversalComponents/ErrorWindow.jsx";
import ConfirmWindow from "../UniversalComponents/ConfirmWindow.jsx";
import CameraDetails from "./CameraDetails.jsx";
import AddCamera from "./AddCamera.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../UniversalComponents/api.jsx";

function CameraList({isList}) {
    const navigate = useNavigate();

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
        if(!isList) return;
        api.delete(`/api/cameras/${id}/`, {
            headers: {
                Authorization: `Token ${token}`
            }
        }).then(() => {
            const updatedCameras = cameras.filter((_, i) => i !== index);
            setCameras(updatedCameras);
        }).catch(error => {
            if(error.response) setError(error.response.data.detail || "Internal Server Error");
            else if(error.request) setError("Cannot connect to the server.");
            else setError(error.message);
            setShowError(true);
        })
    }

    const handleGetDeletedFiles = (id) => {
        if(isList) return;
        api.get(`/api/cameras/${id}/get-deleted-files`)
            .then(response => {
                if(response.status === 204) {
                    setError("No deleted files found");
                    setShowError(true)
                } else navigate(`/synchronize-list?camera=${id}`, {state: {filesList: response.data.paths}});
            }).catch(error => {
            if(error.response) setError(error.response.data.detail || "Internal Server Error");
            else if(error.request) setError("Cannot connect to the server.");
            else setError(error.message);
            setShowError(true);
        })
    }

    const handleShowCameraDetails = (id) => {
        if(!isList) return;
        setShowDetails(true);
        setCurrentID(id);
    }

    const handleCloseCameraDetails = () => {
        if(!isList) return;
        setShowDetails(false);
        window.location.reload();
    }

    const handleShowAddCamera = () => {
        if(!isList) return;
        setShowAddCamera(true);
    }

    const handleCloseAddCamera = () => {
        if(!isList) return;
        setShowAddCamera(false);
    }

    const handleCloseError = () => {
        setShowError(false);
        setError(null);
    }

    const handleCancelConfirmation = () => {
        if(!isList) return;
        setShowConfirmation(false);
        setSelectedItem({});
        setSelectedIndex(null);
    }

    const handleConfirmConfirmation = () => {
        if(!isList) return;
        deleteCamera(selectedItem.id, selectedIndex);
        setShowConfirmation(false);
        setSelectedItem({});
        setSelectedIndex(null);
    }

    return (
        <div className="flex flex-col text-center justify-center px-5 w-2/5 my-10 mx-auto">
            <h1 className="mb-5 text-black font-bold text-3xl">Your cameras</h1>

            <button
                className="button w-[200px] px-4 py-2 mb-4 mx-auto rounded-full bg-cyan-600 text-white text-xl hover:bg-cyan-800 transition"
                onClick={() => window.location.reload()}>{loading ? "Reloading cameras..." : "Reload cameras"}</button>

            {isList && <button
                className="button w-[200px] px-4 py-2 mb-12 mx-auto rounded-full bg-green-500 text-white text-xl hover:bg-green-600 transition"
                onClick={handleShowAddCamera}>Add new camera</button>}

            <div className="w-full">
                {cameras.length > 0 ?
                    <ol className="p-0 m-0">
                        {cameras.map((item, index) => (
                            <li className="flex justify-between items-center px-4 py-3 mb-3 rounded-3xl bg-cyan-50 shadow-md
                                            transition-transform hover:-translate-y-0.5 hover:shadow-xl hover:bg-white/20"
                                key={index}>
                              <span className="flex-1 font-medium text-black break-words">
                                {index + 1}. {item.camera_name}</span>

                                <div className="flex">
                                    {isList && <button className="button px-3 py-1 rounded-full text-sm bg-blue-500 text-white hover:bg-blue-700"
                                        onClick={() => handleShowCameraDetails(item.id)}>Details</button>}

                                    {isList && <button className="close-button px-3 py-1 rounded-full text-sm ml-2 text-white"
                                        onClick={() => {
                                            setSelectedItem(item);
                                            setSelectedIndex(index);
                                            setShowConfirmation(true);
                                        }}>Delete</button>}

                                    {!isList && <button className="button px-3 py-1 rounded-full text-sm bg-blue-500 text-white hover:bg-blue-700"
                                    onClick={() => navigate(`/synchronize-list?camera=${item.id}`)}>
                                        Synchronize
                                    </button>}
                                </div>
                            </li>
                        ))}
                    </ol> : <h2 className="text-2xl">No cameras found</h2>}
            </div>

            {showError && <ErrorWindow message={error} onClose={handleCloseError} />}
            {showDetails && <CameraDetails id={currentID} onClose={handleCloseCameraDetails} />}
            {showAddCamera && <AddCamera onClose={handleCloseAddCamera} />}
            {showConfirmation && <ConfirmWindow message={`delete ${selectedItem.camera_name}`} onClose={handleCancelConfirmation} onConfirm={handleConfirmConfirmation}/>}
        </div>
    );
}

export default CameraList;