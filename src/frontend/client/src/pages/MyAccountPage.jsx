import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import TopBar from "../components/UniversalComponents/TopBar.jsx";
import UserInfo from "../components/MyAccountComponents/UserInfo.jsx"
import api from "../components/UniversalComponents/api.jsx";

function MyAccountPage() {
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/auth/is-logged").catch(() => {navigate("/login")});
    }, [navigate]);

    return(
        <div className="flex flex-col min-h-screen w-full">
            <TopBar isLoggedIn={true}></TopBar>
            <div className="flex flex-1 justify-center items-center w-full">
                <UserInfo></UserInfo>
            </div>
        </div>
    );
}

export default MyAccountPage;