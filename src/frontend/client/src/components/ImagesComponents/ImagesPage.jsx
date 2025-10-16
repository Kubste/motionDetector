import TopBar from "../UniversalComponents/TopBar.jsx";
import ImageInfoList from "./ImageInfoList.jsx";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";


function ImagesPage() {
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
                <ImageInfoList></ImageInfoList>
            </div>
        </div>
    );
}

export default ImagesPage;