import styles from "../../MainPageComponents/MainPage/MainPage.module.css";
import TopBar from "../../UniversalComponents/TopBar/TopBar.jsx";
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
        <div className={styles.ImagesPage}>
            <TopBar isLoggedIn={true}></TopBar>
            <div className={styles.ImagesContainer}>
                <h1>Images Page</h1>
            </div>
        </div>
    );
}

export default ImagesPage;