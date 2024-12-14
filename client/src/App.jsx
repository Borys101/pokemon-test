import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import AuthRoute from "./components/authRoute/AuthRoute";
import Login from "./pages/login/Login";

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <AuthRoute isProtected={false}>
                            <Login />
                        </AuthRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                        <AuthRoute isProtected={true}>
                            <Home />
                        </AuthRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
