import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import TopBar from "../UniversalComponents/TopBar.jsx"
import CameraList from "../CameraManagementComponents/CameraList.jsx"

function SynchronizePage() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if(!token) {
            navigate('/login');
        }
    }, [navigate]);

    return(
        <div className="flex flex-col min-h-screen w-full">
            <TopBar isLoggedIn={true}></TopBar>
            <div className="flex flex-1 justify-center items-center w-full">
                <CameraList isList={false} isSynchronize={true} isManagement={false}></CameraList>
            </div>
        </div>
    );

}

export default SynchronizePage;