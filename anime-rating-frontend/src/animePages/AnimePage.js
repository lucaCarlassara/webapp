import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import HamburgerMenu from "../components/HamburgerMenu";
import "../styles/AnimePage.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function AnimePage() {
    const { id } = useParams(); // Ottieni l'ID dell'anime dall'URL
    const [anime, setAnime] = useState(null);
    const [ratings, setRatings] = useState({
        parameter1: null,
        parameter2: null,
        parameter3: null,
    });
    const [isVoted, setIsVoted] = useState(false); // Stato per verificare se l'anime è stato votato
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Recupera i dati dell'anime dal backend
        axios
            .get(`http://127.0.0.1:8000/api/animes/${id}/`)
            .then((response) => {
                setAnime(response.data);
            })
            .catch((error) => {
                console.error("Errore nel recupero dell'anime:", error);
            });

        // Controlla se l'utente ha già votato questo anime
        const token = localStorage.getItem("token");
        if (token) {
            const userId = jwtDecode(token).user_id;
            axios
                .get(`http://127.0.0.1:8000/api/animes/${id}/ratings/${userId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    const userRatings = response.data;
                    if (userRatings) {
                        setRatings({
                            parameter1: userRatings.parameter1,
                            parameter2: userRatings.parameter2,
                            parameter3: userRatings.parameter3,
                        });
                        setIsVoted(true); // L'anime è stato votato
                    }
                })
                .catch((error) => {
                    if (error.response?.status === 404) {
                        setIsVoted(false); // L'anime non è stato votato
                    } else {
                        console.error("Errore nel recupero delle votazioni:", error);
                    }
                });
        }
    }, [id]);

    const handleRating = (parameter, value) => {
        setRatings((prevRatings) => ({
            ...prevRatings,
            [parameter]: value,
        }));
    };

    const handleSave = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("Devi effettuare il login per salvare le votazioni.");
            return;
        }

        const data = {
            parameter1: ratings.parameter1,
            parameter2: ratings.parameter2,
            parameter3: ratings.parameter3,
        };

        axios
            .post(`http://127.0.0.1:8000/api/animes/${id}/ratings/`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                setMessage("Votazioni salvate con successo!");
                setIsVoted(true); // Imposta lo stato a "votato"
            })
            .catch((error) => {
                console.error("Errore nel salvataggio delle votazioni:", error);
                setMessage("Errore nel salvataggio delle votazioni.");
            });
    };

    if (!anime) {
        return <p>Caricamento...</p>;
    }

    return (
        <div className="anime-page-container">
            {/* Header con Hamburger Menu */}
            <div className="header">
                <HamburgerMenu />
                <h1 className="title">Area Personale</h1>
                <Link to="/" className="home-link">
                    Home
                </Link>
            </div>

            {/* Contenuto */}
            <div className="anime-info">
                <img
                    src={anime.image_url || "https://via.placeholder.com/150"}
                    alt={anime.title}
                    className="anime-image"
                />
                <div className="anime-details">
                    <h2>{anime.title}</h2>
                    <p>Anno: {anime.year}</p>
                    <p>Genere: {anime.genre}</p>
                    <p>Studio: {anime.studio}</p>
                    <p>Durata: {anime.duration}</p>
                    <p>Tipologia: {anime.typology}</p>
                    <p>Stato: {anime.status}</p>
                </div>
            </div>

            <p className="anime-description">{anime.description}</p>

            {/* Parametri di valutazione */}
            {["parameter1", "parameter2", "parameter3"].map((parameter, index) => (
                <div key={parameter} className="rating-row">
                    <p>Parametro {index + 1}</p>
                    <div className="rating-options">
                        {[...Array(10).keys()].map((num) => (
                            <button
                                key={num + 1}
                                className={`rating-button ${
                                    ratings[parameter] === num + 1 ? "selected" : ""
                                }`}
                                style={{
                                    backgroundColor:
                                        ratings[parameter] === num + 1
                                            ? getColor(num + 1)
                                            : "transparent",
                                    pointerEvents: isVoted ? "none" : "auto", // Disabilita il click se votato
                                }}
                                onClick={() =>
                                    !isVoted && handleRating(parameter, num + 1)
                                } // Imposta i voti solo se non è stato votato
                            >
                                {num + 1}
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            {/* Messaggio di stato */}
            {message && <p className="message">{message}</p>}

            {/* Bottone Salva */}
            {!isVoted && (
                <button className="save-button" onClick={handleSave}>
                    Salva
                </button>
            )}
        </div>
    );
}

// Funzione per determinare il colore basato sul voto
const getColor = (rating) => {
    return "blue";
};

export default AnimePage;
