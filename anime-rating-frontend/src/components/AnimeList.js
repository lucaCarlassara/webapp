import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import "../styles/AnimeList.css";
import axios from "axios";
import config from "../config";
import Footer from "./Footer";
import ScrollToTopButton from "./ScrollToTopButton";
import Breadcrumbs from "./Breadcrumbs";

function AnimeList() {
    const [animeList, setAnimeList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [stats, setStats] = useState({
        totalAnimes: 0,
        totalUsers: 0,
        totalVotes: 0,
    });
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`${config.backendUrl}/api/stats/`)
            .then((response) => setStats(response.data))
            .catch((error) => console.error("Error fetching stats:", error));
        axios
            .get(`${config.backendUrl}/api/animes/`)
            .then((response) => setAnimeList(response.data.sort((a, b) => a.title.localeCompare(b.title))))
            .catch((error) => console.error("Error fetching anime list:", error));
    }, []);

    const filteredAnime = animeList.filter((anime) =>
        anime.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAnimeClick = (animeId) => {
        navigate(`/anime-list/${animeId}`);
    };

    return (
        <div className="anime-list-container">
            <header className="header-list">
                <HamburgerMenu />
                <h1 className="title">Anime List</h1>
                <Link to="/home" className="home-link" aria-label="Go to Home Page">Home</Link>
            </header>

                <Breadcrumbs />

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
            <section className="search-section">
                <input
                    type="text"
                    placeholder="Search anime..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search anime input"
                />
            </section>
            <section className="anime-list-list">
                {filteredAnime.length > 0 ? (
                    filteredAnime.map((anime) => (
                        <div
                            key={anime.id}
                            className="anime-item-list"
                            onClick={() => handleAnimeClick(anime.id)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => e.key === "Enter" && handleAnimeClick(anime.id)}
                        >
                            <img
                                src={anime.image_url}
                                alt={`Cover of ${anime.title}`}
                                className="anime-image-list"
                                loading="lazy"
                            />
                            <p className="anime-title-list">{anime.title}</p>
                        </div>
                    ))
                ) : (
                    <p>No anime found.</p>
                )}
            </section>
            <div className="container">
                {/* ...contenuto esistente... */}
                <Footer />
            </div>
            <div className="container">
                {/* Contenuto della pagina */}
                <ScrollToTopButton />
            </div>
        </div>
    );
}

export default AnimeList;
