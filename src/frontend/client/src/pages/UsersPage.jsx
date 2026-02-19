import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import TopBar from "../components/UniversalComponents/TopBar.jsx";
import UsersList from "../components/UsersComponents/UsersList.jsx";
import api from "../components/UniversalComponents/api.jsx";

function UsersPage() {
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/auth/is-logged").catch(() => {navigate("/login")});
    }, [navigate]);

    return(
        <div className="flex flex-col min-h-screen">
            <TopBar isLoggedIn={true}></TopBar>
            <div className="flex flex-col flex-1 justify-center items-center w-full">
                <UsersList></UsersList>
            </div>
        </div>
    );
}

export default UsersPage;