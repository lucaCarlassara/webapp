import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AuthPage.css";

function AuthPage() {
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [signupUsername, setSignupUsername] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupRepeatPassword, setSignupRepeatPassword] = useState("");

    const navigate = useNavigate();

    // Gestione del login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Simulazione login API
            console.log("Logging in:", loginUsername, loginPassword);
            navigate("/personal-area");
        } catch (error) {
            alert("Login failed!");
        }
    };

    // Gestione della registrazione
    const handleSignup = async (e) => {
        e.preventDefault();
        if (signupPassword !== signupRepeatPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            // Simulazione registrazione API
            console.log("Signing up:", signupUsername, signupPassword);
            navigate("/personal-area");
        } catch (error) {
            alert("Signup failed!");
        }
    };

    return (
        <div className="auth-container">
            {/* Header */}
            <div className="auth-header">
                <button className="menu-button">&#9776;</button>
                <h1 className="auth-title">Login</h1>
                <a href="/home" className="home-link">
                    Home
                </a>
            </div>

            {/* Login Form */}
            <form className="auth-form" onSubmit={handleLogin}>
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

            {/* Divider */}
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
