import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import PersonalArea from './components/PersonalArea';

function App() {
    const [token, setToken] = React.useState(localStorage.getItem('token'));

    return (
        <Router>
            <Routes>
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/personal-area" element={<PersonalArea />} />
            </Routes>
        </Router>
    );
}

export default App;
