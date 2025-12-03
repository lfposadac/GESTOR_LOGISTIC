import React, { useState, useEffect } from 'react';
import './App.css';
// IMPORTANTE: Logo a Color para el Header Blanco
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

    if (!isLoggedIn) return <Login onLoginSuccess={loginSuccess} />;

    const renderBody = () => {
        switch(view) {
            case 'dashboard': return <Dashboard onViewChange={setView} />;
            case 'clientes': 
                return (
                    <div className="container">
                        <button className="btn-secondary" onClick={()=>setView('dashboard')} style={{marginBottom:15}}>← Volver al Panel</button>
                        <MatriculaCliente onSuccess={(id)=>alert(`✅ Cliente creado con ID: ${id}`)} />
                    </div>
                );
            case 'operaciones':
                return (
                    <div className="container">
                        <button className="btn-secondary" onClick={()=>setView('dashboard')} style={{marginBottom:15}}>← Volver al Panel</button>
                        <CargaMasiva currentDoId={doId || 1} />
                    </div>
                );
            default: return <Dashboard onViewChange={setView} />;
        }
    };

    return (
        <div style={{display:'flex', flexDirection:'column', minHeight:'100vh'}}>
            {/* HEADER BLANCO con LOGO COLOR */}
            <header className="app-header">
                <div className="header-left">
                    <img src={logoColor} alt="Integra Comex" className="header-logo" />
                    <h1 style={{fontSize:'1.4rem', margin:0, fontWeight:'700'}}>Gestor Logístico</h1>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:15}}>
                    <span style={{fontSize:'0.9rem', color:'#555', fontWeight:'500'}}>Usuario Conectado</span>
                    <button onClick={logout} className="logout-btn">Cerrar Sesión</button>
                </div>
            </header>

            <main style={{flex:1, padding:'40px 0'}}>
                {renderBody()}
            </main>

            {/* FOOTER NARANJA */}
            <Footer />
        </div>
    );
}

export default App;