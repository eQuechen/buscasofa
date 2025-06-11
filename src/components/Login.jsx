import { useState } from 'react';

import '@styles/form.css'
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { setUser } = useUser();
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    const res = await fetch('http://localhost:4000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      setMsg('¡Bienvenido, ' + data.username + '!');
      localStorage.setItem('token', data.token);
      setUser({
        name: data.username,
        email: form.email,
        token: data.token
      });
    } else {
      setMsg(data.message);
    }
    navigate('/perfil');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
      <button type="submit">Entrar</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}

export default Login;