import ErrorWindow from "../UniversalComponents/ErrorWindow.jsx";
import PaginationBar from "../UniversalComponents/PaginationBar.jsx";
import UserDetails from "./UserDetails.jsx";
import {useEffect, useState} from "react";
import api from "../UniversalComponents/api.jsx";

function UsersList() {

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [currentIndex, setCurrentIndex] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState({name: 5, value: 5});

    useEffect(() => {
        fetchUsers();
    }, [page, pageSize])

    const fetchUsers = async () => {
        setLoading(true);

        try {
            const response = await api.get(`/auth/users/?page=${page}&page_size=${pageSize.value}`);
            const data = response.data;
            setUsers(data.results);
            setTotalPages(Math.ceil(data.count / pageSize.value));
        } catch(error) {
            setError(error.message || "Failed to load users.");
            setShowError(true);

        } finally {
            setLoading(false);
        }
    };

    const handlePageSizeChange = (option) => {
        setPageSize(option);
        setPage(1);
    }

    const handleShowUserDetails = (index) => {
        setCurrentIndex(index);
        setShowUserDetails(true);
    }

    const handleCloseUserDetails = () => {
        setShowUserDetails(false);
        setCurrentIndex("");
    }

    const handleCloseError = () => {
        setShowError(false);
        setError("");
    }

    return (
        <div className="flex flex-col text-center justify-center px-5 w-2/5 my-10 mx-auto">
            <h1 className="mb-5 text-black font-bold text-3xl">Users List</h1>

            <button
                className="button w-[200px] px-4 py-2 mb-4 mx-auto rounded-full bg-cyan-600 text-white text-xl hover:bg-cyan-800 transition"
                onClick={() => fetchUsers()}>{loading ? "Reloading users..." : "Reload users"}</button>

            <div className="w-full">
                {users.length > 0 ?
                    <ol className="p-0 m-0">
                        {users.map((item, index) => (
                            <li className="flex justify-between items-center px-4 py-3 mb-3 rounded-3xl bg-cyan-50 shadow-md
                                            transition-transform hover:-translate-y-0.5 hover:shadow-xl hover:bg-white/20"
                                key={index}>
                              <span className="flex-1 font-medium text-black break-words">
                                {index + 1}. {item.username}</span>

                                <div className="flex">
                                    <button className="button px-3 py-1 rounded-full text-sm bg-blue-500 text-white hover:bg-blue-700"
                                            onClick={() => handleShowUserDetails(index)}>Details</button>
                                </div>
                            </li>
                        ))}
                    </ol> : <h2 className="text-2xl">No cameras found</h2>}
            </div>

            {users.length > 0 && <div className="flex justify-center">
                <PaginationBar page={page}
                               onPrevClick={() => setPage(page - 1)}
                               onNextClick={() => setPage(page + 1)}
                               totalPages={totalPages}
                               onChange={handlePageSizeChange}
                               selectedOption={pageSize}
                ></PaginationBar>
            </div>}

            {showError && <ErrorWindow message={error} onClose={handleCloseError}></ErrorWindow>}
            {showUserDetails && <UserDetails onClose={handleCloseUserDetails} userDetails={users[currentIndex]}></UserDetails>}
        </div>
    );
}

export default UsersList;