import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import styles from "./MyAccountPage.module.css";
import TopBar from "../../UniversalComponents/TopBar/TopBar.jsx";
import UserInfo from "../UserInfo/UserInfo.jsx"

function MyAccountPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if(!token) {
            navigate('/login');
        }
    }, [navigate]);

    return(
        <div className={styles.MyAccountPage}>
            <TopBar isLoggedIn={true}></TopBar>
            <div>
                <UserInfo></UserInfo>
            </div>
        </div>
    );
}

export default MyAccountPage;