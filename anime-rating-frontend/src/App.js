import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import AuthPage from "./components/AuthPage";
import AnimeList from "./components/AnimeList";
import PersonalArea from "./components/PersonalArea";
import { AuthProvider } from "./AuthContext";
import AttackOnTitan from "./animePages/AnimePage";
import "./styles/global.css"; // Import global styles
import AnimeVoteDetails from "./components/AnimeVoteDetails";

function App() {
    useEffect(() => {
        localStorage.removeItem("token");
    }, []);

    return (
        <AuthProvider>
            <Router>
                <div>
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" />} />
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/login/personal-area" element={<PersonalArea />} />
                        <Route path="/login/personal-area/:id" element={<AttackOnTitan />} />
                        <Route path="/anime-list" element={<AnimeList />} /> {/* Nuova pagina */}
                        <Route path="/anime-list/:animeId" element={<AnimeVoteDetails />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
