import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import AuthRoute from "./components/authRoute/AuthRoute";
import Login from "./pages/login/Login";
import BattlesHistory from "./pages/battlesHistory/BattlesHistory";
import Header from "./components/header/Header";
import BattlePage from "./pages/battle/Battle";

function App() {
    return (
        <Router>
            <Header />
            <main className="main">
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
                    <Route
                        path="/battle"
                        element={
                            <AuthRoute isProtected={true}>
                                <BattlePage />
                            </AuthRoute>
                        }
                    />
                    <Route
                        path="/battles-history"
                        element={
                            <AuthRoute isProtected={true}>
                                <BattlesHistory />
                            </AuthRoute>
                        }
                    />
                </Routes>
            </main>
        </Router>
    );
}

export default App;
