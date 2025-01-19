import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/PersonalArea.css";
import HamburgerMenu from "./HamburgerMenu";
import axios from "axios";

function PersonalArea() {
    const [selectedTab, setSelectedTab] = useState("voted");
    const [animeList, setAnimeList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedTab === "toVote") {
            // Interroga l'API per ottenere l'elenco degli anime
            axios
                .get("http://127.0.0.1:8000/api/animes/")
                .then((response) => {
                    setAnimeList(response.data);
                })
                .catch((error) => {
                    console.error("Errore nel recupero degli anime:", error);
                });
        }
    }, [selectedTab]);

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };

    const handleAnimeClick = (animeId) => {
        navigate(`/anime/${animeId}`);
    };

    return (
        <div className="personal-area-container">
            {/* Header con Hamburger Menu */}
            <div className="header">
                <HamburgerMenu />
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

            {/* Contenuto */}
            <div className="content-container">
                {selectedTab === "voted" && <p>Lista anime votati</p>}
                {selectedTab === "toVote" && (
                    <div className="anime-list">
                        {animeList.map((anime) => (
                            <div
                                key={anime.id}
                                className="anime-item"
                                onClick={() => handleAnimeClick(anime.id)}
                            >
                                {anime.title}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PersonalArea;
