import styles from './TopBar.module.css';
import { CgLogOut } from "react-icons/cg";

function MainPageCard({username, isLoggedIn}) {

    return(
        <div className={styles.MainPageBar}>
            {isLoggedIn ? <h3>Motion Detector App, {'\u00A0\u00A0'} Hi {username}!</h3> : <h3>Motion Detector App</h3>}
            {isLoggedIn &&
                <button>
                    <CgLogOut size={20}></CgLogOut>
                    Logout
                </button>
            }
        </div>
    );
}

export default MainPageCard;