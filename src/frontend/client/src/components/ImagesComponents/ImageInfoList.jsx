import React, {useState, useEffect} from "react";
import ErrorWindow from "../UniversalComponents/ErrorWindow.jsx";
import ConfirmWindow from "../UniversalComponents/ConfirmWindow.jsx";
import ImageInfoDetails from "./ImageInfoDetails.jsx";
import ImageWindow from "./ImageWindow.jsx";
import SortingBar from "../UniversalComponents/SortingBar.jsx";
import api from "../UniversalComponents/api.jsx";
import PaginationBar from "../UniversalComponents/PaginationBar.jsx";
import {
    Eye,
    Info,
    Trash2,
    RefreshCw,
} from "lucide-react"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {Button} from "@/components/ui/button.js";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.js";
import {Badge} from "@/components/ui/badge.js";
import {useTranslation} from "react-i18next";
import {Spinner} from "@/components/ui/spinner.js";

function ImageInfoList() {
    const { t } = useTranslation();

    const [imageInfo, setImageInfo] = useState([]);
    const [currentID, setCurrentID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showSelectedImage, setShowSelectedImage] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [sortingField, setSortingField] = useState({name: "Filename", value: "filename"});
    const [order, setOrder] = useState({name: "ascending", value: "asc"});
    const [showChangeOrder, setShowChangeOrder] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState({name: 2, value: 2});


    const fetchImages = async () => {
        setLoading(true);

        try {
            const pageSizeParam = pageSize.value === -1 ? -1 : pageSize.value * 4;

            const response = await api.get(`/api/image-info/?ordering=${order.value}${sortingField.value}&page=${page}&page_size=${pageSizeParam}`);
            const data = response?.data;
            setImageInfo(data.results);
            console.log(imageInfo);
            setTotalPages(pageSize.value === -1 ? 1 : Math.ceil(data.count / pageSizeParam));
        } catch(error) {
            console.error(error);
            setError(error.message || "Failed to load images.");
            setShowError(true);

        } finally {
            setLoading(false);
        }
    };

    // called once after render and each time after reload button is clicked
    useEffect(() => {
        fetchImages();
        }, [page, pageSize, sortingField, order]);

    function deleteImageInfo(id, index) {
        api.delete(`/api/image-info/${id}/`
        ).then(() => {
            const updatedImageInfo = imageInfo.filter((_, i) => i !== index);
            setImageInfo(updatedImageInfo);
        }).catch(error => {
            console.log(error);
            if(error.response) setError(error.response.data.detail || "Internal Server Error");
             else if(error.request) setError("Cannot connect to the server.");
             else setError(error.message);
            setShowError(true);
        })
    }

    const handleShowDetails = (id) => {
        setShowDetails(true);
        setCurrentID(id);
    }

    const handleCloseError = () => {
        setError(null);
        setShowError(false);
    }

    const handleCloseDetails = () => {
        setShowDetails(false);
        //window.location.reload();
    }

    const handleShowImage = (item) => {
        console.log(item);
        setSelectedImage(item);
        setShowSelectedImage(true);
    }

    const handleCloseSelectedImage = () => {
        setSelectedImage(null);
        setShowSelectedImage(false);
    }

    const handleCancelConfirmation = () => {
        setShowConfirmation(false);
        setSelectedItem({});
        setSelectedIndex(null);
    }

    const handleConfirmConfirmation = () => {
        deleteImageInfo(selectedItem.id, selectedIndex);
        setShowConfirmation(false);
        setSelectedItem({});
        setSelectedIndex(null);
    }

    const handlePageSizeChange = (option) => {
        setPageSize(option);
        setPage(1);
    }

    const handleSortingFieldChange = (option) => {
        console.log(option);
        setSortingField(option);
    }

    const handleOrderChange = (option) => {
        console.log(option);
        setOrder(option);
    }

    const handleConvertTimestamp = (timestamp) => {
        const date = new Date(timestamp);
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

    return (
        <div className="flex flex-col text-center justify-center px-5 w-3/5 my-10 mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t("imagesListTitle")}</h1>

                <div className="flex gap-3 items-center">
                    <Button className="hover:cursor-pointer"
                        disabled={loading}
                        variant="outline"
                        onClick={fetchImages}>
                        {loading ? (
                            <>
                                <RefreshCw className="mr-2 size-4 animate-spin" />
                                {t("reloadInProgress")}
                            </>) : (<>
                                    <RefreshCw className="mr-2 size-4" />
                                {t("reload")}
                                </>
                            )}
                    </Button>

                    {!showChangeOrder &&
                        <Button className="hover:cursor-pointer"
                                variant="outline"
                                onClick={() => setShowChangeOrder(!showChangeOrder)}>{t("order")}</Button>}

                    {showChangeOrder &&
                        <SortingBar options={[{name: t("filename"), value: "filename"}, {name: t("fileSize"), value: "file_size"}, {name: t("fileType"), value: "file_type"},
                            {name: t("res"), value: "resolution"}, {name: t("photoDate"), value: "timestamp"}, {name: t("camera"), value: "camera_id"},
                            {name: t("model"), value: "model_id"}, {name: t("wasProcessed"), value: "is_processed"}]}
                                    onChangeField={handleSortingFieldChange}
                                    onChangeOrder={handleOrderChange}
                                    selectedOptionName={sortingField}
                                    selectedOptionOrder={order}
                                    onClose={() => setShowChangeOrder(false)}
                        ></SortingBar>}
                </div>
            </div>

            <div className="flex flex-col text-center justify-center px-5 w-auto my-10 mx-auto">
                <div className="w-full">
                    {imageInfo?.length > 0 ? (
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            {imageInfo.map((item, index) => (
                                <Card key={item.id}
                                    className="group relative bg-white/80 dark:bg-slate-800/70 backdrop-blur-md border border-slate-200/md dark:border-slate-700/60
                                    rounded-2xl shadow-sm transition-all hover:translate-y-1 hover:shadow-2xl hover:bg-white/90 dark:hover:bg-slate-700/80 gap-3">

                                    <CardHeader>
                                        <CardTitle className="truncate">{item.filename}</CardTitle>
                                        <CardDescription className="flex flex-col gap-2 flex-wrap">
                                            <Badge variant="secondary">#{index + 1}</Badge>
                                                {item.is_processed ? (
                                                    <Badge>{t("processed")}</Badge>
                                                ) : (
                                                    <Badge variant="destructive">{t("notProcessed")}</Badge>
                                                )}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="flex flex-col justify-start items-start gap-2">
                                        <span className="text-sm text-slate-500">ID: {item.id}</span>
                                        <span className="text-sm text-slate-500">{t("date")}: {handleConvertTimestamp(item.timestamp)}</span>
                                        <div className="flex self-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button className="hover:cursor-pointer"
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => handleShowImage(item)}><Eye className="size-4"></Eye>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="bottom">
                                                        <p>{t("imagesListShowImage")}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button className="hover:cursor-pointer"
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => handleShowDetails(item.id)}><Info className="size-4"></Info>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="bottom">
                                                        <p>{t("imagesListShowDetails")}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button className="hover:cursor-pointer"
                                                                size="icon"
                                                                variant="destructive"
                                                                onClick={() => {
                                                                    setSelectedItem(item);
                                                                    setSelectedIndex(index);
                                                                    setShowConfirmation(true);
                                                                }}><Trash2 className="size-4"></Trash2>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="bottom">
                                                        <p>{t("imagesListDelete")}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (<h2 className="text-2xl">No images found</h2>)}
                </div>
            </div>

            {imageInfo?.length > 0 && <div className="flex justify-center">
                <PaginationBar page={page}
                               type="rows"
                               onPrevClick={() => setPage(page - 1)}
                               onNextClick={() => setPage(page + 1)}
                               totalPages={totalPages}
                               onChange={handlePageSizeChange}
                               selectedOption={pageSize}
                ></PaginationBar>
            </div>}

            {showError && <ErrorWindow message={error} onClose={handleCloseError} />}
            {showDetails && <ImageInfoDetails id={currentID} onClose={handleCloseDetails} />}
            {showSelectedImage && <ImageWindow filename={selectedImage.filename} id={selectedImage.id} onClose={handleCloseSelectedImage}/>}
            {showConfirmation && <ConfirmWindow message={`delete ${selectedItem.filename}`} onClose={handleCancelConfirmation} onConfirm={handleConfirmConfirmation}/>}
        </div>
    );
}

export default ImageInfoList;