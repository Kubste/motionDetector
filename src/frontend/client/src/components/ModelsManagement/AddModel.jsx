import ErrorWindow from "../UniversalComponents/ErrorWindow.jsx";
import api from "../UniversalComponents/api.jsx";
import {useState} from "react";

function AddModel({onClose, onModelAdd}) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);

    const [modelName, setModelName] = useState("");
    const [modelVersion, setModelVersion] = useState("");
    const [modelURL, setModelURL] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        await api.post(`/api/tensor-flow-models/`, {
            "model_name": modelName,
            "model_version": modelVersion,
            "model_url": modelURL,
        }).then(() => {
            onModelAdd();
        }).catch(error => {
            setError(error.response?.data?.error || "Failed to add model.");
            setShowError(true);
        }).finally(() => setLoading(false));
    }

    const handleCloseError = () => {
        setError('');
        setShowError(false);
    }

    return(
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-100">
            <div className="bg-cyan-50 dark:bg-slate-700 flex flex-col justify-center items-center rounded-3xl p-6 min-w-[500px] max-w-[90%] shadow-3xl gap-4">
                <h2 className="text-2xl font-semibold">Input new model parameters</h2>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="flex flex-col items-center gap-3 w-full">
                        <input className="input px-4 py-2"
                               type="text"
                               placeholder="Enter model name"
                               value={modelName}
                               onChange={(event) => setModelName(event.target.value)} required/>

                        <input className="input px-4 py-2"
                               type="text" placeholder="Enter model version"
                               value={modelVersion}
                               onChange={(event) => setModelVersion(event.target.value)} required/>

                        <input className="input px-4 py-2"
                               type="text"
                               placeholder="Enter model URL"
                               value={modelURL}
                               onChange={(event) => setModelURL(event.target.value)} required/>

                        <button className="confirm-button px-3 py-2"
                                type="submit"
                                disabled={loading}>{loading ? "Creating new model ..." : "Create model"}</button>
                    </div>
                </form>
                <button className="close-button px-3 py-2"
                        onClick={onClose}>Close</button>
            </div>
            {showError && <ErrorWindow message={error} onClose={handleCloseError}></ErrorWindow>}
        </div>
    );
} export default AddModel;