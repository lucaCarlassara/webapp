import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HamburgerMenu.css";
import { AuthContext } from "../AuthContext";

function HamburgerMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleNavigation = (path, requireAuth = false) => {
        if (requireAuth && !isAuthenticated) {
            alert("Devi autenticarti prima di accedere a questa sezione!");
            navigate("/login");
        } else {
            navigate(path);
        }
        setIsOpen(false); // Chiude il menu
    };

    return (
        <div className="hamburger-menu">
            <button className="menu-button" onClick={toggleMenu}>
                &#9776;
            </button>

            {isOpen && (
                <div className="menu-content">
                    <ul>
                        <li onClick={() => handleNavigation("/home")}>Home</li>
                        <li onClick={() => handleNavigation("/login")}>Login / Sign Up</li>
                        <li onClick={() => handleNavigation("/login/personal-area", true)}>Personal Area</li>
                        <li onClick={() => handleNavigation("/anime-list")}>Anime List</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default HamburgerMenu;
