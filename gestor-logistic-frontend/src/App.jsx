import React, { useState, useEffect } from 'react';
import './App.css';
import logoColor from './assets/logo_color.png'; // Logo color para Header blanco

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
                        <button className="btn-secondary" onClick={()=>setView('dashboard')} style={{marginBottom:15}}>← Volver</button>
                        <MatriculaCliente onSuccess={(id)=>alert(`Cliente ${id} creado`)} />
                    </div>
                );
            case 'operaciones':
                return (
                    <div className="container">
                        <button className="btn-secondary" onClick={()=>setView('dashboard')} style={{marginBottom:15}}>← Volver</button>
                        <CargaMasiva currentDoId={doId || 1} />
                    </div>
                );
            default: return <Dashboard onViewChange={setView} />;
        }
    };

    return (
        <div style={{display:'flex', flexDirection:'column', minHeight:'100vh'}}>
            <header className="app-header">
                <div className="header-left">
                    <img src={logoColor} alt="Integra Comex" className="header-logo" />
                    <h1 style={{fontSize:'1.3rem', margin:0, fontWeight:600}}>Gestor Logístico</h1>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:15}}>
                    <button onClick={logout} className="logout-btn">Salir</button>
                </div>
            </header>

            <main style={{flex:1, padding:'30px 0'}}>
                {renderBody()}
            </main>

            <Footer />
        </div>
    );
}

export default App;