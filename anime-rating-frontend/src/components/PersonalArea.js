import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/PersonalArea.css";
import HamburgerMenu from "./HamburgerMenu";
import axios from "axios";
import config from "../config";

function PersonalArea() {
    const [selectedTab, setSelectedTab] = useState("voted");
    const [animeVoted, setAnimeVoted] = useState([]);
    const [animeToVote, setAnimeToVote] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    // Decode the JWT token to get the username
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

    // Fetch voted and to-vote anime for the current user
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
        navigate(`/anime/${animeId}`);
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
        <div className="personal-area-container">
            {/* Header with Hamburger Menu */}
            <div className="header">
                <HamburgerMenu />
                <h1 className="title">Personal Area</h1>
                <Link to="/home" className="home-link">
                    Home
                </Link>
            </div>

            {/* User info */}
            <div className="user-info">
                <p>Hello, {username}!</p>
            </div>

            {/* Tab buttons */}
            <div className="tab-buttons">
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
            </div>

            {/* Search bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search anime..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Anime list */}
            <div className="content-container">
                {filteredAnime.length > 0 ? (
                    filteredAnime.map((anime) => {
                        return (
                            <div
                                key={anime.id}
                                className="anime-item"
                                onClick={() => handleAnimeClick(anime.id)}
                            >
                                <img
                                    src={
                                        anime.image_url?.startsWith("http")
                                            ? anime.image_url
                                            : "https://via.placeholder.com/100"
                                    }
                                    alt={anime.title}
                                    className="anime-image"
                                />
                                <p className="anime-title">{anime.title}</p>
                            </div>
                        );
                    })
                ) : (
                    <p>No anime found.</p>
                )}
            </div>

        </div>
    );
}

export default PersonalArea;
