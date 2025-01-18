import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/PersonalArea.css";

function PersonalArea() {
    const [selectedTab, setSelectedTab] = useState("voted"); // Tab selezionato: "voted" o "toVote"

    // Funzione per gestire il cambio di tab
    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <div className="personal-area-container">
            {/* Header */}
            <div className="header">
                <button className="menu-button">&#9776;</button>
                <h1 className="title">Area Personale</h1>
                <Link to="/home" className="home-link">
                    Home
                </Link>
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
                {/* Contenuto Anime Votati */}
                <div className={`content ${selectedTab === "voted" ? "slide-in" : "hidden"}`}>
                    <p>Lista anime votati</p>
                </div>

                {/* Contenuto Vota un Anime */}
                <div className={`content ${selectedTab === "toVote" ? "slide-in" : "hidden"}`}>
                    <p>Lista anime da votare</p>
                </div>
            </div>
        </div>
    );
}

export default PersonalArea;
