import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corretto import
import "../styles/PersonalArea.css";
import HamburgerMenu from "./HamburgerMenu";
import axios from "axios";

function PersonalArea() {
    const [selectedTab, setSelectedTab] = useState("voted");
    const [animeList, setAnimeList] = useState([]);
    const [username, setUsername] = useState(""); // Stato per il nome utente
    const navigate = useNavigate();

    // Decodifica il token JWT per ottenere il nome utente
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token); // Usa jwtDecode qui
                setUsername(decoded.username); // Imposta il nome utente
            } catch (error) {
                console.error("Errore nella decodifica del token:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (selectedTab === "toVote") {
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

            {/* Nome utente */}
            <div className="user-info">
                <p>Benvenuto, {username}!</p>
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
