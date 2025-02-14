import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/PersonalArea.css";
import HamburgerMenu from "./HamburgerMenu";
import axios from "axios";
import config from "../config";
import Footer from "./Footer";
import ScrollToTopButton from "./ScrollToTopButton";
import Breadcrumbs from "./Breadcrumbs";

function PersonalArea() {
    const [selectedTab, setSelectedTab] = useState("toVote");
    const [animeVoted, setAnimeVoted] = useState([]);
    const [animeToVote, setAnimeToVote] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUsername(decoded.username);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            const userId = jwtDecode(token).user_id;

            axios
                .get(`${config.backendUrl}/api/user-animes/${userId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    const { voted, to_vote } = response.data;
                    setAnimeVoted(voted.sort((a, b) => a.title.localeCompare(b.title)));
                    setAnimeToVote(to_vote.sort((a, b) => a.title.localeCompare(b.title)));
                })
                .catch((error) => {
                    console.error("Error loading anime lists:", error);
                });
        }
    }, []);

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        setSearchQuery("");
    };

    const handleAnimeClick = (animeId) => {
        navigate(`/login/personal-area/${animeId}`);
    };

    const filteredAnime =
        selectedTab === "voted"
            ? animeVoted.filter((anime) =>
                  anime.title.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : animeToVote.filter((anime) =>
                  anime.title.toLowerCase().includes(searchQuery.toLowerCase())
              );

    return (
        <>
            {/* Meta tag per SEO */}
            <meta
                name="description"
                content="Explore your personal anime list. View anime you've voted for or find anime to rate and contribute to the global average score."
            />
            <div className="personal-area-container">
                {/* Header */}
                <header className="header">
                    <HamburgerMenu />
                    <h1 className="title">Personal Area</h1>
                    <Link to="/home" className="home-link" aria-label="Go to Home Page">
                        Home
                    </Link>
                </header>

                    <Breadcrumbs />

                <main>
                    {/* User info */}
                    <section className="user-info">
                        <h2>Hello, {username}!</h2>
                    </section>

                    {/* Tab buttons */}
                    <nav className="tab-buttons" aria-label="Anime tabs">
                        <button
                            className={`tab-button ${selectedTab === "voted" ? "active" : ""}`}
                            onClick={() => handleTabChange("voted")}
                        >
                            Voted Anime
                        </button>
                        <button
                            className={`tab-button ${selectedTab === "toVote" ? "active" : ""}`}
                            onClick={() => handleTabChange("toVote")}
                        >
                            Anime to Vote
                        </button>
                    </nav>

                    {/* Search bar */}
                    <section className="search-bar" aria-label="Search for anime">
                        <input
                            type="text"
                            placeholder="Search anime..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search anime input"
                        />
                    </section>

                    {/* Anime list */}
                    <section className="content-container">
                        {filteredAnime.length > 0 ? (
                            filteredAnime.map((anime) => (
                                <article
                                    key={anime.id}
                                    className="anime-item"
                                    onClick={() => handleAnimeClick(anime.id)}
                                    aria-label={`View details for ${anime.title}`}
                                >
                                    <img
                                        loading="lazy"
                                        src={anime.image_url}
                                        alt={`Cover of ${anime.title}`}
                                        className="anime-image"
                                    />
                                    <h3 className="anime-title">{anime.title}</h3>
                                </article>
                            ))
                        ) : (
                            <p>No anime found.</p>
                        )}
                    </section>
                </main>
                <div className="container">
                    {/* ...contenuto esistente... */}
                    <Footer />
                </div>
                <div className="container">
                    {/* Contenuto della pagina */}
                    <ScrollToTopButton />
                </div>
            </div>
        </>
    );
}

export default PersonalArea;
