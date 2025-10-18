import PaginationBar from "../UniversalComponents/PaginationBar.jsx";
import ErrorWindow from "../UniversalComponents/ErrorWindow.jsx";
import ModelDetails from "./ModelDetails.jsx";
import AddModel from "./AddModel.jsx";
import {useEffect, useState} from "react";
import api from "../UniversalComponents/api.jsx";
import SortingBar from "../UniversalComponents/SortingBar.jsx";

function ModelsList() {

    const [loading, setLoading] = useState(false);
    const [models, setModels] = useState([]);
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [currentID, setCurrentID] = useState(null);
    const [showAddModel, setShowAddModel] = useState(false);

    const [sortingField, setSortingField] = useState({name: "Model name", value: "model_name"});
    const [order, setOrder] = useState({name: "ascending", value: ""});
    const [showChangeOrder, setShowChangeOrder] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState({name: 5, value: 5});

    useEffect(() => {
        fetchModels();
    }, [page, pageSize])

    const fetchModels = async () => {
        setLoading(true);

        try {
            const response = await api.get(`/api/tensor-flow-models/?ordering=${order.value}${sortingField.value}&page=${page}&page_size=${pageSize.value}`);
            const data = response.data;
            setModels(data.results);
            setTotalPages(Math.ceil(data.count / pageSize.value));
        } catch(error) {
            setError(error.message || "Failed to load models.");
            setShowError(true);

        } finally {
            setLoading(false);
        }
    }

    function deleteModel(id, index) {
        api.delete(`/api/tensor-flow-models/${id}/`
        ).then(() => {
            const updatedModels = models.filter((_, i) => i !== index);
            setModels(updatedModels);
        }).catch(error => {
            if(error.response) setError(error.response.data.detail || "Internal Server Error");
            else if(error.request) setError("Cannot connect to the server.");
            else setError(error.message);
            setShowError(true);
        })
    }

    const handleShowModelDetails = (id) => {
        setShowDetails(true);
        setCurrentID(id);
    }

    const handleShowAddModel = () => {
        setShowAddModel(true);
    }

    const handleModelAdd = () => {
        setShowAddModel(false);
        fetchModels();
    }

    const handleCloseAddModel = () => {
        setShowAddModel(false);
    }

    const handleCloseModelDetails = () => {
        setShowDetails(false);
        //window.location.reload();
    }

    const handlePageSizeChange = (option) => {
        setPageSize(option);
        setPage(1);
    }

    const handleCloseError = () => {
        setShowError(false);
        setError("");
    }

    const handleSortingFieldChange = (option) => {
        setSortingField(option);
    }

    const handleOrderChange = (option) => {
        setOrder(option);
    }

    return (
        <div className="flex flex-col text-center justify-center px-5 w-2/5 my-10 mx-auto">
            <h1 className="mb-5 text-black dark:text-white font-bold text-3xl">Models List</h1>

            <div className="flex items-center justify-center p-4 rounded-2xl gap-6">
                <button className="button w-[200px] px-4 py-2 rounded-full bg-cyan-600 text-white text-xl hover:bg-cyan-800 transition"
                        onClick={() => fetchModels()}>{loading ? "Reloading models..." : "Reload models"}</button>

                {!showChangeOrder &&
                    <button className="button w-[200px] px-4 py-2 rounded-full bg-cyan-600 text-white text-xl hover:bg-cyan-800"
                            onClick={() => {setShowChangeOrder(true)}}>Change order</button>
                }

                {showChangeOrder &&
                    <SortingBar options={[{name: "Model name", value: "model_name"}, {name: "Model version", value: "model_version"}, {name: "Model URL", value: "model_URL"}]}
                                onChangeField={handleSortingFieldChange}
                                onChangeOrder={handleOrderChange}
                                selectedOptionName={sortingField}
                                selectedOptionOrder={order}
                                onClose={() => setShowChangeOrder(false)}
                    ></SortingBar>}
            </div>

            <button className="button w-[200px] px-4 py-2 mb-6 mx-auto rounded-full bg-green-500 text-white text-xl hover:bg-green-600 transition"
                    onClick={handleShowAddModel}>Add new model</button>

            <div className="w-full">
                {models.length > 0 ?
                    <ol className="p-0 m-0">
                        {models.map((item, index) => (
                            <li className="flex justify-between items-center px-4 py-3 mb-3 rounded-3xl bg-cyan-50 dark:bg-slate-700 dark:hover:bg-slate-800 shadow-md
                                            transition-transform hover:-translate-y-0.5 hover:shadow-xl hover:bg-white/20"
                                key={index}>
                              <span className="flex-1 font-medium text-black dark:text-white break-words">
                                {index + 1}. {item.model_name} {item.model_version}</span>

                                <div className="flex gap-2 items-center justify-end">
                                    <button className="button px-3 py-1 rounded-full text-sm bg-blue-500 text-white hover:bg-blue-700"
                                            onClick={() => handleShowModelDetails(item.id)}>Details</button>

                                    <button className="close-button px-3 py-1 rounded-full text-sm text-white"
                                            onClick={() => deleteModel(item.id, index)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ol> : <h2 className="text-2xl">No models found</h2>}
            </div>

            {models.length > 0 && <div className="flex justify-center">
                <PaginationBar page={page}
                               onPrevClick={() => setPage(page - 1)}
                               onNextClick={() => setPage(page + 1)}
                               totalPages={totalPages}
                               onChange={handlePageSizeChange}
                               selectedOption={pageSize}
                ></PaginationBar>
            </div>}

            {showError && <ErrorWindow message={error} onClose={handleCloseError}></ErrorWindow>}
            {showDetails && <ModelDetails id={currentID} onClose={handleCloseModelDetails}></ModelDetails>}
            {showAddModel && <AddModel onClose={handleCloseAddModel} onModelAdd={handleModelAdd}></AddModel>}
        </div>
    );
}

export default ModelsList;