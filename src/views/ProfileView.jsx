import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';

import {useUser} from '../contexts/UserContext';
import '@styles/profile.css';


function ProfileView() {
    const {user, setUser} = useUser();
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        navigate('/');
    };

    const fetchMyComments = async () => {
        const token = localStorage.getItem('token');
        console.log('Token usado:', token);

        try {
            const res = await fetch('http://localhost:4000/api/profile/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();
            console.log("Respuesta backend:", data);
            console.log("Comentarios obtenidos:", data);
            if (res.ok) {
                setComments(data);
            } else {
                console.error('Error al obtener comentarios:', data.message);
            }
        } catch (err) {
            console.error('Error de red:', err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMyComments();
        }
    }, [user]);

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

        <div className="my-comments">
            <h3>Mis comentarios</h3>
            {comments.length > 0 ? (<ul>
                {comments.map((c, i) => (<li key={i}>
                    <p>{c.comment}</p>
                    <small>{new Date(c.created_at).toLocaleString()}</small>
                </li>))}
            </ul>) : (<p>Aún no has hecho comentarios.</p>)}
        </div>
    </div>);
}

export default ProfileView;
