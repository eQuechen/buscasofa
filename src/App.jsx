import '@styles/app.css'

import GasofaRouter from './router/GasofaRouter.jsx';
import {BrowserRouter} from 'react-router-dom';
import {useEffect, useState} from 'react';

import Header from './components/Header';
import Footer from './components/Footer';
import {useUser} from './contexts/UserContext';

import {loadStations} from "@hooks/useFuelData.js";


function App() {

    const {user, setUser} = useUser();
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadStations(setStations, setError, setLoading);
    }, []);


    return (
        <BrowserRouter>
            <Header />
            {loading && <div className="loading">Cargando...</div>}
            {error && <div className="error">Error: {error}</div>}
            {!loading && !error && (
                <GasofaRouter stations={stations} />
            )}
            <Footer />
        </BrowserRouter>
    );
}


export default App