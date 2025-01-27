import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import HamburgerMenu from "./HamburgerMenu";
import { AuthContext } from "../AuthContext";
import axios from "axios";

function HomePage() {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const [animeRatings, setAnimeRatings] = useState([]);

    useEffect(() => {
        // Recupera i dati dei voti e calcola le medie
        axios
            .get("http://127.0.0.1:8000/api/ratings-summary/") // Endpoint per recuperare i dati delle medie
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
                <h1 className="title">Home Pag</h1>
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
                {["parameter1", "parameter2", "parameter3"].map((parameter, index) => (
                    <div key={parameter} className="parameter-section">
                        <h2>Parametro {index + 1}</h2>
                        <div className="anime-list">
                            {animeRatings
                                .sort((a, b) => b[parameter] - a[parameter]) // Ordina gli anime in base alla media dei voti per il parametro
                                .map((anime) => (
                                    <div key={anime.id} className="anime-item">
                                        <img
                                            src={anime.image_url || "https://via.placeholder.com/100"}
                                            alt={anime.title}
                                            className="anime-image"
                                        />
                                        <p>{anime[parameter].toFixed(1)}</p>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomePage;
