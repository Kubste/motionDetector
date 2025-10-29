import {useState, useEffect} from "react";
import ErrorWindow from "../UniversalComponents/ErrorWindow.jsx";
import ConfirmWindow from "../UniversalComponents/ConfirmWindow.jsx";
import ImageInfoDetails from "./ImageInfoDetails.jsx";
import ImageWindow from "./ImageWindow.jsx";
import SortingBar from "../UniversalComponents/SortingBar.jsx";
import api from "../UniversalComponents/api.jsx";
import PaginationBar from "../UniversalComponents/PaginationBar.jsx";

function ImageInfoList() {
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
    const [order, setOrder] = useState({name: "ascending", value: ""});
    const [showChangeOrder, setShowChangeOrder] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState({name: 5, value: 5});


    const fetchImages = async () => {
        setLoading(true);

        try {
            const response = await api.get(`/api/image-info/?ordering=${order.value}${sortingField.value}&page=${page}&page_size=${pageSize.value}`);
            const data = response.data;
            setImageInfo(data.results);
            setTotalPages(Math.ceil(data.count / pageSize.value));
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
        }, [page, pageSize]);

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
        setSortingField(option);
    }

    const handleOrderChange = (option) => {
        setOrder(option);
    }

    return (
        <div className="flex flex-col text-center justify-center px-5 w-2/5 my-10 mx-auto">
            <h1 className="mb-5 text-black dark:text-white font-bold text-3xl">Captured Images</h1>

            <div className="flex items-center justify-center p-4 rounded-2xl mb-6 gap-6">
                <button className="button w-[200px] px-4 py-2 rounded-full bg-cyan-600 text-white text-xl hover:bg-cyan-800"
                        onClick={fetchImages}>{loading ? "Reloading images..." : "Reload images"}</button>

                {!showChangeOrder &&
                    <button className="button w-[200px] px-4 py-2 rounded-full bg-cyan-600 text-white text-xl hover:bg-cyan-800"
                            onClick={() => {setShowChangeOrder(true)}}>Change order</button>
                }

                {showChangeOrder &&
                    <SortingBar options={[{name: "Filename", value: "filename"}, {name: "File size", value: "file_size"}, {name: "File type", value: "file_type"},
                                {name: "Resolution", value: "resolution"}, {name: "Photo taken date", value: "timestamp"}, {name: "Camera", value: "file_size"},
                                {name: "TensorFlow model", value: "model_id"}, {name: "Was processed", value: "is_processed"}]}
                                onChangeField={handleSortingFieldChange}
                                onChangeOrder={handleOrderChange}
                                selectedOptionName={sortingField}
                                selectedOptionOrder={order}
                                onClose={() => setShowChangeOrder(false)}
                    ></SortingBar>}
            </div>

            <div className="w-full">
                {imageInfo.length > 0 ? (
                    <ol className="p-0 m-0">
                        {imageInfo.map((item, index) => (
                            <li className="flex justify-between items-center px-4 py-3 mb-3 rounded-3xl bg-cyan-50 shadow-md transition-transform hover:-translate-y-0.5
                                            hover:shadow-xl hover:bg-white/20 dark:bg-slate-700 dark:hover:bg-slate-800"
                                key={index}>
                                <span className="flex-1 font-medium text-black dark:text-white break-words">{index + 1 }. {item.filename}</span>

                                <div className="flex">
                                    <button className="button px-3 py-1 rounded-full text-sm bg-green-700 text-white hover:bg-green-900"
                                        onClick={() => handleShowImage(item)}>Show Image</button>

                                    <button className="button px-3 py-1 rounded-full text-sm ml-2 bg-blue-500 text-white hover:bg-blue-700"
                                        onClick={() => handleShowDetails(item.id)}>Details</button>

                                    <button className="close-button px-3 py-1 rounded-full text-sm ml-2 text-white"
                                        onClick={() => {
                                            setSelectedItem(item);
                                            setSelectedIndex(index);
                                            setShowConfirmation(true);
                                        }}
                                    >Delete</button>
                                </div>
                            </li>
                        ))}
                    </ol>
                ) : (<h2 className="text-2xl">No images found</h2>)}
            </div>

            {imageInfo.length > 0 && <div className="flex justify-center">
                <PaginationBar page={page}
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