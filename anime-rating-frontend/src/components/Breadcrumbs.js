import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import config from "../config";
import "../styles/Breadcrumbs.css";

const predefinedRoutes = {
    "login": "Login",
    "personal-area": "Personal Area",
    "anime": "Anime",
    "anime-list" : "Anime List",
    "anime-vote-details" : "Anime Vote Details"

};

const Breadcrumbs = () => {
    const location = useLocation();
    const [animeName, setAnimeName] = useState(null);
    const [animeIdIndex, setAnimeIdIndex] = useState(null);

    // Ottieni i segmenti della URL e filtra quelli vuoti
    const pathnames = location.pathname.split("/").filter((x) => x);

    useEffect(() => {
        for (let i = 0; i < pathnames.length; i++) {
            if (!isNaN(pathnames[i])) { // Se il segmento è un numero, probabilmente è un ID anime
                const animeId = pathnames[i];

                axios.get(`${config.backendUrl}/api/animes/${animeId}/`)
                    .then((response) => {
                        setAnimeName(response.data.title);
                        setAnimeIdIndex(i);
                    })
                    .catch((error) => {
                        console.error("Error fetching anime name:", error);
                    });

                break; // Interrompe il ciclo dopo aver trovato il primo ID numerico
            }
        }
    }, [pathnames]);

    return (
        <nav className="breadcrumbs">
            <Link to="/" className="breadcrumb-item">Home</Link>

            {pathnames.map((value, index) => {
                let pathTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1;

                // Se è una route predefinita, sostituisci con il nome leggibile
                if (predefinedRoutes[value]) {
                    value = predefinedRoutes[value];
                }

                // Sostituisci l'ID con il nome dell'anime
                if (index === animeIdIndex && animeName) {
                    return (
                        <span key={pathTo} className="breadcrumb-item active">{animeName}</span>
                    );
                }

                return isLast ? (
                    <span key={pathTo} className="breadcrumb-item active">{decodeURIComponent(value)}</span>
                ) : (
                    <Link key={pathTo} to={pathTo} className="breadcrumb-item">
                        {decodeURIComponent(value)}
                    </Link>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;
