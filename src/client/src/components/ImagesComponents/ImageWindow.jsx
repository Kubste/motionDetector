import ErrorWindow from "../UniversalComponents/ErrorWindow.jsx";
import {useState} from "react";

function ImageWindow({path, filename, onClose}) {
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);

    const imageURL = `https://192.168.100.7/${path}`;

    const handleCloseError = () => {
        setError(null);
        setShowError(false);
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100">
            <div className="relative flex flex-col items-center w-full max-w-5xl max-h-full p-6 rounded-3xl bg-cyan-50 backdrop-blur-3xl shadow-2xl text-black">
                <h2 className="mb-4 text-2xl font-semibold">{filename}</h2>

                <img className="object-contain max-h-[calc(90vh-120px)] w-full rounded-lg shadow-md"
                    src={imageURL}
                    alt={filename}
                    onLoad={handleCloseError}
                    onError={() => {
                        setError(`Failed to load ${filename}`);
                        setShowError(true);
                    }}/>

                <button className="close-button mt-6 px-6 py-2 rounded-full" onClick={onClose}>Close</button>
            </div>
            {showError && <ErrorWindow message={error} onClose={handleCloseError}/>}
        </div>
    );
}

export default ImageWindow;