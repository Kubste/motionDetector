import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import TopBar from "../UniversalComponents/TopBar.jsx"
import DeletedFilesList from "./DeletedFilesList.jsx"
import {useLocation} from "react-router-dom";

function DeletedFilesPage() {
    const location = useLocation();
    const filesList = location.state?.filesList || [];
    const cameraID = location.state?.cameraID;
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if(!token) {
            navigate('/login');
        }
    }, [navigate]);

    return(
        <div className="flex flex-col min-h-screen w-full">
            <TopBar isLoggedIn={true}></TopBar>
            <div className="flex flex-1 justify-center items-center w-full">
                <DeletedFilesList filesList={filesList} cameraID={cameraID}></DeletedFilesList>
            </div>
        </div>
    );

}

export default DeletedFilesPage;