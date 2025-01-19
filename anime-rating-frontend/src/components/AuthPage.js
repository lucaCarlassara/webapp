import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/AuthPage.css";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import HamburgerMenu from "./HamburgerMenu"; // Importa HamburgerMenu

function AuthPage() {
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [signupUsername, setSignupUsername] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupRepeatPassword, setSignupRepeatPassword] = useState("");

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/token/", {
                username: loginUsername,
                password: loginPassword,
            });
            login(response.data.access);
            alert("Login effettuato con successo!");
            navigate("/personal-area");
        } catch (error) {
            alert("Login fallito! Controlla username e password.");
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (signupPassword !== signupRepeatPassword) {
            alert("Le password non corrispondono!");
            return;
        }
        try {
            await axios.post("http://127.0.0.1:8000/api/register/", {
                username: signupUsername,
                password: signupPassword,
            });
            const response = await axios.post("http://127.0.0.1:8000/api/token/", {
                username: signupUsername,
                password: signupPassword,
            });
            login(response.data.access);
            alert("Registrazione effettuata con successo!");
            navigate("/personal-area");
        } catch (error) {
            alert("Registrazione fallita! Riprova.");
        }
    };

    return (
        <div className="auth-container">
            {/* Header con Hamburger Menu */}
            <div className="header">
                <HamburgerMenu />
                <h1 className="title">Login / Registrazione</h1>
                <Link to="/home" className="home-link">
                    Home
                </Link>
            </div>

            {/* Login Form */}
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

            {/* Signup Form */}
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
