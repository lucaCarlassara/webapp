import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import HamburgerMenu from "./HamburgerMenu";
import { AuthContext } from "../AuthContext";

function HomePage() {
    const { isAuthenticated, logout } = useContext(AuthContext);

    return (
        <div className="container">
            {/* Header */}
            <div className="header">
                <HamburgerMenu />
                <h1 className="title">Home Page</h1>
                {isAuthenticated ? (
                    <button onClick={logout} className="logout-button">
                        Logout
                    </button>
                ) : (
                    <Link to="/auth" className="login-link">
                        Accedi
                    </Link>
                )}
            </div>

            
        </div>
    );
}

export default HomePage;
