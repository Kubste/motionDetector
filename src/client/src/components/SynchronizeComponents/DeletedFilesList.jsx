import ErrorWindow from "../UniversalComponents/ErrorWindow.jsx";
import {useEffect, useState} from "react";
import api from "../UniversalComponents/api.jsx";

function DeletedFilesList({cameraID}) {

    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        handleGetDeletedFiles()
    }, [])

    const handleGetDeletedFiles = () => {
        setLoading(true);
        api.get(`/api/cameras/${cameraID}/get-deleted-files`)
            .then(response => {
                if(response.status !== 204) setFiles(response.data.paths)
                else setFiles([]);
            }).catch(error => {
            if(error.response) setError(error.response.data.detail || "Internal Server Error");
            else if(error.request) setError("Cannot connect to the server.");
            else setError(error.message);
            setShowError(true);
        }).finally(() => setLoading(false));
    }

    const handleDeleteFile = (ids) => {
        api.delete(`api/cameras/${cameraID}/synchronize/`, {
            data: {ids: ids}
        }).then(response => {
            handleGetDeletedFiles();
        }).catch(error => {
            if(error.response) setError(error.response.data.detail || "Internal Server Error");
            else if(error.request) setError("Cannot connect to the server.");
            else setError(error.message);
            setShowError(true);
        })
    }

    const handleCloseError = () => {
        setError("");
        setShowError(false);
    }

    return (
        <div className="flex flex-col text-center justify-center px-5 w-2/5 my-10 mx-auto">
            <h1 className="mb-5 text-black dark:text-white font-bold text-3xl">Found deleted files</h1>

            <button
                className="button w-[250px] px-4 py-2 mb-4 mx-auto rounded-full bg-cyan-600 dark:bg-slate-700 text-white text-xl
                hover:bg-cyan-800 dark:hover:bg-slate-800 transition"
                onClick={handleGetDeletedFiles}>
                {loading ? "Reloading deleted files..." : "Reload deleted files"}</button>

            {files.length !== 0 && <button
                className="close-button w-[200px] px-4 py-2 mb-4 mx-auto rounded-full text-white text-xl transition"
                onClick={() => handleDeleteFile(files.map(([id]) => id), null)}
            >Delete all</button>}


            <div className="w-full">
                {files.length > 0 ?
                    <ol className="p-0 m-0">
                        {files.map(([id, path], index) => (
                            <li className="flex justify-between items-center px-4 py-3 mb-3 rounded-3xl bg-cyan-50 dark:bg-slate-700 shadow-md
                                            transition-transform hover:-translate-y-0.5 hover:shadow-xl hover:bg-white/20 dark:hover:bg-slate-800"
                                key={index}>
                              <span className="flex-1 font-medium text-black dark:text-white break-words">
                                {index + 1}. {path}</span>

                                <div className="flex">
                                    <button className="close-button px-3 py-1 rounded-full text-sm text-white"
                                            onClick={() => handleDeleteFile([id], index)}
                                    >Delete</button>

                                </div>
                            </li>
                        ))}
                    </ol> : <h2 className="text-2xl">No deleted files found</h2>}
            </div>

            {showError && <ErrorWindow message={error} onClose={handleCloseError} />}
        </div>
    );
}

export default DeletedFilesList;