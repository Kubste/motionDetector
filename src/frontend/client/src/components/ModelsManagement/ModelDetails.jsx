import ChangeBox from "../UniversalComponents/ChangeBox.jsx";
import ErrorWindow from "../UniversalComponents/ErrorWindow.jsx";
import {useEffect, useState} from "react";
import api from "../UniversalComponents/api.jsx";

function ModelDetails({id, onClose}) {

    const [details, setDetails] = useState(null);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);

    const [modelName, setModelName] = useState("");
    const [newModelName, setNewModelName] = useState("");
    const [showModelNameChange, setShowModelNameChange] = useState(false);
    const [showModelNameChangeConfirmation, setShowModelNameChangeConfirmation] = useState(false);

    const [modelVersion, setModelVersion] = useState("");
    const [newModelVersion, setNewModelVersion] = useState("");
    const [showModelVersionChange, setShowModelVersionChange] = useState(false);
    const [showModelVersionChangeConfirmation, setShowModelVersionChangeConfirmation] = useState(false);

    const [modelURL, setModelURL] = useState("");
    const [newModelURL, setNewModelURL] = useState("");
    const [showModelURLChange, setShowModelURLChange] = useState(false);
    const [showModelURLChangeConfirmation, setShowModelURLChangeConfirmation] = useState(false);

    useEffect(() => {
        fetchDetails();
    }, [id, modelName, modelVersion, modelURL])

    const fetchDetails = () => {
        api.get(`/api/tensor-flow-models/${id}/`
        ).then(response => {
            setDetails(response.data);
        }).catch(error => {
            setError(error.response?.data?.error || "Failed to load model details.");
            setShowError(true);
        })
    }

    const handlePatch = (field, fieldValue, valueSetter, confirmationSetter) => {

        api.patch(`/api/tensor-flow-models/${id}/`, {
            [field]: fieldValue
        }).then(() => {
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

    const handleCloseError = () => {
        setShowError(false);
        setError(null);
    }


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100">
            <div
                className="bg-white dark:bg-slate-700 rounded-xl p-6 min-w-[500px] max-h-[90vh] shadow-2xl text-black dark:text-white flex flex-col items-center gap-3">

                <p className="text-2xl font-semibold mb-4">Model Details</p>
                <ChangeBox nameStr="Model Name"
                           nameValue={details?.model_name}
                           show={showModelNameChange}
                           onShowClick={() => setShowModelNameChange(true)}
                           showChange={showModelNameChange}
                           value={newModelName}
                           showDropdown={false}
                           onConfirmClick={() => {
                               handlePatch("model_name", newModelName, setModelName, setShowModelNameChangeConfirmation);
                               setNewModelName("")
                           }}
                           onCancelClick={() => {
                               setShowModelNameChange(false);
                               setShowModelNameChangeConfirmation(false)
                           }}
                           showConfirmation={showModelNameChangeConfirmation}
                           onInputChange={(e) => setNewModelName(e.target.value)}></ChangeBox>

                <ChangeBox nameStr="Model Version"
                           nameValue={details?.model_version}
                           show={showModelVersionChange} onShowClick={() => setShowModelVersionChange(true)}
                           showChange={showModelVersionChange}
                           value={newModelVersion}
                           showDropdown={false}
                           onConfirmClick={() => {
                               handlePatch("model_version", newModelVersion, setModelVersion, setShowModelVersionChangeConfirmation);
                               setNewModelVersion("");
                           }}
                           onCancelClick={() => {
                               setShowModelVersionChange(false);
                               setShowModelVersionChangeConfirmation(false)
                           }}
                           showConfirmation={showModelVersionChangeConfirmation}
                           onInputChange={(e) => setNewModelVersion(e.target.value)}></ChangeBox>

                <ChangeBox nameStr="Model URL"
                           nameValue={details?.model_url}
                           show={showModelURLChange}
                           onShowClick={() => setShowModelURLChange(true)}
                           showChange={showModelURLChange}
                           value={newModelURL}
                           showDropdown={false}
                           onConfirmClick={() => {
                               handlePatch("model_url", newModelURL, setModelURL, setShowModelURLChangeConfirmation);
                               setNewModelURL("");
                           }}
                           onCancelClick={() => {
                               setShowModelURLChange(false);
                               setShowModelURLChangeConfirmation(false)
                           }}
                           showConfirmation={showModelURLChangeConfirmation}
                           onInputChange={(e) => setNewModelURL(e.target.value)}></ChangeBox>

                <button className="close-button mt-2 px-6 py-2 rounded-full" onClick={onClose}>Close</button>
            </div>
            {showError && <ErrorWindow message={error} onClose={handleCloseError}></ErrorWindow>}
        </div>
    );
} export default ModelDetails;