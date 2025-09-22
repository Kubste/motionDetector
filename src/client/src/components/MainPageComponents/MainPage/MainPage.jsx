import App from "../../../App.jsx";
import styles from "./MainPage.module.css";
import {FaImages, FaCamera} from "react-icons/fa";
import {MdAccountCircle} from "react-icons/md";
import MainPageCard from "../MainPageCard/MainPageCard.jsx";
import MainPageBar from "../../UniversalComponents/TopBar/TopBar.jsx";
import {useNavigate} from "react-router-dom";

function MainPage() {
    const navigate = useNavigate();
    const username = "testUser";

    return(
        <div className={styles.MainPage}>
            <MainPageBar username={username}></MainPageBar>
            <div className={styles.CardsContainer}>
                <MainPageCard Icon={FaImages} description="Images" onClick={() => navigate("/images")}></MainPageCard>
                <MainPageCard Icon={FaCamera} description="Camera management" onClick={() => navigate("/camera-management")}></MainPageCard>
                <MainPageCard Icon={MdAccountCircle} description="My account" onClick={() => navigate("/my-account")}></MainPageCard>
            </div>
        </div>
    );
}

export default MainPage;