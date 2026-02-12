import {useState, useEffect, useRef} from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ErrorWindow from "../UniversalComponents/ErrorWindow.jsx";
import api from "../UniversalComponents/api.jsx";
import {useTranslation} from "react-i18next";
import {Spinner} from "@/components/ui/spinner.js";

function ImageWindow({id, filename, onClose}) {
    const modalRef = useRef(null);
    const { t } = useTranslation();

    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [src, setSrc] = useState(null);

    const handleClickOutside = (event) => {
        if(modalRef.current && !modalRef.current.contains(event.target)) onClose();
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const controller = new AbortController();   // it enables cancelling requests
        let revoke;
        setSrc(null);

        api.get(`/api/image-info/${id}/get-image/`, {
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

    const handleSave = () => {
        if(!src) {
            setError("Image not loaded yet");
            setShowError(true);
            return;
        }

        try {
            const link = document.createElement("a");
            link.href = src;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch(err) {
            setError("Failed to save image");
            setShowError(true);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
            <div ref={modalRef} className="p-0 min-w-[450px]">
            <Card className="relative flex flex-col w-full max-w-5xl max-h-[90vh] p-6 rounded-2xl shadow-2xl overflow-auto no-scrollbar bg-white/90 dark:bg-slate-800/80 backdrop-blur-lg">
                <CardHeader className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold">{filename}</CardTitle>
                    <Button variant="ghost" size="icon" className="hover:cursor-pointer" onClick={onClose}>✕</Button>
                </CardHeader>

                <CardContent className="flex justify-center items-center mt-4">
                    {src ? (<img src={src}
                                 alt={filename}
                                 className="rounded-xl shadow-lg max-h-[70vh] w-auto object-contain hover:scale-105 transition-transform hover:cursor-pointer"
                                 onClick={() => window.open(src, "_blank")}
                                 onError={() => {setError(`Failed to load ${filename}`); setShowError(true);}}/>
                    ) : (<div className="flex justify-center items-center gap-6">
                            <p className="text-slate-500 dark:text-slate-300">{t("loadingImage")}</p>
                            <Spinner className="text-slate-500 dark:text-slate-300" />
                        </div>)}
                </CardContent>



                <div className="flex justify-center mt-6 gap-6">
                    <Button onClick={handleSave} className="hover:cursor-pointer" variant="secondary">{t("saveImage")}</Button>
                    <Button onClick={onClose} className="hover:cursor-pointer" variant="destructive">{t("close")}</Button>
                </div>
            </Card>

            </div>
            {showError && <ErrorWindow message={error} onClose={handleCloseError} />}
        </div>
    );
}

export default ImageWindow;