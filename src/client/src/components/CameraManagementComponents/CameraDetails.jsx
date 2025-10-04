import {useState, useEffect} from "react";
import api from "../UniversalComponents/api.jsx";
import ErrorWindow from "../UniversalComponents/ErrorWindow.jsx";
import ChangeBox from "../UniversalComponents/ChangeBox.jsx";

function CameraDetails({id, onClose}) {
    const [details, setDetails] = useState(null);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [models, setModels] = useState([]);

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

    const [process, setProcess] = useState("");
    const [newProcess, setNewProcess] = useState("");
    const [showProcessChange, setShowProcessChange] = useState(false);
    const [showProcessChangeConfirmation, setShowProcessChangeConfirmation] = useState(false);

    const [model, setModel] = useState(null);
    const [newModel, setNewModel] = useState(null);
    const [showModelChange, setShowModelChange] = useState(false);
    const [showModelChangeConfirmation, setShowModelChangeConfirmation] = useState(false);

    useEffect(() => {

        api.get(`/api/cameras/${id}/`
        ).then(response => {
            setDetails(response.data);
        }).catch(error => {
            setError(error.response?.data?.error || "Failed to load cameras details.");
            setShowError(true);
        })

    }, [id, cameraName, boardName, location, address, confidence, process, model])

    const handleFetchModels = () => {
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
    }

    const handlePatch = (field, fieldValue, valueSetter, confirmationSetter) => {
        const token = sessionStorage.getItem('token');

        if(field === 'confidence_threshold' && (Number(fieldValue) < 0 || Number(fieldValue) > 1)) {
            setError("Confidence threshold must be a number in range [0, 1]");
            setShowError(true);
            return;
        }

        api.patch(`/api/cameras/${id}/`, {
            [field]: fieldValue
        }, {headers: {
                Authorization: `Token ${token}`
            }
        }).then(() => {
            //window.location.reload();
            valueSetter(fieldValue);
            confirmationSetter(true);
        }).catch(error => {
            const errorData = error.response?.data;

            if(errorData.non_field_errors?.[0]) setError(errorData.non_field_errors?.[0]);
            else {
                // finding the right key in errorData - finding sublist with length is greater than 0
                const fieldKey = Object.keys(errorData).find(key => Array.isArray(errorData[key]) && errorData[key].length > 0);
                if(fieldKey) setError(errorData[fieldKey][0] || "Failed to change field");
            }
            setShowError(true);
        })
    }

    const handleProcessingChange = (option) => {
        setNewProcess(option);
        setProcess(option);
    }

    const handleModelChange = (option) => {
        setNewModel(option);
        setModel(option);
    }

    const handleCloseError = () => {
        setShowError(false);
        setError(null);
    }

    return(
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100">
            <div className="bg-white rounded-xl p-6 min-w-[500px] max-h-[90vh] shadow-2xl text-black flex flex-col items-center gap-3">

                <p className="text-2xl font-semibold mb-4">Camera Details</p>
                <ChangeBox nameStr="Camera Name"
                           nameValue={details?.camera_name}
                           show={showCameraNameChange}
                           onShowClick={() => setShowCameraNameChange(true)}
                           showChange={showCameraNameChange}
                           value={newCameraName}
                           showDropdown={false}
                           onConfirmClick={() => {handlePatch("camera_name", newCameraName, setCameraName, setShowCameraNameChangeConfirmation); setNewCameraName("")}}
                           onCancelClick={() => {setShowCameraNameChange(false); setShowCameraNameChangeConfirmation(false)}}
                           showConfirmation={showCameraNameChangeConfirmation} onInputChange={(e) => setNewCameraName(e.target.value)}></ChangeBox>

                <ChangeBox nameStr="Board Name"
                           nameValue={details?.board_name}
                           show={showBoardNameChange} onShowClick={() => setShowBoardNameChange(true)}
                           showChange={showBoardNameChange}
                           value={newBoardName}
                           showDropdown={false}
                           onConfirmClick={() => {handlePatch("board_name", newBoardName, setBoardName, setShowBoardNameChangeConfirmation); setNewBoardName("");}}
                           onCancelClick={() => {setShowBoardNameChange(false); setShowBoardNameChangeConfirmation(false)}}
                           showConfirmation={showBoardNameChangeConfirmation} onInputChange={(e) => setNewBoardName(e.target.value)}></ChangeBox>

                <ChangeBox nameStr="Location"
                           nameValue={details?.location}
                           show={showLocationChange}
                           onShowClick={() => setShowLocationChange(true)}
                           showChange={showLocationChange}
                           value={newLocation}
                           showDropdown={false}
                           onConfirmClick={() => {handlePatch("location", newLocation, setLocation, setShowLocationChangeConfirmation); setNewLocation("");}}
                           onCancelClick={() => {setShowLocationChange(false); setShowLocationChangeConfirmation(false)}}
                           showConfirmation={showLocationChangeConfirmation} onInputChange={(e) => setNewLocation(e.target.value)}></ChangeBox>

                <ChangeBox nameStr="Address"
                           nameValue={details?.address}
                           show={showAddressChange} onShowClick={() => setShowAddressChange(true)}
                           showChange={showAddressChange}
                           value={newAddress}
                           showDropdown={false}
                           onConfirmClick={() => {handlePatch("address", newAddress, setAddress, setShowAddressChangeConfirmation); setNewAddress("");}}
                           onCancelClick={() => {setShowAddressChange(false); setShowAddressChangeConfirmation(false)}}
                           showConfirmation={showAddressChangeConfirmation} onInputChange={(e) => setNewAddress(e.target.value)}></ChangeBox>

                <ChangeBox nameStr="Confidence Threshold"
                           nameValue={details?.confidence_threshold}
                           show={showConfidenceChange}
                           onShowClick={() => setShowConfidenceChange(true)}
                           showChange={showConfidenceChange}
                           value={newConfidence}
                           showDropdown={false}
                           onConfirmClick={() => {handlePatch("confidence_threshold", newConfidence, setConfidence, setShowConfidenceChangeConfirmation); setNewConfidence("");}}
                           onCancelClick={() => {setShowConfidenceChange(false); setShowConfidenceChangeConfirmation(false)}}
                           showConfirmation={showConfidenceChangeConfirmation} onInputChange={(e) => setNewConfidence(e.target.value)}></ChangeBox>

                <ChangeBox nameStr="Process Image"
                           nameValue={details?.process_image}
                           show={showProcessChange} onShowClick={() => setShowProcessChange(true)}
                           showChange={showProcessChange}
                           value={newProcess}
                           showDropdown={true}
                           options={[{name: "Enabled", value: true}, {name: "Disabled", value: false}]}
                           label="Choose option"
                           onChange={handleProcessingChange}
                           onConfirmClick={() => {handlePatch("process_image", newProcess.value, setProcess, setShowProcessChangeConfirmation); setNewProcess(null);}}
                           onCancelClick={() => {setShowProcessChange(false); setShowProcessChangeConfirmation(false)}}
                           showConfirmation={showProcessChangeConfirmation} onInputChange={(e) => setNewProcess(e.target.value)}></ChangeBox>

                <ChangeBox
                            nameStr="Tensor flow model"
                            nameValue={details?.model?.model_name + " " + details?.model?.model_version}
                            show={showModelChange}
                            onShowClick={() => {setShowModelChange(true); handleFetchModels();}}
                            showChange={showModelChange}
                            value={newModel}
                            showDropdown={true}
                            options={models.map(m => ({name: m.model_name + " " + m.model_version, value: m.id}))}
                            label="Choose option"
                            onChange={handleModelChange}
                            onConfirmClick={() => {handlePatch("model_id", newModel.value, setModel, setShowModelChangeConfirmation); setNewModel(null)}}
                            onCancelClick={() => {setShowModelChange(false); setShowModelChangeConfirmation(false);}}
                            showConfirmation={showModelChangeConfirmation}
                            onInputChange={(e) => setNewModel(e.target.value)}></ChangeBox>

                <button className="close-button mt-2 px-6 py-2 rounded-full" onClick={onClose}>Close</button>
            </div>
            {showError && <ErrorWindow message={error} onClose={handleCloseError}></ErrorWindow>}
        </div>
    );
}

export default CameraDetails;