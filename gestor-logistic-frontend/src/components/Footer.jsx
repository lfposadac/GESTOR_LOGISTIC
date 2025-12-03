import React from 'react';
// Logo BLANCO para fondo Naranja
import logoWhite from '../assets/logo_white.png'; 

export const Footer = () => {
    return (
        <footer className="app-footer">
            <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:10}}>
                <img src={logoWhite} alt="Integra" style={{height:35, width:'auto'}} />
                <span style={{fontWeight:'bold', fontSize:'1.2rem'}}>Integra Comex SAS</span>
            </div>
            <p style={{fontSize:'0.9rem', opacity:0.9, margin:0}}>
                © {new Date().getFullYear()} Plataforma de Gestión Logística
            </p>
        </footer>
    );
};