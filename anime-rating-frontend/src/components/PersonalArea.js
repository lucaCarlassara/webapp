import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PersonalArea.css";
import HamburgerMenu from "./HamburgerMenu";
import { AuthContext } from "../AuthContext";

function PersonalArea() {
    const [selectedTab, setSelectedTab] = useState("voted"); // Tab selezionato
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    // Funzione per cambiare tab
    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };

    // Controlla se l'utente è autenticato
    if (!isAuthenticated) {
        alert("Devi autenticarti prima di accedere all'area personale!");
        navigate("/auth");
        return null;
    }

    return (
        <div className="personal-area-container">
            {/* Header con Hamburger Menu */}
            <div className="header">
                <HamburgerMenu />
                <h1 className="title">Area Personale</h1>
            </div>

            {/* Bottoni per cambiare tab */}
            <div className="tab-buttons">
                <button
                    className={`tab-button ${selectedTab === "voted" ? "active" : ""}`}
                    onClick={() => handleTabChange("voted")}
                >
                    Anime votati
                </button>
                <button
                    className={`tab-button ${selectedTab === "toVote" ? "active" : ""}`}
                    onClick={() => handleTabChange("toVote")}
                >
                    Vota un anime
                </button>
            </div>

            {/* Contenuto basato sul tab selezionato */}
            <div className="content-container">
                {selectedTab === "voted" && (
                    <div className="content slide-in">
                        <p>Lista anime votati</p>
                    </div>
                )}
                {selectedTab === "toVote" && (
                    <div className="content slide-in">
                        <p>Lista anime da votare</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PersonalArea;
