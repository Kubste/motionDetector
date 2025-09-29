import styles from './TopBar.module.css';
import { CgLogOut } from "react-icons/cg";
import {useNavigate} from "react-router-dom";
import ErrorWindow from "../ErrorWindow/ErrorWindow.jsx";
import api from "../../UniversalComponents/api.jsx";
import {useState} from "react";

function TopBar({isLoggedIn}) {
    const navigate = useNavigate();
    const username = sessionStorage.getItem("username");
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);

    const handleLogout = async () => {
        
        try {
            await api.post('/auth/logout-all/', {});
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('role');
            navigate('/login');
        } catch (error) {
            setError(error);
            setShowError(true);
        }
    }

    const handleLogoutAll = async () => {
        try {
            const token = sessionStorage.getItem("token");

            await api.post('/auth/logout-all-users/', {}, {
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

    return (
        <div className={styles.TopBar}>
            <h3 onClick={() => navigate("/")}>Motion Detector App {isLoggedIn && `\u00A0\u00A0 Hi ${username}!`}</h3>

            {isLoggedIn && (
                <div className={styles.ButtonGroup}>
                    {sessionStorage.getItem('role') === "sup" && (
                        <button onClick={handleLogoutAll}>
                            <CgLogOut size={20} />
                            Logout all users
                        </button>
                    )}

                    <button onClick={handleLogout}>
                        <CgLogOut size={20} />
                        Logout
                    </button>
                </div>
            )}

            {showError && (
                <ErrorWindow
                    message="Error while trying to log out"
                    onClose={handleCloseError}
                />
            )}
        </div>
    );
}

export default TopBar;