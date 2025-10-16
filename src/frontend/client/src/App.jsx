import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPageComponents/MainPage.jsx";
import ImagesPage from "./components/ImagesComponents/ImagesPage.jsx";
import CameraManagementPage from "./components/CameraManagementComponents/CameraManagementPage.jsx";
import MyAccountPage from "./components/MyAccountComponents/MyAccountPage.jsx";
import LoginPage from "./components/LoginPageComponents/LoginPage.jsx";
import RegisterPage from "./components/RegisterUserComponents/RegisterPage.jsx";
import UsersPage from "./components/UsersComponents/UsersPage.jsx";
import AdminsManagementPage from "./components/AdminsManagementComponents/AdminsManagementPage.jsx";
import SynchronizePage from "./components/SynchronizeComponents/SynchronizePage.jsx";
import DeletedFilesPage from "./components/SynchronizeComponents/DeletedFilesPage.jsx";
import AdminsPage from "./components/AdminsManagementComponents/AdminsPage.jsx";
import AddAdminsPage from "./components/AdminsManagementComponents/AddAdminsPage.jsx";

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
        </Routes>
    </Router>
  );

    // return(
    //     <LoginPage></LoginPage>
    // );
}

export default App
