import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import TopBar from "../UniversalComponents/TopBar.jsx";
import CameraList from "../CameraManagementComponents/CameraList.jsx";
import api from "../UniversalComponents/api.jsx";

function AdminsManagementPage() {
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/auth/is-logged").catch(() => {navigate("/login")});
    }, [navigate]);

    return(
        <div className="flex flex-col min-h-screen">
            <TopBar isLoggedIn={true}></TopBar>
            <div className="flex flex-col flex-1 justify-center items-center w-full">
                <CameraList isList={false} isSynchronize={false} isManagement={true}></CameraList>
            </div>
        </div>
    );
}

export default AdminsManagementPage;