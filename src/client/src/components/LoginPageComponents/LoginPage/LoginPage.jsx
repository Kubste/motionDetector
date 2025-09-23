import styles from './LoginPage.module.css';
import TopBar from '../../UniversalComponents/TopBar/TopBar.jsx';

function LoginPage() {

    return (
        <div className={styles.Page}>
            <TopBar isLoggedIn={false}></TopBar>
            <div className={styles.Container}>
                <h2>Sign in to your account</h2>
                <form>
                    <div className={styles.Inputs}>
                        <input type="text" placeholder="Username" />
                        <input type="password" placeholder="Password" />
                        <button className={styles.SignInButton} type="submit">Sign in</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;