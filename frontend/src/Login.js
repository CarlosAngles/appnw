import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles.css';  // Asegúrate de importar el archivo CSS

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Por favor ingresa tu usuario y contraseña');
            return;
        }

        setError('');  // Limpiar errores previos
        setLoading(true);  // Activar el estado de carga

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password
            });
            localStorage.setItem('userName', response.data.userName);
            localStorage.setItem('token', response.data.token);
            navigate('/');
        } catch (err) {
            setError('Usuario o contraseña incorrectos');
        } finally {
            setLoading(false);  // Desactivar el estado de carga
        }
    };

    return (
        <div className="form-container">
            <h1>Login</h1>
            {error && <p className="error">{error}</p>}
            <div className="input-group">
                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input"
                />
            </div>
            <div className="input-group">
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                />
            </div>
            <div className="button-group">
                <button onClick={handleLogin} className="btn" disabled={loading}>
                    {loading ? 'Cargando...' : 'Iniciar sesión'}
                </button>
                <button onClick={() => navigate('/register')} className="btn2">Registrarse</button>
            </div>
        </div>
    );
};

export default Login;
