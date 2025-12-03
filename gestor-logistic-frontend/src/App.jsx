import React, { useState, useEffect } from 'react';
import './App.css';
import logoColor from './assets/logo_color.png'; 

import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { MatriculaCliente } from './components/MatriculaCliente';
import { CargaMasiva } from './components/CargaMasiva';
import { Footer } from './components/Footer';
import { apiService } from './services/api';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [view, setView] = useState('dashboard');
    const [doId, setDoId] = useState(null);

    useEffect(() => { if(localStorage.getItem('token')) setIsLoggedIn(true); }, []);

    const logout = () => { apiService.logout(); setIsLoggedIn(false); setView('dashboard'); };
    const loginSuccess = () => { setIsLoggedIn(true); setView('dashboard'); };

    // Login ocupa toda la pantalla por sí solo (usa .login-container del CSS)
    if (!isLoggedIn) return <Login onLoginSuccess={loginSuccess} />;

    const renderBody = () => {
        switch(view) {
            case 'dashboard': return <Dashboard onViewChange={setView} />;
            case 'clientes': 
                return (
                    <div className="container">
                        <button className="btn-secondary" onClick={()=>setView('dashboard')} style={{marginBottom:20, width:'auto'}}>← Volver</button>
                        <MatriculaCliente onSuccess={(id)=>alert(`ID Creado: ${id}`)} />
                    </div>
                );
            case 'operaciones':
                return (
                    <div className="container">
                        <button className="btn-secondary" onClick={()=>setView('dashboard')} style={{marginBottom:20, width:'auto'}}>← Volver</button>
                        <CargaMasiva currentDoId={doId || 1} />
                    </div>
                );
            default: return <Dashboard onViewChange={setView} />;
        }
    };

    return (
        // CLASE NUEVA: app-layout (Asegura que rellene la pantalla)
        <div className="app-layout">
            <header className="app-header">
                <div className="header-left">
                    <img src={logoColor} alt="Integra" className="header-logo" />
                    <h1 style={{fontSize:'1.3rem', margin:0, fontWeight:700}}>Gestor Logístico</h1>
                </div>
                <button onClick={logout} className="logout-btn">Salir</button>
            </header>

            <main className="app-main">
                {renderBody()}
            </main>

            <Footer />
        </div>
    );
}

export default App;