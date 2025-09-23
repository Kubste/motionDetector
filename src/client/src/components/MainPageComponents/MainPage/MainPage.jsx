import App from "../../../App.jsx";
import styles from "./MainPage.module.css";
import {FaImages, FaCamera} from "react-icons/fa";
import {MdAccountCircle} from "react-icons/md";
import MainPageCard from "../MainPageCard/MainPageCard.jsx";
import TopBar from "../../UniversalComponents/TopBar/TopBar.jsx";
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
        <div className={styles.MainPage}>
            <TopBar isLoggedIn={true}></TopBar>
            <div className={styles.CardsContainer}>
                <MainPageCard Icon={FaImages} description="Images" onClick={() => navigate("/images")}></MainPageCard>
                <MainPageCard Icon={FaCamera} description="Camera management" onClick={() => navigate("/camera-management")}></MainPageCard>
                <MainPageCard Icon={MdAccountCircle} description="My account" onClick={() => navigate("/my-account")}></MainPageCard>
            </div>
        </div>
    );
}

export default MainPage;