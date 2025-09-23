import styles from './LoginPage.module.css';
import TopBar from '../../UniversalComponents/TopBar/TopBar.jsx';
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from 'axios';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('https://192.168.100.7/auth/login/', {username, password});

            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('username', response.data.username);
            sessionStorage.setItem('role', response.data.role);
            navigate('/');
        } catch (error) {
            if(error.response && error.response.data) setError("Invalid username or password");
            else setError("Server Error. Please try again.");

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.Page}>
            <TopBar isLoggedIn={false}></TopBar>
            <div className={styles.Container}>
                <h2>Sign in to your account</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.Inputs}>
                        <input type="text" placeholder="Username" value={username} onChange={(event) => setUsername(event.target.value)} required={true}/>
                        <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required={true}/>
                        <button className={styles.SignInButton} type="submit" disabled={loading}>{loading ? "Signing in ..." : "Sign in"}</button>
                    </div>
                    {error && <p className={styles.Error}>{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default LoginPage;