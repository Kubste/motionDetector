import TopBar from '../UniversalComponents/TopBar.jsx';
import ForgotPasswordWindow from "./ForgotPasswordWindow.jsx";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import api from "../UniversalComponents/api.jsx";

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const [showPasswordChange, setShowPasswordChange] = useState(false);

    // preventing user to go back to login page after successful login
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if(token) navigate("/", {replace: true});
    }, [navigate])


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/auth/login/', { username, password });

            //sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('username', response.data.username);
            sessionStorage.setItem('user_id', response.data.user_id);
            sessionStorage.setItem('role', response.data.role);
            navigate('/', {replace: true});
        } catch (error) {
            if(error.response && error.response.status === 400) setError("Invalid username or password");
            else setError("Server Error. Please try again.");

        } finally {
            setLoading(false);
        }
    }

    const handleClosePasswordChange = (event) => {
        setShowPasswordChange(false);
    }

    return (
        <div className="min-h-screen flex flex-col">
            <TopBar isLoggedIn={false} />

            <div className="flex-grow flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-cyan-50 dark:bg-slate-700 transition-colors duration-500 ease-in-out backdrop-blur-md shadow-xl rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-center text-stone-950 dark:text-white mb-6 transition-colors duration-500 ease-in-out">
                        Sign in to your account
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input  className="w-full px-4 py-3 rounded-xl bg-cyan-100 text-gray-500 placeholder-gray-500 border dark:bg-slate-800 transition-colors
                                duration-500 ease-in-out border-cyan-700 focus:ring-1 focus:ring-cyan-950 focus:outline-none"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                required
                        />

                        <input  className="w-full px-4 py-3 rounded-xl bg-cyan-100 text-gray-500 placeholder-gray-500 dark:bg-slate-800 transition-colors duration-500
                                ease-in-out border border-cyan-700 focus:ring-1 focus:ring-cyan-950 focus:outline-none"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                        />

                        <button className="w-full py-3 rounded-xl font-bold text-white bg-cyan-600 hover:bg-cyan-700 dark:bg-slate-800 dark:hover:bg-slate-900
                                transition-colors duration-500 ease-in-out hover:cursor-pointer transition disabled:cursor-not-allowed"
                                type="submit"
                                disabled={loading}
                        >{loading ? "Signing in ..." : "Sign in"}</button>

                        {error && <p className="text-red-600 text-center font-medium mt-2">{error}</p>}
                    </form>
                    <span className="block cursor-pointer hover:text-blue-500 hover:underline mt-6 text-center"
                          onClick={() => setShowPasswordChange(true)}
                    >Forgot your password?</span>
                </div>
            </div>
            {showPasswordChange && <ForgotPasswordWindow onClose={handleClosePasswordChange}></ForgotPasswordWindow>}
        </div>
    );
}

export default LoginPage;