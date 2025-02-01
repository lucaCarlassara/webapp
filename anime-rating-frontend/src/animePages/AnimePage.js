import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import HamburgerMenu from "../components/HamburgerMenu";
import "../styles/AnimePage.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import config from "../config";

/* Parameter Explanations */
const parameterDescriptions = {
    intro: "Quality of the introduction and how engaging it is.",
    soundtrack: "How well the soundtrack complements the anime.",
    plot: "Storyline depth, coherence, and overall engagement.",
    animations: "Quality of animation and visual aesthetics.",
    unpredictability: "How unpredictable the story is.",
    protagonist: "Character development and likability of the protagonist.",
    secondary_characters: "Depth and importance of supporting characters.",
    plot_armor: "How much a fictional character is preserved from harm due to their necessity for the plot to proceed. The lower the score, the bigger the plot armor is.",
    character_development: "Growth and evolution of characters over time.",
    villains: "Complexity and impact of antagonists.",
    japanese_awkwardness: "Presence of embarrassing or exaggerated Japanese clichés. The lower the score, the more clichés there are.",
    story_flow: "How smoothly and logically the story progresses.",
    dead_moments: "Number of dull or slow-paced sections. The higher the score the less dead moments there are ",
    logical_character_choices: "How logical the decisions of characters feel.",
    fights: "Engagement and choreography of fight scenes.",
    character_design: "Creativity and uniqueness of character appearances.",
    ending: "Satisfaction and closure provided by the ending."
};

function AnimePage() {
    const { id } = useParams();
    const [anime, setAnime] = useState(null);
    const [ratings, setRatings] = useState({});
    const [isEditable, setIsEditable] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [tooltip, setTooltip] = useState(null);

    useEffect(() => {
        /* Fetch Anime Details */
        axios.get(`${config.backendUrl}/api/animes/${id}/`)
            .then(response => setAnime(response.data))
            .catch(error => console.error("Error fetching anime:", error));

        /* Fetch User Ratings */
        const token = localStorage.getItem("token");
        if (token) {
            const userId = jwtDecode(token).user_id;
            axios.get(`${config.backendUrl}/api/animes/${id}/ratings/${userId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(response => {
                    setRatings(response.data);
                    setIsEditable(false);
                })
                .catch(error => {
                    if (error.response && error.response.status === 404) {
                        setIsEditable(true);
                    } else {
                        console.error("Error fetching ratings:", error);
                    }
                });
        }
    }, [id]);

    /* Handle Rating Selection */
    const handleRating = (parameter, value) => {
        setRatings(prevRatings => ({
            ...prevRatings,
            [parameter]: value,
        }));
    };

    /* Save Ratings */
    const handleSave = () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        const userId = jwtDecode(token).user_id;

        axios({
            method: isEditable ? "post" : "put",
            url: isEditable
                ? `${config.backendUrl}/api/animes/${id}/ratings/`
                : `${config.backendUrl}/api/animes/${id}/ratings/${userId}/`,
            data: ratings,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                setShowSuccess(true);
                setIsEditable(false);
                setTimeout(() => setShowSuccess(false), 2000);
            })
            .catch(error => console.error("Error saving ratings:", error));
    };

    /* Toggle Edit Mode */
    const handleEdit = () => setIsEditable(true);

    /* If Anime Data is Not Available */
    if (!anime) return <p>Loading...</p>;

    return (
        <div className="anime-page-container">
            {/* Header */}
            <div className="header">
                <HamburgerMenu />
                <h1 className="title">Anime Details</h1>
                <Link to="/" className="home-link">Home</Link>
            </div>

            <div className="not-header">
                {/* Anime Title */}
                <div className="anime-title-container">
                    <h1 className="anime-title">{anime.title}</h1>
                </div>

                {/* Anime Image & Details */}
                <div className="anime-info">
                    <img
                        src={anime.image_url || "https://via.placeholder.com/150"}
                        alt={anime.title}
                        className="anime-image"
                    />
                    <div className="anime-details">
                        <p><strong>Year:</strong> {anime.year}</p>
                        <p><strong>Genre:</strong> {anime.genre}</p>
                        <p><strong>Studio:</strong> {anime.studio}</p>
                        <p><strong>Duration:</strong> {anime.duration}</p>
                        <p><strong>Typology:</strong> {anime.typology}</p>
                        <p><strong>Status:</strong> {anime.status}</p>
                    </div>
                </div>

                {/* Anime Description */}
                <p className="anime-description">{anime.description}</p>

                {/* Rating Parameters */}
                {anime?.votable_parameters?.map((parameter) => (
                    <div key={parameter} className="rating-row">
                        <div className="parameter-header-personal">
                                    <h2 className="parameter-name">
                                        {parameter
                                            .replace("_", " ")
                                            .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase())}
                                    </h2>
                                    <button
                                        className="help-button"
                                        onClick={() =>
                                            setTooltip(tooltip === parameter ? null : parameter)
                                        }
                                    >
                                        ?
                                    </button>
                                </div>
                        {tooltip === parameter && (
                            <div className="tooltip">{parameterDescriptions[parameter]}</div>
                        )}
                        <div className="rating-options">
                            {[...Array(10).keys()].map((num) => (
                                <button
                                    key={num + 1}
                                    className={`rating-button ${ratings[parameter] === num + 1 ? "selected" : ""}`}
                                    onClick={() => isEditable && handleRating(parameter, num + 1)}
                                    disabled={!isEditable}
                                >
                                    {num + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Save/Modify Buttons */}
                {isEditable ? (
                    <button className="save-button" onClick={handleSave}>Save</button>
                ) : (
                    <button className="save-button" onClick={handleEdit}>Modify</button>
                )}

                {/* Success Checkmark */}
                {showSuccess && <div className="success-checkmark">✔</div>}
            </div>
        </div>
    );
}

export default AnimePage;
