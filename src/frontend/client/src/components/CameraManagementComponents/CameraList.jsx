import ErrorWindow from "../UniversalComponents/ErrorWindow.jsx";
import ConfirmWindow from "../UniversalComponents/ConfirmWindow.jsx";
import CameraDetails from "./CameraDetails.jsx";
import AddCamera from "./AddCamera.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../UniversalComponents/api.jsx";
import PaginationBar from "../UniversalComponents/PaginationBar.jsx";
import SortingBar from "../UniversalComponents/SortingBar.jsx";

function CameraList({isList, isSynchronize, isManagement}) {
    const navigate = useNavigate();
    const [cameras, setCameras] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showAddCamera, setShowAddCamera] = useState(false);
    const [currentID, setCurrentID] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [sortingField, setSortingField] = useState({name: "Camera name", value: "camera_name"});
    const [order, setOrder] = useState({name: "ascending", value: ""});
    const [showChangeOrder, setShowChangeOrder] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState({name: 5, value: 5});

    const fetchCameras = async () => {
        setLoading(true);

        try {
            const response = await api.get(`/api/cameras/?ordering=${order.value}${sortingField.value}&page=${page}&page_size=${pageSize.value}`);
            const data = response.data;
            setCameras(data.results);
            setTotalPages(Math.ceil(data.count / pageSize.value));
        } catch(error) {
            setError(error.message || "Failed to load cameras.");
            setShowError(true);

        } finally {
            setLoading(false);
        }
    };

    // called once after render and each time after reload button is clicked
    useEffect(() => {
        fetchCameras();
    }, [page, pageSize]);

    function deleteCamera(id, index) {
        if(!isList) return;
        api.delete(`/api/cameras/${id}/`
        ).then(() => {
            const updatedCameras = cameras.filter((_, i) => i !== index);
            setCameras(updatedCameras);
        }).catch(error => {
            if(error.response) setError(error.response.data.detail || "Internal Server Error");
            else if(error.request) setError("Cannot connect to the server.");
            else setError(error.message);
            setShowError(true);
        })
    }

    const handleShowCameraDetails = (id) => {
        if(!isList) return;
        setShowDetails(true);
        setCurrentID(id);
    }

    const handleCloseCameraDetails = () => {
        if(!isList) return;
        setShowDetails(false);
        //window.location.reload();
    }

    const handleShowAddCamera = () => {
        if(!isList) return;
        setShowAddCamera(true);
    }

    const handleCloseAddCamera = () => {
        if(!isList) return;
        setShowAddCamera(false);
    }

    const handleCloseError = () => {
        setShowError(false);
        setError(null);
    }

    const handleCancelConfirmation = () => {
        if(!isList) return;
        setShowConfirmation(false);
        setSelectedItem({});
        setSelectedIndex(null);
    }

    const handleConfirmConfirmation = () => {
        if(!isList) return;
        deleteCamera(selectedItem.id, selectedIndex);
        setShowConfirmation(false);
        setSelectedItem({});
        setSelectedIndex(null);
    }

    const handlePageSizeChange = (option) => {
        setPageSize(option);
        setPage(1);
    }

    const handleCameraAdd = () => {
        setShowAddCamera(false);
        fetchCameras();
    }

    const handleSortingFieldChange = (option) => {
        setSortingField(option);
    }

    const handleOrderChange = (option) => {
        setOrder(option);
    }

    return (
        <div className="flex flex-col text-center justify-center px-5 w-2/5 my-10 mx-auto">
            <h1 className="mb-5 text-black dark:text-white font-bold text-3xl">Your cameras</h1>

            <div className="flex items-center justify-center mb-4 rounded-2xl gap-6">

                <button className="button w-[200px] px-4 py-2 rounded-full bg-cyan-600 text-white text-xl hover:bg-cyan-800 transition"
                        onClick={fetchCameras}>{loading ? "Reloading cameras..." : "Reload cameras"}</button>

                {!showChangeOrder &&
                    <button className="button w-[200px] px-4 py-2 rounded-full bg-cyan-600 text-white text-xl hover:bg-cyan-800"
                            onClick={() => {setShowChangeOrder(true)}}>Change order</button>
                }

                {showChangeOrder &&
                    <SortingBar options={[{name: "Camera name", value: "camera_name"}, {name: "Board name", value: "board_name"}, {name: "Location", value: "location"},
                                {name: "Address", value: "address"}, {name: "Confidence", value: "confidence_threshold"}, {name: "User", value: "user_id"},
                                {name: "TensorFlow model", value: "model_id"}, {name: "Was processed", value: "process_image"}, {name: "Resolution", value: "resolution"}]}
                                onChangeField={handleSortingFieldChange}
                                onChangeOrder={handleOrderChange}
                                selectedOptionName={sortingField}
                                selectedOptionOrder={order}
                                onClose={() => setShowChangeOrder(false)}
                    ></SortingBar>}
            </div>

            {isList && <button
                className="button w-[200px] px-4 py-2 mb-6 mx-auto rounded-full bg-green-500 text-white text-xl hover:bg-green-600 transition"
                onClick={handleShowAddCamera}>Add new camera</button>}

            {isSynchronize &&
                <button className="button w-[200px] px-4 py-2 mb-4 mx-auto rounded-full bg-cyan-600 text-white text-xl hover:bg-cyan-800 transition"
                        onClick={() => navigate(`/synchronize-list?camera=-1`)}
                >Synchronize all</button>}

            <div className="w-full">
                {cameras.length > 0 ?
                    <ol className="p-0 m-0">
                        {cameras.map((item, index) => (
                            <li className="flex justify-between items-center px-4 py-3 mb-3 rounded-3xl bg-cyan-50 shadow-md dark:bg-slate-700 dark:hover:bg-slate-800
                            transition-transform hover:-translate-y-0.5 hover:shadow-xl hover:bg-white/20"
                                key={index}>
                              <span className="flex-1 font-medium text-black dark:text-white break-words">
                                {index + 1}. {item.camera_name}</span>

                                <div className="flex">
                                    {isList && <button className="button px-3 py-1 rounded-full text-sm bg-blue-500 text-white hover:bg-blue-700"
                                        onClick={() => handleShowCameraDetails(item.id)}>Details</button>}

                                    {isList && <button className="close-button px-3 py-1 rounded-full text-sm ml-2 text-white"
                                        onClick={() => {
                                            setSelectedItem(item);
                                            setSelectedIndex(index);
                                            setShowConfirmation(true);
                                        }}>Delete</button>}

                                    {isManagement && <button className="button px-3 py-1 rounded-full text-sm ml-2  bg-blue-500 text-white hover:bg-blue-700"
                                    onClick={() => navigate(`/admins-page?camera=${item.id}`)}
                                    >Show Admins</button>}

                                    {isSynchronize && <button className="button px-3 py-1 rounded-full text-sm bg-blue-500 text-white hover:bg-blue-700"
                                    onClick={() => navigate(`/synchronize-list?camera=${item.id}`)}>
                                        Synchronize
                                    </button>}
                                </div>
                            </li>
                        ))}
                    </ol> : <h2 className="text-2xl">No cameras found</h2>}
            </div>

            {cameras.length > 0 && <div className="flex justify-center">
                <PaginationBar page={page}
                               onPrevClick={() => setPage(page - 1)}
                               onNextClick={() => setPage(page + 1)}
                               totalPages={totalPages}
                               onChange={handlePageSizeChange}
                               selectedOption={pageSize}
                ></PaginationBar>
            </div>}

            {showError && <ErrorWindow message={error} onClose={handleCloseError} />}
            {showDetails && <CameraDetails id={currentID} onClose={handleCloseCameraDetails} />}
            {showAddCamera && <AddCamera onClose={handleCloseAddCamera} onCameraAdd={handleCameraAdd}/>}
            {showConfirmation && <ConfirmWindow message={`delete ${selectedItem.camera_name}`} onClose={handleCancelConfirmation} onConfirm={handleConfirmConfirmation}/>}
        </div>
    );
}

export default CameraList;