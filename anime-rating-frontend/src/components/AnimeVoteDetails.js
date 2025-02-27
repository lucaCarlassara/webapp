import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import "../styles/AnimeVoteDetails.css";
import axios from "axios";
import config from "../config";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Footer from "./Footer";
import ScrollToTopButton from "./ScrollToTopButton";
import Breadcrumbs from "./Breadcrumbs";
import { AuthContext } from "../AuthContext";

// Registriamo i componenti di Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AnimeVoteDetails() {
    const { animeId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    
    const [animeDetails, setAnimeDetails] = useState({});
    const [voteCount, setVoteCount] = useState(0);
    const [voteDistribution, setVoteDistribution] = useState({});
    const [averageScore, setAverageScore] = useState(null);

    useEffect(() => {
        // Fetch anime details
        axios
            .get(`${config.backendUrl}/api/animes/${animeId}/`)
            .then((response) => {
                setAnimeDetails(response.data);
            })
            .catch((error) => console.error("Error fetching anime details:", error));
    
        // Fetch vote count
        axios
            .get(`${config.backendUrl}/api/animes/${animeId}/vote-count/`)
            .then((response) => setVoteCount(response.data.total_votes))
            .catch((error) => console.error("Error fetching vote count:", error));
    
        // Fetch vote distribution
        axios
            .get(`${config.backendUrl}/api/animes/${animeId}/vote-distribution/`)
            .then((response) => {
                setVoteDistribution(response.data.vote_distribution);
            })
            .catch((error) => console.error("Error fetching vote distribution:", error));

        // Fetch average score
        axios
            .get(`${config.backendUrl}/api/animes/${animeId}/average-score/`)
            .then((response) => setAverageScore(response.data.average_score))
            .catch((error) => console.error("Error fetching average score:", error));
    }, [animeId]);

    // Funzione per gestire il click su "Vote It Yourself"
    const handleVoteClick = () => {
        if (isAuthenticated) {
            navigate(`/login/personal-area/${animeId}`);
        } else {
            // Salva la destinazione nel localStorage e reindirizza al login
            localStorage.setItem("redirectAfterLogin", `/login/personal-area/${animeId}`);
            navigate("/login");
        }
    };

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

            <Breadcrumbs />

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
                    {averageScore !== null && (
                        <div className="average-score-container">
                            <p className="average-score">Average Score:</p>
                            <p className="score">{averageScore.toFixed(2)}</p>
                            <h2 className="anime-name" style={{ textAlign: 'center', marginTop: '10px' }}>
                                {animeDetails.title || "Loading..."}
                            </h2>
                        </div>
                    )}
                    <p className="vote-count">{voteCount} {voteCount === 1 ? "User" : "Users"} Voted</p>

                    {/* Vote It Yourself Button */}
                    <button
                        className="vote-it-yourself-button"
                        onClick={handleVoteClick}
                    >
                        Vote It Yourself
                    </button>
                </div>
            </section>

            {/* Vote Distribution Section */}
            <h2 className="h2-details">Vote Distribution</h2>
            <section className="vote-distribution-section">
                {animeDetails.votable_parameters && animeDetails.votable_parameters.length > 0 ? (
                    animeDetails.votable_parameters.map((param) => (
                        <div key={param} className="vote-chart">
                            <h3 className="h3-details">{param.replace(/_/g, " ").toUpperCase()}</h3>
                            <Bar
                                data={{
                                    labels: Array.from({ length: 10 }, (_, i) => i + 1),
                                    datasets: [
                                        {
                                            label: "Number of Votes",
                                            data: Array.from({ length: 10 }, (_, i) => voteDistribution[param]?.[i + 1] || 0),
                                            backgroundColor: "rgba(75, 192, 192, 0.5)",
                                            borderColor: "rgba(75, 192, 192, 1)",
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { display: false },
                                        title: { display: false },
                                    },
                                    scales: {
                                        x: {
                                            title: {
                                                display: true,
                                                text: "Score",
                                                color: "#fff",
                                            },
                                            ticks: {
                                                color: "#fff",
                                            },
                                        },
                                        y: {
                                            beginAtZero: true,
                                            ticks: {
                                                stepSize: 1,
                                                color: "#fff",
                                            },
                                            title: {
                                                display: true,
                                                text: "Number of Votes",
                                                color: "#fff",
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    ))
                ) : (
                    <p>No votable parameters available for this anime.</p>
                )}
            </section>

            {/* Footer and ScrollToTop */}
            <div className="container">
                <Footer />
            </div>
            <div className="container">
                <ScrollToTopButton />
            </div>
        </div>
    );
}

export default AnimeVoteDetails;
