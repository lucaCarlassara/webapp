import React from "react";
import "../styles/Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h4 className="h4-footer">Contact</h4>
                    <p>Email: <a href="mailto:crllcu01@gmail.com">crllcu01@gmail.com</a></p>
                    <p>Instagram: <a href="https://www.instagram.com/luca.carlassara/" target="_blank" rel="noopener noreferrer">@luca.carlassara</a></p>
                </div>
                <div className="footer-section">
                    <h4 className="h4-footer">About me</h4>
                    <p>Developer passionate about anime and technology. This site is a personal project for anime lovers.</p>
                </div>
                <div className="footer-section">
                    <h4 className="h4-footer">Credits</h4>
                    <p>Site developed by Luca Carlassara - © 2025. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
