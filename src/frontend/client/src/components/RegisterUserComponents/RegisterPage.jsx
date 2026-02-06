import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import TopBar from "../UniversalComponents/TopBar.jsx";
import RegisterWindow from "./RegisterWindow.jsx";
import api from "../UniversalComponents/api.jsx";

function RegisterPage() {
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/auth/is-logged").catch(() => {navigate("/login")});
    }, [navigate]);

    return(
        <div className="flex flex-col min-h-screen w-full">
            <TopBar isLoggedIn={true}></TopBar>
            <div className="flex flex-1 justify-center items-center w-full">
                <RegisterWindow></RegisterWindow>
            </div>
        </div>
    );
}

export default RegisterPage;