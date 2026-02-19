import App from "../App.jsx";
import {FaImages, FaCamera, FaUsers} from "react-icons/fa";
import {MdAccountCircle, MdAdminPanelSettings, MdSwitchAccount} from "react-icons/md";
import {RiAdminFill} from "react-icons/ri"
import {IoReloadCircle} from "react-icons/io5";
import {SiTensorflow} from "react-icons/si";
import MainPageCard from "../components/MainPageComponents/MainPageCard.jsx";
import TopBar from "../components/UniversalComponents/TopBar.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import api from "../components/UniversalComponents/api.jsx";
import {useTranslation} from "react-i18next";

function MainPage() {
    const navigate = useNavigate();
    const address = window.RUNTIME_CONFIG?.SERVER_IP
    const { t } = useTranslation();

    useEffect(() => {
        api.get("/auth/is-logged").catch(() => {navigate("/login")});
    }, [navigate]);

    return(
        <div className="flex flex-col min-h-screen">
            <TopBar isLoggedIn={true} />
            <div className="flex-grow flex items-center justify-center">
                <div className="flex flex-wrap gap-5 justify-center items-center">
                    <MainPageCard Icon={FaImages} description={t("imagesCard")} onClick={() => navigate("/images")} />
                    <MainPageCard Icon={FaCamera} description={t("cameraCard")} onClick={() => navigate("/camera-management")} />
                    <MainPageCard Icon={MdAccountCircle} description={t("accountCard")} onClick={() => navigate("/my-account")} />
                    {(localStorage.getItem("role") === "sup" || localStorage.getItem("role") === "admin") &&
                        <MainPageCard Icon={MdSwitchAccount} description={t("registerCard")} onClick={() => navigate("/register")}></MainPageCard>}
                    {(localStorage.getItem("role") === "sup" || localStorage.getItem("role") === "admin") &&
                        <MainPageCard Icon={FaUsers} description={t("usersCard")} onClick={() => navigate("/users")}></MainPageCard>}
                    {(localStorage.getItem("role") === "sup" || localStorage.getItem("role") === "admin") &&
                        <MainPageCard Icon={IoReloadCircle} description={t("synchronizeCard")} onClick={() => navigate("/synchronize")}></MainPageCard>}
                    {(localStorage.getItem("role") === "sup" || localStorage.getItem("role") === "admin") &&
                        <MainPageCard Icon={SiTensorflow} description={t("modelsCard")} onClick={() => navigate("/models-management")}></MainPageCard>}
                    {localStorage.getItem("role") === "sup" &&
                        <MainPageCard Icon={RiAdminFill} description={t("adminsCard")} onClick={() => navigate("/admins-management")}></MainPageCard>}
                    {localStorage.getItem("role") === "sup" &&
                        <MainPageCard Icon={MdAdminPanelSettings} description={t("djangoCard")} onClick={() => window.open(`https://${address}/admin`)}></MainPageCard>}
                </div>
            </div>
        </div>
    );
}

export default MainPage;