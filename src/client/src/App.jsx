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

function App() {

    document.title = "Motion Detector App";

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
        </Routes>
    </Router>
  );

    // return(
    //     <LoginPage></LoginPage>
    // );
}

export default App
