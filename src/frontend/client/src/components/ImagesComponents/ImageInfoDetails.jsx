import {useState, useEffect} from "react";
import api from "../UniversalComponents/api.jsx";
import ErrorWindow from "../UniversalComponents/ErrorWindow.jsx";
import ChangeBox from "../UniversalComponents/ChangeBox.jsx";

function ImageInfoDetails({id, onClose}) {
    const [details, setDetails] = useState(null);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [filename, setFilename] = useState("");
    const [newFilename, setNewFilename] = useState("");
    const [showFilenameChange, setShowFilenameChange] = useState(false);
    const [showFilenameChangeConfirmation, setShowFilenameChangeConfirmation] = useState(false);

    useEffect(() => {
        api.get(`/api/image-info/${id}/`, {
        }).then(response => {
            setDetails(response.data);
        }).catch(error => {
            setError(error.message || "Failed to load image details.");
            setShowError(true);
        })
    }, [id, filename])

    const handleFilenameChange = () => {
        if(newFilename === "") {
            setError("Filename cannot be empty");
            setShowError(true);
            return;
        }

        api.patch(`/api/image-info/${id}/change-filename/`, {
            filename: newFilename + ".jpg"
        }).then(() => {
            //window.location.reload();
            setFilename(newFilename);
            setShowFilenameChangeConfirmation(true);
        }).catch(error => {
            setError(error.response?.data?.error || "Failed to change filename.");
            setShowError(true);
        })
    }

    const handleConvertTimestamp = () => {
        const date = new Date(details?.timestamp);
        if(date) {
            return date.toLocaleString(undefined, {     // undefined - default browser settings
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        } else return "N/A";
    }

    const handleCloseError = () => {
        setShowError(false);
        setError(null);
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100">
            <div className="relative w-full max-w-lg max-h-[90vh] p-6 rounded-3xl bg-cyan-50 dark:bg-slate-700 backdrop-blur-3xl shadow-2xl text-black dark:text-white">

                <h2 className="text-2xl font-semibold mb-4">File Details</h2>

                <div className="mb-4">              {/*new div needed to apply margin bottom - else it would require changebox component modifications*/}
                    <ChangeBox nameStr="Filename"
                               nameValue={details?.filename}
                               show={showFilenameChange}
                               onShowClick={() => setShowFilenameChange(true)}
                               showChange={showFilenameChange}
                               value={newFilename}
                               showDropdown={false}
                               onConfirmClick={() => {handleFilenameChange(); setNewFilename("");}}
                               onCancelClick={() => {setShowFilenameChange(false); setShowFilenameChangeConfirmation(false)}}
                               showConfirmation={showFilenameChangeConfirmation}
                               onInputChange={(e) => setNewFilename(e.target.value)}></ChangeBox>
                </div>


                <div className="flex flex-col items-start gap-2 mb-6">
                    <p><span className="font-semibold">File size</span>: {details ? details.file_size / 1000 + " kB" : "N/A"}</p>
                    <p><span className="font-semibold">File type</span>: {details?.file_type || "N/A"}</p>
                    <p><span className="font-semibold">Resolution</span>: {details?.resolution || "N/A"}</p>
                    <p><span className="font-semibold">Timestamp</span>: {handleConvertTimestamp()}</p>
                    <p><span className="font-semibold">Camera</span>: {details?.camera || "N/A"}</p>
                    <p><span className="font-semibold">Model</span>: {details ? details.model.model_name + " version: " + details.model.model_version : "N/A"}</p>
                    <p><span className="font-semibold">Confidence</span>: {Math.round(details?.output?.confidence * 1000) / 1000 || "N/A"}</p>
                    <p><span className="font-semibold">Was processed</span>: {details?.is_processed != null ? (details?.is_processed ? "yes" : "no") : "N/A"}</p>
                    <p><span className="font-semibold">Person Count</span>: {details?.output?.person_count || "N/A"}</p>
                </div>

                <button className="close-button mt-2 px-6 py-2 rounded-full" onClick={onClose}>Close</button>
            </div>
            {showError && <ErrorWindow message={error} onClose={handleCloseError} />}
        </div>
    );
}

export default ImageInfoDetails;