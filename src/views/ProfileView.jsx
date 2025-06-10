import {useNavigate} from 'react-router-dom';

import {useUser} from '../contexts/UserContext';
import '@styles/profile.css';


function ProfileView() {
        const {user, setUser} = useUser();
        const navigate = useNavigate();

        const handleLogout = () => {
            setUser(null);
            localStorage.removeItem('token');
            navigate('/');
        };



    if (!user) {
        return (<div className="profile-view">
            <h2>Mi Perfil</h2>
            <p>No has iniciado sesión. <a href="/login">Inicia sesión aquí</a>.</p>
        </div>);
    }

    return (<div className="profile-view">
        <h2>Mi Perfil</h2>

        <div className="profile-data">
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
        </div>

        <div className="profile-actions">
            <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
        </div>

    </div>);
}

export default ProfileView;
