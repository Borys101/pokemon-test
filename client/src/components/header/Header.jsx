import { Link, useNavigate } from "react-router-dom";
import "./header.scss";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    };

    return (
        <header className="header">
            <div className="header-content">
                <h1 className="header-logo">Pokemon App</h1>
                <nav className="header-nav">
                    <Link to="/">Home</Link>
                    <Link to="/battles-history">Battle History</Link>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
