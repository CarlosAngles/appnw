const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Registrar un nuevo usuario
const registerUser = (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ msg: 'Las contraseñas no coinciden' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ msg: 'Error al encriptar la contraseña' });

        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(query, [username, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({ msg: 'Error al registrar el usuario' });
            res.status(201).json({ msg: 'Usuario registrado correctamente' });
        });
    });
};

// Iniciar sesión y devolver un token JWT
const loginUser = (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, result) => {
        if (err) return res.status(500).json({ msg: 'Error al iniciar sesión' });

        if (result.length === 0) return res.status(404).json({ msg: 'Usuario no encontrado' });

        bcrypt.compare(password, result[0].password, (err, isMatch) => {
            if (err) return res.status(500).json({ msg: 'Error al verificar la contraseña' });

            if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrecta' });

            // Incluir el ID del usuario en el token
            const token = jwt.sign({ userId: result[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ msg: 'Inicio de sesión exitoso', token });
        });
    });
};

// Verificar el token para autenticar usuarios en otras rutas
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ msg: 'Token no proporcionado' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ msg: 'Token no válido' });
        req.user = user; // Guardar el usuario decodificado en el request
        next();
    });
};

module.exports = { registerUser, loginUser, authenticateToken };
