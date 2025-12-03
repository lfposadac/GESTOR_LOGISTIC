import React, { useState, useEffect } from 'react';
import './App.css';
import logoColor from './assets/logo_color.png'; 

import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { MatriculaCliente } from './components/MatriculaCliente';
import { CargaMasiva } from './components/CargaMasiva';
import { ListaClientes } from './components/ListaClientes'; // NUEVO
import { ListaDOs } from './components/ListaDOs'; // NUEVO
import { Footer } from './components/Footer';
import { apiService } from './services/api';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    // Navegación
    const [view, setView] = useState('dashboard');
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [selectedDoId, setSelectedDoId] = useState(null);

    useEffect(() => { if(localStorage.getItem('token')) setIsLoggedIn(true); }, []);

    const logout = () => { apiService.logout(); setIsLoggedIn(false); setView('dashboard'); };
    const loginSuccess = () => { setIsLoggedIn(true); setView('dashboard'); };

    if (!isLoggedIn) return <Login onLoginSuccess={loginSuccess} />;

    const renderBody = () => {
        switch(view) {
            case 'dashboard': 
                return <Dashboard onViewChange={(v) => {
                    // Si elige operaciones, vamos directo a clientes para seleccionar uno
                    // O podrías hacer una vista de "Todos los DOs"
                    if(v === 'operaciones') setView('lista-clientes'); 
                    else setView(v);
                }} />;
            
            // 1. LISTA DE CLIENTES
            case 'clientes': 
            case 'lista-clientes':
                return (
                    <div className="container">
                        <button className="btn-secondary" onClick={()=>setView('dashboard')} style={{marginBottom:15, width:'auto'}}>← Volver al Panel</button>
                        <ListaClientes 
                            onNuevoCliente={() => setView('crear-cliente')}
                            onSelectCliente={(cliente) => {
                                setSelectedCliente(cliente);
                                setView('lista-dos');
                            }} 
                        />
                    </div>
                );

            // 2. CREAR NUEVO CLIENTE
            case 'crear-cliente':
                return (
                    <div className="container">
                        <button className="btn-secondary" onClick={()=>setView('lista-clientes')} style={{marginBottom:15, width:'auto'}}>← Cancelar</button>
                        <MatriculaCliente onSuccess={() => {
                            alert('Cliente creado exitosamente');
                            setView('lista-clientes');
                        }} />
                    </div>
                );

            // 3. LISTA DE DOs DEL CLIENTE
            case 'lista-dos':
                return (
                    <div className="container">
                        <ListaDOs 
                            cliente={selectedCliente} 
                            onBack={() => setView('lista-clientes')}
                            onGestionarDO={(doId) => {
                                setSelectedDoId(doId);
                                setView('gestion-operativa');
                            }}
                        />
                    </div>
                );

            // 4. GESTIÓN OPERATIVA (Carga Masiva)
            case 'gestion-operativa':
            case 'operaciones': // Fallback
                return (
                    <div className="container">
                        <button className="btn-secondary" onClick={()=>setView('lista-dos')} style={{marginBottom:15, width:'auto'}}>← Volver a la Lista</button>
                        <CargaMasiva currentDoId={selectedDoId} />
                    </div>
                );

            default: return <Dashboard onViewChange={setView} />;
        }
    };

    return (
        <div className="app-layout">
            <header className="app-header">
                <div className="header-left">
                    <img src={logoColor} alt="Integra" className="header-logo" />
                    <h1 className="header-title">Gestor Logístico</h1>
                </div>
                <button onClick={logout} className="logout-btn">Salir</button>
            </header>
            <main className="app-main">{renderBody()}</main>
            <Footer />
        </div>
    );
}

export default App;