import PaginationBar from "../UniversalComponents/PaginationBar.jsx";
import ErrorWindow from "../UniversalComponents/ErrorWindow.jsx";
import ConfirmWindow from "../UniversalComponents/ConfirmWindow.jsx";
import api from "../UniversalComponents/api.jsx";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

function AdminsList({cameraID}) {

    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState({name: 5, value: 5});

    useEffect(() => {
        fetchAdmins()
    }, [page, pageSize])

    const fetchAdmins = async () => {
        setLoading(true);
        api.get(`/api/cameras/${cameraID}/get-admins/?page=${page}&page_size=${pageSize.value}`)
            .then(response => {
                setAdmins(response.data.results || []);
                setTotalPages(Math.ceil(response.data.count / pageSize.value));
            }).catch(error => {
                if(error.response) setError(error.response.data.detail || "Internal Server Error");
                else if(error.request) setError("Cannot connect to the server.");
                else setError(error.message);
                setShowError(true);
            }).finally(() => setLoading(false));
    }

    const removeAdmins = async (ids) => {
        api.delete(`/api/cameras/${cameraID}/remove-admins/`, {
                data: {admins: ids}
        }).then(() => {
            fetchAdmins();
        }).catch(error => {
            if(error.response) setError(error.response.data.detail || "Internal Server Error");
            else if(error.request) setError("Cannot connect to the server.");
            else setError(error.message);
            setShowError(true);
        })
    }

    const handlePageSizeChange = (option) => {
        setPageSize(option);
        setPage(1);
    }

    const handleCloseError = () => {
        setShowError(false);
        setError(null);
    }

    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
    }

    const handleConfirmConfirmation = () => {
        setShowConfirmation(false);
        removeAdmins(admins.map(admin => admin.id));
    }

    return (
        <div className="flex flex-col text-center justify-center px-5 w-2/5 my-10 mx-auto">
            <h1 className="mb-5 text-black dark:text-white font-bold text-3xl">Camera: {cameraID} Admins</h1>

            <button className="button w-[200px] px-4 py-2 mb-4 mx-auto rounded-full bg-cyan-600 text-white text-xl hover:bg-cyan-800 transition"
                    onClick={fetchAdmins}>{loading ? "Reloading admins..." : "Reload admins"}</button>

            {admins.length > 0 &&
                <button className="close-button w-[200px] px-4 py-2 mb-4 mx-auto rounded-full text-white text-xl transition"
                        onClick={() => setShowConfirmation(true)}
            >Unassign all</button>}

            <button className="confirm-button w-[230px] px-4 py-2 mb-4 mx-auto rounded-full text-white text-xl transition"
                    onClick={() => navigate(`/assign-admins?camera=${cameraID}`)}
            >Assign new admin</button>

            <div className="w-full">
                {admins.length > 0 ?
                    <ol className="p-0 m-0">
                        {admins.map((item, index) => (
                            <li className="flex justify-between items-center px-4 py-3 mb-3 rounded-3xl bg-cyan-50 shadow-md dark:bg-slate-700 dark:hover:bg-slate-800
                            transition-transform hover:-translate-y-0.5 hover:shadow-xl hover:bg-white/20"
                                key={index}>
                              <span className="flex-1 font-medium text-black dark:text-white break-words">
                                {index + 1}. Username: {item.username} ID: {item.id}</span>

                                <div className="flex">
                                    <button className="close-button px-3 py-1 rounded-full text-sm ml-2 text-white"
                                            onClick={() => {removeAdmins([item.id])}}
                                    >Unassign</button>
                                </div>
                            </li>
                        ))}
                    </ol> : <h2 className="text-2xl">No assigned admins</h2>}
            </div>

            {admins.length > 0 && <div className="flex justify-center">
                <PaginationBar page={page}
                               onPrevClick={() => setPage(page - 1)}
                               onNextClick={() => setPage(page + 1)}
                               totalPages={totalPages}
                               onChange={handlePageSizeChange}
                               selectedOption={pageSize}
                ></PaginationBar>
            </div>}

            {showError && <ErrorWindow message={error} onClose={handleCloseError}></ErrorWindow>}
            {showConfirmation && <ConfirmWindow message="unassign all admins" onConfirm={handleConfirmConfirmation} onClose={handleCloseConfirmation}></ConfirmWindow>}
        </div>
    );
}

export default AdminsList;