import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPageComponents/MainPage/MainPage.jsx";
import ImagesPage from "./components/ImagesComponents/ImagesPage/ImagesPage.jsx";
import CameraManagementPage from "./components/CameraManagementComponents/CameraManagementPage/CameraManagementPage.jsx";
import MyAccountPage from "./components/MyAccountComponents/MyAccountPage/MyAccountPage.jsx";

function App() {

  return (
    <Router>
        <Routes>
            <Route path="/" element={<MainPage></MainPage>}></Route>
            <Route path="/images" element={<ImagesPage></ImagesPage>}></Route>
            <Route path="/camera-management" element={<CameraManagementPage></CameraManagementPage>}></Route>
            <Route path="/my-account" element={<MyAccountPage></MyAccountPage>}></Route>
        </Routes>
    </Router>
  );
}

export default App
