import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import TopBar from "../UniversalComponents/TopBar.jsx"
import DeletedFilesList from "./DeletedFilesList.jsx"
import api from "../UniversalComponents/api.jsx";

function DeletedFilesPage() {
    const searchParams = new URLSearchParams(location.search);
    const cameraID = searchParams.get("camera");
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/auth/is-logged").catch(() => {navigate("/login")});
    }, [navigate]);

    return(
        <div className="flex flex-col min-h-screen w-full">
            <TopBar isLoggedIn={true}></TopBar>
            <div className="flex flex-1 justify-center items-center w-full">
                <DeletedFilesList cameraID={cameraID}></DeletedFilesList>
            </div>
        </div>
    );

}

export default DeletedFilesPage;