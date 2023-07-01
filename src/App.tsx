import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/register/RegisterPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RegisterPage />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
