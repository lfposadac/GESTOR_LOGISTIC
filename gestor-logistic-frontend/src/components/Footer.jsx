import React from 'react';
// IMPORTANTE: Logo Blanco para el fondo Naranja
import logoWhite from '../assets/logo_white.png'; 

export const Footer = () => {
    return (
        <footer className="app-footer">
            <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:10}}>
                <img src={logoWhite} alt="Integra" style={{height:35, width:'auto'}} />
                <span style={{fontWeight:'bold', fontSize:'1.2rem', letterSpacing:'0.5px'}}>
                    Integra Comex SAS
                </span>
            </div>
            <p style={{fontSize:'0.9rem', opacity:0.95, margin:0}}>
                © {new Date().getFullYear()} Plataforma de Gestión Logística y Aduanera
            </p>
        </footer>
    );
};