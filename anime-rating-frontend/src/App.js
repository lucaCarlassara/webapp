import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import AuthPage from "./components/AuthPage";
import PersonalArea from "./components/PersonalArea";
import { AuthProvider } from "./AuthContext";
import AttackOnTitan from "./animePages/AttackOnTitan";

function App() {
    useEffect(() => {
        // Rimuovi il token al caricamento dell'app
        localStorage.removeItem("token");
    }, []);

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/personal-area" element={<PersonalArea />} />
                    <Route path="/anime/:id" element={<AttackOnTitan />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
