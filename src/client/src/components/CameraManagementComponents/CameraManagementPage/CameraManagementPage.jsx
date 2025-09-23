import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import styles from "../../MainPageComponents/MainPage/MainPage.module.css";
import TopBar from "../../UniversalComponents/TopBar/TopBar.jsx";

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
            <div>
                <h1>Camera Management Page</h1>
            </div>
        </div>
    );
}

export default CameraManagementPage;