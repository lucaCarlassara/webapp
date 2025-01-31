import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import HamburgerMenu from "./HamburgerMenu";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import config from "../config";

function HomePage() {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const [animeRatings, setAnimeRatings] = useState([]);

    useEffect(() => {
        // Recupera i dati dei voti e calcola le medie
        axios
            .get(`${config.backendUrl}/api/ratings-summary/`) // Usa l'URL del backend configurato
            .then((response) => {
                setAnimeRatings(response.data);
            })
            .catch((error) => {
                console.error("Errore nel recupero delle medie dei voti:", error);
            });
    }, []);

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

            {/* Contenuto: Lista dei parametri */}
            <div className="ratings-container">
                {[
                    "intro", "soundtrack", "plot", "animations", "unpredictability", 
                    "protagonist", "secondary_characters", "plot_armor", "character_development", 
                    "villains", "japanese_awkwardness", "story_flow", "dead_moments", 
                    "logical_character_choices", "fights", "character_design", "ending"
                ].map((parameter) => {
                    // Filtra gli anime con media > 0 per il parametro corrente
                    const filteredAnime = animeRatings.filter(anime => anime[parameter] > 0);

                    return (
                        filteredAnime.length > 0 && ( // Mostra la sezione solo se ci sono anime con voto > 0
                            <div key={parameter} className="parameter-section">
                                <h2>{parameter.replace("_", " ").replace(/(^|\s)\S/g, (letter) => letter.toUpperCase())}</h2>
                                <div className="anime-list">
                                    {filteredAnime
                                        .sort((a, b) => b[parameter] - a[parameter]) // Ordina gli anime in base alla media dei voti per il parametro
                                        .map((anime) => (
                                        <div key={anime.id} className="anime-item">
                                            <p className="anime-score">{anime[parameter].toFixed(1)}</p> {/* Voto sopra l'immagine */}
                                            <img
                                                src={anime.image_url || "https://via.placeholder.com/100"}
                                                alt={anime.title}
                                                className="anime-image"
                                            />
                                            <p className="anime-title-home">{anime.title}</p> {/* Titolo sotto l'immagine */}
                                        </div>
                                        ))}
                                </div>
                            </div>
                        )
                    );
                })}
            </div>
        </div>
    );
}

export default HomePage;
