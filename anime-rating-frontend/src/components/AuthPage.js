import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/AuthPage.css";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import HamburgerMenu from "./HamburgerMenu";
import { jwtDecode } from "jwt-decode"; // Corretto import

function AuthPage() {
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [signupUsername, setSignupUsername] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupRepeatPassword, setSignupRepeatPassword] = useState("");

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Legge l'URL del backend con fallback
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/api/token/`, {
                username: loginUsername,
                password: loginPassword,
            });
            const token = response.data.access;
            const decoded = jwtDecode(token);
            login(token, decoded.username);
            alert("Login effettuato con successo!");
            navigate("/personal-area", { replace: true });
        } catch (error) {
            const errorMessage = error.response?.data?.detail || "Errore durante il login. Riprova!";
            console.error("Errore nel login:", error.response?.data || error.message);
            alert(errorMessage);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (signupPassword !== signupRepeatPassword) {
            alert("Le password non corrispondono!");
            return;
        }
        try {
            await axios.post(`${backendUrl}/api/register/`, {
                username: signupUsername,
                password: signupPassword,
            });

            const response = await axios.post(`${backendUrl}/api/token/`, {
                username: signupUsername,
                password: signupPassword,
            });

            const token = response.data.access;
            const decoded = jwtDecode(token);
            login(token, decoded.username);
            alert("Registrazione e login effettuati con successo!");
            navigate("/personal-area", { replace: true });
        } catch (error) {
            const errorMessage = error.response?.data?.detail || "Errore durante la registrazione. Riprova!";
            console.error("Errore nella registrazione:", error.response?.data || error.message);
            alert(errorMessage);
        }
    };

    return (
        <div className="auth-container">
            <div className="header">
                <HamburgerMenu />
                <h1 className="title">Login / Sign up</h1>
                <Link to="/home" className="home-link">
                    Home
                </Link>
            </div>

            <form className="auth-form" onSubmit={handleLogin}>
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="input-field"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="input-field"
                    required
                />
                <button type="submit" className="auth-button">
                    Login
                </button>
            </form>

            <div className="divider">
                <span>or</span>
            </div>

            <form className="auth-form" onSubmit={handleSignup}>
                <h2>Sign up</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    className="input-field"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="input-field"
                    required
                />
                <input
                    type="password"
                    placeholder="Ripeti password"
                    value={signupRepeatPassword}
                    onChange={(e) => setSignupRepeatPassword(e.target.value)}
                    className="input-field"
                    required
                />
                <button type="submit" className="auth-button">
                    Sign up
                </button>
            </form>
        </div>
    );
}

export default AuthPage;
