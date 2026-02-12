import { useState, useEffect, useRef } from "react";
import api from "../UniversalComponents/api.jsx";
import {Card, CardHeader, CardContent, CardDescription} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Input} from "@/components/ui/input.js";
import {FieldLabel} from "@/components/ui/field.js";

function ImageInfoDetails({id, onClose}) {
    const modalRef = useRef(null);

    const [details, setDetails] = useState(null);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [filename, setFilename] = useState("");
    const [newFilename, setNewFilename] = useState("");
    const [showFilenameChange, setShowFilenameChange] = useState(false);
    const [showFilenameChangeConfirmation, setShowFilenameChangeConfirmation] = useState(false);

    const handleClickOutside = (event) => {
        if(modalRef.current && !modalRef.current.contains(event.target)) onClose();
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
            setNewFilename("");
            setShowFilenameChangeConfirmation(true);
            setShowFilenameChange(false);
            setError(null);
            setShowError(false);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 opacity-100 transition-opacity">
            <div ref={modalRef} className="relative w-full max-w-3xl max-h-[100vh] overflow-auto no-scrollbar p-6 rounded-2xl bg-white/90 dark:bg-slate-800/80 backdrop-blur-xl
                shadow-2xl text-black dark:text-white transition-transform duration-300 ease-out">

                <Card className="bg-transparent shadow-none p-4">
                    <CardHeader className="flex justify-between items-center border-b border-slate-200 dark:border-slate-600 pb-2 mb-4">
                        <h2 className="text-2xl font-semibold">Image Details</h2>
                        <Button variant="ghost" size="icon" onClick={onClose}>✕</Button>
                    </CardHeader>

                    <div className="flex gap-4 mb-6 justify-between items-center">
                        <div className="flex justify-between items-center gap-2">
                            <span className="font-bold text-xl">Filename:</span>
                            <span className="font-semibold">{details?.filename}</span>
                            {showFilenameChangeConfirmation && (
                                <CardDescription className="inline-flex text-left hover:cursor-pointer hover:underline text-green-500"
                                                 onClick={() => setShowFilenameChangeConfirmation(false)}
                                >Filename has been changed</CardDescription>
                            )}
                        </div>

                        {showFilenameChange ? (
                            <div className="flex flex-col justify-start gap-1">
                                {!showError && <CardDescription className="text-left">Enter new filename:</CardDescription>}
                                {showError && <FieldLabel className="text-red-500 font-semibold" htmlFor="input-invalid">{error}</FieldLabel>}
                                <div className="flex justify-between items-center gap-2">
                                    <Input aria-invalid={!!error} placeholder="filename" onChange={(event) => setNewFilename(event.target.value)}></Input>
                                    <Button variant="destructive" className="hover:cursor-pointer" onClick={() => {
                                        setShowFilenameChange(false);
                                        setError(null);
                                        setShowError(false);}}>Cancel</Button>
                                </div>
                            </div>

                        ) : (
                            <Button variant="secondary" className="hover:cursor-pointer" onClick={() => {
                                setShowFilenameChange(true);
                                setShowFilenameChangeConfirmation(false);}}
                            >Change filename</Button>)}
                    </div>

                    <CardContent>
                        <div className="grid grid-cols-2 gap-x-16 gap-y-2 text-sm">
                            <div className="flex justify-between"><span className="font-semibold">File size</span><span>{details ? (details.file_size / 1000).toFixed(1) + " kB" : "N/A"}</span></div>
                            <div className="flex justify-between"><span className="font-semibold">File type</span><span>{details?.file_type || "N/A"}</span></div>
                            <div className="flex justify-between"><span className="font-semibold">Resolution</span><span>{details?.resolution || "N/A"}</span></div>
                            <div className="flex justify-between"><span className="font-semibold">Timestamp</span><span>{handleConvertTimestamp()}</span></div>
                            <div className="flex justify-between"><span className="font-semibold">Camera</span><span>{details?.camera || "N/A"}</span></div>
                            <div className="flex justify-between"><span className="font-semibold">Model</span><span>{details ? details.model.model_name + " v" + details.model.model_version : "N/A"}</span></div>
                            <div className="flex justify-between"><span className="font-semibold">Confidence</span><span>{details?.output?.confidence ? (details.output.confidence.toFixed(3)) : "N/A"}</span></div>
                            <div className="flex justify-between"><span className="font-semibold">Processed</span><span>{details?.is_processed != null ? (details.is_processed ? "yes" : "no") : "N/A"}</span></div>
                            <div className="flex justify-between"><span className="font-semibold">Person Count</span><span>{details?.output?.person_count || "N/A"}</span></div>
                        </div>
                    </CardContent>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button variant="default" className="hover:cursor-pointer" onClick={handleFilenameChange} disabled={!newFilename || newFilename.trim() === ""}>Save Changes</Button>
                        <Button variant="destructive" className="hover:cursor-pointer" onClick={onClose}>Close</Button>
                    </div>
                </Card>
            </div>

            {/*{showError && <ErrorWindow message={error} onClose={handleCloseError} />}*/}
        </div>
    );
}

export default ImageInfoDetails;