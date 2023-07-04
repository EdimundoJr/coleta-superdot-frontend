import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/register/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RegisterPage />}></Route>
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <p>Tela inicial</p>
                        </ProtectedRoute>
                    }
                ></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
