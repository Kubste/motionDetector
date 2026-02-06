import App from "../../App.jsx";
import {FaImages, FaCamera, FaUsers} from "react-icons/fa";
import {MdAccountCircle, MdAdminPanelSettings, MdSwitchAccount} from "react-icons/md";
import {RiAdminFill} from "react-icons/ri"
import {IoReloadCircle} from "react-icons/io5";
import {SiTensorflow} from "react-icons/si";
import MainPageCard from "./MainPageCard.jsx";
import TopBar from "../UniversalComponents/TopBar.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import api from "../UniversalComponents/api.jsx";

function MainPage() {
    const navigate = useNavigate();
    const address = window.RUNTIME_CONFIG?.SERVER_IP

    useEffect(() => {
        api.get("/auth/is-logged").catch(() => {navigate("/login")});
    }, [navigate]);

    return(
        <div className="flex flex-col min-h-screen">
            <TopBar isLoggedIn={true} />
            <div className="flex-grow flex items-center justify-center">
                <div className="flex flex-wrap gap-5 justify-center items-center">
                    <MainPageCard Icon={FaImages} description="Images" onClick={() => navigate("/images")} />
                    <MainPageCard Icon={FaCamera} description="Camera management" onClick={() => navigate("/camera-management")} />
                    <MainPageCard Icon={MdAccountCircle} description="My account" onClick={() => navigate("/my-account")} />
                    {(localStorage.getItem("role") === "sup" || localStorage.getItem("role") === "admin") &&
                        <MainPageCard Icon={MdSwitchAccount} description="Register new user" onClick={() => navigate("/register")}></MainPageCard>}
                    {(localStorage.getItem("role") === "sup" || localStorage.getItem("role") === "admin") &&
                        <MainPageCard Icon={FaUsers} description="Users" onClick={() => navigate("/users")}></MainPageCard>}
                    {(localStorage.getItem("role") === "sup" || localStorage.getItem("role") === "admin") &&
                        <MainPageCard Icon={IoReloadCircle} description="Synchronize files" onClick={() => navigate("/synchronize")}></MainPageCard>}
                    {(localStorage.getItem("role") === "sup" || localStorage.getItem("role") === "admin") &&
                        <MainPageCard Icon={SiTensorflow} description="TensorFlow models management" onClick={() => navigate("/models-management")}></MainPageCard>}
                    {localStorage.getItem("role") === "sup" &&
                        <MainPageCard Icon={RiAdminFill} description="Admins Management" onClick={() => navigate("/admins-management")}></MainPageCard>}
                    {localStorage.getItem("role") === "sup" &&
                        <MainPageCard Icon={MdAdminPanelSettings} description="Django superuser panel" onClick={() => window.open(`https://${address}/admin`)}></MainPageCard>}
                </div>
            </div>
        </div>
    );
}

export default MainPage;