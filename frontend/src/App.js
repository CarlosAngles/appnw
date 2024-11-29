import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ViewExpenses from './components/ViewExpenses';

const ProtectedRoute = ({ element: Component }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redirige al login si no hay token
        }
    }, [navigate]);

    return <Component />;
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/"
                    element={<ProtectedRoute element={ViewExpenses} />}
                />
            </Routes>
        </Router>
    );
};

export default App;
