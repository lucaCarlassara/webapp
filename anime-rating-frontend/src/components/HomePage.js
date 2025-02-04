import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import HamburgerMenu from "./HamburgerMenu";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import config from "../config";

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
    dead_moments: "Number of dull or slow-paced sections. The higher the score the less dead moments there are.",
    logical_character_choices: "How logical the decisions of characters feel.",
    fights: "Engagement and choreography of fight scenes.",
    character_design: "Creativity and uniqueness of character appearances.",
    ending: "Satisfaction and closure provided by the ending."
};

function HomePage() {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const [animeRatings, setAnimeRatings] = useState([]);
    const [tooltip, setTooltip] = useState(null);
    const [showTutorial, setShowTutorial] = useState(false); // Controls the tutorial popup
    const [searchTerm, setSearchTerm] = useState(""); // Keeps track of search input

    useEffect(() => {
        axios
            .get(`${config.backendUrl}/api/ratings-summary/`)
            .then((response) => {
                setAnimeRatings(response.data);
            })
            .catch((error) => {
                console.error("Error fetching rating summary:", error);
            });
    }, []);

    // Filter parameters based on search input and sort them alphabetically
    const filteredParameters = Object.keys(parameterDescriptions)
        .filter((parameter) =>
            parameter
                .replace(/_/g, " ")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => a.localeCompare(b));

    return (
        <div className="container">
            {/* Tutorial Popup */}
            {showTutorial && (
                <div className="tutorial-modal">
                    <div className="tutorial-content">
                        <button
                            className="close-button"
                            onClick={() => setShowTutorial(false)}
                        >
                            ✖
                        </button>
                        <h2>Welcome to Anime Ratings!</h2>
                        <p>
                            This platform allows you to browse, rate, and explore your favorite
                            anime. Each parameter helps you evaluate various aspects of an anime,
                            such as plot, character development, and more.
                        </p>
                        <p>
                            Use the rating buttons to score different aspects. The ratings from all 
                            users are used to calculate the average and display it on the homepage.
                        </p>
                        <p>Click on the question mark (?) next to each parameter for details.</p>
                    </div>
                </div>
            )}

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
                        Login
                    </Link>
                )}
            </div>

            {/* How It Works and Search Bar */}
            <div className="how-it-works-search">
                <button
                    className="tutorial-button"
                    onClick={() => setShowTutorial(true)}
                >
                    How Does It Work?
                </button>
                <input
                    type="text"
                    className="search-bar-home"
                    placeholder="Search parameters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="ratings-container">
                {filteredParameters.map((parameter) => {
                    const filteredAnime = animeRatings.filter((anime) => anime[parameter] > 0);

                    return (
                        filteredAnime.length > 0 && (
                            <div key={parameter} className="parameter-section">
                                {/* Wrap parameter name and help button in a flex container */}
                                <div className="parameter-header">
                                    <h2 className="parameter-name">
                                        {parameter
                                            .replace(/_/g, " ") // Replace underscores with spaces
                                            .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase()) // Capitalize words
                                        }
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
                                <div className="anime-list">
                                    {filteredAnime
                                        .sort((a, b) => b[parameter] - a[parameter])
                                        .map((anime) => (
                                            <div key={anime.id} className="anime-item-home">
                                                <p className="anime-score">
                                                    {anime[parameter].toFixed(1)}
                                                </p>
                                                <img
                                                    src={
                                                        anime.image_url ||
                                                        "https://via.placeholder.com/100"
                                                    }
                                                    alt={anime.title}
                                                    className="anime-image"
                                                />
                                                <p className="anime-title-home">{anime.title}</p>
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
