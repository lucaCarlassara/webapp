import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import "../styles/AnimeVoteDetails.css";
import axios from "axios";
import config from "../config";

function AnimeVoteDetails() {
    const { animeId } = useParams();
    const [animeDetails, setAnimeDetails] = useState({});
    const [voteCount, setVoteCount] = useState(0);

    useEffect(() => {
        // Fetch anime details
        axios
            .get(`${config.backendUrl}/api/animes/${animeId}/`)
            .then((response) => setAnimeDetails(response.data))
            .catch((error) => console.error("Error fetching anime details:", error));

        // Fetch vote count
        axios
            .get(`${config.backendUrl}/api/animes/${animeId}/vote-count/`)
            .then((response) => setVoteCount(response.data.total_votes))
            .catch((error) => console.error("Error fetching vote count:", error));
    }, [animeId]);

    return (
        <div className="anime-vote-details-container">
            {/* Header */}
            <header className="header">
                <HamburgerMenu />
                <h1 className="title">{animeDetails.title || "Anime Details"}</h1>
                <Link to="/anime-list" className="home-link" aria-label="Go to Anime List">
                    Back to List
                </Link>
            </header>

            {/* Anime Details Section */}
            <section className="anime-details-section">
                <div className="anime-image-container">
                    <img
                        src={animeDetails.image_url || "https://via.placeholder.com/150"}
                        alt={`Cover of ${animeDetails.title}`}
                        className="anime-image"
                    />
                </div>
                <div className="anime-info-container">
                    <h2 className="anime-name">{animeDetails.title || "Loading..."}</h2>
                    <p className="vote-count">
                        {voteCount} {voteCount === 1 ? "User" : "Users"} Voted
                    </p>
                </div>
            </section>
        </div>
    );
}

export default AnimeVoteDetails;
