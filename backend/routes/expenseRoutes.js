const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');  // Importar JWT para verificar el token

// Crear la conexión a la base de datos
const db = require('../config/db');  // Ajustar la ruta según la ubicación de db.js
// Ruta para agregar un gasto
router.post('/add', async (req, res) => {
    const { amount, category, description } = req.body;
    const token = req.headers.authorization?.split(' ')[1];  // Obtener el token JWT desde el header

    if (!token) {
        return res.status(403).send({ error: 'Token no proporcionado' });
    }

    try {
        // Decodificar y verificar el token para obtener el userId
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decodedToken.userId;  // Extraer el userId del token decodificado

        if (!userId) {
            return res.status(400).send({ error: 'User ID no encontrado en el token' });
        }

        // Insertar el gasto en la base de datos junto con el userId
        const query = 'INSERT INTO expenses (amount, category, description, userId) VALUES (?, ?, ?, ?)';
        db.query(query, [amount, category, description, userId], (err, result) => {
            if (err) {
                console.error("Error en la consulta SQL:", err); // Log detallado
                return res.status(500).send({ error: 'Error al agregar el gasto' });
            }
            res.status(201).send({ message: 'Gasto agregado correctamente' });
        });
    } catch (err) {
        console.error("Error al verificar el token:", err); // Log detallado
        return res.status(500).send({ error: 'Error al procesar el token' });
    }
});

// Ruta para obtener los gastos del usuario
router.get('/all', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];  // Obtener el token JWT desde el header

    if (!token) {
        return res.status(403).send({ error: 'Token no proporcionado' });
    }

    try {
        // Decodificar y verificar el token para obtener el userId
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decodedToken.userId;  // Extraer el userId del token decodificado

        if (!userId) {
            return res.status(400).send({ error: 'User ID no encontrado en el token' });
        }

        // Obtener los gastos del usuario
        const query = 'SELECT * FROM expenses WHERE userId = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error("Error al consultar los gastos:", err);  // Log detallado
                return res.status(500).send({ error: 'Error al obtener los gastos' });
            }
            res.status(200).send(results);  // Enviar los resultados como respuesta
        });
    } catch (err) {
        console.error("Error al verificar el token:", err); // Log detallado
        return res.status(500).send({ error: 'Error al procesar el token' });
    }
});

// Ruta para eliminar un gasto
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params; // Obtener el id del gasto a eliminar
    const token = req.headers.authorization?.split(' ')[1];  // Obtener el token JWT desde el header

    if (!token) {
        return res.status(403).send({ error: 'Token no proporcionado' });
    }

    try {
        // Decodificar y verificar el token para obtener el userId
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;  // Extraer el userId del token decodificado

        if (!userId) {
            return res.status(400).send({ error: 'User ID no encontrado en el token' });
        }

        // Eliminar el gasto de la base de datos
        const query = 'DELETE FROM expenses WHERE id = ? AND userId = ?';  // Verifica que el gasto pertenece al usuario
        db.query(query, [id, userId], (err, result) => {
            if (err) {
                console.error("Error en la consulta SQL:", err);
                return res.status(500).send({ error: 'Error al eliminar el gasto' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).send({ error: 'Gasto no encontrado o no pertenece al usuario' });
            }

            res.status(200).send({ message: 'Gasto eliminado correctamente' });
        });
    } catch (err) {
        console.error("Error al verificar el token:", err);
        return res.status(500).send({ error: 'Error al procesar el token' });
    }
});
// Ruta para actualizar un gasto
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;  // Obtener el id del gasto a actualizar
    const { amount, category, description } = req.body;  // Obtener los nuevos datos del gasto
    const token = req.headers.authorization?.split(' ')[1];  // Obtener el token JWT desde el header

    if (!token) {
        return res.status(403).send({ error: 'Token no proporcionado' });
    }

    try {
        // Decodificar y verificar el token para obtener el userId
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;  // Extraer el userId del token decodificado

        if (!userId) {
            return res.status(400).send({ error: 'User ID no encontrado en el token' });
        }

        // Verificar si el gasto existe
        const query = 'SELECT * FROM expenses WHERE id = ? AND userId = ?';
        db.query(query, [id, userId], (err, results) => {
            if (err) {
                console.error("Error al consultar el gasto:", err);
                return res.status(500).send({ error: 'Error al obtener el gasto' });
            }

            if (results.length === 0) {
                return res.status(404).send({ error: 'Gasto no encontrado o no pertenece al usuario' });
            }

            // Actualizar el gasto
            const updateQuery = 'UPDATE expenses SET amount = ?, category = ?, description = ? WHERE id = ? AND userId = ?';
            db.query(updateQuery, [amount, category, description, id, userId], (err, result) => {
                if (err) {
                    console.error("Error al actualizar el gasto:", err);
                    return res.status(500).send({ error: 'Error al actualizar el gasto' });
                }

                res.status(200).send({ message: 'Gasto actualizado correctamente' });
            });
        });
    } catch (err) {
        console.error("Error al verificar el token:", err);
        return res.status(500).send({ error: 'Error al procesar el token' });
    }
});

module.exports = router;