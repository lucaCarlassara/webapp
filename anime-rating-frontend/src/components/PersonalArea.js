import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/PersonalArea.css";
import HamburgerMenu from "./HamburgerMenu";
import axios from "axios";

function PersonalArea() {
    const [selectedTab, setSelectedTab] = useState("voted");
    const [animeVoted, setAnimeVoted] = useState([]); // Lista degli anime votati
    const [animeToVote, setAnimeToVote] = useState([]); // Lista degli anime da votare
    const [username, setUsername] = useState(""); // Stato per il nome utente
    const navigate = useNavigate();

    // Decodifica il token JWT per ottenere il nome utente
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token); // Decodifica il token JWT
                setUsername(decoded.username); // Imposta il nome utente
            } catch (error) {
                console.error("Errore nella decodifica del token:", error);
            }
        }
    }, []);

    // Recupera gli anime votati e da votare per l'utente corrente
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            const userId = jwtDecode(token).user_id;

            // Interroga il backend per ottenere le liste degli anime
            axios
                .get(`http://127.0.0.1:8000/api/user-animes/${userId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    const { voted, to_vote } = response.data;
                    setAnimeVoted(voted); // Imposta gli anime votati
                    setAnimeToVote(to_vote); // Imposta gli anime da votare
                })
                .catch((error) => {
                    console.error("Errore nel caricamento degli anime:", error);
                });
        }
    }, []);

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };

    const handleAnimeClick = (animeId) => {
        navigate(`/anime/${animeId}`); // Naviga alla pagina dell'anime specifico
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
                {selectedTab === "voted" && (
                    <div className="anime-voted-list">
                        {animeVoted.length > 0 ? (
                            animeVoted.map((anime) => (
                                <div key={anime.id} className="anime-item" onClick={() => handleAnimeClick(anime.id)}>
                                    {anime.title}
                                </div>
                            ))
                        ) : (
                            <p>Non hai ancora votato nessun anime.</p>
                        )}
                    </div>
                )}
                {selectedTab === "toVote" && (
                    <div className="anime-to-vote-list">
                        {animeToVote.length > 0 ? (
                            animeToVote.map((anime) => (
                                <div
                                    key={anime.id}
                                    className="anime-item"
                                    onClick={() => handleAnimeClick(anime.id)}
                                >
                                    {anime.title}
                                </div>
                            ))
                        ) : (
                            <p>Non ci sono anime disponibili da votare.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PersonalArea;
