import { Routes, Route } from 'react-router-dom';

import AboutView from '@/views/AboutView.jsx';
import Home from '../components/Home';
import FuelMap from '../components/FuelMap';
import FuelTable from '../components/FuelTable';
import Register from '../components/Register';
import Login from '../components/Login';
import StationDetailView from '@/views/StationDetailView.jsx';
import { NotFoundView } from '../views/NotFoundView.jsx';
import { useUser } from '../contexts/UserContext';

export default function FuelRoutes({ stations }) {
    const { user, setUser } = useUser();
    return (
        <Routes>
            <Route path="/registro" element={<Register />} />
            <Route path="/login" element={<Login onLogin={setUser} />} />
            <Route path="/about" element={<AboutView />} />

            <Route path="/" element={<Home stations={stations} />} />
            <Route path="/mapa" element={<FuelMap stations={stations} />} />
            <Route path="/lista" element={<FuelTable stations={stations} />} />
            <Route path="/station/:id" element={<StationDetailView stations={stations} user={user} />} />
            <Route path="*" element={<NotFoundView />} />
        </Routes>
    );
}
