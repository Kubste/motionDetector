import { CgLogOut } from "react-icons/cg";
import {useNavigate} from "react-router-dom";
import ErrorWindow from "./ErrorWindow.jsx";
import ConfirmWindow from "./ConfirmWindow.jsx";
import api from "./api.jsx";
import {useEffect, useState} from "react";
import {BsMoon, BsSun} from "react-icons/bs";

function TopBar({isLoggedIn}) {
    const navigate = useNavigate();
    const username = sessionStorage.getItem("username");
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        if(localStorage.getItem("theme") === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            document.documentElement.classList.add("dark");
            setTheme("dark");
        } else {
            document.documentElement.classList.remove("dark");
            setTheme("light");
        }
    }, []);

    const handleThemeToggle = () => {
        if (theme === "dark") {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setTheme("light");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setTheme("dark");
        }
    }

    const handleLogout = async () => {

        try {
            await api.post('/auth/logout-all/', {});
            //sessionStorage.removeItem('token');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('user_id');
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
            //sessionStorage.removeItem('token');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('user_id');
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

    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
    }

    return (
        <div className="w-full bg-cyan-300 text-cyan-700 dark:bg-slate-800 shadow-2xl px-6 py-4 flex items-center justify-between sticky top-0 z-50">
            <h3 className="text-xl font-bold cursor-pointer hover:text-cyan-900 transition dark:text-white"
                onClick={() => navigate("/")}>
                Motion Detector App {isLoggedIn && `\u00A0\u00A0 Hi ${username}!`}
            </h3>

            <button className="button inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-700 text-white hover:bg-cyan-900 dark:text-black dark:bg-slate-600 dark:hover:bg-slate-700"
                    onClick={handleThemeToggle}
            >{theme === "light" ? <BsMoon size={18} /> : <BsSun size={18} />} {theme === "light" ? "Set dark mode" : "Set light mode"}</button>

            {isLoggedIn && (<div className="flex gap-3">{sessionStorage.getItem('role') === "sup" && (
                        <button className="button flex items-center gap-1 px-3 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-900 hover:cursor-pointer text-white dark:text-black dark:bg-slate-600 dark:hover:bg-slate-700"
                            onClick={() => setShowConfirmation(true)}>
                            <CgLogOut size={18}/>
                            Logout all users
                        </button>
                    )}

                    <button className="button flex items-center gap-1 px-3 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-900 hover:cursor-pointer text-white dark:text-black dark:bg-slate-600 dark:hover:bg-slate-700"
                        onClick={handleLogout}>
                        <CgLogOut size={18}/>
                        Logout
                    </button>
                </div>
            )}

            {showError && (<ErrorWindow message="Error while trying to log out" onClose={handleCloseError}/>)}

            {showConfirmation && (<ConfirmWindow message="log out all users" onClose={handleCloseConfirmation} onConfirm={handleLogoutAll}/>)}
        </div>
    );
}

export default TopBar;