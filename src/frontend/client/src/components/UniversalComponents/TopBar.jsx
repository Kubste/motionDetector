import { CgLogOut } from "react-icons/cg";
import { IoLanguage } from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import ErrorWindow from "./ErrorWindow.jsx";
import ConfirmWindow from "./ConfirmWindow.jsx";
import api from "./api.jsx";
import {useEffect, useState} from "react";
import {BsMoon, BsSun} from "react-icons/bs";
import {Button} from "@/components/ui/button.js";
import { useTranslation } from "react-i18next";

function TopBar({isLoggedIn}) {
    const { i18n } = useTranslation();
    const { t } = useTranslation();

    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [theme, setTheme] = useState("light");
    const [language, setLanguage] = useState("en");

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
        if(theme === "dark") {
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
            localStorage.removeItem('username');
            localStorage.removeItem('user_id');
            localStorage.removeItem('role');
            navigate('/login');
        } catch (error) {
            setError(error);
            setShowError(true);
        }
    }

    const handleLogoutAll = async () => {
        try {
            await api.post('/auth/logout-all-users/', {});
            localStorage.removeItem('username');
            localStorage.removeItem('user_id');
            localStorage.removeItem('role');
            navigate('/login');
        } catch (error) {
            setError(error);
            setShowError(true);
        }
    }

    const handleLanguageToggle = () => {
        if(language === "en") {
            setLanguage("pl");
            i18n.changeLanguage("pl");
        } else {
            setLanguage("en");
            i18n.changeLanguage("en");
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
        <div>
            <div className="sticky top-0 z-50 w-full bg-gradient-to-br from-white/80 via-white/60 to-white/40
                dark:from-cyan-800/10 dark:via-indigo-600/10 dark:to-violet-900/20 backdrop-blur-2xl">
                <div className="mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex flex-col cursor-pointer" onClick={() => navigate("/")}>

            <span className="text-xl font-bold text-slate-900 dark:text-white">Motion Detector App</span>
                {isLoggedIn && (<span className="text-sm text-slate-600 dark:text-slate-400">{t("greetings")} {username}!</span>)}
                    </div>
                        <div className="flex items-center gap-3">
                            <Button className="hover:cursor-pointer w-25"
                                variant="outline"
                                size="sm"
                                onClick={handleLanguageToggle}>
                                <IoLanguage />
                                {language === "en" ? "Polski" : "English"}</Button>

                            <Button className="hover:cursor-pointer w-25"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleThemeToggle}>
                                {theme === "light" ? <BsMoon /> : <BsSun />}
                                {theme === "light" ? t("darkMode") : t("lightMode")}</Button>

                            {isLoggedIn && (
                                <div className="flex items-center gap-3">
                                    {role === "sup" && (
                                        <Button className="hover:cursor-pointer w-45"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setShowConfirmation(true)}>
                                            <CgLogOut />
                                            {t("logoutAll")}</Button>)}

                                    <Button className="hover:cursor-pointer w-30"
                                        size="sm"
                                        onClick={handleLogout}>
                                        <CgLogOut />
                                        {t("logout")}</Button>
                        </div>)}
                    </div>
                </div>
            </div>

            {showError && (<ErrorWindow> message="Error while trying to log out"
                    onClose={handleCloseError}</ErrorWindow>)}

            {showConfirmation && (
                <ConfirmWindow message={t("logoutAllLow")}
                    onClose={handleCloseConfirmation}
                    onConfirm={handleLogoutAll}></ConfirmWindow>)}
        </div>
    );
}

export default TopBar;