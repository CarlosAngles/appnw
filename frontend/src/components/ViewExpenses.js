    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import './styles.css';  // Asegúrate de incluir los estilos

    const ViewExpenses = () => {
        const [expenses, setExpenses] = useState([]);
        const [error, setError] = useState('');
        const [loading, setLoading] = useState(false);
        const [modalOpen, setModalOpen] = useState(false);
        const [editMode, setEditMode] = useState(false);
        const [selectedExpense, setSelectedExpense] = useState(null);
        const [amount, setAmount] = useState('');
        const [category, setCategory] = useState('');
        const [description, setDescription] = useState('');
        const [date, setDate] = useState('');  // Nuevo estado para la fecha
        const [expandedRow, setExpandedRow] = useState(null);  // Estado para manejar las filas expandidas
    

        const [currentPage, setCurrentPage] = useState(1); // Página actual
        const [expensesPerPage, setExpensesPerPage] = useState(5); // Cantidad de gastos por página
    


        const userName = localStorage.getItem('userName');
        const token = localStorage.getItem('token');


        
        useEffect(() => {
            const fetchExpenses = async () => {
                try {
                    const token = localStorage.getItem('token');
                    setLoading(true);
                    const response = await axios.get('http://localhost:5000/api/expenses/all', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setExpenses(response.data);
                } catch (err) {
                    setError('Error al obtener los gastos');
                } finally {
                    setLoading(false);
                }
            };
        
            fetchExpenses();
        }, []);
        
        // Calcular los gastos a mostrar en la página actual
        const indexOfLastExpense = currentPage * expensesPerPage;
        const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
        const currentExpenses = expenses.slice(indexOfFirstExpense, indexOfLastExpense);
        const paginate = (pageNumber) => setCurrentPage(pageNumber);

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(expenses.length / expensesPerPage); i++) {
            pageNumbers.push(i);
        }
            

        const handleDelete = async (id) => {
            const token = localStorage.getItem('token');
            try {
                await axios.delete(`http://localhost:5000/api/expenses/delete/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setExpenses(expenses.filter(expense => expense.id !== id));
            } catch (err) {
                setError('Error al eliminar el gasto');
            }
        };

        const handleAddExpense = async () => {
            const token = localStorage.getItem('token');
            try {
                await axios.post('http://localhost:5000/api/expenses/add', {
                    amount,
                    category,
                    description,
                    date,  // Agregar la fecha al cuerpo de la solicitud
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAmount('');
                setCategory('');
                setDescription('');
                setDate('');  // Limpiar la fecha
                setModalOpen(false);
                const response = await axios.get('http://localhost:5000/api/expenses/all', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setExpenses(response.data);
            } catch (err) {
                setError('Error al agregar el gasto');
            }
        };

        const handleUpdateExpense = async () => {
            const token = localStorage.getItem('token');
            try {
                await axios.put(`http://localhost:5000/api/expenses/update/${selectedExpense.id}`, {
                    amount,
                    category,
                    description,
                    date,  // Agregar la fecha al cuerpo de la solicitud
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAmount('');
                setCategory('');
                setDescription('');
                setDate('');  // Limpiar la fecha
                setEditMode(false);
                setModalOpen(false);
                const response = await axios.get('http://localhost:5000/api/expenses/all', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setExpenses(response.data);
            } catch (err) {
                setError('Error al actualizar el gasto');
            }
        };

        const openEditModal = (expense) => {
            setSelectedExpense(expense);
            setAmount(expense.amount);
            setCategory(expense.category);
            setDescription(expense.description);
            setDate(expense.date);  // Establecer la fecha al editar
            setEditMode(true);
            setModalOpen(true);
        };

        const handleLogout = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            window.location.href = '/login';
        };
        

        // Calcular el total de los gastos
        const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

        // Función para alternar entre expandir y contraer las filas
        const toggleExpandRow = (id) => {
            setExpandedRow(expandedRow === id ? null : id); // Alterna entre expandir o contraer la fila
        };
        
        
        return (
            <div>
                <div className="header">
                <div className="user-info">
                {/* Mostrar el nombre del usuario si está disponible */}
                <span>Hola!</span>
            </div>
                    <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
                </div>

                <h2>Mis Gastos</h2>
                {error && <p className="error">{error}</p>}

                <div className="divagre">
                    <button onClick={() => { setModalOpen(true); setEditMode(false); }} className="btn-agregar">
                        Agregar Gasto
                    </button>
                </div>

                {loading ? (
                    <p>Cargando...</p>
                ) : (
                    <>
                        <table className="expense-table">
                            <thead>
                                <tr>
                                    <th>Categoria</th>
                                    <th>Fecha</th>
                                    <th>Gasto</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
        {currentExpenses.length === 0 ? (
            <tr>
                <td colSpan="4">No hay gastos registrados</td>
            </tr>
        ) : (
            currentExpenses.map((expense) => (
                <React.Fragment key={expense.id}>
                    <tr>
                        <td>{expense.category}</td>
                        <td>{new Date(expense.date).toLocaleDateString()}</td>
                        <td>{expense.amount}</td>
                        
                        <td>
                            <button className='agre-btn' onClick={() => openEditModal(expense)}>Editar</button>
                            <button className='close-btn' onClick={() => handleDelete(expense.id)}>Eliminar</button>
                            <button onClick={() => toggleExpandRow(expense.id)} className="expand-btn">
                                {expandedRow === expense.id ? 'Ver menos' : 'Ver más'}
                            </button>
                        </td>
                    </tr>
                    {expandedRow === expense.id && (
                        <tr>
                            <td colSpan="4">{expense.description}</td> {/* Mostrar la descripción */}
                        </tr>
                    )}
                </React.Fragment>
            ))
        )}
    </tbody>

                        </table>

                        {/* Mostrar el total de gastos */}
                        <div className="total-expenses">
                            <p className="a1"><strong>Gastos Totales:</strong></p>
                            <p className="a2">{totalExpenses.toFixed(2)}</p>
                        </div>
                        <div className="pagination">
    {/* Botón de retroceso */}
    <button 
        onClick={() => paginate(currentPage - 1)} 
        disabled={currentPage === 1} 
        className="pagination-btn">
        Anterior
    </button>
    
    {/* Botones de página */}
    {pageNumbers.map((number) => (
        <button 
            key={number} 
            onClick={() => paginate(number)} 
            className={currentPage === number ? 'active' : ''}>
            {number}
        </button>
    ))}
    
    {/* Botón de avance */}
    <button 
        onClick={() => paginate(currentPage + 1)} 
        disabled={currentPage === pageNumbers.length} 
        className="pagination-btn">
        Siguiente
    </button>
</div>


                    </>
                )}

                <div className={`modal ${modalOpen ? 'open' : ''}`}>
                    <div className="modal-content">
                        <h3>{editMode ? 'Editar Gasto' : 'Agregar Gasto'}</h3>
                        <input
                            type="number"
                            placeholder="Monto"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Categoría"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                        <textarea
                            placeholder="Descripción"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}  // Permite elegir la fecha
                        />
                        <button className="agre-btn" onClick={editMode ? handleUpdateExpense : handleAddExpense}>
                            {editMode ? 'Actualizar' : 'Agregar'}
                        </button>
                        <button className="close-btn" onClick={() => setModalOpen(false)}>Cerrar</button>
                    </div>
                </div>
            </div>
        );
    };

    export default ViewExpenses;

