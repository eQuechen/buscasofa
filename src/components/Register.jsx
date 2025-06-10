import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

import '@styles/form.css';
import {useUser} from '../contexts/UserContext';

function Register() {

    const {setUser} = useUser();
    const [form, setForm] = useState({username: '', email: '', password: ''});
    const [msg, setMsg] = useState('');
    //const navigate = useNavigate();

    const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

    const handleSubmit = async e => {
        e.preventDefault();
        setMsg('');
        const res = await fetch('http://localhost:4000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            setUser({
                name: data.username || form.username,
                email: form.email,
                token: data.token
            });
            setMsg('¡Registro exitoso!');
            //navigate('/perfil');
        } else {
            setMsg(data.message);
        }
    };


    return (
        <form onSubmit={handleSubmit} className='register-form'>
            <h2>Registro de Usuario</h2>
            <input name="username" placeholder="Usuario" onChange={handleChange} required/>
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required/>
            <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required/>
            <button type="submit">Registrarse</button>
            {msg && <p>{msg}</p>}
        </form>
    );
}

export default Register;