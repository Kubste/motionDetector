import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import styles from "./CameraManagementPage.module.css";
import TopBar from "../../UniversalComponents/TopBar/TopBar.jsx";
import CameraList from "../CameraList/CameraList.jsx";

function CameraManagementPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if(!token) {
            navigate('/login');
        }
    }, [navigate]);

    return(
        <div className={styles.CameraManagementPage}>
            <TopBar isLoggedIn={true}></TopBar>
            <div className={styles.CameraContainer}>
                <CameraList></CameraList>
            </div>
        </div>
    );
}

export default CameraManagementPage;