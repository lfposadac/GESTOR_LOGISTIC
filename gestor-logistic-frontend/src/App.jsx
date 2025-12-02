// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './assets/logo_integra.png'; // Para el header
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { MatriculaCliente } from './components/MatriculaCliente';
import { CargaMasiva } from './components/CargaMasiva';
import { apiService } from './services/api';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // Estados de navegación: 'dashboard', 'clientes', 'operaciones'
    const [currentView, setCurrentView] = useState('dashboard');
    // Estado global para manejar el DO actual si se selecciona un cliente
    const [currentDoId, setCurrentDoId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) setIsLoggedIn(true);
    }, []);

    const handleLogout = () => {
        apiService.logout();
        setIsLoggedIn(false);
        setCurrentView('dashboard');
    };

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setCurrentView('dashboard');
    };

    // Si no está logueado, mostrar Login (ocupa toda la pantalla)
    if (!isLoggedIn) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    // Renderizar el contenido principal basado en la vista actual
    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <Dashboard onViewChange={setCurrentView} />;
            case 'clientes':
                return (
                    <div className="container">
                        <div style={{marginBottom: '20px'}}>
                             <button className="btn-secondary" onClick={() => setCurrentView('dashboard')}>← Volver al Dashboard</button>
                        </div>
                        <MatriculaCliente onMatriculaSuccess={(id) => alert(`Cliente ${id} creado. Ahora puede crear un DO.`)} />
                    </div>
                );
            case 'operaciones':
                return (
                    <div className="container">
                        <div style={{marginBottom: '20px'}}>
                             <button className="btn-secondary" onClick={() => setCurrentView('dashboard')}>← Volver al Dashboard</button>
                        </div>
                        {/* Aquí pasamos un DO ID de ejemplo. En un futuro, esto vendría de seleccionar un DO de una lista */}
                        <CargaMasiva currentDoId={currentDoId || 1} />
                    </div>
                );
            default:
                return <Dashboard onViewChange={setCurrentView} />;
        }
    };

    // Layout principal cuando está logueado (Header + Contenido)
    return (
        <div>
            {/* Header Global */}
            <header className="app-header">
                <div style={{display: 'flex', alignItems: 'center'}}>
                    {/* Usamos el logo en blanco usando filtro CSS definido en App.css */}
                    <img src={logo} alt="Integra Comex" className="header-logo" style={{marginRight: '15px'}} />
                    <h1 style={{color: 'var(--white)', margin: 0, fontSize: '1.5rem'}}>Gestor Logístico</h1>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
                    <span>Usuario Conectado</span>
                    <button onClick={handleLogout} className="logout-btn">
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            {/* Contenido Dinámico */}
            <main style={{ padding: '30px 0' }}>
                {renderView()}
            </main>
        </div>
    );
}

export default App;