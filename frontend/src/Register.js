import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';  // Asegúrate de importar el archivo CSS

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/auth/register', { username, password, confirmPassword });
            // Mostrar mensaje de éxito
            alert('Registro exitoso, por favor inicia sesión');
            // Redirigir a la página de login
            window.location.href = '/login';
        } catch (err) {
            setError('Error al registrar el usuario');
        }
    };

    return (
        <div className="form-container">
            <h1>Registro</h1>
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
            <div className="input-group">
                <input
                    type="password"
                    placeholder="Confirmar Contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input"
                />
            </div>
            <div className="button-group">
                <button onClick={handleRegister} className="btn">Registrarse</button>
            </div>
        </div>
    );
};

export default Register;
