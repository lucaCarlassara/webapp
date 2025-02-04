import React from "react";
import { Link, useParams } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import "../styles/AnimeVoteDetails.css";

function AnimeVoteDetails() {
    const { animeId } = useParams(); // Ottieni l'ID dell'anime dai parametri URL

    return (
        <div className="anime-vote-details-container">
            <header className="header">
                <HamburgerMenu />
                <h1 className="title">Anime Details</h1>
                <Link to="/anime-list" className="home-link" aria-label="Go to Anime List">
                    Anime List
                </Link>
            </header>
            <main>
                <p>Details for anime ID: {animeId}</p>
            </main>
        </div>
    );
}

export default AnimeVoteDetails;
