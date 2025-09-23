import styles from './TopBar.module.css';
import { CgLogOut } from "react-icons/cg";
import {useNavigate} from "react-router-dom";

function TopBar({isLoggedIn}) {
    const navigate = useNavigate();
    const username = sessionStorage.getItem("username");

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('role');
        navigate('/login');
    }

    return(
        <div className={styles.MainPageBar}>
            {isLoggedIn ? <h3>Motion Detector App, {'\u00A0\u00A0'} Hi {username}!</h3> : <h3>Motion Detector App</h3>}
            {isLoggedIn &&
                <button onClick={handleLogout}>
                    <CgLogOut size={20}></CgLogOut>
                    Logout
                </button>
            }
        </div>
    );
}

export default TopBar;