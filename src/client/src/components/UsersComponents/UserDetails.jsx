import ErrorWindow from "../UniversalComponents/ErrorWindow.jsx";
import {useState} from "react";

function UserDetails({onClose, userDetails}) {

    const [error, setError] = useState("");
    const [showError, SetShowError] = useState(false);

    const handleCloseError = () => {
        SetShowError(false);
        setError("");
    }

    return(
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100">
            <div className="bg-cyan-50 rounded-3xl p-6 min-w-[500px] max-h-[90vh] shadow-2xl text-black flex flex-col items-start justify-center gap-3 mb-4">

                <p className="self-center text-2xl font-semibold mb-4">User Details</p>
                <p><span className="font-semibold">Database ID</span>: {userDetails.id || "N/A"}</p>
                <p><span className="font-semibold">Username</span>: {userDetails.username || "N/A"}</p>
                <p><span className="font-semibold">E-mail address</span>: {userDetails.email || "N/A"}</p>
                <p><span className="font-semibold">First Name</span>: {userDetails.first_name || "N/A"}</p>
                <p><span className="font-semibold">Last Name</span>: {userDetails.last_name || "N/A"}</p>
                <p><span className="font-semibold">Phone Number</span>: {userDetails.phone_number || "N/A"}</p>
                <p><span className="font-semibold">Role</span>: {userDetails.role || "N/A"}</p>

                <button className="close-button self-center mt-2 px-6 py-2 rounded-full" onClick={onClose}>Close</button>
            </div>
            {showError && <ErrorWindow message={error} onClose={handleCloseError}></ErrorWindow>}
        </div>
    );
}

export default UserDetails;