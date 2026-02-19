import './App.css'
import './locales/locales.jsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage.jsx";
import ImagesPage from "./pages/ImagesPage.jsx";
import CameraManagementPage from "./pages/CameraManagementPage.jsx";
import MyAccountPage from "./pages/MyAccountPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import AdminsManagementPage from "./components/AdminsManagementComponents/AdminsManagementPage.jsx";
import SynchronizePage from "./components/SynchronizeComponents/SynchronizePage.jsx";
import DeletedFilesPage from "./pages/DeletedFilesPage.jsx";
import AdminsPage from "./pages/AdminsPage.jsx";
import AddAdminsPage from "./components/AdminsManagementComponents/AddAdminsPage.jsx";
import ModelsManagementPage from "./pages/ModelsManagementPage.jsx";

function App() {

    document.title = "Motion Detector App";

    // // disabling color transition effect after page reload
    // document.documentElement.classList.add("preload");
    // window.addEventListener("load", () => {
    //     document.documentElement.classList.remove("preload");
    // });

  return(
    <Router>
        <Routes>
            <Route path="/login" element={<LoginPage></LoginPage>}></Route>
            <Route path="/" element={<MainPage isLoggedIn={true}></MainPage>}></Route>
            <Route path="/images" element={<ImagesPage></ImagesPage>}></Route>
            <Route path="/camera-management" element={<CameraManagementPage></CameraManagementPage>}></Route>
            <Route path="/my-account" element={<MyAccountPage></MyAccountPage>}></Route>
            <Route path="/register" element={<RegisterPage></RegisterPage>}></Route>
            <Route path="/users" element={<UsersPage></UsersPage>}></Route>
            <Route path="/admins-management" element={<AdminsManagementPage></AdminsManagementPage>}></Route>
            <Route path="/synchronize" element={<SynchronizePage></SynchronizePage>}></Route>
            <Route path="/synchronize-list" element={<DeletedFilesPage></DeletedFilesPage>}></Route>
            <Route path="/admins-page" element={<AdminsPage></AdminsPage>}></Route>
            <Route path="/assign-admins" element={<AddAdminsPage></AddAdminsPage>}></Route>
            <Route path="/models-management" element={<ModelsManagementPage></ModelsManagementPage>}></Route>
        </Routes>
    </Router>
  );

    // return(
    //     <LoginPage></LoginPage>
    // );
}

export default App
