import { CgLogOut } from "react-icons/cg";
import { IoLanguage } from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import ErrorWindow from "./ErrorWindow.jsx";
import ConfirmWindow from "./ConfirmWindow.jsx";
import api from "./api.jsx";
import React, {useEffect, useState} from "react";
import {BsMoon, BsSun} from "react-icons/bs";
import {Button} from "@/components/ui/button.js";
import { useTranslation } from "react-i18next";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.js";

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

    const handleLanguageToggle = (lan) => {
        setLanguage(lan);
        switch(lan) {
            case "en":
                i18n.changeLanguage("en");
                break;

            case "pl":
                i18n.changeLanguage("pl");
                break;

            case "de":
                i18n.changeLanguage("de");
                break;

            case "es":
                i18n.changeLanguage("es");
                break;

            case "fr":
                i18n.changeLanguage("fr");
                break;

            case "pt":
                i18n.changeLanguage("pt");
                break;

            case "uk":
                i18n.changeLanguage("uk");
                break;

            case "zh":
                i18n.changeLanguage("zh");
                break;

            default:
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
                            <Select value={i18n.language}
                                    onValueChange={(value) => {handleLanguageToggle(value)}}>
                                <SelectTrigger className="w-40 hover:cursor-pointer">
                                    <SelectValue placeholder="Language" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectGroup>
                                        <SelectLabel>{t("language")}</SelectLabel>
                                        <SelectItem value="en">
                                            <div className="flex items-center gap-2 hover:cursor-pointer">
                                                <IoLanguage className="inline-block" />
                                                <span>{t("en")}</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="pl">
                                            <div className="flex items-center gap-2 hover:cursor-pointer">
                                                <IoLanguage className="inline-block" />
                                                <span>{t("pl")}</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="de">
                                            <div className="flex items-center gap-2 hover:cursor-pointer">
                                                <IoLanguage className="inline-block" />
                                                <span>{t("de")}</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="es">
                                            <div className="flex items-center gap-2 hover:cursor-pointer">
                                                <IoLanguage className="inline-block" />
                                                <span>{t("es")}</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="fr">
                                            <div className="flex items-center gap-2 hover:cursor-pointer">
                                                <IoLanguage className="inline-block" />
                                                <span>{t("fr")}</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="pt">
                                            <div className="flex items-center gap-2 hover:cursor-pointer">
                                                <IoLanguage className="inline-block" />
                                                <span>{t("pt")}</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="uk">
                                            <div className="flex items-center gap-2 hover:cursor-pointer">
                                                <IoLanguage className="inline-block" />
                                                <span>{t("uk")}</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="zh">
                                            <div className="flex items-center gap-2 hover:cursor-pointer">
                                                <IoLanguage className="inline-block" />
                                                <span>{t("zh")}</span>
                                            </div>
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <Button className="hover:cursor-pointer w-25"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleThemeToggle}>
                                {theme === "light" ? <BsMoon /> : <BsSun />}
                                {theme === "light" ? t("darkMode") : t("lightMode")}</Button>

                            {isLoggedIn && (
                                <div className="flex items-center gap-3">
                                    {role === "sup" && (
                                        <Button className="hover:cursor-pointer w-75"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setShowConfirmation(true)}>
                                            <CgLogOut />
                                            {t("logoutAll")}</Button>)}

                                    <Button className="hover:cursor-pointer w-35"
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