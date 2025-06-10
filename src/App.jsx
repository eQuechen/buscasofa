import '@styles/app.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchFuelPrices } from './apis/fuelApiLib';
import { FuelApi } from './apis/FuelApi';


import Header from './components/Header';
import FuelMap from './components/FuelMap';
import About from './components/About';
import Home from './components/Home';
import StationDetail from './components/StationDetail';
import FuelTable from './components/FuelTable';
import Register from './components/Register';
import Login from './components/Login';
import Footer from './components/Footer';
import { NotFound } from './NotFound';

// Componente principal de la aplicación
// Este componente es el punto de entrada de la aplicación y se encarga de gestionar las rutas y el estado global de la aplicación.
// Utiliza React Router para la navegación entre diferentes componentes y páginas.
// También se encarga de la carga inicial de datos (precios de combustible) y del manejo de errores.
// El componente utiliza el hook useEffect para realizar una llamada a la API de precios de combustible al cargar la aplicación.
// Además, utiliza el hook useState para gestionar el estado de los precios de combustible, el usuario autenticado, el estado de carga y los errores.
// El componente Header se encarga de mostrar la barra de navegación y el estado de autenticación del usuario.
// El componente Routes se encarga de definir las diferentes rutas de la aplicación y los componentes que se renderizan en cada ruta.
// El componente BrowserRouter se encarga de gestionar la navegación entre las diferentes rutas de la aplicación.
function App() {

  const [stations, setStations] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);   // Inicialmente cargando ...
  const [error, setError] = useState(null);

    useEffect(() => {
      fetchFuelPrices()
        .then(data => {
          console.log(data);
          setStations(data.ListaEESSPrecio);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }, []);

/*   useEffect(() => {
    FuelApi.getInstance().getFuelPrices()
      .then(data => {
        console.log(data);
        setStations(data.ListaEESSPrecio);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []); */

  return (
    <BrowserRouter>
      <Header user={user} />
      {
        loading && <div className="loading">Cargando...</div>
      }
      {
        error && <div className="error">Error: {error}</div>
      }
      {!loading && !error && (
        <Routes>
          <Route path="/registro" element={<Register />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/about" element={<About />} />

          <Route path="/" element={<Home stations={stations} />} />
          <Route path="/mapa" element={<FuelMap stations={stations} />} />
          <Route path="/lista" element={<FuelTable stations={stations} />} />
          <Route path="/station/:id" element={<StationDetail stations={stations} user={user} />} />
          <Route path="*" element={<NotFound />} /> {/* Pagina no encontrada */}
        </Routes>
      )}
      <Footer />
    </BrowserRouter>
  )
}

export default App