import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import HamburgerMenu from "../components/HamburgerMenu"; // Importa il menu
import "../styles/AnimePage.css"; // Stile per le pagine degli anime
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Corretto import

function AnimePage() {
    const { id } = useParams(); // Ottieni l'ID dell'anime dall'URL
    const [anime, setAnime] = useState(null);
    const [animeList, setAnimeList] = useState([]); // Aggiunto stato per la lista degli anime
    const [ratings, setRatings] = useState({
        parameter1: null,
        parameter2: null,
        parameter3: null,
    });
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
    }, [id]);

    const handleRating = (parameter, value) => {
        setRatings((prevRatings) => ({
            ...prevRatings,
            [parameter]: value,
        }));
    };

    const handleSave = () => {
        const token = localStorage.getItem("token"); // Recupera il token JWT

        if (!token) {
            setMessage("Devi effettuare il login per salvare le votazioni.");
            return;
        }

        // Prepara i dati da inviare
        const data = {
            ...ratings,
            user: jwtDecode(token).user_id, // Associa l'utente loggato
        };

        axios
            .post(`http://127.0.0.1:8000/api/animes/${id}/ratings/`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setMessage("Votazioni salvate con successo!");

                // Rimuove l'anime dalla lista degli anime da votare (frontend)
                const updatedToVoteList = animeList.filter((anime) => anime.id !== id);
                setAnimeList(updatedToVoteList);
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
                <HamburgerMenu /> {/* Aggiunto l'hamburger menu */}
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
                                onClick={() => handleRating(parameter, num + 1)}
                            >
                                {num + 1}
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            {/* Messaggio di stato */}
            {message && <p className="message">{message}</p>}

            <button className="save-button" onClick={handleSave}>
                Salva
            </button>
        </div>
    );
}

export default AnimePage;
