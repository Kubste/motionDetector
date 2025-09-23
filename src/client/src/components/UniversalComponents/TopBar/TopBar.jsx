import styles from './TopBar.module.css';
import { CgLogOut } from "react-icons/cg";
import {useNavigate} from "react-router-dom";
import ErrorWindow from "../ErrorWindow/ErrorWindow.jsx";
import axios from 'axios';
import {useState} from "react";

function TopBar({isLoggedIn}) {
    const navigate = useNavigate();
    const username = sessionStorage.getItem("username");
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);

    const handleLogout = async () => {
        try {
            const token = sessionStorage.getItem("token");

            await axios.post('https://192.168.100.7/auth/logout-all/', {}, {
                headers: {
                    'Authorization': `Token ${token}`,
                }
            });
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('role');
            navigate('/login');
        } catch (error) {
            setError(error);
            setShowError(true);
        }
    }

    const handleCloseError = () => {
        setError(null);
        setShowError(false);
    }

    return(
        <div className={styles.TopBar}>
            {isLoggedIn ? <h3>Motion Detector App, {'\u00A0\u00A0'} Hi {username}!</h3> : <h3>Motion Detector App</h3>}
            {isLoggedIn &&
                <button onClick={handleLogout}>
                    <CgLogOut size={20}></CgLogOut>
                    Logout
                </button>
            }
            {showError && <ErrorWindow message="Error while trying to log out" onClose={handleCloseError}></ErrorWindow>}
        </div>
    );
}

export default TopBar;