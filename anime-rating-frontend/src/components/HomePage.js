import React from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";

function HomePage() {
    return (
        <div className="container">
            {/* Header */}
            <div className="header">
                <button className="menu-button">&#9776;</button>
                <h1 className="title">Home Page</h1>
                <Link to="/auth" className="login-link">
                    Accedi
                </Link>
            </div>

            {/* Content */}
            <div className="content">
                <p>questa è la home</p>
            </div>
        </div>
    );
}

export default HomePage;

