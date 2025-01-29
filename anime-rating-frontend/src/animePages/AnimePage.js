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
        intro: null,
        soundtrack: null,
        plot: null,
        animations: null,
        unpredictability: null,
        protagonist: null,
        secondary_characters: null,
        plot_armor: null,
        character_development: null,
        villains: null,
        japanese_awkwardness: null,
        story_flow: null,
        dead_moments: null,
        logical_character_choices: null,
        fights: null,
        character_design: null,
        ending: null,
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
                        intro: response.data.intro,
                        soundtrack: response.data.soundtrack,
                        plot: response.data.plot,
                        animations: response.data.animations,
                        unpredictability: response.data.unpredictability,
                        protagonist: response.data.protagonist,
                        secondary_characters: response.data.secondary_characters,
                        plot_armor: response.data.plot_armor,
                        character_development: response.data.character_development,
                        villains: response.data.villains,
                        japanese_awkwardness: response.data.japanese_awkwardness,
                        story_flow: response.data.story_flow,
                        dead_moments: response.data.dead_moments,
                        logical_character_choices: response.data.logical_character_choices,
                        fights: response.data.fights,
                        character_design: response.data.character_design,
                        ending: response.data.ending,
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
            intro: ratings.intro,
            soundtrack: ratings.soundtrack,
            plot: ratings.plot,
            animations: ratings.animations,
            unpredictability: ratings.unpredictability,
            protagonist: ratings.protagonist,
            secondary_characters: ratings.secondary_characters,
            plot_armor: ratings.plot_armor,
            character_development: ratings.character_development,
            villains: ratings.villains,
            japanese_awkwardness: ratings.japanese_awkwardness,
            story_flow: ratings.story_flow,
            dead_moments: ratings.dead_moments,
            logical_character_choices: ratings.logical_character_choices,
            fights: ratings.fights,
            character_design: ratings.character_design,
            ending: ratings.ending,
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
            {["intro", "soundtrack", "plot", "animations", "unpredictability", "protagonist", "secondary_characters", "plot_armor", "character_development", "villains", "japanese_awkwardness", "story_flow", "dead_moments", "logical_character_choices", "fights", "character_design", "ending"].map((parameter, index) => (
                <div key={parameter} className="rating-row">
                    <p>{parameter.replace("_", " ").replace(/(^|\s)\S/g, (letter) => letter.toUpperCase())}</p>
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
