import ErrorWindow from "../UniversalComponents/ErrorWindow.jsx";
import {useState} from "react";

function ImageWindow({path, filename, onClose}) {
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const address = window.RUNTIME_CONFIG?.SERVER_IP
    const [src, setSrc] = useState(null);

    useEffect(() => {
        const controller = new AbortController();   // it enables cancelling requests
        let revoke;
        setSrc(null);

        api.get(`/api/image-info/${id}/get-permission/`, {
            responseType: "blob",       // binary file
            signal: controller.signal,  // signal that can abort request
        }).then(res => {
                const url = URL.createObjectURL(res.data);  // url to image, so src can display it
                setSrc(url);
                revoke = () => URL.revokeObjectURL(url);    // function to free memory after closing image window
        }).catch(e => {
                if(e.name === "CanceledError" || e.code === "ERR_CANCELED") return;     // returning when user cancels
                setError(e?.message || "Download failed");
                setShowError(true);
        });

        return () => {        // called when component demounts
            controller.abort();     // aborts downloading image
            if(revoke) revoke();    // freeing memory
        };
    }, [id]);

    const handleCloseError = () => {
        setError(null);
        setShowError(false);
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100">
            <div className="relative flex flex-col items-center w-full max-w-5xl max-h-full p-6 rounded-3xl bg-cyan-50 dark:bg-slate-700
             backdrop-blur-3xl shadow-2xl text-black dark:text-white">
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