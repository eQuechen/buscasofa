import { useState } from 'react';
import '@styles/form.css';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [msg, setMsg] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    const res = await fetch('http://localhost:4000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setMsg(data.message);
  };

  return (
    <form onSubmit={handleSubmit} className='register-form'>
      <h2>Registro de Usuario</h2>
      <input name="username" placeholder="Usuario" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
      <button type="submit">Registrarse</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}

export default Register;