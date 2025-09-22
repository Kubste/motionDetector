import styles from './TopBar.module.css';
import { CgLogOut } from "react-icons/cg";

function MainPageCard({username}){

    return(
        <div className={styles.MainPageBar}>
            <h3>Motion Detector App, {'\u00A0\u00A0'} Hi {username}!</h3>
            <button>
                <CgLogOut size={20}></CgLogOut>
                Logout
            </button>
        </div>
    );
}

export default MainPageCard;