import App from "../../../App.jsx";
import styles from "./MainPage.module.css";
import {FaImages, FaCamera} from "react-icons/fa";
import {MdAccountCircle} from "react-icons/md";
import MainPageCard from "../MainPageCard/MainPageCard.jsx";
import MainPageBar from "../MainPageBar/MainPageBar.jsx";

function MainPage() {
    const username = "testUser";

    return(
        <div className={styles.MainPage}>
            <MainPageBar username={username}></MainPageBar>
            <div className={styles.CardsContainer}>
                <MainPageCard Icon={FaImages} description="Images"></MainPageCard>
                <MainPageCard Icon={FaCamera} description="Camera management"></MainPageCard>
                <MainPageCard Icon={MdAccountCircle} description="My account"></MainPageCard>
            </div>
        </div>
    );
}

export default MainPage;