import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import AuthPage from "./components/AuthPage";
import PersonalArea from "./components/PersonalArea";

function App() {
    useEffect(() => {
        // Rimuovi il token al caricamento dell'app
        localStorage.removeItem("token");
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/personal-area" element={<PersonalArea />} />
            </Routes>
        </Router>
    );
}

export default App;
