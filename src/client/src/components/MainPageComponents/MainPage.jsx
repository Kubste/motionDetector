import App from "../../App.jsx";
import {FaImages, FaCamera} from "react-icons/fa";
import {MdAccountCircle} from "react-icons/md";
import MainPageCard from "./MainPageCard.jsx";
import TopBar from "../UniversalComponents/TopBar.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

function MainPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if(!token) {
            navigate('/login');
        }
    }, [navigate]);

    return(
        <div className="flex flex-col min-h-screen">
            <TopBar isLoggedIn={true} />
            <div className="flex-grow flex items-center justify-center">
                <div className="flex flex-wrap gap-5 justify-center items-center">
                    <MainPageCard Icon={FaImages} description="Images" onClick={() => navigate("/images")} />
                    <MainPageCard Icon={FaCamera} description="Camera management" onClick={() => navigate("/camera-management")} />
                    <MainPageCard Icon={MdAccountCircle} description="My account" onClick={() => navigate("/my-account")} />
                </div>
            </div>
        </div>
    );
}

export default MainPage;