import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import HamburgerMenu from "../components/HamburgerMenu";
import "../styles/AnimePage.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import config from "../config";

function AnimePage() {
    const { id } = useParams();
    const [anime, setAnime] = useState(null);
    const [ratings, setRatings] = useState({
        parameter1: null,
        parameter2: null,
        parameter3: null,
    });
    const [isEditable, setIsEditable] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false); // Stato per la spunta verde

    useEffect(() => {
        // Recupera i dettagli dell'anime
        axios
            .get(`${config.backendUrl}/api/animes/${id}/`)
            .then((response) => {
                setAnime(response.data);
            })
            .catch((error) => {
                console.error("Errore nel recupero dell'anime:", error);
            });

        // Recupera i voti salvati per l'anime dell'utente
        const token = localStorage.getItem("token");
        if (token) {
            const userId = jwtDecode(token).user_id;
            axios
                .get(`${config.backendUrl}/api/animes/${id}/ratings/${userId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    setRatings({
                        parameter1: response.data.parameter1,
                        parameter2: response.data.parameter2,
                        parameter3: response.data.parameter3,
                    });
                    setIsEditable(false);
                })
                .catch((error) => {
                    if (error.response && error.response.status === 404) {
                        setIsEditable(true);
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
        if (!token) return;

        const userId = jwtDecode(token).user_id;

        const data = {
            parameter1: ratings.parameter1,
            parameter2: ratings.parameter2,
            parameter3: ratings.parameter3,
        };

        const endpoint = `${config.backendUrl}/api/animes/${id}/ratings/${userId}/`;
        const method = isEditable ? "post" : "put";

        axios({
            method: method,
            url: method === "post" ? endpoint.replace(`/${userId}/`, "/") : endpoint,
            data: data,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                setShowSuccess(true); // Mostra la spunta verde
                setIsEditable(false);

                // Nascondi la spunta dopo 2 secondi
                setTimeout(() => {
                    setShowSuccess(false);
                }, 2000);
            })
            .catch((error) => {
                console.error("Errore nel salvataggio o aggiornamento delle votazioni:", error);
            });
    };

    const handleEdit = () => {
        setIsEditable(true);
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
                                onClick={() => isEditable && handleRating(parameter, num + 1)}
                                disabled={!isEditable}
                            >
                                {num + 1}
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            {/* Pulsanti per salvare o modificare */}
            {isEditable ? (
                <button className="save-button" onClick={handleSave}>
                    Salva
                </button>
            ) : (
                <button className="edit-button" onClick={handleEdit}>
                    Modifica
                </button>
            )}

            {/* Spunta verde */}
            {showSuccess && <div className="success-checkmark">✔</div>}
        </div>
    );
}

export default AnimePage;
