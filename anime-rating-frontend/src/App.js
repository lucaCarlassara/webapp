import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import AuthPage from "./components/AuthPage";
import PersonalArea from "./components/PersonalArea";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/personal-area" element={<PersonalArea />} />
            </Routes>
        </Router>
    );
}

export default App;
