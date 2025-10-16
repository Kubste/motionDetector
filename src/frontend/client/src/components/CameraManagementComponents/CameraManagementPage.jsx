import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import TopBar from "../UniversalComponents/TopBar.jsx";
import CameraList from "./CameraList.jsx";

function CameraManagementPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if(!token) {
            navigate('/login');
        }
    }, [navigate]);

    return(
        <div className="flex flex-col min-h-screen">
            <TopBar isLoggedIn={true}></TopBar>
            <div className="flex flex-col flex-1 justify-center items-center w-full">
                <CameraList isList={true}></CameraList>
            </div>
        </div>
    );
}

export default CameraManagementPage;