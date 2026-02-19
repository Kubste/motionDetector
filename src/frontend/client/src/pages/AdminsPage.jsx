import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import TopBar from "../components/UniversalComponents/TopBar.jsx";
import AdminsList from "../components/AdminsManagementComponents/AdminsList.jsx";
import api from "../components/UniversalComponents/api.jsx";

function AdminsPage() {

    const searchParams = new URLSearchParams(location.search);
    const cameraID = searchParams.get("camera");
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/auth/is-logged").catch(() => {navigate("/login")});
    }, [navigate]);

    return(
        <div className="flex flex-col min-h-screen w-full">
            <TopBar isLoggedIn={true}></TopBar>
            <div className="flex flex-1 justify-center items-center w-full">
                <AdminsList cameraID={cameraID} isNew={false}></AdminsList>
            </div>
        </div>
    );
}

export default AdminsPage;