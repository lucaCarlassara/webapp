import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

function HomePage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    // Pulisci il token all'avvio per assicurarti che nessuno sia autenticato
    useEffect(() => {
        localStorage.removeItem("token"); // Rimuovi il token salvato
        setIsAuthenticated(false); // Aggiorna lo stato
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        alert("Logout effettuato!");
        navigate("/home");
    };

    return (
        <div className="container">
            {/* Header */}
            <div className="header">
                <button className="menu-button">&#9776;</button>
                <h1 className="title">Home Page</h1>
                {isAuthenticated ? (
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                ) : (
                    <Link to="/auth" className="login-link">
                        Accedi
                    </Link>
                )}
            </div>

            {/* Content */}
            <div className="content">
                <p>questa è la home</p>
            </div>
        </div>
    );
}

export default HomePage;
