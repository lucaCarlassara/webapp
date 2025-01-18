import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AuthPage.css";
import axios from "axios";

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
            // Richiesta al backend per ottenere il token JWT
            const response = await axios.post("http://127.0.0.1:8000/api/token/", {
                username: loginUsername,
                password: loginPassword,
            });

            // Salva il token JWT nel localStorage
            localStorage.setItem("token", response.data.access);

            alert("Login effettuato con successo!");
            navigate("/personal-area"); // Reindirizza all'area personale
        } catch (error) {
            alert("Login fallito! Controlla username e password.");
        }
    };

    // Gestione della registrazione
    const handleSignup = async (e) => {
        e.preventDefault();
    
        if (signupPassword !== signupRepeatPassword) {
            alert("Le password non corrispondono!");
            return;
        }
    
        try {
            // Richiesta per registrare un nuovo utente
            await axios.post("http://127.0.0.1:8000/api/register/", {
                username: signupUsername,
                password: signupPassword,
            });
    
            // Richiesta per ottenere il token JWT dopo la registrazione
            const response = await axios.post("http://127.0.0.1:8000/api/token/", {
                username: signupUsername,
                password: signupPassword,
            });
    
            // Salva il token JWT nel localStorage
            localStorage.setItem("token", response.data.access);
    
            alert("Registrazione effettuata con successo!");
            navigate("/personal-area"); // Reindirizza all'area personale
        } catch (error) {
            alert("Registrazione fallita! Riprova.");
        }
    };
    

    return (
        <div className="auth-container">
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
                    placeholder="Repeat Password"
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
