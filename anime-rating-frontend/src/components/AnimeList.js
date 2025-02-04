import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import "../styles/AnimeList.css";
import axios from "axios";
import config from "../config";

function AnimeList() {
    const [animeList, setAnimeList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [stats, setStats] = useState({
        totalAnimes: 0,
        totalUsers: 0,
        totalVotes: 0,
    });

    useEffect(() => {
        // Fetch stats (total animes, users, votes)
        axios
            .get(`${config.backendUrl}/api/stats/`)
            .then((response) => setStats(response.data))
            .catch((error) => console.error("Error fetching stats:", error));

        // Fetch anime list
        axios
            .get(`${config.backendUrl}/api/animes/`)
            .then((response) => setAnimeList(response.data.sort((a, b) => a.title.localeCompare(b.title))))
            .catch((error) => console.error("Error fetching anime list:", error));
    }, []);

    const filteredAnime = animeList.filter((anime) =>
        anime.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="anime-list-container">
            {/* Header */}
            <header className="header-list">
                <HamburgerMenu />
                <h1 className="title">Anime List</h1>
                <Link to="/home" className="home-link" aria-label="Go to Home Page">
                    Home
                </Link>
            </header>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stat-item">
                    <h2 className="h2-list">Total Animes</h2>
                    <p>{stats.totalAnimes}</p>
                </div>
                <div className="stat-item">
                    <h2 className="h2-list">Total Users</h2>
                    <p>{stats.totalUsers}</p>
                </div>
                <div className="stat-item">
                    <h2 className="h2-list">Total Votes</h2>
                    <p>{stats.totalVotes}</p>
                </div>
            </section>

            {/* Search Section */}
            <section className="search-section">
                <input
                    type="text"
                    placeholder="Search anime..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search anime input"
                />
            </section>

            {/* Anime List Section */}
            <section className="anime-list-list">
                {filteredAnime.length > 0 ? (
                    filteredAnime.map((anime) => (
                        <div key={anime.id} className="anime-item-list">
                            <img
                                src={anime.image_url}
                                alt={`Cover of ${anime.title}`}
                                className="anime-image-list"
                            />
                            <p className="anime-title-list">{anime.title}</p>
                        </div>
                    ))
                ) : (
                    <p>No anime found.</p>
                )}
            </section>
        </div>
    );
}

export default AnimeList;
