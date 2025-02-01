import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import AuthPage from "./components/AuthPage";
import PersonalArea from "./components/PersonalArea";
import { AuthProvider } from "./AuthContext";
import AttackOnTitan from "./animePages/AnimePage";
import "./styles/global.css";

function App() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Rimuovi il token al caricamento dell'app
        localStorage.removeItem("token");
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle("dark-mode", !darkMode); // Aggiunge o rimuove la classe 'dark-mode' al body
    };

    return (
        <AuthProvider>
            <Router>
                <div>
                    {/* Pulsante per alternare la modalità scura */}
                    <header className="header">
                        <button onClick={toggleDarkMode} className="dark-mode-toggle">
                            {darkMode ? "Light Mode" : "Dark Mode"}
                        </button>
                    </header>

                    <Routes>
                        <Route path="/" element={<Navigate to="/home" />} />
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/personal-area" element={<PersonalArea />} />
                        <Route path="/anime/:id" element={<AttackOnTitan />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
